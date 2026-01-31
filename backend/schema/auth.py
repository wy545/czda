"""
认证相关的 Pydantic 模型
"""
from pydantic import BaseModel, Field
from typing import Optional


class UserRegister(BaseModel):
    """用户注册请求"""
    phone: str = Field(..., min_length=11, max_length=11, description="手机号码")
    password: str = Field(..., min_length=6, description="密码")
    name: Optional[str] = Field(None, description="姓名")


class UserLogin(BaseModel):
    """用户登录请求"""
    phone: str = Field(..., description="手机号码")
    password: str = Field(..., description="密码")


class Token(BaseModel):
    """Token 响应"""
    access_token: str
    token_type: str = "bearer"
    user_id: str


class TokenData(BaseModel):
    """Token 数据"""
    user_id: Optional[str] = None
