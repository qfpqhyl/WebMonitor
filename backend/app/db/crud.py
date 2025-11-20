from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from typing import Union, List, Optional
from .models import MonitorTask, MonitorLog, EmailConfig, User
from ..schemas.schemas import MonitorTaskCreate, MonitorTaskUpdate, EmailConfigCreate, EmailConfigUpdate, UserCreate, UserUpdate

def validate_email_config_ownership(db: Session, email_config_id: Optional[int], user_id: int) -> bool:
    """验证邮箱配置是否属于指定用户"""
    if email_config_id is None:
        return True  # None值是允许的

    config = db.query(EmailConfig).filter(
        EmailConfig.id == email_config_id,
        EmailConfig.user_id == user_id
    ).first()
    return config is not None

def create_monitor_task(db: Session, task: MonitorTaskCreate, owner_id: int) -> MonitorTask:
    """创建监控任务"""
    db_task = MonitorTask(
        name=task.name,
        url=task.url,
        xpath=task.xpath,
        interval=task.interval,
        is_active=task.is_active,
        owner_id=owner_id,
        email_config_id=task.email_config_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_monitor_tasks(db: Session, skip: int = 0, limit: int = 100) -> List[MonitorTask]:
    """获取监控任务列表"""
    return db.query(MonitorTask).offset(skip).limit(limit).all()

def get_monitor_task(db: Session, task_id: int) -> Union[MonitorTask, None]:
    """获取单个监控任务"""
    return db.query(MonitorTask).filter(MonitorTask.id == task_id).first()

def update_monitor_task(db: Session, task_id: int, task: MonitorTaskUpdate) -> Union[MonitorTask, None]:
    """更新监控任务"""
    db_task = db.query(MonitorTask).filter(MonitorTask.id == task_id).first()
    if db_task is None:
        return None

    update_data = task.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db.commit()
    db.refresh(db_task)
    return db_task

def delete_monitor_task(db: Session, task_id: int) -> bool:
    """删除监控任务"""
    db_task = db.query(MonitorTask).filter(MonitorTask.id == task_id).first()
    if db_task is None:
        return False

    db.delete(db_task)
    db.commit()
    return True

def create_monitor_log(
    db: Session,
    task_id: int,
    old_content: str = None,
    new_content: str = None,
    is_changed: bool = False,
    error_message: str = None,
    check_time: datetime = None
) -> MonitorLog:
    """创建监控日志"""
    db_log = MonitorLog(
        task_id=task_id,
        old_content=old_content,
        new_content=new_content,
        is_changed=is_changed,
        error_message=error_message,
        check_time=check_time or datetime.now()
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_monitor_logs(db: Session, task_id: int, skip: int = 0, limit: int = 100) -> List[MonitorLog]:
    """获取监控任务日志"""
    return (
        db.query(MonitorLog)
        .filter(MonitorLog.task_id == task_id)
        .order_by(desc(MonitorLog.check_time))
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_latest_monitor_logs(db: Session, limit: int = 10) -> List[MonitorLog]:
    """获取最新的监控日志记录"""
    return (
        db.query(MonitorLog)
        .order_by(desc(MonitorLog.check_time))
        .limit(limit)
        .all()
    )

def update_monitor_task_content(db: Session, task_id: int, content: str, check_time: datetime) -> bool:
    """更新监控任务内容和检查时间"""
    db_task = db.query(MonitorTask).filter(MonitorTask.id == task_id).first()
    if db_task is None:
        return False

    db_task.last_content = content
    db_task.last_check = check_time
    db.commit()
    return True

def get_active_monitor_tasks(db: Session) -> List[MonitorTask]:
    """获取所有活跃的监控任务"""
    return db.query(MonitorTask).filter(MonitorTask.is_active == True).all()

# 邮件配置相关CRUD操作
def create_email_config(db: Session, config: EmailConfigCreate, user_id: int) -> EmailConfig:
    """创建邮件配置"""
    db_config = EmailConfig(
        name=config.name,
        smtp_server=config.smtp_server,
        smtp_port=config.smtp_port,
        smtp_user=config.smtp_user,
        smtp_password=config.smtp_password,
        receiver_email=config.receiver_email,
        is_ssl=config.is_ssl,
        user_id=user_id
    )
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

def get_email_configs(db: Session, skip: int = 0, limit: int = 100) -> List[EmailConfig]:
    """获取邮件配置列表"""
    return db.query(EmailConfig).offset(skip).limit(limit).all()

def get_user_email_configs(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[EmailConfig]:
    """获取用户的邮件配置列表"""
    return db.query(EmailConfig).filter(EmailConfig.user_id == user_id).offset(skip).limit(limit).all()

def get_email_config(db: Session, config_id: int) -> Union[EmailConfig, None]:
    """获取单个邮件配置"""
    return db.query(EmailConfig).filter(EmailConfig.id == config_id).first()

def get_user_active_email_config(db: Session, user_id: int) -> Union[EmailConfig, None]:
    """获取用户的邮件配置（用于向后兼容）"""
    return db.query(EmailConfig).filter(EmailConfig.user_id == user_id).first()

def get_active_email_config(db: Session) -> Union[EmailConfig, None]:
    """获取邮件配置（用于向后兼容）"""
    return db.query(EmailConfig).first()

def update_email_config(db: Session, config_id: int, config: EmailConfigUpdate) -> Union[EmailConfig, None]:
    """更新邮件配置"""
    db_config = db.query(EmailConfig).filter(EmailConfig.id == config_id).first()
    if db_config is None:
        return None

    update_data = config.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_config, field, value)

    db.commit()
    db.refresh(db_config)
    return db_config

def delete_email_config(db: Session, config_id: int) -> bool:
    """删除邮件配置"""
    db_config = db.query(EmailConfig).filter(EmailConfig.id == config_id).first()
    if db_config is None:
        return False

    db.delete(db_config)
    db.commit()
    return True

# 用户相关CRUD操作
def create_user(db: Session, user: UserCreate) -> User:
    """创建用户"""
    from ..services.auth_service import get_password_hash
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        is_active=user.is_active,
        is_admin=user.is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """获取用户列表"""
    return db.query(User).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: int) -> Union[User, None]:
    """获取单个用户"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> Union[User, None]:
    """根据用户名获取用户"""
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> Union[User, None]:
    """根据邮箱获取用户"""
    return db.query(User).filter(User.email == email).first()

def update_user(db: Session, user_id: int, user: UserUpdate) -> Union[User, None]:
    """更新用户"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        return None

    update_data = user.model_dump(exclude_unset=True)

    # 如果更新密码，需要哈希处理
    if "password" in update_data:
        from ..services.auth_service import get_password_hash
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    """删除用户"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        return False

    db.delete(db_user)
    db.commit()
    return True

def get_user_monitor_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[MonitorTask]:
    """获取用户的监控任务列表"""
    return db.query(MonitorTask).filter(MonitorTask.owner_id == user_id).offset(skip).limit(limit).all()