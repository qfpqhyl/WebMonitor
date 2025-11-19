"""
API路由模块
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db, create_monitor_task, get_monitor_tasks, get_monitor_task, update_monitor_task, delete_monitor_task, get_monitor_logs, create_email_config, get_email_configs, get_email_config, update_email_config, delete_email_config
from app.schemas import MonitorTaskCreate, MonitorTaskResponse, MonitorLogResponse, EmailConfigCreate, EmailConfigResponse, EmailConfigUpdate
from app.services import EmailService
from app.services.monitor_service import MonitorService

router = APIRouter()

@router.post("/monitor-tasks", response_model=MonitorTaskResponse)
async def create_task(task: MonitorTaskCreate, db: Session = Depends(get_db)):
    """创建监控任务"""
    return create_monitor_task(db=db, task=task)

@router.get("/monitor-tasks", response_model=List[MonitorTaskResponse])
async def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取监控任务列表"""
    return get_monitor_tasks(db=db, skip=skip, limit=limit)

@router.get("/monitor-tasks/{task_id}", response_model=MonitorTaskResponse)
async def read_task(task_id: int, db: Session = Depends(get_db)):
    """获取单个监控任务"""
    task = get_monitor_task(db=db, task_id=task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="监控任务不存在")
    return task

@router.put("/monitor-tasks/{task_id}", response_model=MonitorTaskResponse)
async def update_task(task_id: int, task: MonitorTaskCreate, db: Session = Depends(get_db)):
    """更新监控任务"""
    updated_task = update_monitor_task(db=db, task_id=task_id, task=task)
    if updated_task is None:
        raise HTTPException(status_code=404, detail="监控任务不存在")
    return updated_task

@router.delete("/monitor-tasks/{task_id}")
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    """删除监控任务"""
    success = delete_monitor_task(db=db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="监控任务不存在")
    return {"message": "监控任务删除成功"}

@router.get("/monitor-tasks/{task_id}/logs", response_model=List[MonitorLogResponse])
async def read_task_logs(task_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取监控任务日志"""
    return get_monitor_logs(db=db, task_id=task_id, skip=skip, limit=limit)

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
async def create_email_config_route(config: EmailConfigCreate, db: Session = Depends(get_db)):
    """创建邮件配置"""
    return create_email_config(db=db, config=config)

@router.get("/email-configs", response_model=List[EmailConfigResponse])
async def read_email_configs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取邮件配置列表"""
    return get_email_configs(db=db, skip=skip, limit=limit)

@router.get("/email-configs/active", response_model=EmailConfigResponse)
async def read_active_email_config(db: Session = Depends(get_db)):
    """获取当前活跃的邮件配置"""
    config = get_active_email_config(db=db)
    if config is None:
        raise HTTPException(status_code=404, detail="没有找到活跃的邮件配置")
    return config

@router.get("/email-configs/{config_id}", response_model=EmailConfigResponse)
async def read_email_config(config_id: int, db: Session = Depends(get_db)):
    """获取单个邮件配置"""
    config = get_email_config(db=db, config_id=config_id)
    if config is None:
        raise HTTPException(status_code=404, detail="邮件配置不存在")
    return config

@router.put("/email-configs/{config_id}", response_model=EmailConfigResponse)
async def update_email_config_route(config_id: int, config: EmailConfigUpdate, db: Session = Depends(get_db)):
    """更新邮件配置"""
    db_config = update_email_config(db=db, config_id=config_id, config=config)
    if db_config is None:
        raise HTTPException(status_code=404, detail="邮件配置不存在")
    return db_config

@router.delete("/email-configs/{config_id}")
async def delete_email_config_route(config_id: int, db: Session = Depends(get_db)):
    """删除邮件配置"""
    success = delete_email_config(db=db, config_id=config_id)
    if not success:
        raise HTTPException(status_code=404, detail="邮件配置不存在")
    return {"message": "邮件配置删除成功"}

@router.post("/email-configs/{config_id}/test")
async def test_email_config(config_id: int, db: Session = Depends(get_db)):
    """测试邮件配置"""
    config = get_email_config(db=db, config_id=config_id)
    if config is None:
        raise HTTPException(status_code=404, detail="邮件配置不存在")

    email_service = EmailService()
    # 先测试连接
    connection_result = email_service.test_email_connection_with_config(config)

    if not connection_result.get("success"):
        return connection_result

    # 如果连接成功，发送测试邮件
    try:
        from datetime import datetime
        success = await email_service.send_test_email(config)
        if success:
            return {"success": True, "message": "邮件连接测试成功，测试邮件已发送"}
        else:
            return {"success": False, "error": "测试邮件发送失败"}
    except Exception as e:
        return {"success": False, "error": f"测试邮件发送失败: {str(e)}"}