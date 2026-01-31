# 学生成长档案系统 - 部署指南

本文档介绍如何将项目部署到云端。

---

## 架构说明

| 组件 | 技术栈 | 推荐部署平台 |
|------|--------|--------------|
| 前端 | React + Vite + TypeScript | **Vercel** |
| 后端 | FastAPI + Python | **Vercel Serverless** 或 **Railway** |
| 数据库 | PostgreSQL | **Supabase**（已配置） |

---

## 一、前端部署到 Vercel

### 1. 准备工作

确保项目已推送到 GitHub：
- 仓库地址：`https://github.com/wy545/czda`

### 2. 导入项目到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New → Project**
3. 选择 **Import Git Repository**
4. 授权并选择 `wy545/czda` 仓库

### 3. 配置构建设置

| 配置项 | 值 |
|--------|-----|
| Framework Preset | **Vite** |
| Root Directory | `.`（根目录） |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 4. 配置环境变量

在 Vercel 项目设置 → **Environment Variables** 中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_API_BASE_URL` | `https://your-backend-url.vercel.app` | 后端 API 地址 |

> ⚠️ 先部署后端获取 URL，再回来配置此变量

### 5. 部署

点击 **Deploy** 按钮，等待构建完成。

---

## 二、后端部署到 Vercel Serverless

### 1. 创建 Vercel 配置文件

在项目根目录创建 `vercel.json`：

```json
{
  "builds": [
    {
      "src": "backend/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/main.py"
    }
  ]
}
```

### 2. 修改后端入口文件

确保 `backend/main.py` 导出 `app` 对象供 Vercel 使用：

```python
# backend/main.py 末尾应该有：
app = FastAPI(...)

# Vercel 需要这个
handler = app
```

### 3. 配置后端环境变量

在 Vercel 项目设置中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 项目 URL |
| `SUPABASE_KEY` | `eyJhbG...` | Supabase anon key |
| `SECRET_KEY` | `your-secret-key-here` | JWT 密钥（随机字符串） |

---

## 三、替代方案：后端部署到 Railway

如果 Vercel Serverless 有限制，推荐使用 **Railway**：

### 1. 创建 Railway 项目

1. 访问 [Railway](https://railway.app/)
2. 点击 **New Project → Deploy from GitHub repo**
3. 选择 `wy545/czda` 仓库

### 2. 配置部署

在 Railway 设置中：

| 配置项 | 值 |
|--------|-----|
| Root Directory | `backend` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

### 3. 添加环境变量

与 Vercel 相同：
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `SECRET_KEY`

---

## 四、部署后配置

### 1. 更新前端 API 地址

部署后端后，获取后端 URL（如 `https://czda-backend.railway.app`），然后：

1. 在 Vercel 前端项目中添加环境变量：
   - `VITE_API_BASE_URL` = `https://your-backend-url`

2. 重新部署前端

### 2. 配置 CORS

确保后端 `main.py` 中的 CORS 配置包含前端域名：

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend.vercel.app"  # 添加这一行
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 五、验证部署

1. 访问前端 URL，确认页面加载正常
2. 测试注册/登录功能
3. 测试档案创建和查看
4. 检查消息通知功能

---

## 常见问题

### Q: 前端构建失败？
检查 `package.json` 中的依赖是否完整，运行 `npm install` 后重试。

### Q: 后端 API 返回 500 错误？
检查 Vercel/Railway 日志，确认环境变量是否正确配置。

### Q: CORS 错误？
确保后端 CORS 配置包含前端域名。

---

## 环境变量汇总

### 前端（Vercel）
```
VITE_API_BASE_URL=https://your-backend-url
```

### 后端（Vercel/Railway）
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SECRET_KEY=your-random-secret-key-at-least-32-chars
```
