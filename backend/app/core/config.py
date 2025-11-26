"""
应用配置设置
"""
import os
import json
from typing import Optional, Union, List
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """应用设置"""

    # 应用基础设置
    APP_NAME: str = "WebMonitor"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # 数据库设置
    DATABASE_URL: str = "sqlite:///./webmonitor.db"

    # CORS设置
    BACKEND_CORS_ORIGINS: Union[List[str], str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # 邮件设置
    SMTP_SERVER: Optional[str] = None
    SMTP_PORT: int = 465
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    RECEIVER_EMAIL: Optional[str] = None

    # 监控设置
    DEFAULT_CHECK_INTERVAL: int = 300  # 5分钟
    MAX_CHECK_INTERVAL: int = 86400  # 24小时
    MIN_CHECK_INTERVAL: int = 10  # 10秒

    # Selenium设置
    SELENIUM_HEADLESS: bool = True
    SELENIUM_TIMEOUT: int = 30

    # 日志设置
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"

    # JWT设置
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    @field_validator('BACKEND_CORS_ORIGINS', mode='before')
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith('['):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    class Config:
        env_file = ".env"
        case_sensitive = True


# 创建全局设置实例
settings = Settings()

def get_settings():
    """获取设置实例"""
    return settings