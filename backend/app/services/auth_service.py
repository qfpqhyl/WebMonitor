from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import bcrypt
from ..db.database import SessionLocal
from ..db.models import User
from ..schemas.schemas import TokenData
from ..core.config import get_settings

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_db():
    """获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    """验证密码"""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        print(f"密码验证错误: {e}")
        return False

def get_password_hash(password):
    """获取密码哈希"""
    try:
        # bcrypt限制密码最长72字节
        if len(password) > 72:
            password = password[:72]

        # 生成盐值并哈希
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    except Exception as e:
        print(f"密码哈希生成错误: {e}")
        raise

def authenticate_user(db: Session, username: str, password: str):
    """验证用户"""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """创建访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    settings = get_settings()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """获取当前用户"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无法验证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        settings = get_settings()
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)):
    """获取当前活跃用户"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="用户未激活")
    return current_user

def get_current_admin_user(current_user: User = Depends(get_current_active_user)):
    """获取当前管理员用户"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足"
        )
    return current_user

class AuthService:
    """认证服务"""

    def __init__(self):
        self.settings = get_settings()

    def login(self, db: Session, username: str, password: str) -> dict:
        """用户登录"""
        user = authenticate_user(db, username, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户名或密码错误",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id), "username": user.username, "is_admin": user.is_admin},
            expires_delta=access_token_expires
        )

        user_info = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }

        result = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_info
        }

        return result

    def create_user(self, db: Session, user_data) -> User:
        """创建用户"""
        # 检查用户名是否已存在
        if db.query(User).filter(User.username == user_data.username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="用户名已存在"
            )

        # 检查邮箱是否已存在
        if db.query(User).filter(User.email == user_data.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="邮箱已存在"
            )

        # 创建新用户
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            is_active=user_data.is_active,
            is_admin=user_data.is_admin
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def get_users(self, db: Session, skip: int = 0, limit: int = 100):
        """获取用户列表"""
        return db.query(User).offset(skip).limit(limit).all()

    def get_user(self, db: Session, user_id: int):
        """获取单个用户"""
        return db.query(User).filter(User.id == user_id).first()

    def update_user(self, db: Session, user_id: int, user_data):
        """更新用户"""
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            return None

        update_data = user_data.model_dump(exclude_unset=True)

        # 如果更新密码，需要哈希处理
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

        for field, value in update_data.items():
            setattr(db_user, field, value)

        db.commit()
        db.refresh(db_user)
        return db_user

    def delete_user(self, db: Session, user_id: int) -> bool:
        """删除用户"""
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            return False

        db.delete(db_user)
        db.commit()
        return True