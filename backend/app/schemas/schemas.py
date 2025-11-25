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

class UserUpdate(BaseModel):
    """更新用户"""
    username: Optional[str] = Field(None, description="用户名")
    email: Optional[EmailStr] = Field(None, description="邮箱")
    full_name: Optional[str] = Field(None, description="全名")
    is_active: Optional[bool] = Field(None, description="是否激活")
    password: Optional[str] = Field(None, description="密码")
    is_admin: Optional[bool] = None
    max_subscriptions: Optional[int] = Field(None, description="最大订阅任务数量")

class UserResponse(BaseModel):
    """用户响应"""
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool
    is_admin: bool
    max_subscriptions: Optional[int] = 10
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
    is_public: bool = Field(default=False, description="是否公开")
    description: Optional[str] = Field(None, description="任务描述", max_length=1000)

class MonitorTaskCreate(MonitorTaskBase):
    """创建监控任务"""
    email_config_id: int = Field(..., description="邮件配置ID")

class MonitorTaskUpdate(BaseModel):
    """更新监控任务"""
    name: Optional[str] = Field(None, description="任务名称", min_length=1, max_length=200)
    url: Optional[str] = Field(None, description="监控URL", min_length=1, max_length=500)
    xpath: Optional[str] = Field(None, description="XPath选择器", min_length=1, max_length=500)
    interval: Optional[int] = Field(None, description="检查间隔（秒）", ge=10)
    is_active: Optional[bool] = Field(None, description="是否启用")
    is_public: Optional[bool] = Field(None, description="是否公开")
    description: Optional[str] = Field(None, description="任务描述", max_length=1000)
    email_config_id: Optional[int] = Field(None, description="邮件配置ID")

class MonitorTaskResponse(MonitorTaskBase):
    """监控任务响应"""
    id: int
    last_content: Optional[str] = None
    last_check: Optional[datetime] = None
    owner_id: int
    email_config_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    owner_username: Optional[str] = None
    subscription_count: Optional[int] = 0
    user_subscribed: Optional[bool] = False

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

class BlacklistDomainBase(BaseModel):
    """黑名单域名基础模型"""
    domain: str = Field(..., description="黑名单域名", min_length=1, max_length=500)
    description: Optional[str] = Field(None, description="描述")
    is_active: bool = Field(default=True, description="是否启用")

class BlacklistDomainCreate(BlacklistDomainBase):
    """创建黑名单域名"""
    pass

class BlacklistDomainUpdate(BaseModel):
    """更新黑名单域名"""
    domain: Optional[str] = Field(None, description="黑名单域名", min_length=1, max_length=500)
    description: Optional[str] = Field(None, description="描述")
    is_active: Optional[bool] = Field(None, description="是否启用")

class BlacklistDomainResponse(BlacklistDomainBase):
    """黑名单域名响应"""
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskSubscriptionBase(BaseModel):
    """任务订阅基础模型"""
    task_id: int = Field(..., description="订阅任务ID")
    is_active: bool = Field(default=True, description="是否启用订阅")
    email_config_id: Optional[int] = Field(None, description="通知邮件配置ID")

class TaskSubscriptionCreate(TaskSubscriptionBase):
    """创建任务订阅"""
    pass

class TaskSubscriptionUpdate(BaseModel):
    """更新任务订阅"""
    is_active: Optional[bool] = Field(None, description="是否启用订阅")
    email_config_id: Optional[int] = Field(None, description="通知邮件配置ID")

class TaskSubscriptionResponse(TaskSubscriptionBase):
    """任务订阅响应"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    task_name: Optional[str] = None
    task_url: Optional[str] = None

    class Config:
        from_attributes = True


class PublicTaskResponse(BaseModel):
    """公开任务响应（用于公开任务列表）"""
    id: int
    name: str
    url: str
    description: Optional[str] = None
    owner_username: Optional[str] = None
    created_at: datetime
    subscription_count: Optional[int] = 0
    user_subscribed: Optional[bool] = False

    class Config:
        from_attributes = True


class UserSubscriptionLimitResponse(BaseModel):
    """用户订阅限制响应"""
    current_subscriptions: int
    max_subscriptions: int
    remaining_slots: int

    class Config:
        from_attributes = True