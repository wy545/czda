"""
大学生成长档案系统 - 后端主入口
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, users, archives, notifications

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# 创建 FastAPI 应用
app = FastAPI(
    title="大学生成长档案系统",
    description="记录学业、实践、奖惩、证书等全维度成长数据",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 开发环境允许所有来源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(archives.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")


@app.get("/", tags=["根路径"])
async def root():
    """
    API 根路径，返回欢迎信息
    """
    return {
        "message": "欢迎使用大学生成长档案系统 API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", tags=["健康检查"])
async def health_check():
    """
    健康检查接口
    """
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
