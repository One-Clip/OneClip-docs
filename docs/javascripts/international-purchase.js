(() => {
  "use strict";

  const checkout = document.querySelector("[data-oneclip-international-checkout]");
  if (!checkout) return;

  const form = document.getElementById("international-purchase-form");
  const emailInput = document.getElementById("international-email");
  const couponInput = document.getElementById("international-coupon");
  const applyCouponButton = document.getElementById("international-apply-coupon");
  const couponStatus = document.getElementById("international-coupon-status");
  const discountRow = document.getElementById("international-discount-row");
  const discountAmount = document.getElementById("international-discount");
  const total = document.getElementById("international-total");
  const submitButton = document.getElementById("international-submit");
  const status = document.getElementById("international-status");
  const state = { couponCode: null, discount: 0 };

  function setStatus(element, message, type = "") {
    element.textContent = message;
    element.className = "purchase-status is-visible";
    if (type) element.classList.add(`is-${type}`);
  }

  function updateSummary() {
    const finalPrice = Math.max(0, 8.90 - state.discount);
    discountRow.hidden = state.discount <= 0;
    discountAmount.textContent = `-$${state.discount.toFixed(2)}`;
    total.textContent = `$${finalPrice.toFixed(2)} USD`;
  }

  applyCouponButton.addEventListener("click", async () => {
    const code = couponInput.value.trim();
    if (!code) {
      state.couponCode = null;
      state.discount = 0;
      couponStatus.className = "purchase-status";
      updateSummary();
      return;
    }

    applyCouponButton.disabled = true;
    setStatus(couponStatus, "Checking coupon...");
    try {
      const response = await fetch("/api/payment/verify-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          plan: "lifetime",
          device_cap: 9999,
          base_price: 8.90,
          email: emailInput.value.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.valid) throw new Error(data.message || "Invalid coupon code.");
      state.couponCode = code;
      state.discount = Math.max(0, Math.min(8.90, Number(data.discount) || 0));
      setStatus(couponStatus, `Coupon applied. You save $${state.discount.toFixed(2)}.`, "success");
    } catch (error) {
      state.couponCode = null;
      state.discount = 0;
      setStatus(couponStatus, error.message, "error");
    } finally {
      applyCouponButton.disabled = false;
      updateSummary();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!emailInput.reportValidity()) return;

    const email = emailInput.value.trim();
    localStorage.setItem("oneclip_purchase_email", email);
    submitButton.disabled = true;
    setStatus(status, "Creating your secure checkout...");

    try {
      const response = await fetch("/api/payment/create-international", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          plan: "lifetime",
          device_cap: 9999,
          currency: "USD",
          coupon_code: state.couponCode || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || `Checkout failed (${response.status})`);
      }

      if (data.is_free) {
        window.location.assign(data.redirect_url || `/purchase/international/complete?order_id=${encodeURIComponent(data.order_id)}&email=${encodeURIComponent(email)}`);
        return;
      }
      if (!data.checkout_url) throw new Error("The payment provider did not return a checkout URL.");
      const paymentWindow = window.open(data.checkout_url, "_blank", "noopener,noreferrer");
      if (!paymentWindow) {
        window.location.assign(data.checkout_url);
        return;
      }
      setStatus(status, "Secure checkout opened in a new tab. Complete payment there; your license will be emailed to you.", "success");
      submitButton.disabled = false;
    } catch (error) {
      setStatus(status, error.message, "error");
      submitButton.disabled = false;
    }
  });

  emailInput.value = localStorage.getItem("oneclip_purchase_email") || "";
  updateSummary();
})();
