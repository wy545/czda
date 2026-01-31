"""
认证 API 路由
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from schema.auth import UserRegister, UserLogin, Token
from service import auth_service

router = APIRouter(prefix="/auth", tags=["认证"])


def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """从请求头获取当前用户ID"""
    if not authorization:
        raise HTTPException(status_code=401, detail="未提供认证信息")
    
    # 解析 Bearer token
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="认证格式错误")
    
    token = parts[1]
    user = auth_service.get_current_user(token)
    
    if not user:
        raise HTTPException(status_code=401, detail="无效的认证信息")
    
    return user["id"]


@router.post("/register", summary="用户注册")
async def register(data: UserRegister):
    """
    注册新用户
    """
    result = auth_service.register_user(
        phone=data.phone,
        password=data.password,
        name=data.name
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "注册失败"))
    
    return {"message": "注册成功", "user_id": result["user_id"]}


@router.post("/login", response_model=Token, summary="用户登录")
async def login(data: UserLogin):
    """
    用户登录，返回访问令牌
    """
    result = auth_service.login_user(phone=data.phone, password=data.password)
    
    if not result["success"]:
        raise HTTPException(status_code=401, detail=result.get("error", "登录失败"))
    
    return Token(
        access_token=result["access_token"],
        token_type=result["token_type"],
        user_id=result["user_id"]
    )


@router.post("/logout", summary="用户注销登录")
async def logout(user_id: str = Depends(get_current_user_id)):
    """
    注销登录（前端清除token即可）
    """
    return {"message": "注销成功"}


@router.get("/me", summary="获取当前用户")
async def get_me(user_id: str = Depends(get_current_user_id)):
    """
    获取当前登录用户信息
    """
    from service import user_service
    profile = user_service.get_user_profile(user_id)
    
    if not profile:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    return profile


@router.delete("/account", summary="注销账号")
async def delete_account(user_id: str = Depends(get_current_user_id)):
    """
    永久删除用户账号及所有数据
    """
    result = auth_service.delete_user_account(user_id)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "注销失败"))
    
    return {"message": "账号已注销"}
