"""
用户相关的 Pydantic 模型
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserProfile(BaseModel):
    """用户资料"""
    id: str
    name: str
    student_id: str
    avatar: Optional[str] = None
    grade: Optional[str] = None
    major: Optional[str] = None
    university: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserProfileCreate(BaseModel):
    """创建用户资料"""
    id: str
    name: str = Field(default="新用户")
    student_id: str = Field(default="")
    avatar: Optional[str] = Field(default="")
    grade: Optional[str] = Field(default="")
    major: Optional[str] = Field(default="")
    university: Optional[str] = Field(default="")


class UserProfileUpdate(BaseModel):
    """更新用户资料"""
    name: Optional[str] = None
    student_id: Optional[str] = None
    avatar: Optional[str] = None
    grade: Optional[str] = None
    major: Optional[str] = None
    university: Optional[str] = None
