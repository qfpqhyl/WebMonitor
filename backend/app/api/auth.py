"""
认证相关API路由
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from pydantic import ValidationError

from app.db.database import get_db
from app.db.crud import create_user, get_users, get_user, update_user, delete_user, get_user_by_username, get_user_by_email
from app.schemas.schemas import UserCreate, UserResponse, UserUpdate, Token, LoginResponse
from app.services.auth_service import AuthService, get_current_active_user, get_current_admin_user
from app.core.config import get_settings
from app.db.models import User

router = APIRouter(prefix="/auth", tags=["认证"])

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """用户注册"""
    # 检查用户名是否已存在
    if get_user_by_username(db, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )

    # 检查邮箱是否已存在
    if get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已存在"
        )

    # 创建用户
    return create_user(db, user)

@router.post("/login", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """用户登录"""
    auth_service = AuthService()
    return auth_service.login(db, form_data.username, form_data.password)

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """获取当前用户信息"""
    return current_user

@router.get("/users", response_model=List[UserResponse])
async def get_user_list(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """获取用户列表 (仅管理员)"""
    return get_users(db, skip=skip, limit=limit)

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_info(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """获取用户信息 (仅管理员)"""
    user = get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user_info(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """更新用户信息 (仅管理员)"""
    # 添加调试日志
    print(f"Received update data: {user_update.model_dump()}")

    try:
        user = update_user(db, user_id, user_update)
        if user is None:
            raise HTTPException(status_code=404, detail="用户不存在")
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValidationError as e:
        print(f"Validation error: {e}")
        raise HTTPException(status_code=422, detail=f"数据验证失败: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"服务器内部错误: {str(e)}")

@router.delete("/users/{user_id}")
async def delete_user_account(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """删除用户 (仅管理员)"""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="不能删除自己的账户"
        )

    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="用户不存在")
    return {"message": "用户删除成功"}

@router.post("/logout")
async def logout():
    """用户登出 (客户端处理)"""
    return {"message": "登出成功"}