(() => {
  "use strict";

  const checkout = document.querySelector("[data-oneclip-checkout]");
  if (!checkout) return;

  const config = {
    plan: checkout.dataset.plan,
    label: checkout.dataset.label,
    price: Number(checkout.dataset.price),
    days: checkout.dataset.days ? Number(checkout.dataset.days) : null,
    deviceCap: 9999,
  };

  const state = {
    couponCode: null,
    discount: 0,
    pollTimer: null,
  };

  const byId = (id) => document.getElementById(id);
  const emailInput = byId("purchase-email");
  const couponInput = byId("purchase-coupon");
  const couponStatus = byId("purchase-coupon-status");
  const couponRow = byId("purchase-coupon-row");
  const couponAmount = byId("purchase-coupon-amount");
  const total = byId("purchase-total");
  const submitButton = byId("purchase-submit");
  const formStatus = byId("purchase-form-status");

  function finalPrice() {
    return Math.max(0, config.price - state.discount);
  }

  function formatPrice(value) {
    return `¥${Number(value).toFixed(2)}`;
  }

  function setStatus(element, message, type = "") {
    if (!element) return;
    element.textContent = message;
    element.className = "purchase-status is-visible";
    if (type) element.classList.add(`is-${type}`);
  }

  function clearStatus(element) {
    if (!element) return;
    element.textContent = "";
    element.className = "purchase-status";
  }

  function updateSummary() {
    total.textContent = formatPrice(finalPrice());
    submitButton.textContent = `立即支付 ${formatPrice(finalPrice())}`;
    couponRow.hidden = state.discount <= 0;
    couponAmount.textContent = `-${formatPrice(state.discount)}`;
  }

  async function requestJson(url, options) {
    const response = await fetch(url, options);
    let data;
    try {
      data = await response.json();
    } catch (_) {
      throw new Error(`服务器返回异常（${response.status}）`);
    }
    if (!response.ok) throw new Error(data.message || `请求失败（${response.status}）`);
    return data;
  }

  async function applyCoupon() {
    const code = couponInput.value.trim();
    if (!code) {
      state.couponCode = null;
      state.discount = 0;
      clearStatus(couponStatus);
      updateSummary();
      return;
    }

    setStatus(couponStatus, "正在验证优惠码…");
    try {
      const data = await requestJson("/api/payment/verify-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          plan: config.plan,
          device_cap: config.deviceCap,
          base_price: config.price,
          days: config.days,
          email: emailInput.value.trim(),
        }),
      });

      if (!data.valid) throw new Error(data.message || "优惠码无效");
      state.couponCode = code;
      state.discount = Math.max(0, Number(data.discount) || 0);
      setStatus(couponStatus, data.message || "优惠码已应用", "success");
    } catch (error) {
      state.couponCode = null;
      state.discount = 0;
      setStatus(couponStatus, error.message, "error");
    }
    updateSummary();
  }

  function openModal(id) {
    const modal = byId(id);
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const modal = byId(id);
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (id === "purchase-payment-modal" && state.pollTimer) {
      clearInterval(state.pollTimer);
      state.pollTimer = null;
    }
  }

  function completeUrl(orderId, email) {
    return `/complete_order_page.html?order_id=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`;
  }

  async function checkPayment(orderId, email, redirectOnPaid = false) {
    const data = await requestJson("/api/payment/query-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, email }),
    });
    const order = data.order || (data.orders && data.orders[0]);
    if (order && order.status === "paid" && redirectOnPaid) {
      window.location.assign(completeUrl(order.order_id || orderId, email));
    }
    return order;
  }

  function showPayment(data, email) {
    byId("purchase-payment-order").textContent = data.order_id;
    byId("purchase-payment-amount").textContent = formatPrice(data.amount);
    byId("purchase-payment-email").textContent = email;
    const qrImage = byId("purchase-payment-qr");
    const qrSource = data.img || data.qrcode || data.qr_code || "";
    qrImage.src = qrSource;
    qrImage.hidden = !qrSource;

    byId("purchase-payment-status").textContent = qrSource
      ? "等待支付…"
      : "订单已创建，但支付入口暂不可用，请关闭后重试。";
    openModal("purchase-payment-modal");

    state.pollTimer = window.setInterval(async () => {
      try {
        await checkPayment(data.order_id, email, true);
      } catch (_) {
        // Keep polling. The manual refresh button reports errors explicitly.
      }
    }, 7000);
  }

  async function submitOrder(event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    if (!emailInput.reportValidity()) return;

    localStorage.setItem("oneclip_purchase_email", email);
    submitButton.disabled = true;
    setStatus(formStatus, "正在创建订单…");

    try {
      const data = await requestJson("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          plan: config.plan,
          device_cap: config.deviceCap,
          days: config.days,
          coupon_code: state.couponCode || undefined,
        }),
      });

      if (!data.success) throw new Error(data.message || "创建订单失败");
      if (data.is_free) {
        window.location.assign(data.redirect_url || completeUrl(data.order_id, email));
        return;
      }
      showPayment(data, email);
      setStatus(formStatus, "订单已创建，请扫码支付。", "success");
    } catch (error) {
      setStatus(formStatus, `创建订单失败：${error.message}`, "error");
    } finally {
      submitButton.disabled = false;
    }
  }

  function renderOrder(order) {
    const result = byId("purchase-query-result");
    const code = order.activation_code || order.activation_code_masked || "待支付后生成";
    const channelNames = { zpay: "官方渠道", applinko: "AppLinko（淘宝）", waffo: "海外渠道" };
    result.innerHTML = "";
    const values = [
      ["订单号", order.display_id || order.order_id || "-"],
      ["状态", order.status_text || order.status || "-"],
      ["套餐", order.plan || "-"],
      ["邮箱", order.email || "-"],
      ["许可证 ID", order.license_id || "-"],
      ["激活码", code],
      ["购买渠道", channelNames[order.payment_channel] || order.payment_channel || "-"],
    ];
    const list = document.createElement("dl");
    values.forEach(([label, value]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      list.append(dt, dd);
    });
    result.appendChild(list);
    result.hidden = false;
  }

  async function queryOrder() {
    const orderId = byId("purchase-query-id").value.trim();
    const email = byId("purchase-query-email").value.trim();
    const status = byId("purchase-query-status");
    if (!orderId) {
      setStatus(status, "请输入订单号或许可证 ID", "error");
      return;
    }
    localStorage.setItem("oneclip_query_order_id", orderId);
    localStorage.setItem("oneclip_query_email", email);
    setStatus(status, "正在查询…");
    try {
      const order = await checkPayment(orderId, email);
      if (!order) throw new Error("未找到订单");
      renderOrder(order);
      clearStatus(status);
    } catch (error) {
      setStatus(status, error.message, "error");
      byId("purchase-query-result").hidden = true;
    }
  }

  byId("purchase-apply-coupon").addEventListener("click", applyCoupon);
  byId("purchase-form").addEventListener("submit", submitOrder);
  byId("purchase-query-open").addEventListener("click", () => openModal("purchase-query-modal"));
  byId("purchase-query-submit").addEventListener("click", queryOrder);
  document.querySelectorAll("[data-close-purchase-modal]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.dataset.closePurchaseModal));
  });
  byId("purchase-payment-refresh").addEventListener("click", async () => {
    const status = byId("purchase-payment-status");
    try {
      const order = await checkPayment(
        byId("purchase-payment-order").textContent,
        byId("purchase-payment-email").textContent,
        true,
      );
      status.textContent = order ? order.status_text || order.status : "未找到订单";
    } catch (error) {
      status.textContent = error.message;
    }
  });

  emailInput.value = localStorage.getItem("oneclip_purchase_email") || "";
  byId("purchase-query-id").value = localStorage.getItem("oneclip_query_order_id") || "";
  byId("purchase-query-email").value = localStorage.getItem("oneclip_query_email") || "";
  updateSummary();
})();

// 复制淘宝口令（终身边/淘宝渠道按钮调用）
function copyTaobaoToken(btn) {
  const token = btn.getAttribute("data-taobao-token") || "";
  if (!token) return;
  const originalText = btn.textContent;
  const applyFeedback = () => {
    btn.textContent = "已复制！打开淘宝即可";
    setTimeout(() => { btn.textContent = originalText; }, 2000);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(token).then(applyFeedback).catch(() => fallbackCopyToken(token, applyFeedback));
  } else {
    fallbackCopyToken(token, applyFeedback);
  }
}

function fallbackCopyToken(text, onDone) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    if (onDone) onDone();
  } catch (e) {
    // 复制失败，用户可手动选择
  }
  document.body.removeChild(textArea);
}
