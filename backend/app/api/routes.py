"""
API路由模块
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.db.crud import create_monitor_task, get_monitor_tasks, get_monitor_task, update_monitor_task, delete_monitor_task, get_monitor_logs, get_latest_monitor_logs, create_email_config, get_email_configs, get_email_config, update_email_config, delete_email_config, get_user_monitor_tasks, get_user_email_configs, get_user_active_email_config, validate_email_config_ownership, create_blacklist_domain, get_blacklist_domains, get_blacklist_domain, update_blacklist_domain, delete_blacklist_domain, is_url_allowed_for_user, is_url_in_blacklist, create_task_subscription, get_user_subscriptions, get_task_subscriptions, get_subscription, update_task_subscription, delete_task_subscription, get_user_subscription_count, is_user_subscribed_to_task, get_public_tasks, update_user_max_subscriptions, get_user_subscription_info, validate_email_config_ownership
from app.schemas.schemas import MonitorTaskCreate, MonitorTaskUpdate, MonitorTaskResponse, MonitorLogResponse, EmailConfigCreate, EmailConfigResponse, EmailConfigUpdate, EmailConfigSimpleResponse, BlacklistDomainCreate, BlacklistDomainUpdate, BlacklistDomainResponse, TaskSubscriptionCreate, TaskSubscriptionUpdate, TaskSubscriptionResponse, PublicTaskResponse, UserSubscriptionLimitResponse
from app.services import EmailService
from app.services.monitor_service import MonitorService
from app.services.auth_service import get_current_active_user
from app.db.models import User, TaskSubscription

router = APIRouter()

@router.post("/monitor-tasks", response_model=MonitorTaskResponse)
async def create_task(task: MonitorTaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """创建监控任务"""
    # 检查用户是否可以监控指定URL（黑名单验证）
    if not is_url_allowed_for_user(db=db, url=task.url, is_admin=current_user.is_admin):
        raise HTTPException(status_code=403, detail="该域名在黑名单中，普通用户无法监控此网站")

    # 验证邮箱配置是否属于当前用户
    if not validate_email_config_ownership(db, task.email_config_id, current_user.id):
        raise HTTPException(status_code=400, detail="邮箱配置不存在或不属于当前用户")

    return create_monitor_task(db=db, task=task, owner_id=current_user.id)

@router.get("/monitor-tasks", response_model=List[MonitorTaskResponse])
async def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取当前用户的监控任务列表"""
    return get_user_monitor_tasks(db=db, user_id=current_user.id, skip=skip, limit=limit)

@router.get("/monitor-tasks/{task_id}", response_model=MonitorTaskResponse)
async def read_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取单个监控任务"""
    task = get_monitor_task(db=db, task_id=task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="监控任务不存在")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权访问此任务")
    return task

@router.put("/monitor-tasks/{task_id}", response_model=MonitorTaskResponse)
async def update_task(task_id: int, task: MonitorTaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """更新监控任务"""
    # 首先检查任务是否存在且属于当前用户
    existing_task = get_monitor_task(db=db, task_id=task_id)
    if existing_task is None:
        raise HTTPException(status_code=404, detail="监控任务不存在")
    if existing_task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权访问此任务")

    # 如果更新了URL，需要验证黑名单
    if task.url and task.url != existing_task.url:
        if not is_url_allowed_for_user(db=db, url=task.url, is_admin=current_user.is_admin):
            raise HTTPException(status_code=403, detail="该域名在黑名单中，普通用户无法监控此网站")

    # 验证邮箱配置是否属于当前用户
    if task.email_config_id is not None and not validate_email_config_ownership(db, task.email_config_id, current_user.id):
        raise HTTPException(status_code=400, detail="邮箱配置不存在或不属于当前用户")

    updated_task = update_monitor_task(db=db, task_id=task_id, task=task)
    return updated_task

@router.delete("/monitor-tasks/{task_id}")
async def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """删除监控任务"""
    # 首先检查任务是否存在且属于当前用户
    existing_task = get_monitor_task(db=db, task_id=task_id)
    if existing_task is None:
        raise HTTPException(status_code=404, detail="监控任务不存在")
    if existing_task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权访问此任务")

    success = delete_monitor_task(db=db, task_id=task_id)
    return {"message": "监控任务删除成功"}

@router.get("/monitor-tasks/{task_id}/logs", response_model=List[MonitorLogResponse])
async def read_task_logs(task_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取监控任务日志"""
    return get_monitor_logs(db=db, task_id=task_id, skip=skip, limit=limit)

@router.get("/monitor-logs/latest", response_model=List[MonitorLogResponse])
async def read_latest_logs(limit: int = 10, db: Session = Depends(get_db)):
    """获取最新的监控日志记录"""
    return get_latest_monitor_logs(db=db, limit=limit)

@router.post("/monitor-tasks/{task_id}/test")
async def test_monitor_task(task_id: int, db: Session = Depends(get_db)):
    """测试监控任务"""
    task = get_monitor_task(db=db, task_id=task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="监控任务不存在")

    # 实际执行监控测试
    monitor_service = MonitorService()
    result = await monitor_service.test_task(task_id)

    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "测试失败"))

    return {
        "message": "监控任务测试完成",
        "status": "success",
        "content": result.get("content"),
        "title": result.get("title"),
        "url": result.get("url")
    }

@router.post("/test-email")
async def test_email_connection():
    """测试邮件连接"""
    email_service = EmailService()
    result = email_service.test_email_connection()
    return result

# 邮件配置相关API
@router.post("/email-configs", response_model=EmailConfigResponse)
async def create_email_config_route(config: EmailConfigCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """创建邮件配置"""
    return create_email_config(db=db, config=config, user_id=current_user.id)

@router.get("/email-configs", response_model=List[EmailConfigResponse])
async def read_email_configs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取当前用户的邮件配置列表"""
    return get_user_email_configs(db=db, user_id=current_user.id, skip=skip, limit=limit)

@router.get("/email-configs/simple-list", response_model=List[EmailConfigSimpleResponse])
async def get_simple_email_config_list(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取当前用户的邮件配置简单列表（用于任务选择）"""
    configs = get_user_email_configs(db=db, user_id=current_user.id, skip=skip, limit=limit)
    # 只返回必要的字段用于前端选择
    return [
        EmailConfigSimpleResponse(
            id=config.id,
            name=config.name,
            smtp_user=config.smtp_user,
            receiver_email=config.receiver_email
        ) for config in configs
    ]

@router.get("/email-configs/{config_id}", response_model=EmailConfigResponse)
async def read_email_config(config_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取单个邮件配置"""
    config = get_email_config(db=db, config_id=config_id)
    if config is None:
        raise HTTPException(status_code=404, detail="邮件配置不存在")
    # 确保用户只能访问自己的配置
    if config.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权访问此邮件配置")
    return config

@router.put("/email-configs/{config_id}", response_model=EmailConfigResponse)
async def update_email_config_route(config_id: int, config: EmailConfigUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """更新邮件配置"""
    # 先检查配置是否存在且属于当前用户
    existing_config = get_email_config(db=db, config_id=config_id)
    if existing_config is None:
        raise HTTPException(status_code=404, detail="邮件配置不存在")
    if existing_config.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此邮件配置")

    db_config = update_email_config(db=db, config_id=config_id, config=config)
    return db_config

@router.delete("/email-configs/{config_id}")
async def delete_email_config_route(config_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """删除邮件配置"""
    # 先检查配置是否存在且属于当前用户
    existing_config = get_email_config(db=db, config_id=config_id)
    if existing_config is None:
        raise HTTPException(status_code=404, detail="邮件配置不存在")
    if existing_config.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权删除此邮件配置")

    success = delete_email_config(db=db, config_id=config_id)
    if not success:
        raise HTTPException(status_code=404, detail="邮件配置不存在")
    return {"message": "邮件配置删除成功"}

@router.post("/email-configs/{config_id}/test")
async def test_email_config(config_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """测试邮件配置"""
    config = get_email_config(db=db, config_id=config_id)
    if config is None:
        raise HTTPException(status_code=404, detail="邮件配置不存在")
    # 确保用户只能测试自己的配置
    if config.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权测试此邮件配置")

    email_service = EmailService()
    # 先测试连接
    connection_result = email_service.test_email_connection_with_config(config)

    if not connection_result.get("success"):
        return connection_result

    # 如果连接成功，发送测试邮件
        try:
            from datetime import datetime
            success = email_service.send_test_email(config)
            if success:
                return {"success": True, "message": "邮件连接测试成功，测试邮件已发送"}
            else:
                return {"success": False, "error": "测试邮件发送失败"}
        except Exception as e:
            return {"success": False, "error": f"测试邮件发送失败: {str(e)}"}

# 黑名单域名相关API（仅管理员可访问）
@router.post("/blacklist-domains", response_model=BlacklistDomainResponse)
async def create_blacklist_domain_route(domain: BlacklistDomainCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """创建黑名单域名（仅管理员）"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="需要管理员权限")

    return create_blacklist_domain(db=db, domain=domain, created_by=current_user.id)

@router.get("/blacklist-domains", response_model=List[BlacklistDomainResponse])
async def read_blacklist_domains(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取黑名单域名列表（仅管理员）"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="需要管理员权限")

    return get_blacklist_domains(db=db, skip=skip, limit=limit)

@router.get("/blacklist-domains/{domain_id}", response_model=BlacklistDomainResponse)
async def read_blacklist_domain(domain_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取单个黑名单域名（仅管理员）"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="需要管理员权限")

    domain = get_blacklist_domain(db=db, domain_id=domain_id)
    if domain is None:
        raise HTTPException(status_code=404, detail="黑名单域名不存在")
    return domain

@router.put("/blacklist-domains/{domain_id}", response_model=BlacklistDomainResponse)
async def update_blacklist_domain_route(domain_id: int, domain: BlacklistDomainUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """更新黑名单域名（仅管理员）"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="需要管理员权限")

    updated_domain = update_blacklist_domain(db=db, domain_id=domain_id, domain=domain)
    if updated_domain is None:
        raise HTTPException(status_code=404, detail="黑名单域名不存在")
    return updated_domain

@router.delete("/blacklist-domains/{domain_id}")
async def delete_blacklist_domain_route(domain_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """删除黑名单域名（仅管理员）"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="需要管理员权限")

    success = delete_blacklist_domain(db=db, domain_id=domain_id)
    if not success:
        raise HTTPException(status_code=404, detail="黑名单域名不存在")
    return {"message": "黑名单域名删除成功"}

@router.post("/blacklist-domains/test")
async def test_blacklist_matching(url: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """测试黑名单匹配功能（仅管理员）"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="需要管理员权限")

    is_blacklisted = is_url_in_blacklist(db=db, url=url)
    return {
        "url": url,
        "is_blacklisted": is_blacklisted,
        "message": "该URL在黑名单中" if is_blacklisted else "该URL不在黑名单中"
    }

# 公开任务相关API
@router.get("/public-tasks", response_model=List[PublicTaskResponse])
async def read_public_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取公开任务列表"""
    return get_public_tasks(db=db, current_user_id=current_user.id, skip=skip, limit=limit)

@router.get("/public-tasks/{task_id}")
async def read_public_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取公开任务详情"""
    task_info = get_task_with_subscription_info(db=db, task_id=task_id, current_user_id=current_user.id)
    if not task_info:
        raise HTTPException(status_code=404, detail="公开任务不存在")
    return task_info

# 任务订阅相关API
@router.post("/subscribe/{task_id}", response_model=TaskSubscriptionResponse)
async def subscribe_to_task(task_id: int, subscription: TaskSubscriptionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """订阅任务"""
    # 检查任务是否存在且为公开任务
    from app.db.models import MonitorTask
    task = db.query(MonitorTask).filter(MonitorTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    if not task.is_public:
        raise HTTPException(status_code=400, detail="该任务不是公开任务，无法订阅")
    if not task.is_active:
        raise HTTPException(status_code=400, detail="该任务已停用，无法订阅")

    # 检查订阅数量限制
    current_count = get_user_subscription_count(db=db, user_id=current_user.id)
    if current_count >= current_user.max_subscriptions:
        raise HTTPException(status_code=400, detail=f"已达到最大订阅数量限制({current_user.max_subscriptions})")

    # 验证邮箱配置是否属于当前用户
    if subscription.email_config_id and not validate_email_config_ownership(db, subscription.email_config_id, current_user.id):
        raise HTTPException(status_code=400, detail="邮箱配置不存在或不属于当前用户")

    subscription.task_id = task_id
    return create_task_subscription(db=db, subscription=subscription, user_id=current_user.id)

@router.get("/subscriptions", response_model=List[TaskSubscriptionResponse])
async def read_subscriptions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取当前用户的订阅列表"""
    subscriptions = get_user_subscriptions(db=db, user_id=current_user.id, skip=skip, limit=limit)

    # 添加任务信息
    for subscription in subscriptions:
        subscription.task_name = subscription.task.name if subscription.task else None
        subscription.task_url = subscription.task.url if subscription.task else None

    return subscriptions

@router.put("/subscriptions/{subscription_id}", response_model=TaskSubscriptionResponse)
async def update_subscription(subscription_id: int, subscription: TaskSubscriptionUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """更新订阅"""
    # 验证邮箱配置是否属于当前用户
    if subscription.email_config_id and not validate_email_config_ownership(db, subscription.email_config_id, current_user.id):
        raise HTTPException(status_code=400, detail="邮箱配置不存在或不属于当前用户")

    updated_subscription = update_task_subscription(db=db, subscription_id=subscription_id, subscription=subscription, user_id=current_user.id)
    if updated_subscription is None:
        raise HTTPException(status_code=404, detail="订阅不存在")

    # 添加任务信息
    updated_subscription.task_name = updated_subscription.task.name if updated_subscription.task else None
    updated_subscription.task_url = updated_subscription.task.url if updated_subscription.task else None

    return updated_subscription

@router.delete("/subscriptions/{subscription_id}")
async def delete_subscription(subscription_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """取消订阅"""
    success = delete_task_subscription(db=db, subscription_id=subscription_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="订阅不存在")
    return {"message": "订阅取消成功"}

@router.get("/subscription-info", response_model=UserSubscriptionLimitResponse)
async def get_subscription_limit_info(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取用户订阅限制信息"""
    return get_user_subscription_info(db=db, user_id=current_user.id)

@router.post("/subscriptions/{task_id}/toggle")
async def toggle_subscription(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """切换任务订阅状态（一键订阅/取消订阅）"""
    from app.db.models import MonitorTask

    print(f"DEBUG: Toggle subscription for task {task_id} by user {current_user.id}")

    # 检查任务是否存在且为公开任务
    task = db.query(MonitorTask).filter(MonitorTask.id == task_id).first()
    if not task:
        print(f"DEBUG: Task {task_id} not found")
        raise HTTPException(status_code=404, detail="任务不存在")
    if not task.is_public:
        print(f"DEBUG: Task {task_id} is not public")
        raise HTTPException(status_code=400, detail="该任务不是公开任务，无法订阅")
    if not task.is_active:
        print(f"DEBUG: Task {task_id} is not active")
        raise HTTPException(status_code=400, detail="该任务已停用，无法订阅")

    # 检查是否已订阅
    is_subscribed = is_user_subscribed_to_task(db=db, user_id=current_user.id, task_id=task_id)
    print(f"DEBUG: User subscription status: {is_subscribed}")

    if is_subscribed:
        # 取消订阅
        subscription = db.query(TaskSubscription).filter(
            TaskSubscription.user_id == current_user.id,
            TaskSubscription.task_id == task_id
        ).first()
        if subscription:
            db.delete(subscription)
            db.commit()
            print(f"DEBUG: Subscription deleted successfully")
        return {"message": "订阅取消成功", "subscribed": False}
    else:
        # 检查用户是否有邮箱配置
        email_configs = get_user_email_configs(db=db, user_id=current_user.id)
        if not email_configs:
            raise HTTPException(status_code=400, detail="请先配置邮箱通知设置后再订阅任务")

        # 添加订阅（使用用户的第一个邮箱配置）
        current_count = get_user_subscription_count(db=db, user_id=current_user.id)
        print(f"DEBUG: Current subscription count: {current_count}, max: {current_user.max_subscriptions}")

        if current_count >= current_user.max_subscriptions:
            print(f"DEBUG: Subscription limit reached")
            raise HTTPException(status_code=400, detail=f"已达到最大订阅数量限制({current_user.max_subscriptions})")

        subscription = TaskSubscription(
            user_id=current_user.id,
            task_id=task_id,
            is_active=True,
            email_config_id=email_configs[0].id
        )
        db.add(subscription)
        db.commit()
        print(f"DEBUG: Subscription created successfully")
        return {"message": "订阅成功", "subscribed": True}

@router.post("/subscriptions/{task_id}/subscribe-with-email")
async def subscribe_with_email_config(
    task_id: int,
    subscription_data: dict,  # 接收JSON body
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """订阅任务并指定邮件配置"""
    from app.db.models import MonitorTask, EmailConfig

    # 从请求体获取email_config_id
    email_config_id = subscription_data.get('email_config_id')
    if not email_config_id:
        raise HTTPException(status_code=400, detail="邮件配置ID不能为空")

    print(f"DEBUG: Subscribe with email config for task {task_id} by user {current_user.id} with email config {email_config_id}")

    # 检查任务是否存在且为公开任务
    task = db.query(MonitorTask).filter(MonitorTask.id == task_id).first()
    if not task:
        print(f"DEBUG: Task {task_id} not found")
        raise HTTPException(status_code=404, detail="任务不存在")
    if not task.is_public:
        print(f"DEBUG: Task {task_id} is not public")
        raise HTTPException(status_code=400, detail="该任务不是公开任务，无法订阅")
    if not task.is_active:
        print(f"DEBUG: Task {task_id} is not active")
        raise HTTPException(status_code=400, detail="该任务已停用，无法订阅")

    # 检查是否已订阅
    if is_user_subscribed_to_task(db=db, user_id=current_user.id, task_id=task_id):
        # 如果已订阅，更新邮件配置
        subscription = db.query(TaskSubscription).filter(
            TaskSubscription.user_id == current_user.id,
            TaskSubscription.task_id == task_id
        ).first()
        if subscription:
            subscription.email_config_id = email_config_id
            db.commit()
            print(f"DEBUG: Subscription email config updated successfully")
        return {"message": "订阅邮件配置更新成功", "subscribed": True}

    # 验证邮件配置是否属于当前用户
    email_config = db.query(EmailConfig).filter(
        EmailConfig.id == email_config_id,
        EmailConfig.user_id == current_user.id
    ).first()
    if not email_config:
        print(f"DEBUG: Email config {email_config_id} not found or not owned by user")
        raise HTTPException(status_code=404, detail="邮件配置不存在或无权访问")

    # 检查订阅数量限制
    current_count = get_user_subscription_count(db=db, user_id=current_user.id)
    print(f"DEBUG: Current subscription count: {current_count}, max: {current_user.max_subscriptions}")

    if current_count >= current_user.max_subscriptions:
        print(f"DEBUG: Subscription limit reached")
        raise HTTPException(status_code=400, detail=f"已达到最大订阅数量限制({current_user.max_subscriptions})")

    # 创建订阅
    subscription = TaskSubscription(
        user_id=current_user.id,
        task_id=task_id,
        is_active=True,
        email_config_id=email_config_id
    )
    db.add(subscription)
    db.commit()
    print(f"DEBUG: Subscription created with email config successfully")
    return {"message": "订阅成功", "subscribed": True}

# 管理员：用户订阅数量管理
@router.put("/users/{user_id}/max-subscriptions")
async def update_user_subscription_limit(user_id: int, max_subscriptions: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """更新用户最大订阅数量（仅管理员）"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="需要管理员权限")

    if max_subscriptions < 1:
        raise HTTPException(status_code=400, detail="最大订阅数量必须大于0")

    success = update_user_max_subscriptions(db=db, user_id=user_id, max_subscriptions=max_subscriptions)
    if not success:
        raise HTTPException(status_code=404, detail="用户不存在")

    return {"message": f"用户最大订阅数量已更新为{max_subscriptions}"}