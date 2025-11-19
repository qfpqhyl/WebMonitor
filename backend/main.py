"""
WebMonitor 后端主启动文件
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List

from app.core.config import settings
from app.db import get_db, engine
from app.db.models import Base
from app.api.routes import router as api_router
from app.services import monitor_scheduler

# 创建数据库表
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动监控调度器
    monitor_scheduler.start()
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} 启动成功")
    print("📊 监控调度器已启动")
    yield
    # 停止监控调度器
    monitor_scheduler.stop()
    print("🛑 WebMonitor API已关闭，监控调度器已停止")

# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    description="网页内容监控通知系统 API",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    debug=settings.DEBUG
)

# CORS中间件配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件目录（如果存在）
import os
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

# 注册API路由
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    """根路径"""
    return {
        "message": f"欢迎使用 {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )