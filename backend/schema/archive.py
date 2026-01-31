"""
档案相关的 Pydantic 模型
"""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime, date


class ArchiveItem(BaseModel):
    """档案项目"""
    id: str
    user_id: str
    title: str
    category: str
    organization: str
    date: str
    status: Literal["approved", "pending", "rejected"]
    image_url: Optional[str] = None
    description: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ArchiveCreate(BaseModel):
    """创建档案"""
    title: str = Field(..., min_length=1, description="档案名称")
    category: str = Field(..., description="分类: 学业/实践/奖惩/证书")
    organization: Optional[str] = Field(default="未知单位", description="颁发单位")
    date: Optional[str] = Field(default=None, description="获得日期")
    image_url: Optional[str] = Field(default=None, description="图片URL")
    description: Optional[str] = Field(default=None, description="详细描述")


class ArchiveUpdate(BaseModel):
    """更新档案"""
    title: Optional[str] = None
    category: Optional[str] = None
    organization: Optional[str] = None
    date: Optional[str] = None
    status: Optional[Literal["approved", "pending", "rejected"]] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
