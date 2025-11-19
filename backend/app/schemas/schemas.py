from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class MonitorTaskBase(BaseModel):
    """监控任务基础模型"""
    name: str = Field(..., description="任务名称", min_length=1, max_length=200)
    url: str = Field(..., description="监控URL", min_length=1, max_length=500)
    xpath: str = Field(..., description="XPath选择器", min_length=1, max_length=500)
    interval: int = Field(default=300, description="检查间隔（秒）", ge=10)
    is_active: bool = Field(default=True, description="是否启用")

class MonitorTaskCreate(MonitorTaskBase):
    """创建监控任务"""
    pass

class MonitorTaskUpdate(MonitorTaskBase):
    """更新监控任务"""
    name: Optional[str] = None
    url: Optional[str] = None
    xpath: Optional[str] = None
    interval: Optional[int] = None
    is_active: Optional[bool] = None

class MonitorTaskResponse(MonitorTaskBase):
    """监控任务响应"""
    id: int
    last_content: Optional[str] = None
    last_check: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MonitorLogBase(BaseModel):
    """监控日志基础模型"""
    old_content: Optional[str] = None
    new_content: Optional[str] = None
    is_changed: bool = False
    error_message: Optional[str] = None

class MonitorLogResponse(MonitorLogBase):
    """监控日志响应"""
    id: int
    task_id: int
    check_time: datetime

    class Config:
        from_attributes = True

class MonitorTaskWithLogs(MonitorTaskResponse):
    """包含日志的监控任务响应"""
    logs: List[MonitorLogResponse] = []

class EmailConfigBase(BaseModel):
    """邮件配置基础模型"""
    name: str = Field(..., description="配置名称", min_length=1, max_length=100)
    smtp_server: str = Field(..., description="SMTP服务器地址", min_length=1, max_length=200)
    smtp_port: int = Field(default=465, description="SMTP端口", ge=1, le=65535)
    smtp_user: str = Field(..., description="发送者邮箱", min_length=1, max_length=200)
    smtp_password: str = Field(..., description="SMTP密码", min_length=1, max_length=200)
    receiver_email: str = Field(..., description="接收者邮箱", min_length=1, max_length=200)
    is_active: bool = Field(default=True, description="是否启用")
    is_ssl: bool = Field(default=True, description="是否使用SSL")

class EmailConfigCreate(EmailConfigBase):
    """创建邮件配置"""
    pass

class EmailConfigUpdate(EmailConfigBase):
    """更新邮件配置"""
    name: Optional[str] = None
    smtp_server: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    receiver_email: Optional[str] = None
    is_active: Optional[bool] = None
    is_ssl: Optional[bool] = None

class EmailConfigResponse(EmailConfigBase):
    """邮件配置响应"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True