from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    """用户基础模型"""
    username: str = Field(..., description="用户名", min_length=3, max_length=50)
    email: EmailStr = Field(..., description="邮箱")
    full_name: Optional[str] = Field(None, description="全名", max_length=100)
    is_active: bool = Field(default=True, description="是否激活")

class UserCreate(UserBase):
    """创建用户"""
    password: str = Field(..., description="密码", min_length=6)
    is_admin: Optional[bool] = Field(default=False, description="是否管理员")

class UserUpdate(UserBase):
    """更新用户"""
    password: Optional[str] = Field(None, description="密码", min_length=6)
    is_admin: Optional[bool] = None

class UserResponse(UserBase):
    """用户响应"""
    id: int
    is_admin: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    """令牌模型"""
    access_token: str
    token_type: str = "bearer"

class LoginResponse(BaseModel):
    """登录响应模型"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    """令牌数据"""
    username: Optional[str] = None
    user_id: Optional[int] = None
    is_admin: Optional[bool] = False

class MonitorTaskBase(BaseModel):
    """监控任务基础模型"""
    name: str = Field(..., description="任务名称", min_length=1, max_length=200)
    url: str = Field(..., description="监控URL", min_length=1, max_length=500)
    xpath: str = Field(..., description="XPath选择器", min_length=1, max_length=500)
    interval: int = Field(default=300, description="检查间隔（秒）", ge=10)
    is_active: bool = Field(default=True, description="是否启用")

class MonitorTaskCreate(MonitorTaskBase):
    """创建监控任务"""
    email_config_id: Optional[int] = Field(None, description="邮件配置ID")

class MonitorTaskUpdate(MonitorTaskBase):
    """更新监控任务"""
    name: Optional[str] = None
    url: Optional[str] = None
    xpath: Optional[str] = None
    interval: Optional[int] = None
    is_active: Optional[bool] = None
    email_config_id: Optional[int] = None

class MonitorTaskResponse(MonitorTaskBase):
    """监控任务响应"""
    id: int
    last_content: Optional[str] = None
    last_check: Optional[datetime] = None
    owner_id: int
    email_config_id: Optional[int] = None
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
    is_ssl: Optional[bool] = None

class EmailConfigSimpleResponse(BaseModel):
    """邮件配置简单响应（用于选择器）"""
    id: int
    name: str
    smtp_user: str
    receiver_email: str

    class Config:
        from_attributes = True

class EmailConfigResponse(EmailConfigBase):
    """邮件配置响应"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True