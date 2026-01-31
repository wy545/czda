"""
Supabase 客户端模块
"""
from supabase import create_client, Client
from config import settings


def get_supabase_client() -> Client:
    """获取 Supabase 客户端实例"""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


# 全局客户端实例
supabase: Client = get_supabase_client()
