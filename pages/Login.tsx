import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, School, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useArchive();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  // 如果已登录，跳转到首页
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone || !formData.password) {
      setErrorMessage('请填写手机号和密码');
      setShowError(true);
      return;
    }

    setLoading(true);
    setShowError(false);

    try {
      await login(formData.phone, formData.password);
      navigate('/');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '登录失败，请重试');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value } = e.target;
    // Hide error when user starts typing again
    if (showError) setShowError(false);

    setFormData(prev => ({
      ...prev,
      [type === 'tel' ? 'phone' : 'password']: value
    }));
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-white">
      <div className="flex items-center p-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="返回"
          className="flex w-10 h-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center px-8 pb-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-inset ring-primary/10">
            <School size={40} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">欢迎回来</h1>
          <p className="mt-3 text-base text-slate-500">登录您的学生成长档案系统</p>
        </div>

        {showError && (
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="block text-sm font-medium leading-normal text-slate-900">
              手机号码
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-0 py-3.5 pl-4 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white sm:text-base sm:leading-6 transition-shadow outline-none"
                placeholder="请输入手机号码"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium leading-normal text-slate-900">
                密码
              </label>
              <a className="text-sm font-medium text-primary hover:text-primary-hover transition-colors" href="#">
                忘记密码？
              </a>
            </div>
            <div className="relative rounded-lg shadow-sm">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-0 py-3.5 pl-4 pr-12 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white sm:text-base sm:leading-6 transition-shadow outline-none"
                placeholder="请输入密码"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-lg bg-primary px-3 py-3.5 text-base font-bold leading-6 text-white shadow-md shadow-blue-500/20 hover:bg-primary-hover transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>

        <div className="mt-auto pt-8 text-center">
          <p className="text-sm text-slate-500">
            还没有账号？
            <button onClick={() => navigate('/register')} className="font-bold text-primary hover:text-primary-hover transition-colors">
              立即注册
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;