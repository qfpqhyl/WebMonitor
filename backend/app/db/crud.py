from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from typing import Union, List, Optional
from .models import MonitorTask, MonitorLog, EmailConfig, User, BlacklistDomain, TaskSubscription
from ..schemas.schemas import MonitorTaskCreate, MonitorTaskUpdate, EmailConfigCreate, EmailConfigUpdate, UserCreate, UserUpdate, BlacklistDomainCreate, BlacklistDomainUpdate, TaskSubscriptionCreate, TaskSubscriptionUpdate
from urllib.parse import urlparse

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

    # 检查用户名是否已被其他用户使用
    if "username" in update_data and update_data["username"] is not None:
        existing_user = get_user_by_username(db, update_data["username"])
        if existing_user and existing_user.id != user_id:
            raise ValueError("用户名已存在")

    # 检查邮箱是否已被其他用户使用
    if "email" in update_data and update_data["email"] is not None:
        existing_user = get_user_by_email(db, update_data["email"])
        if existing_user and existing_user.id != user_id:
            raise ValueError("邮箱已存在")

    # 如果更新密码且密码不为空，需要哈希处理
    if "password" in update_data and update_data["password"] is not None and update_data["password"] != "":
        from ..services.auth_service import get_password_hash
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    elif "password" in update_data and (update_data["password"] is None or update_data["password"] == ""):
        # 如果密码为空或None，从更新数据中移除
        update_data.pop("password", None)

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

# 黑名单域名相关CRUD操作
def create_blacklist_domain(db: Session, domain: BlacklistDomainCreate, created_by: int) -> BlacklistDomain:
    """创建黑名单域名"""
    db_domain = BlacklistDomain(
        domain=domain.domain,
        description=domain.description,
        is_active=domain.is_active,
        created_by=created_by
    )
    db.add(db_domain)
    db.commit()
    db.refresh(db_domain)
    return db_domain

def get_blacklist_domains(db: Session, skip: int = 0, limit: int = 100) -> List[BlacklistDomain]:
    """获取黑名单域名列表"""
    return db.query(BlacklistDomain).filter(BlacklistDomain.is_active == True).offset(skip).limit(limit).all()

def get_blacklist_domain(db: Session, domain_id: int) -> Union[BlacklistDomain, None]:
    """获取单个黑名单域名"""
    return db.query(BlacklistDomain).filter(BlacklistDomain.id == domain_id).first()

def update_blacklist_domain(db: Session, domain_id: int, domain: BlacklistDomainUpdate) -> Union[BlacklistDomain, None]:
    """更新黑名单域名"""
    db_domain = db.query(BlacklistDomain).filter(BlacklistDomain.id == domain_id).first()
    if db_domain is None:
        return None

    update_data = domain.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_domain, field, value)

    db.commit()
    db.refresh(db_domain)
    return db_domain

def delete_blacklist_domain(db: Session, domain_id: int) -> bool:
    """删除黑名单域名"""
    db_domain = db.query(BlacklistDomain).filter(BlacklistDomain.id == domain_id).first()
    if db_domain is None:
        return False

    db.delete(db_domain)
    db.commit()
    return True

def is_url_in_blacklist(db: Session, url: str) -> bool:
    """检查URL是否在黑名单中"""
    try:
        # 解析URL获取域名
        parsed_url = urlparse(url)
        domain = parsed_url.netloc.lower()  # 转换为小写进行匹配

        # 移除端口号（如果有的话）
        if ':' in domain:
            domain = domain.split(':')[0]

        # 获取所有启用的黑名单规则
        blacklist_rules = db.query(BlacklistDomain).filter(
            BlacklistDomain.is_active == True
        ).all()

        for rule in blacklist_rules:
            rule_domain = rule.domain.lower().strip()

            # 1. 精确匹配
            if rule_domain == domain:
                return True

            # 2. 通配符匹配 (*.example.com)
            if rule_domain.startswith('*.'):
                # 移除 '*.' 前缀
                wildcard_domain = rule_domain[2:]
                # 检查域名是否以通配符域名结尾，或者在通配符域名和主域名之间有正确的点分隔
                if domain == wildcard_domain or domain.endswith('.' + wildcard_domain):
                    return True

            # 3. 部分匹配 (example 会匹配包含 example 的所有域名)
            if rule_domain in domain:
                return True

        return False
    except Exception:
        # 如果URL解析失败，返回False
        return False

def is_url_allowed_for_user(db: Session, url: str, is_admin: bool) -> bool:
    """检查用户是否可以监控指定URL"""
    # 管理员可以监控任何网站
    if is_admin:
        return True

    # 检查URL是否在黑名单中，如果在黑名单中则不允许
    return not is_url_in_blacklist(db, url)


# 任务订阅相关CRUD操作
def create_task_subscription(db: Session, subscription: TaskSubscriptionCreate, user_id: int) -> TaskSubscription:
    """创建任务订阅"""
    # 检查是否已经订阅
    existing = db.query(TaskSubscription).filter(
        TaskSubscription.user_id == user_id,
        TaskSubscription.task_id == subscription.task_id
    ).first()
    if existing:
        raise ValueError("已经订阅了该任务")

    db_subscription = TaskSubscription(
        user_id=user_id,
        task_id=subscription.task_id,
        is_active=subscription.is_active,
        email_config_id=subscription.email_config_id
    )
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription


def get_user_subscriptions(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[TaskSubscription]:
    """获取用户的订阅列表"""
    return (
        db.query(TaskSubscription)
        .filter(TaskSubscription.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_task_subscriptions(db: Session, task_id: int, skip: int = 0, limit: int = 100) -> List[TaskSubscription]:
    """获取任务的订阅列表"""
    return (
        db.query(TaskSubscription)
        .filter(TaskSubscription.task_id == task_id, TaskSubscription.is_active == True)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_subscription(db: Session, subscription_id: int, user_id: int) -> Union[TaskSubscription, None]:
    """获取单个订阅"""
    return (
        db.query(TaskSubscription)
        .filter(TaskSubscription.id == subscription_id, TaskSubscription.user_id == user_id)
        .first()
    )


def update_task_subscription(db: Session, subscription_id: int, subscription: TaskSubscriptionUpdate, user_id: int) -> Union[TaskSubscription, None]:
    """更新任务订阅"""
    db_subscription = db.query(TaskSubscription).filter(
        TaskSubscription.id == subscription_id,
        TaskSubscription.user_id == user_id
    ).first()

    if db_subscription is None:
        return None

    update_data = subscription.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_subscription, field, value)

    db.commit()
    db.refresh(db_subscription)
    return db_subscription


def delete_task_subscription(db: Session, subscription_id: int, user_id: int) -> bool:
    """删除任务订阅"""
    db_subscription = db.query(TaskSubscription).filter(
        TaskSubscription.id == subscription_id,
        TaskSubscription.user_id == user_id
    ).first()

    if db_subscription is None:
        return False

    db.delete(db_subscription)
    db.commit()
    return True


def get_user_subscription_count(db: Session, user_id: int) -> int:
    """获取用户的订阅数量"""
    return db.query(TaskSubscription).filter(
        TaskSubscription.user_id == user_id,
        TaskSubscription.is_active == True
    ).count()


def is_user_subscribed_to_task(db: Session, user_id: int, task_id: int) -> bool:
    """检查用户是否已订阅指定任务"""
    subscription = db.query(TaskSubscription).filter(
        TaskSubscription.user_id == user_id,
        TaskSubscription.task_id == task_id,
        TaskSubscription.is_active == True
    ).first()
    return subscription is not None


def get_public_tasks(db: Session, current_user_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List:
    """获取公开任务列表"""
    from sqlalchemy import func

    query = (
        db.query(
            MonitorTask,
            User.username.label('owner_username'),
            func.count(TaskSubscription.id).label('subscription_count')
        )
        .join(User, MonitorTask.owner_id == User.id)
        .outerjoin(TaskSubscription, MonitorTask.id == TaskSubscription.task_id)
        .filter(MonitorTask.is_public == True, MonitorTask.is_active == True)
        .group_by(MonitorTask.id, User.username)
        .order_by(desc(MonitorTask.created_at))
        .offset(skip)
        .limit(limit)
    )

    results = []
    for task, owner_username, subscription_count in query:
        task_dict = {
            'id': task.id,
            'name': task.name,
            'url': task.url,
            'description': task.description,
            'owner_username': owner_username,
            'created_at': task.created_at,
            'subscription_count': subscription_count or 0,
            'user_subscribed': False
        }

        # 如果提供了当前用户ID，检查是否已订阅
        if current_user_id:
            task_dict['user_subscribed'] = is_user_subscribed_to_task(db, current_user_id, task.id)

        results.append(task_dict)

    return results


def get_task_with_subscription_info(db: Session, task_id: int, current_user_id: Optional[int] = None) -> Union[dict, None]:
    """获取任务信息及订阅状态"""
    from sqlalchemy import func

    result = (
        db.query(
            MonitorTask,
            User.username.label('owner_username'),
            func.count(TaskSubscription.id).label('subscription_count')
        )
        .join(User, MonitorTask.owner_id == User.id)
        .outerjoin(TaskSubscription, MonitorTask.id == TaskSubscription.task_id)
        .filter(MonitorTask.id == task_id)
        .group_by(MonitorTask.id, User.username)
        .first()
    )

    if not result:
        return None

    task, owner_username, subscription_count = result

    task_dict = {
        'id': task.id,
        'name': task.name,
        'url': task.url,
        'description': task.description,
        'owner_username': owner_username,
        'created_at': task.created_at,
        'subscription_count': subscription_count or 0,
        'user_subscribed': False
    }

    # 如果提供了当前用户ID，检查是否已订阅
    if current_user_id:
        task_dict['user_subscribed'] = is_user_subscribed_to_task(db, current_user_id, task.id)

    return task_dict


def update_user_max_subscriptions(db: Session, user_id: int, max_subscriptions: int) -> bool:
    """更新用户最大订阅数量"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False

    user.max_subscriptions = max_subscriptions
    db.commit()
    return True


def get_user_subscription_info(db: Session, user_id: int) -> dict:
    """获取用户订阅信息"""
    current_count = get_user_subscription_count(db, user_id)
    user = db.query(User).filter(User.id == user_id).first()

    return {
        'current_subscriptions': current_count,
        'max_subscriptions': user.max_subscriptions if user else 10,
        'remaining_slots': (user.max_subscriptions if user else 10) - current_count
    }