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
```

### 2. 安装前端依赖

```bash
cd frontend
npm install
```

### 3. 启动服务

```bash
# 启动后端 (首次启动会自动创建管理员账户)
cd backend
python main.py

# 启动前端 (新终端)
cd frontend
npm start
```

### 4. 访问应用

- 前端界面: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

#### 默认管理员账户
- 用户名: `admin`
- 密码: `admin123`

**⚠️ 安全提醒**: 首次登录后请立即修改默认密码！

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

### 用户管理 (管理员功能)

1. 使用管理员账户登录
2. 点击右上角用户头像 → "用户管理"
3. 添加、编辑或删除用户账户
4. 设置用户角色和权限

## 📁 项目结构

```
WebMonitor/
├── backend/            # FastAPI后端
├── frontend/           # React前端
├── EarlyScripts/       # 早期Python脚本
└── README.md           # 项目说明
```

## ⚠️ 注意事项

- 邮件配置通过 Web 界面完成，建议使用应用专用密码
- 监控间隔建议不少于 60 秒，避免对目标网站造成压力
- 确保 ChromeDriver 版本与 Chrome 浏览器匹配
- XPath 选择器应选择稳定元素避免动态 ID

## 📧 常用 SMTP 配置

- **QQ 邮箱**: smtp.qq.com:465
- **163 邮箱**: smtp.163.com:465
- **Gmail**: smtp.gmail.com:587
- **飞书邮箱**: smtp.feishu.cn:465

## 📄 许可证

本项目采用 **Creative Commons Attribution-NonCommercial 4.0 International License** 许可证。

这意味着您可以：

- ✅ **共享** — 以任何媒介或格式复制和重新分发本软件
- ✅ **改编** — 修改、转换和基于本软件进行创作

但需遵守以下条件：

- 📝 **署名** — 您必须提供适当的署名，提供许可证链接，并说明是否进行了更改
- 🚫 **非商业性使用** — 您不得将本软件用于商业目的

**禁止商业用途**：未经版权持有人明确许可，不得将本软件或其修改版本用于任何商业目的。

详细许可证信息请查看：[LICENSE](./LICENSE) 文件

---

🌟 如有问题欢迎提交 Issue 或 Pull Request！
