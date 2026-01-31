import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, User, Hash, BookOpen, GraduationCap, School, Loader2 } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, isLoggedIn } = useArchive();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    studentId: user.studentId,
    grade: user.grade,
    major: user.major,
    university: user.university,
    avatar: user.avatar
  });

  // 文件选择器引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理头像文件选择
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      // 验证文件大小（限制 5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
      }
      // 使用 FileReader 将图片转换为 Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData({ ...formData, avatar: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  // 如果未登录，跳转到登录页
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 当 user 变化时更新表单
  React.useEffect(() => {
    setFormData({
      name: user.name,
      studentId: user.studentId,
      grade: user.grade,
      major: user.major,
      university: user.university,
      avatar: user.avatar
    });
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser(formData);
      navigate(-1);
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full relative min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 -ml-2 p-2 rounded-full hover:bg-slate-50">
          <ChevronLeft size={24} />
          <span className="text-sm font-medium">取消</span>
        </button>
        <h1 className="text-base font-bold text-slate-900">编辑个人资料</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="text-sm font-bold text-primary px-2 py-1 hover:bg-primary/5 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          保存
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        <div className="flex flex-col items-center py-8 bg-slate-50 border-b border-slate-100">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full p-1 bg-white border border-slate-200">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xl font-bold">
                    {formData.name ? formData.name.charAt(0) : '?'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-50 shadow-sm">
              <Camera size={14} />
            </div>
            {/* 真正的文件选择器 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {/* 点击触发文件选择 */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            />
          </div>
          <p className="text-xs text-slate-500 mt-3">点击更换头像（支持选择本地图片）</p>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <User size={16} className="text-slate-400" />
              姓名
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Hash size={16} className="text-slate-400" />
              学号
            </label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <GraduationCap size={16} className="text-slate-400" />
                年级
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <BookOpen size={16} className="text-slate-400" />
                专业
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <School size={16} className="text-slate-400" />
              学校
            </label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-slate-900"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;