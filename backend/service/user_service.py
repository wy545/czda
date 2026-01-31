"""
用户服务层
"""
from typing import Optional
from repository.supabase_client import supabase
from schema.user import UserProfileUpdate
import logging

logger = logging.getLogger(__name__)


def get_user_profile(user_id: str) -> Optional[dict]:
    """
    获取用户资料
    """
    try:
        result = supabase.table("profiles").select("*").eq("id", user_id).execute()
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None
    except Exception as e:
        logger.error(f"获取用户资料失败: {e}")
        return None


def update_user_profile(user_id: str, updates: UserProfileUpdate) -> dict:
    """
    更新用户资料
    """
    try:
        update_data = updates.model_dump(exclude_unset=True)
        if not update_data:
            return {"success": False, "error": "没有要更新的数据"}
        
        result = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        
        if result.data:
            return {"success": True, "data": result.data[0]}
        else:
            return {"success": False, "error": "更新失败"}
            
    except Exception as e:
        logger.error(f"更新用户资料失败: {e}")
        return {"success": False, "error": str(e)}
