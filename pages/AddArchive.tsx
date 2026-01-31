import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Calendar, UploadCloud, Loader2 } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

const AddArchive: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, isLoggedIn } = useArchive();
  const [category, setCategory] = useState('学业');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
    imageUrl: ''
  });

  // 文件选择器引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理图片文件选择
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      // 验证文件大小（限制 10MB）
      if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过 10MB');
        return;
      }
      // 使用 FileReader 将图片转换为 Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData({ ...formData, imageUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ['学业', '实践', '奖惩', '证书'];

  // 如果未登录，跳转到登录页
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert('请输入档案名称');
      return;
    }

    setLoading(true);

    try {
      await addItem({
        title: formData.title,
        category: category,
        organization: formData.organization || '未知单位',
        date: formData.date || new Date().toISOString().split('T')[0],
        imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        description: formData.description
      });

      navigate('/archive');
    } catch (error) {
      console.error('创建失败:', error);
      alert('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full relative min-h-screen flex flex-col bg-white pb-safe">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 -ml-2 p-2 rounded-full hover:bg-slate-50">
          <ChevronLeft size={24} />
          <span className="text-sm font-medium">取消</span>
        </button>
        <h1 className="text-base font-bold text-slate-900">新增档案</h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">

          {/* Image Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <div
            className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 hover:border-primary/30 transition-all group overflow-hidden relative"
            onClick={() => fileInputRef.current?.click()}
          >
            {formData.imageUrl ? (
              <>
                <img
                  src={formData.imageUrl}
                  alt="预览"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                  <p className="text-sm font-medium text-white mt-2">点击更换图片</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <p className="text-sm font-medium text-slate-400 group-hover:text-primary">点击上传证明/照片</p>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 ml-1">档案名称</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3.5 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 outline-none text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
                placeholder="例如：2023年全国大学生数学竞赛"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 ml-1">档案类型</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all duration-200 ${category === cat
                      ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900 ml-1">颁发/组织单位</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 outline-none text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="例如：教务处"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900 ml-1">获得时间</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 outline-none text-sm font-medium text-slate-600"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 ml-1">详细描述</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3.5 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 outline-none text-sm font-medium placeholder:text-slate-400 placeholder:font-normal resize-none leading-relaxed"
                placeholder="请详细描述该档案的具体内容、获得过程或重要意义..."
              ></textarea>
            </div>
          </div>

          <div className="pt-4 pb-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-base shadow-xl shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <UploadCloud size={20} />
                  提交申请
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 px-4 leading-normal">
              提交后需要经过辅导员审核（预计1-3个工作日），审核通过后将正式记入您的成长档案。
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddArchive;