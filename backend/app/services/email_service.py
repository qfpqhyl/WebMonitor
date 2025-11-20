import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from datetime import datetime
from typing import Optional
from app.core.config import settings
from ..db.database import SessionLocal
from ..db.models import EmailConfig

class EmailService:
    """邮件服务"""

    def __init__(self):
        self._config: Optional[EmailConfig] = None

    def get_email_config_by_id(self, config_id: int) -> Optional[EmailConfig]:
        """根据ID获取邮件配置"""
        db = SessionLocal()
        try:
            return db.query(EmailConfig).filter(EmailConfig.id == config_id).first()
        finally:
            db.close()

    def get_email_config(self, user_id: Optional[int] = None) -> Optional[EmailConfig]:
        """获取邮件配置，优先从数据库获取用户配置，如果数据库没有配置则回退到环境变量"""
        db = SessionLocal()
        try:
            # 如果提供了用户ID，尝试获取用户的邮件配置
            if user_id:
                from ..db.crud import get_user_active_email_config
                user_config = get_user_active_email_config(db, user_id)
                if user_config:
                    return user_config

            # 回退到全局邮件配置
            self._config = db.query(EmailConfig).first()
            return self._config
        finally:
            db.close()

    def get_config_from_env(self) -> dict:
        """从环境变量获取配置作为回退选项"""
        return {
            "smtp_server": settings.SMTP_SERVER,
            "smtp_port": settings.SMTP_PORT,
            "smtp_user": settings.SMTP_USER,
            "smtp_password": settings.SMTP_PASSWORD,
            "receiver_email": settings.RECEIVER_EMAIL,
            "is_ssl": True
        }

    async def send_change_notification(
        self,
        task_name: str,
        url: str,
        title: str,
        old_content: str,
        new_content: str,
        check_time: datetime,
        email_config_id: Optional[int] = None,
        user_id: Optional[int] = None
    ) -> bool:
        """
        发送内容变化通知邮件

        Args:
            task_name: 任务名称
            url: 监控URL
            title: 网页标题
            old_content: 旧内容
            new_content: 新内容
            check_time: 检查时间
            email_config_id: 邮箱配置ID（优先使用）
            user_id: 用户ID（可选，用于获取用户的邮件配置）

        Returns:
            bool: 发送是否成功
        """
        # 优先使用指定的邮箱配置ID
        if email_config_id:
            config = self.get_email_config_by_id(email_config_id)
        else:
            config = self.get_email_config(user_id)

        if config:
            smtp_server = config.smtp_server
            smtp_port = config.smtp_port
            smtp_user = config.smtp_user
            smtp_password = config.smtp_password
            receiver_email = config.receiver_email
            is_ssl = config.is_ssl
        else:
            # 回退到环境变量配置
            env_config = self.get_config_from_env()
            smtp_server = env_config["smtp_server"]
            smtp_port = env_config["smtp_port"]
            smtp_user = env_config["smtp_user"]
            smtp_password = env_config["smtp_password"]
            receiver_email = env_config["receiver_email"]
            is_ssl = env_config["is_ssl"]

        if not all([smtp_server, smtp_user, smtp_password, receiver_email]):
            print("邮件配置不完整，跳过发送")
            return False

        subject = f"{title} - 内容更新通知"

        # 格式化时间
        time_str = check_time.strftime("%Y-%m-%d %H:%M:%S")

        email_body = f"""
网页内容已更新！

监控任务: {task_name}
网页标题: {title}
监控URL: {url}
更新时间: {time_str}

---
原内容:
{old_content}

---
新内容:
{new_content}

---
此邮件由 WebMonitor 自动发送。
        """

        return self._send_email(subject, email_body, smtp_server, smtp_port, smtp_user, smtp_password, receiver_email, is_ssl)

    def _send_email(self, subject: str, content: str, smtp_server: str, smtp_port: int,
                  smtp_user: str, smtp_password: str, receiver_email: str, is_ssl: bool = True) -> bool:
        """
        发送邮件

        Args:
            subject: 邮件主题
            content: 邮件内容
            smtp_server: SMTP服务器地址
            smtp_port: SMTP端口
            smtp_user: 发送者邮箱
            smtp_password: SMTP密码
            receiver_email: 接收者邮箱
            is_ssl: 是否使用SSL

        Returns:
            bool: 发送是否成功
        """
        if not all([smtp_server, smtp_user, smtp_password, receiver_email]):
            print("邮件配置不完整，无法发送")
            return False

        try:
            # 创建邮件对象
            msg = MIMEMultipart()
            msg['From'] = smtp_user
            msg['To'] = receiver_email
            msg['Subject'] = Header(subject, 'utf-8')

            # 添加邮件正文
            msg.attach(MIMEText(content, 'plain', 'utf-8'))

            # 根据配置选择连接方式
            if is_ssl:
                server = smtplib.SMTP_SSL(smtp_server, smtp_port, local_hostname='localhost')
            else:
                server = smtplib.SMTP(smtp_server, smtp_port, local_hostname='localhost')
                server.starttls()

            # 显示调试信息
            server.set_debuglevel(0)

            # 登录
            server.login(smtp_user, smtp_password)

            # 发送邮件
            server.sendmail(smtp_user, receiver_email, msg.as_string())

            # 关闭连接
            server.quit()

            print("邮件发送成功!")
            return True

        except smtplib.SMTPException as e:
            print(f"邮件发送失败 (SMTP错误): {e}")
            return False
        except UnicodeEncodeError as e:
            print(f"邮件发送失败 (编码错误): {e}")
            return False
        except Exception as e:
            print(f"邮件发送失败 (未知错误): {e}")
            return False

    def test_email_connection(self) -> dict:
        """
        测试邮件连接（使用当前配置）

        Returns:
            dict: 测试结果
        """
        config = self.get_email_config()

        if config:
            smtp_server = config.smtp_server
            smtp_port = config.smtp_port
            smtp_user = config.smtp_user
            smtp_password = config.smtp_password
            is_ssl = config.is_ssl
        else:
            # 回退到环境变量配置
            env_config = self.get_config_from_env()
            smtp_server = env_config["smtp_server"]
            smtp_port = env_config["smtp_port"]
            smtp_user = env_config["smtp_user"]
            smtp_password = env_config["smtp_password"]
            is_ssl = env_config["is_ssl"]

        return self._test_connection(smtp_server, smtp_port, smtp_user, smtp_password, is_ssl)

    def test_email_connection_with_config(self, config: EmailConfig) -> dict:
        """
        使用指定配置测试邮件连接

        Args:
            config: 邮件配置对象

        Returns:
            dict: 测试结果
        """
        return self._test_connection(
            config.smtp_server,
            config.smtp_port,
            config.smtp_user,
            config.smtp_password,
            config.is_ssl
        )

    async def send_test_email(self, config: EmailConfig) -> bool:
        """
        发送测试邮件

        Args:
            config: 邮件配置对象

        Returns:
            bool: 发送是否成功
        """
        from datetime import datetime

        test_time = datetime.now()
        subject = "WebMonitor 邮件配置测试"

        email_body = f"""
这是一封来自 WebMonitor 的测试邮件。

测试时间: {test_time.strftime("%Y-%m-%d %H:%M:%S")}
配置名称: {config.name}
SMTP服务器: {config.smtp_server}:{config.smtp_port}
发件人邮箱: {config.smtp_user}
接收者邮箱: {config.receiver_email}

如果您收到这封邮件，说明邮件配置正常工作！

---
此邮件由 WebMonitor 自动发送。
        """

        return self._send_email(
            subject,
            email_body,
            config.smtp_server,
            config.smtp_port,
            config.smtp_user,
            config.smtp_password,
            config.receiver_email,
            config.is_ssl
        )

    def _test_connection(self, smtp_server: str, smtp_port: int, smtp_user: str,
                         smtp_password: str, is_ssl: bool) -> dict:
        """
        测试SMTP连接

        Args:
            smtp_server: SMTP服务器地址
            smtp_port: SMTP端口
            smtp_user: 发送者邮箱
            smtp_password: SMTP密码
            is_ssl: 是否使用SSL

        Returns:
            dict: 测试结果
        """
        if not all([smtp_server, smtp_user, smtp_password]):
            return {
                "success": False,
                "error": "邮件配置不完整"
            }

        try:
            if is_ssl:
                server = smtplib.SMTP_SSL(smtp_server, smtp_port, local_hostname='localhost')
            else:
                server = smtplib.SMTP(smtp_server, smtp_port, local_hostname='localhost')
                server.starttls()

            server.login(smtp_user, smtp_password)
            server.quit()

            return {"success": True, "message": "邮件连接测试成功"}

        except Exception as e:
            return {"success": False, "error": f"邮件连接测试失败: {e}"}