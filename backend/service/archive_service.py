"""
档案服务层
"""
from typing import List, Optional
from datetime import datetime
import uuid
from repository.supabase_client import supabase
from schema.archive import ArchiveCreate, ArchiveUpdate
from service.notification_service import create_notification
import logging

logger = logging.getLogger(__name__)


def get_archives(user_id: str, category: Optional[str] = None) -> List[dict]:
    """
    获取用户的档案列表
    """
    try:
        query = supabase.table("archives").select("*").eq("user_id", user_id)
        
        if category:
            query = query.eq("category", category)
        
        result = query.order("created_at", desc=True).execute()
        return result.data or []
        
    except Exception as e:
        logger.error(f"获取档案列表失败: {e}")
        return []


def get_archive_by_id(archive_id: str, user_id: str) -> Optional[dict]:
    """
    获取档案详情
    """
    try:
        result = supabase.table("archives").select("*").eq("id", archive_id).eq("user_id", user_id).execute()
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None
    except Exception as e:
        logger.error(f"获取档案详情失败: {e}")
        return None


def create_archive(user_id: str, data: ArchiveCreate) -> dict:
    """
    创建新档案
    """
    try:
        archive_id = str(uuid.uuid4())
        
        archive_data = {
            "id": archive_id,
            "user_id": user_id,
            "title": data.title,
            "category": data.category,
            "organization": data.organization or "未知单位",
            "date": data.date or datetime.now().strftime("%Y-%m-%d"),
            "status": "pending",
            "image_url": data.image_url or "",
            "description": data.description or "",
        }
        
        result = supabase.table("archives").insert(archive_data).execute()
        
        if result.data:
            # 创建提交通知
            create_notification(
                user_id=user_id,
                type_="status",
                title="申请提交成功",
                description=f'您的"{data.title}"档案申请已提交，系统正在进行自动审核。'
            )
            
            # 模拟审核通过（实际应用中应该由管理员操作）
            # 这里简化处理，直接设置为 approved
            import random
            if random.random() > 0.2:  # 80% 通过率
                supabase.table("archives").update({"status": "approved"}).eq("id", archive_id).execute()
                create_notification(
                    user_id=user_id,
                    type_="certificate",
                    title="审核通过",
                    description=f'恭喜！您的"{data.title}"已通过审核并正式归档。'
                )
            
            return {"success": True, "data": result.data[0]}
        else:
            return {"success": False, "error": "创建失败"}
            
    except Exception as e:
        logger.error(f"创建档案失败: {e}")
        return {"success": False, "error": str(e)}


def update_archive(archive_id: str, user_id: str, updates: ArchiveUpdate) -> dict:
    """
    更新档案
    """
    try:
        update_data = updates.model_dump(exclude_unset=True)
        if not update_data:
            return {"success": False, "error": "没有要更新的数据"}
        
        result = supabase.table("archives").update(update_data).eq("id", archive_id).eq("user_id", user_id).execute()
        
        if result.data:
            return {"success": True, "data": result.data[0]}
        else:
            return {"success": False, "error": "更新失败"}
            
    except Exception as e:
        logger.error(f"更新档案失败: {e}")
        return {"success": False, "error": str(e)}


def delete_archive(archive_id: str, user_id: str) -> dict:
    """
    删除档案
    """
    try:
        # 先获取档案信息
        archive = get_archive_by_id(archive_id, user_id)
        if not archive:
            return {"success": False, "error": "档案不存在"}
        
        result = supabase.table("archives").delete().eq("id", archive_id).eq("user_id", user_id).execute()
        
        # 创建删除通知
        create_notification(
            user_id=user_id,
            type_="alert",
            title="成长数据已删除",
            description=f'按照您的请求，条目"{archive["title"]}"已从您的时间轴中移除。'
        )
        
        return {"success": True}
        
    except Exception as e:
        logger.error(f"删除档案失败: {e}")
        return {"success": False, "error": str(e)}
