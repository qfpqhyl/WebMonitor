# 网页内容变动监控通知系统

本项目是一个使用 Python 编写的网页内容自动监控及邮件通知工具，适用于检测网页指定区域内容变动并通过邮件提醒。

---

## 功能简介

- **多网页/XPath 支持**：可同时监控多个网页指定内容（XPath）。
- **自动邮件通知**：检测到内容变化后自动邮件提醒。
- **可配置检测频率**：自定义检测时间间隔。
- **Selenium 动态内容抓取**：兼容动态网页。
- **TODO**：为需要登录才能访问的网页添加 session（如 cookies、headers 或 requests.Session），以便监控受限页面。

---

## 快速使用

### 1. 环境准备

- Python 3.6+
- 安装依赖：

  ```bash
  pip install requests lxml selenium
  ```

- 安装 Chrome 浏览器和对应版本的 ChromeDriver。

### 2. 配置监控网址与 XPath

在 `main.py` 的 `url_xpath_pairs` 字典中添加目标网址及 XPath：

```python
url_xpath_pairs = {
    "https://example.com/page": "/html/body/div[2]/div/div[4]/div/ul/li[2]/a",
    ...
}
```

### 3. 设置收件邮箱

在 `main.py` 修改：

```python
receiver_email = 'your_email@example.com'
```

### 4. 启动脚本

```bash
nohup python3 main.py > mylog.out 2>&1 &
```

---

## 邮件通知配置

邮件发送通过 SMTP 实现。请在 `outlooknotice.py` 中填写你的邮箱 SMTP 地址、账号和授权码。

---

## 注意事项

- XPath 路径请用浏览器开发者工具获取。
- 邮箱账号及授权码请注意安全，避免泄露。
- 本工具仅供学习或个人自动通知用途。

---

**使用愉快！**
