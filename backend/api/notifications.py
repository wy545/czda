"""
通知 API 路由
"""
from fastapi import APIRouter, Depends
from typing import List
from api.auth import get_current_user_id
from service import notification_service

router = APIRouter(prefix="/notifications", tags=["通知"])


@router.get("", summary="获取通知列表")
async def get_notifications(
    user_id: str = Depends(get_current_user_id)
) -> List[dict]:
    """
    获取当前用户的所有通知
    """
    return notification_service.get_notifications(user_id)


@router.put("/{notification_id}/read", summary="标记通知已读")
async def mark_read(
    notification_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    标记指定通知为已读
    """
    notification_service.mark_notification_read(notification_id, user_id)
    return {"message": "已标记为已读"}


@router.put("/read-all", summary="标记所有通知已读")
async def mark_all_read(user_id: str = Depends(get_current_user_id)):
    """
    标记所有通知为已读
    """
    notification_service.mark_all_notifications_read(user_id)
    return {"message": "已全部标记为已读"}
