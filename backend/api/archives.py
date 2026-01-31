"""
档案 API 路由
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from api.auth import get_current_user_id
from schema.archive import ArchiveItem, ArchiveCreate, ArchiveUpdate
from service import archive_service

router = APIRouter(prefix="/archives", tags=["档案"])


@router.get("", summary="获取档案列表")
async def get_archives(
    category: Optional[str] = Query(None, description="分类筛选"),
    user_id: str = Depends(get_current_user_id)
) -> List[dict]:
    """
    获取当前用户的档案列表
    """
    return archive_service.get_archives(user_id, category)


@router.get("/{archive_id}", summary="获取档案详情")
async def get_archive(
    archive_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    获取指定档案的详细信息
    """
    archive = archive_service.get_archive_by_id(archive_id, user_id)
    
    if not archive:
        raise HTTPException(status_code=404, detail="档案不存在")
    
    return archive


@router.post("", summary="创建档案")
async def create_archive(
    data: ArchiveCreate,
    user_id: str = Depends(get_current_user_id)
):
    """
    创建新的档案记录
    """
    result = archive_service.create_archive(user_id, data)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "创建失败"))
    
    return result["data"]


@router.put("/{archive_id}", summary="更新档案")
async def update_archive(
    archive_id: str,
    updates: ArchiveUpdate,
    user_id: str = Depends(get_current_user_id)
):
    """
    更新指定档案
    """
    result = archive_service.update_archive(archive_id, user_id, updates)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "更新失败"))
    
    return result["data"]


@router.delete("/{archive_id}", summary="删除档案")
async def delete_archive(
    archive_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    删除指定档案
    """
    result = archive_service.delete_archive(archive_id, user_id)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "删除失败"))
    
    return {"message": "删除成功"}
