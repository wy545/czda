import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, School, EyeOff, Eye, Info, AlertCircle, Loader2 } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useArchive();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证
    if (!formData.phone || formData.phone.length !== 11) {
      setError('请输入正确的11位手机号码');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('密码至少需要6位');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      await register(formData.phone, formData.password);
      setSuccess(true);
      // 2秒后跳转到登录页
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white overflow-x-hidden max-w-md mx-auto">
      <div className="flex items-center px-4 py-4 justify-between sticky top-0 z-10 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-900 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">注册</h2>
      </div>

      <div className="flex-1 flex flex-col px-4 pb-8 w-full">
        <div className="pt-4 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
              <School size={24} />
            </div>
            <h1 className="text-slate-900 tracking-tight text-[24px] font-bold leading-tight">创建您的成长档案</h1>
          </div>
          <p className="text-slate-500 text-base font-normal leading-normal">记录您的学业里程碑、奖项和证书，尽在一处。</p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-start gap-3 rounded-lg bg-green-50 border border-green-100 p-3 text-sm text-green-600">
            <Info size={20} className="shrink-0" />
            <p className="font-medium">注册成功！正在跳转到登录页...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <p className="text-slate-900 text-sm font-medium leading-normal">手机号码</p>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-14 placeholder:text-slate-400 px-4 text-base font-normal leading-normal shadow-sm outline-none"
              placeholder="输入手机号"
            />
          </label>

          <label className="flex flex-col gap-2">
            <p className="text-slate-900 text-sm font-medium leading-normal">设置密码</p>
            <div className="relative flex w-full items-stretch rounded-lg shadow-sm">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-14 placeholder:text-slate-400 px-4 pr-12 text-base font-normal leading-normal outline-none"
                placeholder="至少6位密码"
              />
              <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? <Eye size={24} className="text-slate-400 cursor-pointer hover:text-primary transition-colors" />
                    : <EyeOff size={24} className="text-slate-400 cursor-pointer hover:text-primary transition-colors" />
                  }
                </button>
              </div>
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <p className="text-slate-900 text-sm font-medium leading-normal">确认密码</p>
            <div className="relative flex w-full items-stretch rounded-lg shadow-sm">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-14 placeholder:text-slate-400 px-4 pr-12 text-base font-normal leading-normal outline-none"
                placeholder="再次输入密码"
              />
              <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword
                    ? <Eye size={24} className="text-slate-400 cursor-pointer hover:text-primary transition-colors" />
                    : <EyeOff size={24} className="text-slate-400 cursor-pointer hover:text-primary transition-colors" />
                  }
                </button>
              </div>
            </div>
          </label>

          <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-lg p-4 items-start">
            <Info size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-slate-600 text-sm font-normal leading-relaxed">
              <span className="font-semibold text-slate-900">注意：</span> 若手机号已注册，请先注销原账号后再重新注册。
            </p>
          </div>

          <div className="flex-1"></div>

          <div className="mt-8 flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading || success}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors h-14 px-4 text-white text-base font-semibold leading-normal shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? '注册中...' : '立即注册'}
            </button>
            <div className="flex items-center justify-center gap-2">
              <p className="text-slate-500 text-sm font-normal">已有账号？</p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
              >
                登录
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;