from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class MonitorTask(Base):
    """监控任务模型"""
    __tablename__ = "monitor_tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, comment="任务名称")
    url = Column(String(500), nullable=False, comment="监控URL")
    xpath = Column(String(500), nullable=False, comment="XPath选择器")
    interval = Column(Integer, default=300, comment="检查间隔（秒）")
    is_active = Column(Boolean, default=True, comment="是否启用")
    last_content = Column(Text, comment="上次内容")
    last_check = Column(DateTime, comment="上次检查时间")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), comment="更新时间")

    # 关联监控日志
    logs = relationship("MonitorLog", back_populates="task", cascade="all, delete-orphan")

class MonitorLog(Base):
    """监控日志模型"""
    __tablename__ = "monitor_logs"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("monitor_tasks.id"), nullable=False, comment="任务ID")
    old_content = Column(Text, comment="旧内容")
    new_content = Column(Text, comment="新内容")
    is_changed = Column(Boolean, default=False, comment="内容是否变化")
    error_message = Column(Text, comment="错误信息")
    check_time = Column(DateTime(timezone=True), server_default=func.now(), comment="检查时间")

    # 关联监控任务
    task = relationship("MonitorTask", back_populates="logs")

class EmailConfig(Base):
    """邮件配置模型"""
    __tablename__ = "email_configs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, comment="配置名称")
    smtp_server = Column(String(200), nullable=False, comment="SMTP服务器地址")
    smtp_port = Column(Integer, default=465, comment="SMTP端口")
    smtp_user = Column(String(200), nullable=False, comment="发送者邮箱")
    smtp_password = Column(String(200), nullable=False, comment="SMTP密码")
    receiver_email = Column(String(200), nullable=False, comment="接收者邮箱")
    is_active = Column(Boolean, default=True, comment="是否启用")
    is_ssl = Column(Boolean, default=True, comment="是否使用SSL")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), comment="更新时间")