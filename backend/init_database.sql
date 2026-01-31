-- Supabase 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- 创建 profiles 表（用户资料）
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(100) DEFAULT '新用户',
    student_id VARCHAR(50) DEFAULT '',
    avatar TEXT DEFAULT '',
    grade VARCHAR(20) DEFAULT '',
    major VARCHAR(100) DEFAULT '',
    university VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 archives 表（成长档案）
CREATE TABLE IF NOT EXISTS archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    organization VARCHAR(200) DEFAULT '未知单位',
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
    image_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 notifications 表（通知）
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('certificate', 'status', 'milestone', 'system', 'alert')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_archives_user_id ON archives(user_id);
CREATE INDEX IF NOT EXISTS idx_archives_category ON archives(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 profiles 表添加触发器
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为 archives 表添加触发器
DROP TRIGGER IF EXISTS update_archives_updated_at ON archives;
CREATE TRIGGER update_archives_updated_at
    BEFORE UPDATE ON archives
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 启用 RLS（行级安全策略）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略 - 允许所有操作（开发阶段）
-- 注意：生产环境需要更严格的策略
CREATE POLICY "允许所有操作" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "允许所有操作" ON archives FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "允许所有操作" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 审核状态变更通知触发器
-- 当档案状态从 pending 变为 approved/rejected 时自动发送通知
-- ============================================

CREATE OR REPLACE FUNCTION notify_archive_status_change()
RETURNS TRIGGER AS $$
DECLARE
    notification_title VARCHAR(200);
    notification_desc TEXT;
    notification_type VARCHAR(20);
BEGIN
    -- 仅当状态发生变化且不是新插入时触发
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- 审核通过
        IF NEW.status = 'approved' THEN
            notification_title := '档案审核通过';
            notification_desc := '恭喜！您的档案「' || NEW.title || '」已通过审核，已正式记入您的成长档案。';
            notification_type := 'certificate';
        -- 审核拒绝
        ELSIF NEW.status = 'rejected' THEN
            notification_title := '档案审核未通过';
            notification_desc := '很抱歉，您的档案「' || NEW.title || '」未通过审核。请检查提交材料是否完整或联系辅导员了解详情。';
            notification_type := 'alert';
        -- 重新变为待审核（可能是重新提交）
        ELSIF NEW.status = 'pending' AND OLD.status != 'pending' THEN
            notification_title := '档案已重新提交审核';
            notification_desc := '您的档案「' || NEW.title || '」已重新提交审核，请耐心等待审核结果。';
            notification_type := 'status';
        ELSE
            -- 其他状态变化不发送通知
            RETURN NEW;
        END IF;
        
        -- 插入通知记录
        INSERT INTO notifications (user_id, type, title, description, read, created_at)
        VALUES (NEW.user_id, notification_type, notification_title, notification_desc, FALSE, NOW());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 archives 表添加状态变更通知触发器
DROP TRIGGER IF EXISTS archive_status_change_notification ON archives;
CREATE TRIGGER archive_status_change_notification
    AFTER UPDATE ON archives
    FOR EACH ROW
    EXECUTE FUNCTION notify_archive_status_change();
