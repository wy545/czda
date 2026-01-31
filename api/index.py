"""
Vercel Serverless API 入口点
所有 /api/* 请求都会路由到这里
"""
import sys
import os

# 将 backend 目录添加到 Python 路径
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

# 导入 FastAPI 应用
from main import app

# Vercel 需要的处理器
handler = app
