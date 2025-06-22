import smtplib
import socket
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header


def send_email(subject, content, to_email, attachment_path=None):
    """
    发送电子邮件

    参数:
        subject (str): 邮件主题
        content (str): 邮件内容
        to_email (str): 收件人邮箱
        attachment_path (str, optional): 附件路径
    """
    # SMTP 服务器信息 自行配置
    smtp_server = "******"
    smtp_port = ***  # SSL 端口
    smtp_user = "******"  # 发件人邮箱
    smtp_password = "******"  # SMTP 密码

    # 创建邮件对象
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg['Subject'] = Header(subject, 'utf-8')

    # 添加邮件正文
    msg.attach(MIMEText(content, 'plain', 'utf-8'))

    # 添加附件(如果有)
    if attachment_path:
        try:
            from email.mime.application import MIMEApplication
            with open(attachment_path, 'rb') as f:
                attachment = MIMEApplication(f.read())
                filename = attachment_path.split('/')[-1]
                attachment.add_header(
                    'Content-Disposition', 'attachment', filename=filename)
                msg.attach(attachment)
        except Exception as e:
            print(f"添加附件时出错: {e}")

    try:
        # 使用 SSL 连接到 SMTP 服务器，明确指定本地主机名为 ASCII 字符串
        # 这里使用一个简单的字符串而不是系统的主机名，以避免非 ASCII 字符问题
        server = smtplib.SMTP_SSL(
            smtp_server, smtp_port, local_hostname='localhost')

        # 显示调试信息
        server.set_debuglevel(0)

        # 登录
        server.login(smtp_user, smtp_password)

        # 发送邮件
        server.sendmail(smtp_user, to_email, msg.as_string())
        print("邮件发送成功!")

        # 关闭连接
        server.quit()
        return True
    except smtplib.SMTPException as e:
        print(f"邮件发送失败 (SMTP错误): {e}")
        return False
    except UnicodeEncodeError as e:
        print(f"邮件发送失败 (编码错误): {e}")
        print("这可能是由于主机名包含非ASCII字符造成的")
        return False
    except Exception as e:
        print(f"邮件发送失败 (未知错误): {e}")
        return False


if __name__ == "__main__":
    # 使用示例
    subject = "测试邮件"
    content = """
    您好，

    这是一封通过 Python 脚本发送的测试邮件。

    祝好,
    自动邮件系统
    """
    recipient = "your_email@example.com"

    # 发送邮件
    send_email(subject, content, recipient)
