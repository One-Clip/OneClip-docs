# 激活码全流程

本文档详细介绍 OneClip 激活码的完整流程。

## 完整流程图

```
用户购买 → 支付完成 → 生成激活码 → 发送邮件 → 用户查询 → 应用内验证
```

## 详细流程

### 阶段一：用户购买与支付

#### 1. 创建订单

- **前端页面**：购买页面（月度版/年度版/终身版）
- **API接口**：`POST /api/payment/create`
- **流程**：
  1. 用户填写邮箱、选择套餐、设备数量
  2. 前端调用创建订单API
  3. 后端创建订单（状态：`pending`），返回订单ID和支付二维码
  4. 前端显示支付二维码，开始轮询支付状态

#### 2. 支付处理

- **支付方式**：国内 ZPay（支付宝）/ 淘宝 / 海外 Waffo（信用卡、Apple Pay、Google Pay、PayPal）
- **轮询检测**：前端每3秒查询一次订单状态
- **API接口**：`POST /api/payment/query-order`
- **支付回调**：`POST /api/payment/notify`（支付服务器主动通知）
- **海外渠道**：使用 `POST /api/payment/create-international`（Waffo 收银台），回调为 `POST /api/payment/waffo-webhook`

### 阶段二：支付完成后的处理

#### 3. 支付回调处理（关键步骤）

- **触发时机**：支付完成后，支付服务器主动回调
- **API接口**：`POST /api/payment/notify`
- **处理流程**：
  1. ✅ 验证签名、商户ID、支付状态
  2. ✅ 更新订单状态：`pending` → `paid`
  3. ✅ 生成许可证和激活码：
     - 调用 `license_manager.generate_license_with_email()`
     - 生成格式：`XXXXX-XXXXX-XXXXX`
     - 生成许可证ID：`LIC-XXXXXXXX`
     - 计算有效期（月付/年付）
  4. ✅ 更新订单：保存 `license_id` 和 `activation_code`
  5. ✅ 发送激活码邮件：
     - 调用 `send_activation_email()`
     - 支持多邮件服务商自动切换（QQ邮箱、163邮箱等）
  6. ✅ 更新 `email_sent = 1`（标记邮件已发送）

#### 4. 跳转到订单完成页面

- **跳转方式**：
  1. **前端轮询检测**：检测到 `status === 'paid'` 后，2秒后跳转
  2. **支付回调跳转**：`/api/payment/return` 接口重定向
- **目标页面**：`/complete_order_page.html?order_id=xxx&email=xxx`

### 阶段三：激活码查询与显示

#### 5. 订单完成页面加载

- **API接口**：`GET /api/order/complete?order_id=xxx&email=xxx`
- **安全要求**：必须同时提供订单号和邮箱，两者必须匹配
- **返回数据**：
  - 订单信息（订单号、邮箱、套餐、设备上限等）
  - 激活码（仅已支付订单返回）
  - 许可证ID
  - 有效期（月付/年付）
  - 邮件发送状态（`email_sent`）

#### 6. 自动发送邮件（如果未发送）

- **触发时机**：页面加载完成后，延迟3秒自动发送
- **API接口**：`POST /api/payment/send-email`
- **参数**：
  - `order_id`: 订单号
  - `email`: 邮箱地址
  - `choice`: `'send'`（自动发送）
- **防重复机制**：
  - 检查 `email_sent` 标志
  - 如果已发送，返回提示"邮件之前已经发送过了"
  - 如果未发送，发送邮件并更新 `email_sent = 1`

#### 7. 手动重新发送邮件

- **触发方式**：用户点击"重新发送邮件"按钮
- **API接口**：`POST /api/payment/send-email`
- **参数**：
  - `order_id`: 订单号
  - `email`: 邮箱地址
  - `choice`: `'resend'`（允许重复发送）
- **处理逻辑**：
  - `resend` 允许重复发送（不受 `email_sent` 限制）
  - 发送成功后更新 `email_sent = 1`

#### 8. 订单查询功能

- **位置**：购买页面和管理后台
- **API接口**：`POST /api/payment/query-order`
- **安全要求**：必须同时提供订单号和邮箱
- **返回数据**：
  - 订单信息（脱敏处理）
  - 激活码（仅已支付订单返回完整激活码）
  - 订单状态

### 阶段四：应用内验证（服务器验证）

#### 9. 应用内激活码验证（服务器验证）

- **验证方式**：✅ **服务器验证**（非本地验证）
- **API接口**：`POST https://oneclip.cloud/api/verify-license-3`
- **实现位置**：
  - 应用端：`OneClip/Services/LicenseServerService.swift`
  - 服务端：`license_api_server.py` 的 `/api/verify-license-3` 路由
- **安全要求**：
  - ✅ 需要API密钥（`X-API-Key` header）
  - ✅ 必须提供激活码、邮箱、设备ID
  - ✅ 设备ID基于硬件UUID生成，确保唯一性和稳定性

#### 10. 应用端验证流程

**10.1 用户激活操作**
- **触发位置**：设置页面 → 高级功能 → 激活码输入
- **实现函数**：`EntitlementService.activate(with:email:)`
- **流程**：
  1. ✅ 验证邮箱格式
  2. ✅ 验证激活码格式（`XXXXX-XXXXX-XXXXX`）
  3. ✅ 调用服务器验证
  4. ✅ 构建请求数据
  5. ✅ 发送POST请求到 `https://oneclip.cloud/api/verify-license-3`
  6. ✅ 保存激活信息到本地（钥匙串 + UserDefaults）
  7. ✅ 应用许可证状态（更新 `isPro`、`plan` 等）

**10.2 应用启动时验证**
- **触发时机**：应用启动后延迟1.5秒
- **实现函数**：`EntitlementService.restoreActivationStateOnStartup()`
- **流程**：
  1. ✅ 从本地恢复激活状态（钥匙串 → SettingsManager → 缓存）
  2. ✅ 延迟1秒后异步验证服务器状态
  3. ✅ 验证状态一致性

**10.3 定期验证检查**
- **触发时机**：
  - 应用进入前台时（最小间隔6小时）
  - 手动检查（最小间隔5分钟）
  - 启动时（如果网络可用）
- **检查内容**：
  1. ✅ 许可证过期检查（本地）
  2. ✅ 远程撤销状态检查（服务器）
  3. ✅ 时间完整性验证

#### 11. 服务器端验证流程

**11.1 接收验证请求**
- **API端点**：`POST /api/verify-license-3`
- **装饰器**：`@require_api_key`（验证API密钥）
- **接收参数**：
  ```json
  {
    "license": "XXXXX-XXXXX-XXXXX",
    "email": "user@example.com",
    "appVersion": "1.4.5",
    "platform": "macOS",
    "device_name": "MacBook Pro",
    "device_id": "abc123def4567890",
    "ip_address": "192.168.1.100"
  }
  ```

**11.2 验证检查项**
1. ✅ **验证激活码存在性**：
   - 查询 `licenses` 表
   - 检查 `activation_code` 和 `status = 'active'`
2. ✅ **验证邮箱匹配**：
   - 检查激活码绑定的邮箱是否与用户输入的邮箱一致（不区分大小写）
3. ✅ **验证有效期**（统一使用北京时间）：
   - 月付/年付：检查 `valid_until` 是否过期
   - 终身版：`valid_until` 为 `NULL`，永久有效
4. ✅ **验证设备数量限制**：
   - 查询已激活设备数量（`device_activations` 表）
   - 检查是否超过 `device_limit`
5. ✅ **设备激活处理**：
   - **新设备**：插入 `device_activations` 记录，记录激活历史
   - **已激活设备**：更新 `last_seen_at`，记录心跳日志
   - **被停用设备**：返回错误

**11.3 返回验证结果**
- **成功响应**（200）：
  ```json
  {
    "success": true,
    "message": "许可证验证成功",
    "code": "SUCCESS",
    "license": {
      "key": "LIC-XXXXXXXX",
      "type": "lifetime",
      "expiresAt": null
    },
    "isValid": true,
    "licenseType": "lifetime",
    "expiresAt": null,
    "timestamp": "2026-01-26T22:20:00+08:00"
  }
  ```
- **失败响应**（400）：
  ```json
  {
    "success": false,
    "message": "错误信息",
    "code": "INVALID_LICENSE",
    "isValid": false,
    "timestamp": "2026-01-26T22:20:00+08:00"
  }
  ```

#### 12. 设备ID生成机制

**12.1 设备ID生成**
- **实现位置**：`OneClip/Services/DeviceIdentifierManager.swift`
- **生成方式**：
  1. ✅ 优先使用硬件UUID（`kIOPlatformUUIDKey`）
  2. ✅ 对UUID进行SHA256哈希
  3. ✅ 取前16位作为设备ID
  4. ✅ 持久化保存到UserDefaults（首次生成后永不改变）
- **降级方案**：
  - 如果无法获取硬件UUID，使用系统标识符组合（Bundle ID + 主机名 + 用户名）
  - 同样进行SHA256哈希，确保稳定性

**12.2 设备ID用途**
- ✅ 设备唯一标识（防止跨设备复制激活码）
- ✅ 设备数量限制检查
- ✅ 设备管理（停用/恢复设备）
- ✅ 设备激活历史记录

#### 13. 撤销检查机制

**13.1 撤销检查端点**
- **API端点**：`POST /api/check-revoke-status`
- **检查频率**：
  - 终身版：每天检查一次
  - 其他计划：每12小时检查一次
  - 应用进入前台：最小间隔6小时
  - 手动检查：最小间隔5分钟

**13.2 撤销策略**
- **宽限期**：2小时
- **确认阈值**：至少2次确认才降级
- **前台检查间隔**：最小15分钟
- **处理流程**：
  1. 检测到撤销 → 进入宽限期
  2. 宽限期内继续检查
  3. 达到确认阈值或宽限期过期 → 降级为免费版

## 安全机制

### 1. 订单查询安全
- ✅ 必须同时提供订单号和邮箱（AND条件）
- ✅ 频率限制：防止暴力枚举
- ✅ 模糊错误信息：不透露是订单号错误还是邮箱错误

### 2. 激活码验证安全
- ✅ API密钥验证：`X-API-Key` header
- ✅ 邮箱+激活码双重验证
- ✅ 设备ID验证：防止未授权设备激活
- ✅ 设备数量限制：防止超量激活

### 3. 邮件发送安全
- ✅ 防重复发送：自动发送时检查 `email_sent` 标志
- ✅ 允许手动重发：`resend` 允许用户主动重新发送

## 数据库表结构

### 1. `payment_orders` 表（订单表）
- `order_id`: 订单号
- `email`: 用户邮箱
- `plan`: 套餐类型（monthly/yearly/lifetime）
- `device_cap`: 设备上限
- `activation_code`: 激活码（支付后生成）
- `license_id`: 许可证ID（支付后生成）
- `status`: 订单状态（pending/paid/failed/cancelled）
- `email_sent`: 邮件发送标志（0/1）
- `created_at`: 创建时间
- `paid_at`: 支付时间

### 2. `licenses` 表（许可证表）
- `license_id`: 许可证ID（LIC-XXXXXXXX）
- `activation_code`: 激活码（XXXXX-XXXXX-XXXXX）
- `email`: 绑定邮箱
- `plan`: 套餐类型
- `device_limit`: 设备数量限制
- `valid_until`: 过期时间（UTC时间，终身版为NULL）
- `status`: 状态（active/suspended/revoked）
- `issued_at`: 发放时间

### 3. `device_activations` 表（设备激活表）
- `license_id`: 许可证ID
- `device_id`: 设备唯一标识（基于硬件UUID）
- `device_name`: 设备名称
- `is_active`: 是否激活（1/0）
- `last_seen_at`: 最后在线时间
- `activated_at`: 激活时间

## 时间处理统一

### 统一使用北京时间（CST，UTC+8）

1. **数据库存储**：UTC时间（标准做法）
2. **业务逻辑比较**：统一转换为北京时间进行比较
3. **前端显示**：统一格式化为北京时间字符串
4. **工具函数**：
   - `get_beijing_time()`: 获取当前北京时间
   - `utc_to_beijing()`: UTC转北京时间
   - `beijing_to_utc()`: 北京时间转UTC（存储）
   - `format_beijing_time()`: 格式化显示

## 邮件发送流程

### 邮件发送时机

1. **自动发送**（支付回调后）：
   - 支付回调成功后立即发送
   - 更新 `email_sent = 1`

2. **页面加载后自动发送**（如果未发送）：
   - 订单完成页面加载后，延迟3秒自动发送
   - 检查 `email_sent` 标志，避免重复发送

3. **手动重新发送**：
   - 用户点击"重新发送邮件"按钮
   - `choice: 'resend'`，允许重复发送

### 邮件内容

- 收件人：用户邮箱
- 发件人：vip@oneclip.cloud
- 主题：OneClip License Activation Code - {套餐类型}
- 内容：
  - 购买信息（套餐、设备上限、订单号等）
  - 激活码（高亮显示）
  - 激活步骤说明

## 关键API端点

| API端点 | 方法 | 用途 | 安全要求 |
|---------|------|------|----------|
| `/api/payment/create` | POST | 创建订单（国内 ZPay） | 无 |
| `/api/payment/create-international` | POST | 创建海外订单（Waffo） | 无 |
| `/api/payment/notify` | POST | 支付回调 | 支付签名验证 |
| `/api/payment/waffo-webhook` | POST | 海外支付回调 | Waffo 签名验证 |
| `/api/payment/query-order` | POST | 查询订单 | 订单号+邮箱 |
| `/api/payment/send-email` | POST | 发送邮件 | 订单号+邮箱 |
| `/api/order/complete` | GET | 订单完成页 | 订单号+邮箱 |
| `/api/verify-license-3` | POST | 验证激活码 | API密钥+激活码+邮箱+设备ID |

## 验证检查清单

### 激活码验证检查项

1. ✅ 激活码是否存在
2. ✅ 激活码状态是否为 `active`
3. ✅ 邮箱是否匹配
4. ✅ 有效期是否过期（月付/年付）
5. ✅ 设备数量是否超限
6. ✅ 设备是否被停用

## 调试与排查

### 常见问题

1. **邮件发送失败**：
   - 检查邮件服务商配置
   - 查看服务器日志
   - 检查 `email_sent` 状态

2. **激活码验证失败**：
   - 检查激活码格式
   - 检查邮箱是否匹配
   - 检查设备数量限制
   - 检查有效期

3. **订单查询失败**：
   - 检查订单号和邮箱是否匹配
   - 检查订单状态是否为 `paid`
   - 检查频率限制

## 总结

整个流程从用户购买到应用内验证，涉及：
- **4个主要阶段**：购买支付、支付回调、激活码查询、应用验证
- **6个关键API**：创建订单、支付回调、查询订单、发送邮件、订单完成、验证激活码
- **3个安全机制**：订单查询安全、激活码验证安全、邮件发送安全
- **统一时间处理**：所有时间统一使用北京时间（CST，UTC+8）

流程设计合理，安全机制完善，用户体验良好。

## 需要帮助？

激活过程中遇到问题？联系我们：

- **📧 邮件**：[vip@oneclip.cloud](mailto:vip@oneclip.cloud)
- **💬 QQ 群**：[1060157293](https://qm.qq.com/q/xiImGHVMcM)
- **🌐 官网**：[https://oneclip.cloud](https://oneclip.cloud)
