# WebMonitor

<h3 align="center">网页内容变化监控平台</h3>

<p align="center">
  <img src="./image/样例图片.png" alt="WebMonitor Dashboard" width="800">
</p>

---

## 在线体验

**访问地址**: https://webmonitor.qfpqhyl.top/

> 由于服务器部署在本人的 MacBook M4 Air 上，受限于设备性能，服务会随 Docker 启停而不定时可用。如需稳定使用，建议自行部署。

---

## 项目简介

使用 Python 编写的网页内容自动监控及邮件通知工具，适用于检测网页指定区域内容变动并通过邮件提醒。

### 主要功能

- 监控网页内容变化（支持 XPath 精确定位）
- 变化时发送邮件通知
- 公开任务订阅机制
- 可视化管理面板
- Docker 一键部署

---

## 快速部署

### Docker 部署（推荐）

```bash
# 克隆项目
git clone https://github.com/qfpqhyl/WebMonitor.git
cd WebMonitor

# 启动服务
docker-compose up -d

# 访问 http://localhost:3000
# 默认账号: admin / admin123
```

### 本地开发

```bash
# 后端
cd backend && pip install -r requirements.txt && python main.py

# 前端
cd frontend && npm install && npm start
```

---

## 配置说明

复制 `.env.example` 为 `.env` 并修改关键配置：

| 配置项           | 说明                           | 默认值   |
| ---------------- | ------------------------------ | -------- |
| `SECRET_KEY`     | JWT 密钥（生产环境必须修改）   | -        |
| `ADMIN_USERNAME` | 管理员用户名                   | admin    |
| `ADMIN_PASSWORD` | 管理员密码                     | admin123 |
| `SMTP_*`         | 邮件服务器配置（发送通知必需） | -        |

更多配置选项请查看 `.env.example` 文件。

---

## 使用场景

- 监控商品价格变化
- 追踪网站公告更新
- 竞品动态监控
- 任何需要关注的网页内容

---

## 系统要求

- Python 3.9+
- Node.js 16+
- Docker（推荐）

---

## 技术栈

**后端**: FastAPI + Selenium + SQLite

**前端**: React + Material-UI

**部署**: Docker + Docker Compose

---

## 许可证

[CC BY-NC 4.0](LICENSE) - 仅供个人非商业使用

---

<p align="center">
  Made with  by 秋风飘起黄叶落
</p>
