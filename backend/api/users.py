"""
用户 API 路由
"""
from fastapi import APIRouter, HTTPException, Depends
from api.auth import get_current_user_id
from schema.user import UserProfile, UserProfileUpdate
from service import user_service

router = APIRouter(prefix="/users", tags=["用户"])


@router.get("/profile", summary="获取用户资料")
async def get_profile(user_id: str = Depends(get_current_user_id)):
    """
    获取当前用户的详细资料
    """
    profile = user_service.get_user_profile(user_id)
    
    if not profile:
        raise HTTPException(status_code=404, detail="用户资料不存在")
    
    return profile


@router.put("/profile", summary="更新用户资料")
async def update_profile(
    updates: UserProfileUpdate,
    user_id: str = Depends(get_current_user_id)
):
    """
    更新当前用户的资料
    """
    result = user_service.update_user_profile(user_id, updates)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "更新失败"))
    
    return result["data"]
