"""
日志工具模块
"""
import logging
import os
from pathlib import Path
from ..core.config import settings

# 确保日志目录存在
log_dir = Path(settings.LOG_FILE).parent
log_dir.mkdir(exist_ok=True)

# 配置日志
def setup_logger():
    """设置应用日志"""
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(settings.LOG_FILE, encoding='utf-8'),
            logging.StreamHandler()
        ]
    )

# 创建应用日志器
app_logger = logging.getLogger(__name__)