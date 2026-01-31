"""
通知相关的 Pydantic 模型
"""
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class Notification(BaseModel):
    """通知"""
    id: str
    user_id: str
    type: Literal["certificate", "status", "milestone", "system", "alert"]
    title: str
    description: str
    read: bool = False
    created_at: Optional[datetime] = None


class NotificationCreate(BaseModel):
    """创建通知"""
    type: Literal["certificate", "status", "milestone", "system", "alert"]
    title: str
    description: str
