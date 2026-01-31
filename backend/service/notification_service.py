"""
通知服务层
"""
from typing import List, Optional
import uuid
from repository.supabase_client import supabase
import logging

logger = logging.getLogger(__name__)


def get_notifications(user_id: str) -> List[dict]:
    """
    获取用户的通知列表
    """
    try:
        result = supabase.table("notifications").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return result.data or []
    except Exception as e:
        logger.error(f"获取通知列表失败: {e}")
        return []


def create_notification(user_id: str, type_: str, title: str, description: str) -> dict:
    """
    创建通知
    """
    try:
        notification_id = str(uuid.uuid4())
        
        notification_data = {
            "id": notification_id,
            "user_id": user_id,
            "type": type_,
            "title": title,
            "description": description,
            "read": False,
        }
        
        result = supabase.table("notifications").insert(notification_data).execute()
        
        if result.data:
            return {"success": True, "data": result.data[0]}
        else:
            return {"success": False, "error": "创建失败"}
            
    except Exception as e:
        logger.error(f"创建通知失败: {e}")
        return {"success": False, "error": str(e)}


def mark_notification_read(notification_id: str, user_id: str) -> dict:
    """
    标记通知已读
    """
    try:
        result = supabase.table("notifications").update({"read": True}).eq("id", notification_id).eq("user_id", user_id).execute()
        
        if result.data:
            return {"success": True}
        else:
            return {"success": False, "error": "标记失败"}
            
    except Exception as e:
        logger.error(f"标记通知已读失败: {e}")
        return {"success": False, "error": str(e)}


def mark_all_notifications_read(user_id: str) -> dict:
    """
    标记所有通知已读
    """
    try:
        result = supabase.table("notifications").update({"read": True}).eq("user_id", user_id).execute()
        return {"success": True}
    except Exception as e:
        logger.error(f"标记所有通知已读失败: {e}")
        return {"success": False, "error": str(e)}
