from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import logging
from datetime import datetime
from typing import Optional, Tuple

from ..db.database import SessionLocal
from ..db.crud import create_monitor_log, update_monitor_task_content
from .email_service import EmailService

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MonitorService:
    """监控服务"""

    def __init__(self):
        self.email_service = EmailService()

    def get_content_with_selenium(self, url: str, xpath: str) -> Tuple[Optional[str], Optional[str], Optional[str]]:
        """
        使用Selenium获取指定网页xpath路径的内容

        Args:
            url: 网页URL
            xpath: XPath选择器

        Returns:
            tuple: (内容, 错误信息, 网页标题)
        """
        driver = None
        try:
            # 配置Chrome选项
            chrome_options = Options()
            chrome_options.add_argument("--headless")  # 无界面模式
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

            # 初始化WebDriver
            driver = webdriver.Chrome(options=chrome_options)
            driver.set_page_load_timeout(30)  # 页面加载超时

            logger.info(f"正在访问: {url}")
            driver.get(url)

            # 等待元素加载
            wait = WebDriverWait(driver, 20)
            element = wait.until(EC.presence_of_element_located((By.XPATH, xpath)))

            # 获取内容
            content = element.text.strip()

            # 获取页面标题
            title = driver.title

            logger.info(f"成功获取内容: {title} - {content[:50]}...")
            return content, None, title

        except Exception as e:
            error_msg = f"获取内容出错 ({url}): {e}"
            logger.error(error_msg)
            return None, error_msg, None

        finally:
            if driver:
                driver.quit()

    async def check_single_task(self, task_id: int) -> bool:
        """
        检查单个监控任务

        Args:
            task_id: 任务ID

        Returns:
            bool: 检查是否成功
        """
        db = SessionLocal()
        try:
            from ..db.crud import get_monitor_task
            task = get_monitor_task(db, task_id)

            if not task or not task.is_active:
                logger.info(f"任务 {task_id} 不存在或未启用，跳过检查")
                return False

            logger.info(f"开始检查任务: {task.name} (ID: {task_id})")

            # 获取当前内容
            current_content, error_message, title = self.get_content_with_selenium(task.url, task.xpath)

            check_time = datetime.now()

            if error_message:
                # 记录错误日志
                create_monitor_log(
                    db=db,
                    task_id=task_id,
                    error_message=error_message,
                    check_time=check_time
                )
                logger.error(f"任务 {task.name} 检查失败: {error_message}")
                return False

            # 检查内容是否发生变化
            old_content = task.last_content
            is_changed = old_content != current_content

            if is_changed:
                logger.info(f"任务 {task.name} 检测到内容变化")

                # 发送邮件通知
                try:
                    await self.email_service.send_change_notification(
                        task_name=task.name,
                        url=task.url,
                        title=title or "未知标题",
                        old_content=old_content or "无历史内容",
                        new_content=current_content,
                        check_time=check_time,
                        email_config_id=task.email_config_id,
                        user_id=task.owner_id
                    )
                except Exception as e:
                    logger.error(f"发送邮件通知失败: {e}")

            # 更新任务内容
            update_monitor_task_content(db, task_id, current_content, check_time)

            # 创建监控日志
            create_monitor_log(
                db=db,
                task_id=task_id,
                old_content=old_content,
                new_content=current_content,
                is_changed=is_changed,
                check_time=check_time
            )

            logger.info(f"任务 {task.name} 检查完成，变化: {is_changed}")
            return True

        except Exception as e:
            error_msg = f"检查任务 {task_id} 时发生错误: {e}"
            logger.error(error_msg)

            # 记录错误日志
            try:
                create_monitor_log(
                    db=db,
                    task_id=task_id,
                    error_message=error_msg,
                    check_time=datetime.now()
                )
            except Exception as log_error:
                logger.error(f"记录错误日志失败: {log_error}")

            return False

        finally:
            db.close()

    async def test_task(self, task_id: int) -> dict:
        """
        测试监控任务

        Args:
            task_id: 任务ID

        Returns:
            dict: 测试结果
        """
        db = SessionLocal()
        try:
            from ..db.crud import get_monitor_task
            task = get_monitor_task(db, task_id)

            if not task:
                return {"success": False, "error": "任务不存在"}

            logger.info(f"测试任务: {task.name} (ID: {task_id})")

            # 获取内容
            current_content, error_message, title = self.get_content_with_selenium(task.url, task.xpath)

            if error_message:
                return {"success": False, "error": error_message}

            return {
                "success": True,
                "content": current_content,
                "title": title,
                "url": task.url,
                "message": "测试成功"
            }

        except Exception as e:
            error_msg = f"测试任务 {task_id} 时发生错误: {e}"
            logger.error(error_msg)
            return {"success": False, "error": error_msg}

        finally:
            db.close()