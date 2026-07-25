# OneClip 文档

OneClip - 简单专业的 macOS 剪贴板管理工具

<p align="center">
  <a href="https://github.com/One-Clip/OneClip/releases"><img src="https://img.shields.io/github/v/release/Wcowin/OneClip?style=for-the-badge&color=3b82f6" alt="Release" style="border-radius: 8px;" /></a>
  <a href="https://github.com/One-Clip/OneClip/releases"><img src="https://img.shields.io/github/downloads/Wcowin/OneClip/total?style=for-the-badge&color=22c55e" alt="Downloads" style="border-radius: 8px;" /></a>
  <img src="https://img.shields.io/badge/Homebrew-Available-orange?style=for-the-badge&logo=homebrew&logoColor=white" alt="Homebrew" style="border-radius: 8px;" />
  <img src="https://img.shields.io/badge/macOS-12%2B-0f172a?style=for-the-badge&logo=apple&logoColor=white" alt="macOS 12+" style="border-radius: 8px;" />
  <img src="https://img.shields.io/badge/Swift-5.9%2B-F05138?style=for-the-badge&logo=swift&logoColor=white" alt="Swift 5.9+" style="border-radius: 8px;" />
  <img src="https://img.shields.io/badge/Privacy-Local%20Storage-green?style=for-the-badge" alt="Privacy Local Storage" style="border-radius: 8px;" />
  <a href="https://github.com/One-Clip/OneClip/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License" style="border-radius: 8px;" /></a>
  <a href="https://qm.qq.com/q/xiImGHVMcM"><img src="https://img.shields.io/badge/QQ%E7%BE%A4-1060157293-0084ff?style=for-the-badge&logo=qq&logoColor=white" alt="QQ 群" style="border-radius: 8px;" /></a>
  <a href="https://space.bilibili.com/1407028951/lists/5012369?type=series">
    <img src="https://img.shields.io/badge/%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B-6366f1?style=for-the-badge" alt="视频教程" style="border-radius: 8px;">
  </a>
</p>

## 简介

OneClip 是一款专为 macOS 打造的**专业级剪贴板管理工具**。采用 **100% SwiftUI** 原生技术，实现更顺滑的动画、更自然的系统融合与更低的资源占用。

### 核心功能

- **智能记录**：自动保存剪贴板历史，支持文本、图片、文件等格式
- **全格式支持**：图片/视频/音频/文档等，完整保留元数据
- **文本/图片编辑**：支持文本/图片编辑，删除可撤销；支持置顶、收藏、删除等管理操作
- **栈粘贴板**：`⌘+⇧+C` 呼出栈粘贴板，方便批量管理；`⌘+V` 依次粘贴栈内容，`⌘+⇧+S` 按行拆分捕获内容
- **快速粘贴面板**：`⌘+；` 呼出快速粘贴面板，快速粘贴最近内容
- **拖拽容器**：`⌘+⇧+D` 呼出拖拽容器，暂存并拖出文件/图片到其他应用
- **极速搜索**：`⌘+F`随打随搜，多维筛选与搜索高亮，快速定位历史内容
- **菜单栏集成**：菜单栏快速访问、分类搜索、悬停预览与一键复制粘贴(左键复制，右键粘贴一气呵成)
- **全局快捷键**：`⌘+⇧+V` 呼出主界面（支持自定义组合）
- **快捷回复**：`⌘+⇧+R` 呼出快捷回复界面，支持文本/图片/文件模板及导入导出
- **OCR 识别**：主动识别屏幕或图片文本，支持 OCR 翻译与快速提取
- **轻量级截图**：支持轻量级截图，多种截图模式，支持截取区域、全屏、窗口等
- **划词翻译/截图翻译**：支持划词翻译、截图翻译，无需手动输入
- **脚本功能**：支持 JS 脚本编写，实现自动化操作
- **AI 集成**：支持本地 AI（Ollama/LMStudio）与在线 AI 服务，智能总结与翻译
- **云同步**：支持 iCloud/Dropbox 等自定义同步方案与数据备份/导入导出
- **自定义存储位置**：支持自定义数据存储位置，便于管理
- **隐私保护**：完全本地存储，无任何数据上传；支持生物识别（Touch ID/Face ID）保护
- **多语言支持**：界面支持中文、英文
- **局域网同步**：支持局域网内多设备同步文本/图片，网页实时共享剪贴板内容
- **API 支持**：提供URL Scheme API 接口，方便与其他应用集成
- **灵活控制**：Dock 图标、明暗主题适配等配置；支持列表/卡片视图切换，卡片模式支持三种方向，支持边缘停靠鼠标触发
- **现代界面**：遵循 macOS 设计规范，毛玻璃与暗黑模式适配
- **便捷安装**：支持 Homebrew 一键安装（也支持Sparkle 自动更新）
- **访达增强**：支持访达 ⌘+X 剪切文件，然后 ⌘+V 在其他位置移动文件（别处单独付费的功能，**OneClip 免费开放给大家**）
- **PopClip**：类PopClip选中菜单功能，选中文本后在鼠标位置显示快捷操作菜单
- **更多功能**：等你来发现

## 许可证

OneClip 提供三种许可证类型：

| 类型 | 价格 | 有效期 | 设备限制 |
|------|------|--------|----------|
| 月度版 | ¥5/月 | 30 天 | 不限设备 |
| 年度版 | ¥50/年 | 365 天 | 不限设备 |
| 终身版 | ¥39.90 | 永久 | 不限设备 |

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

1. 访问 [GitHub Releases](https://github.com/One-Clip/OneClip/releases)
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
- **🐛 GitHub Issues**：[https://github.com/One-Clip/OneClip/issues](https://github.com/One-Clip/OneClip/issues)

## 许可证

Copyright © 2026 Wcowin. All rights reserved.

## 更新日志

查看 [更新日志](docs/about/changelog.md) 了解最新版本更新内容。

## 源码说明

OneClip 早期源码已开源在 [src/](https://github.com/One-Clip/OneClip/tree/main/src) 目录，可自行下载构建。采用 MIT 协议。当前正式版已采用数据库存储，功能更完善，为商业软件。
