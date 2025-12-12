from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy.orm import Session
from datetime import datetime
import logging
import asyncio

from ..db.database import SessionLocal
from .monitor_service import MonitorService

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MonitorScheduler:
    """监控任务调度器"""

    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.monitor_service = MonitorService()
        self._setup_jobs()

    def _setup_jobs(self):
        """设置定时任务"""
        # 每5分钟检查一次活跃任务
        self.scheduler.add_job(
            func=self._check_active_tasks,
            trigger=IntervalTrigger(minutes=5),
            id="check_active_tasks",
            name="检查活跃监控任务",
            replace_existing=True
        )

    def _check_active_tasks(self):
        """检查所有活跃任务"""
        db = SessionLocal()
        try:
            from ..db.crud import get_active_monitor_tasks
            active_tasks = get_active_monitor_tasks(db)

            logger.info(f"检查到 {len(active_tasks)} 个活跃任务")

            for task in active_tasks:
                # 为每个任务添加监控作业
                job_id = f"monitor_task_{task.id}"
                try:
                    # 移除已存在的作业
                    if self.scheduler.get_job(job_id):
                        self.scheduler.remove_job(job_id)

                    # 添加新的定时作业 - 包装异步函数调用
                    def task_wrapper():
                        try:
                            asyncio.run(self.monitor_service.check_single_task(task.id))
                        except Exception as e:
                            logger.error(f"执行任务 {task.name} 时发生错误: {e}")
                    
                    self.scheduler.add_job(
                        func=task_wrapper,
                        trigger=IntervalTrigger(seconds=task.interval),
                        id=job_id,
                        name=f"监控任务: {task.name}",
                        replace_existing=True
                    )
                    logger.info(f"为任务 {task.name} (ID: {task.id}) 设置监控作业，间隔: {task.interval}秒")

                except Exception as e:
                    logger.error(f"为任务 {task.id} 设置监控作业失败: {e}")

        except Exception as e:
            logger.error(f"检查活跃任务失败: {e}")
        finally:
            db.close()

    def start(self):
        """启动调度器"""
        try:
            self.scheduler.start()
            # 立即检查一次活跃任务
            self._check_active_tasks()
            logger.info("监控调度器启动成功")
        except Exception as e:
            logger.error(f"监控调度器启动失败: {e}")

    def stop(self):
        """停止调度器"""
        try:
            self.scheduler.shutdown()
            logger.info("监控调度器已停止")
        except Exception as e:
            logger.error(f"监控调度器停止失败: {e}")

    def add_task_job(self, task_id: int, interval: int):
        """为指定任务添加监控作业"""
        job_id = f"monitor_task_{task_id}"
        try:
            # 移除已存在的作业
            if self.scheduler.get_job(job_id):
                self.scheduler.remove_job(job_id)

            # 添加新的定时作业 - 包装异步函数调用
            def task_wrapper():
                try:
                    asyncio.run(self.monitor_service.check_single_task(task_id))
                except Exception as e:
                    logger.error(f"执行任务 {task_id} 时发生错误: {e}")
            
            self.scheduler.add_job(
                func=task_wrapper,
                trigger=IntervalTrigger(seconds=interval),
                id=job_id,
                name=f"监控任务: {task_id}",
                replace_existing=True
            )
            logger.info(f"为任务 {task_id} 添加监控作业，间隔: {interval}秒")
            return True

        except Exception as e:
            logger.error(f"为任务 {task_id} 添加监控作业失败: {e}")
            return False

    def remove_task_job(self, task_id: int):
        """移除指定任务的监控作业"""
        job_id = f"monitor_task_{task_id}"
        try:
            if self.scheduler.get_job(job_id):
                self.scheduler.remove_job(job_id)
                logger.info(f"移除任务 {task_id} 的监控作业")
            return True

        except Exception as e:
            logger.error(f"移除任务 {task_id} 的监控作业失败: {e}")
            return False

# 创建全局调度器实例
monitor_scheduler = MonitorScheduler()