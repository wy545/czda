"""
认证服务层
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from config import settings
from repository.supabase_client import supabase
from schema.auth import TokenData
import logging

logger = logging.getLogger(__name__)

# 密码加密上下文
# 使用 bcrypt_sha256 方案：先对密码做 SHA-256 哈希再用 bcrypt 处理
# 这样可以自动解决 bcrypt 72 字节限制问题，同时保持与新版 bcrypt 库的兼容性
pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """获取密码哈希"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[TokenData]:
    """解码令牌"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return TokenData(user_id=user_id)
    except JWTError:
        return None


def register_user(phone: str, password: str, name: Optional[str] = None) -> dict:
    """
    注册新用户
    使用 Supabase Auth 或自定义用户表
    """
    try:
        # 检查用户是否已存在
        existing = supabase.table("profiles").select("*").eq("phone", phone).execute()
        if existing.data and len(existing.data) > 0:
            return {"success": False, "error": "该手机号已注册"}
        
        # 生成用户ID
        import uuid
        user_id = str(uuid.uuid4())
        
        # 密码加密
        hashed_password = get_password_hash(password)
        
        # 创建用户资料
        profile_data = {
            "id": user_id,
            "phone": phone,
            "password_hash": hashed_password,
            "name": name or "新用户",
            "student_id": "",
            "avatar": "",
            "grade": "",
            "major": "",
            "university": "",
        }
        
        result = supabase.table("profiles").insert(profile_data).execute()
        
        if result.data:
            return {"success": True, "user_id": user_id}
        else:
            return {"success": False, "error": "注册失败"}
            
    except Exception as e:
        logger.error(f"注册失败: {e}")
        return {"success": False, "error": str(e)}


def login_user(phone: str, password: str) -> dict:
    """
    用户登录
    """
    try:
        # 查找用户
        result = supabase.table("profiles").select("*").eq("phone", phone).execute()
        
        if not result.data or len(result.data) == 0:
            return {"success": False, "error": "用户不存在"}
        
        user = result.data[0]
        
        # 验证密码
        if not verify_password(password, user.get("password_hash", "")):
            return {"success": False, "error": "密码错误"}
        
        # 创建访问令牌
        access_token = create_access_token(data={"sub": user["id"]})
        
        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user["id"]
        }
        
    except Exception as e:
        logger.error(f"登录失败: {e}")
        return {"success": False, "error": str(e)}


def get_current_user(token: str) -> Optional[dict]:
    """
    获取当前用户信息
    """
    token_data = decode_token(token)
    if token_data is None or token_data.user_id is None:
        return None
    
    try:
        result = supabase.table("profiles").select("*").eq("id", token_data.user_id).execute()
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None
    except Exception as e:
        logger.error(f"获取用户失败: {e}")
        return None


def delete_user_account(user_id: str) -> dict:
    """
    注销用户账号
    """
    try:
        # 删除用户的所有档案
        supabase.table("archives").delete().eq("user_id", user_id).execute()
        
        # 删除用户的所有通知
        supabase.table("notifications").delete().eq("user_id", user_id).execute()
        
        # 删除用户资料
        supabase.table("profiles").delete().eq("id", user_id).execute()
        
        return {"success": True}
        
    except Exception as e:
        logger.error(f"注销账号失败: {e}")
        return {"success": False, "error": str(e)}
