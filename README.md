# WebMonitor - 网页内容变动监控通知系统

现代化的网页内容监控平台，支持实时监控网页内容变化并通过邮件发送通知。

![](./image/样例图片.png)

## 🚀 功能特性

- **实时监控**: 支持多个网页同时监控，自定义检查间隔
- **精准定位**: 基于 XPath 精确定位要监控的内容
- **智能检测**: 自动检测网页内容变化，支持动态网页
- **邮件通知**: 配置 SMTP 邮件服务器，内容变化时自动发送通知
- **可视化管理**: 现代化 Web 界面，直观管理监控任务
- **历史记录**: 完整的监控日志记录和查询

## 🏗️ 技术架构

- **前端**: React 18 + Material-UI + React Query
- **后端**: FastAPI + SQLAlchemy + APScheduler
- **监控引擎**: Selenium WebDriver
- **数据库**: SQLite (可扩展至 PostgreSQL)
- **邮件服务**: SMTP SSL/TLS

## 🚀 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/qfpqhyl/WebMonitor.git

cd WebMonitor

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
SMTP_SERVER=smtp.example.com
SMTP_PORT=465
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_app_password
RECEIVER_EMAIL=receiver@example.com
```

### 3. 启动服务

```bash
# 启动后端
cd backend
python main.py

# 启动前端 (新终端)
cd frontend
npm install
npm start
```

### 4. 访问应用

- 前端界面: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

## 📖 使用指南

### 添加监控任务

1. 访问"监控任务"页面
2. 点击"添加任务"
3. 填写任务名称、URL 和 XPath 选择器
4. 设置检查间隔并启用

### 获取 XPath

1. 浏览器打开目标网页
2. 右键点击要监控的元素 → 检查
3. 右键高亮代码 → Copy → Copy XPath

### 配置邮件通知

1. 访问"邮件通知配置"页面
2. 添加 SMTP 配置
3. 测试连接并启用配置

## 📁 项目结构

```
WebMonitor/
├── backend/            # FastAPI后端
├── frontend/           # React前端
├── EarlyScripts/       # 早期Python脚本
├── requirements.txt    # Python依赖
└── .env               # 环境变量配置
```

## ⚠️ 注意事项

- 使用应用专用密码而非邮箱主密码
- 监控间隔建议不少于 60 秒
- 确保 ChromeDriver 版本与 Chrome 浏览器匹配
- XPath 选择器应选择稳定元素避免动态 ID

## 📧 常用 SMTP 配置

- **QQ 邮箱**: smtp.qq.com:465
- **163 邮箱**: smtp.163.com:465
- **Gmail**: smtp.gmail.com:587
- **飞书邮箱**: smtp.feishu.cn:465

---

🌟 如有问题欢迎提交 Issue 或 Pull Request！
