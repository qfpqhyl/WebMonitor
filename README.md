# WebMonitor - 网页内容变动监控通知系统

本项目是一个现代化的网页内容监控平台，提供前后端分离架构，支持实时监控网页内容变化并通过多种方式发送通知。

## 🚀 项目架构

### 当前版本
- **前端**: React + TypeScript (开发中)
- **后端**: FastAPI + Python (开发中)
- **数据库**: PostgreSQL (开发中)

### 早期版本
早期的纯 Python 脚本版本已移至 [`EarlyScripts`](./EarlyScripts/) 目录，包含：
- 单体脚本实现
- 基础的网页监控功能
- 邮件通知功能

---

## 功能简介

- **多网页/XPath 支持**：可同时监控多个网页指定内容（XPath）
- **自动邮件通知**：检测到内容变化后自动邮件提醒
- **可配置检测频率**：自定义检测时间间隔
- **Selenium 动态内容抓取**：兼容动态网页
- **环境变量配置**：敏感信息安全存储，避免泄露到版本控制
- **TODO**：为需要登录才能访问的网页添加 session（如 cookies、headers 或 requests.Session），以便监控受限页面

---

## 快速开始

### 🔄 使用早期脚本版本

如果你需要立即使用基础监控功能，可以使用早期脚本版本：

1. **环境准备**
   ```bash
   cd EarlyScripts
   pip install -r ../requirements.txt
   ```

2. **配置环境变量**
   ```bash
   # 编辑 .env 文件
   vim .env
   ```

3. **运行脚本**
   ```bash
   python main.py
   ```

### 🆕 新版本开发中

新版本将提供以下功能：
- 🌐 现代化 Web 界面
- 📊 实时监控仪表板
- 🔧 可视化配置界面
- 📱 多种通知方式
- 📈 监控历史和统计
- 👥 多用户支持

**开发状态**: 🚧 前后端架构开发中...

---

## 环境变量说明

所有敏感信息都通过环境变量配置，确保信息安全：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `SMTP_SERVER` | SMTP 服务器地址 | `smtp.feishu.cn` |
| `SMTP_PORT` | SMTP 端口号 | `465` |
| `SMTP_USER` | 发件人邮箱 | `notice@example.com` |
| `SMTP_PASSWORD` | SMTP 密码/授权码 | `your_password` |
| `RECEIVER_EMAIL` | 接收通知的邮箱 | `your_email@example.com` |

---

## XPath 获取方法

1. 在浏览器中打开目标网页
2. 右键点击要监控的内容 → 检查元素
3. 在开发者工具中，右键点击选中的元素 → Copy → Copy XPath

---

## 项目结构

```
WebMonitor/
├── EarlyScripts/        # 早期脚本版本
│   ├── main.py         # 早期主程序
│   ├── outlooknotice.py # 早期邮件模块
│   └── README.md       # 早期版本说明
├── frontend/           # React 前端 (开发中)
├── backend/            # FastAPI 后端 (开发中)
├── .env                # 环境变量配置
├── .gitignore          # Git 忽略配置
├── requirements.txt    # Python 依赖
└── README.md          # 项目说明文档
```

---

## 安全注意事项

- ✅ `.env` 文件已被 `.gitignore` 忽略，不会上传到版本控制
- ✅ 所有敏感信息都通过环境变量管理
- ⚠️ 邮箱密码/授权码请使用应用专用密码，避免使用主密码
- ⚠️ 定期更换邮箱密码和授权码
- ⚠️ 不要将 `.env` 文件分享或上传到公共平台

---

## 常见问题

### 1. 如何获取邮箱的 SMTP 配置？
- **飞书邮箱**：服务器 `smtp.feishu.cn`，端口 `465`
- **QQ邮箱**：服务器 `smtp.qq.com`，端口 `465`
- **163邮箱**：服务器 `smtp.163.com`，端口 `465`
- **Gmail**：服务器 `smtp.gmail.com`，端口 `587`

### 2. 如何获取邮箱授权码？
大多数邮箱服务需要使用应用专用密码而非登录密码：
- QQ邮箱：设置 → 账户 → POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务 → 开启服务 → 生成授权码
- 飞书邮箱：设置 → 邮箱 → SMTP设置 → 生成应用密码

### 3. ChromeDriver 配置
- 下载与 Chrome 浏览器版本对应的 ChromeDriver
- 将 chromedriver 添加到系统 PATH 或放在项目目录中

---

**使用愉快！如有问题欢迎提交 Issue。**
