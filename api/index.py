"""
Vercel Serverless API 入口点
使用 Mangum 适配器将 FastAPI ASGI 应用转换为 AWS Lambda 格式
"""
import sys
import os

# 将 backend 目录添加到 Python 路径
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from mangum import Mangum
from main import app

# 使用 Mangum 适配器包装 FastAPI 应用
handler = Mangum(app, lifespan="off")
