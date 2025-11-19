from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from typing import Union, List
from .models import MonitorTask, MonitorLog, EmailConfig
from ..schemas import MonitorTaskCreate, MonitorTaskUpdate, EmailConfigCreate, EmailConfigUpdate

def create_monitor_task(db: Session, task: MonitorTaskCreate) -> MonitorTask:
    """创建监控任务"""
    db_task = MonitorTask(
        name=task.name,
        url=task.url,
        xpath=task.xpath,
        interval=task.interval,
        is_active=task.is_active
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
    error_message: str = None
) -> MonitorLog:
    """创建监控日志"""
    db_log = MonitorLog(
        task_id=task_id,
        old_content=old_content,
        new_content=new_content,
        is_changed=is_changed,
        error_message=error_message
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
def create_email_config(db: Session, config: EmailConfigCreate) -> EmailConfig:
    """创建邮件配置"""
    db_config = EmailConfig(
        name=config.name,
        smtp_server=config.smtp_server,
        smtp_port=config.smtp_port,
        smtp_user=config.smtp_user,
        smtp_password=config.smtp_password,
        receiver_email=config.receiver_email,
        is_active=config.is_active,
        is_ssl=config.is_ssl
    )
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

def get_email_configs(db: Session, skip: int = 0, limit: int = 100) -> List[EmailConfig]:
    """获取邮件配置列表"""
    return db.query(EmailConfig).offset(skip).limit(limit).all()

def get_email_config(db: Session, config_id: int) -> Union[EmailConfig, None]:
    """获取单个邮件配置"""
    return db.query(EmailConfig).filter(EmailConfig.id == config_id).first()

def get_active_email_config(db: Session) -> Union[EmailConfig, None]:
    """获取当前活跃的邮件配置"""
    return db.query(EmailConfig).filter(EmailConfig.is_active == True).first()

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