import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, ZoomIn, Calendar, Loader2 } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

const ArchiveDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, updateItem, deleteItem, isLoggedIn, loading: contextLoading } = useArchive();

  const item = items.find(i => i.id === id);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    imageUrl: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 如果未登录，跳转到登录页
  useEffect(() => {
    if (!contextLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, contextLoading, navigate]);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        category: item.category,
        description: item.description || '',
        date: item.date,
        imageUrl: item.imageUrl
      });
    }
  }, [item]);

  if (contextLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-4 text-center">
        <p className="text-slate-500">档案不存在</p>
        <button
          onClick={() => navigate('/archive')}
          className="mt-4 text-primary font-medium"
        >
          返回档案列表
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);
    try {
      await updateItem(id, {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        date: formData.date
      });
      navigate('/archive');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!id) return;

    setDeleting(true);
    try {
      await deleteItem(id);
      navigate('/archive');
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full relative min-h-screen flex flex-col bg-white pb-20">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">确认删除？</h3>
            <p className="text-sm text-slate-500 mb-6">此操作无法撤销，该档案记录将被永久移除。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-600">
          <ChevronLeft size={24} />
          <span className="text-sm">返回</span>
        </button>
        <h1 className="text-base font-bold text-slate-900">档案详情编辑</h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 group">
            <div
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url("${formData.imageUrl}")` }}
            ></div>
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium shadow-lg">
                <Camera size={18} />
                更换照片
              </button>
            </div>
            <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md">
              <ZoomIn size={20} className="text-slate-700" />
            </button>
          </div>
          <p className="text-center text-[11px] text-slate-400 mt-2">点击预览图可进行自定义更换</p>
        </div>

        <div className="px-4 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">名称</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-sm text-slate-900 placeholder:text-slate-400"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="请输入项目或证书名称"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">档案类别</label>
            <div className="grid grid-cols-4 gap-2">
              {['学业', '实践', '奖惩', '证书'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${formData.category.includes(cat) || (cat === '证书' && formData.category === '证书认证')
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">描述</label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-sm text-slate-900 placeholder:text-slate-400 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="描述一下这个成长的瞬间、项目背景或获得的成就..."
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">上传日期</label>
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl">
              <Calendar size={18} className="text-slate-400" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-transparent text-sm text-slate-600 outline-none w-full"
              />
            </div>
          </div>
        </div>

        <div className="p-6 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {saving && <Loader2 size={20} className="animate-spin" />}
            {saving ? '保存中...' : '保存更改'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={saving}
            className="w-full mt-3 py-4 text-red-500 font-medium text-sm hover:bg-red-50 rounded-2xl transition-colors"
          >
            删除此条记录
          </button>
        </div>
      </main>
    </div>
  );
};

export default ArchiveDetail;