# OneClip 文档

OneClip - 简单专业的 macOS 剪贴板管理工具

![用户评分](https://img.shields.io/badge/用户评分-4.9/5-brightgreen)
![下载量](https://img.shields.io/badge/下载量-11000%2B-blue)
![版本](https://img.shields.io/badge/最新版本-v1.5.7-orange)

## 简介

OneClip 是一款专为 macOS 打造的**专业级剪贴板管理工具**。采用 **100% SwiftUI** 原生技术，实现更顺滑的动画、更自然的系统融合与更低的资源占用。

### 主要功能

- **历史记录管理**：自动保存所有剪贴板内容，支持文本、图片、文件等多种格式
- **快速粘贴**：通过快捷键快速访问和粘贴历史记录
- **分类管理**：自定义分类标签，方便组织剪贴板内容
- **搜索功能**：快速搜索历史记录中的内容
- **云同步**：支持多设备同步剪贴板数据
- **OCR 识别**：支持图片文字识别，可搜索图片中的文字
- **快捷回复**：预设常用文本，快速回复
- **堆栈粘贴**：连续粘贴多个内容
- **隐私保护**：支持密码保护、Touch ID、Face ID
- **局域网同步**：支持 Mac 与手机/Mac 在同一 WiFi 下实时双向同步
- **脚本功能**：支持 JavaScript 脚本编写，实现自动化操作
- **AI 集成**：支持本地 AI（Ollama/LMStudio）与在线 AI 服务

## 许可证

OneClip 提供三种许可证类型：

| 类型 | 价格 | 有效期 | 设备限制 |
|------|------|--------|----------|
| 月度版 | ¥5/月 | 30 天 | 5 台设备 |
| 年度版 | ¥50/年 | 365 天 | 5 台设备 |
| 终身版 | ¥39.90 | 永久 | 5 台设备 |

### 许可证功能

免费版：
- 1 天历史记录
- 基础功能

付费版：
- 无限历史记录
- 无限收藏
- 无限分类
- 自动清理
- 高级设置
- 云同步

## 文档结构

```
docs/
├── index.md              # 首页
├── guide/                # 快速开始
│   ├── installation.md   # 下载安装
│   └── basic-usage.md    # 基础使用
├── features/             # 功能介绍
│   ├── core-features.md  # 核心功能
│   └── hotkeys.md        # 快捷键设置
├── purchase/             # 购买许可证
│   ├── index.md          # 版本对比
│   ├── monthly.md        # 月度版
│   ├── yearly.md         # 年度版
│   ├── lifetime.md       # 终身版
│   ├── activation.md     # 激活指南
│   └── payment.md        # 支付说明
├── blog/                 # 博客
│   ├── index.md          # 博客首页
│   ├── best-clipboard-managers-2026.md
│   ├── clipboard-comparison.md
│   ├── efficiency-tips.md
│   ├── mac-clipboard-history.md
│   ├── oneclip-vs-paste.md
│   └── shortcuts-guide.md
├── help/                 # 帮助文档
│   ├── faq.md            # 常见问题
│   └── activation-flow.md # 激活码全流程
└── about/                # 关于
    ├── changelog.md      # 更新日志
    └── contact.md        # 联系我们
```

## 快速开始

### 安装

1. 访问 [GitHub Releases](https://github.com/Wcowin/OneClip/releases)
2. 下载最新版本的 DMG 文件
3. 拖拽 OneClip 到应用程序文件夹
4. 打开 OneClip 应用

### 激活

1. 打开 OneClip 应用
2. 进入设置 → 高级功能
3. 输入激活码和邮箱
4. 点击激活按钮

详细激活流程请查看 [激活码全流程](docs/help/activation-flow.md)

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd + Shift + V` | 打开剪贴板历史 |
| `Cmd + Shift + R` | 快捷回复 |
| `Cmd + ;` | 快速粘贴面板 |

更多快捷键请查看 [快捷键使用指南](docs/blog/shortcuts-guide.md)

## 联系我们

- **📧 邮件**：[vip@oneclip.cloud](mailto:vip@oneclip.cloud)
- **💬 QQ 群**：[1060157293](https://qm.qq.com/q/xiImGHVMcM)
- **📱 Telegram**：[https://t.me/+I7S6R0pw5180YzRl](https://t.me/+I7S6R0pw5180YzRl)
- **🌐 官网**：[https://oneclip.cloud](https://oneclip.cloud)
- **🐛 GitHub Issues**：[https://github.com/Wcowin/OneClip/issues](https://github.com/Wcowin/OneClip/issues)

## 许可证

Copyright © 2026 Wcowin. All rights reserved.

## 更新日志

查看 [更新日志](docs/about/changelog.md) 了解最新版本更新内容。

## 源码说明

OneClip 早期源码已开源在 [src/](https://github.com/Wcowin/OneClip/tree/main/src) 目录，可自行下载构建。采用 MIT 协议。当前正式版已采用数据库存储，功能更完善，为商业软件。

Windows 版本正在开发中，敬请期待！仓库地址：[https://github.com/Wcowin/OneClip-Windows](https://github.com/Wcowin/OneClip-Windows)
