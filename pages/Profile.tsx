import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, School, UserCog, LogOut, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';
import Layout from '../components/Layout';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, deleteAccount, logout, isLoggedIn } = useArchive();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // 如果未登录，跳转到登录页
    React.useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteAccount();
            setShowDeleteConfirm(false);
            navigate('/register');
        } catch (error) {
            console.error('注销失败:', error);
            alert('注销失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-background-light min-h-screen">
            <Layout>
                {/* Delete Account Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl scale-100 animate-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">确认注销账号？</h3>
                            <p className="text-sm text-slate-500 mb-6">此操作将永久删除您的所有数据且无法恢复。请谨慎操作。</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={loading}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading && <Loader2 size={16} className="animate-spin" />}
                                    确认注销
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-colors duration-300">
                    <div className="flex items-center justify-center p-4 h-16 relative">
                        <h1 className="text-lg font-bold tracking-tight">个人信息</h1>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pb-6">
                    <div className="px-6 pt-6 pb-8 flex flex-col items-center">
                        <div
                            onClick={() => navigate('/profile/edit')}
                            className="relative group cursor-pointer hover:scale-105 transition-transform duration-200"
                        >
                            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary to-blue-400">
                                <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
                                    {user.avatar ? (
                                        <img
                                            alt="User Avatar"
                                            className="w-full h-full object-cover rounded-full"
                                            src={user.avatar}
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-2xl font-bold">
                                            {user.name ? user.name.charAt(0) : '?'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                <Edit2 size={14} />
                            </div>
                        </div>
                        <div className="mt-4 text-center space-y-1">
                            <h2 className="text-2xl font-bold text-gray-900">{user.name || '未设置姓名'}</h2>
                            <p className="text-gray-500 text-sm font-medium">学号: {user.studentId || '未设置'}</p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {user.grade && (
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wide">
                                    {user.grade}
                                </span>
                            )}
                            {user.major && (
                                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wide">
                                    {user.major}
                                </span>
                            )}
                        </div>
                        {user.university && (
                            <div className="mt-3 flex items-center gap-1.5 text-gray-500 text-sm">
                                <School size={18} />
                                <span>{user.university}</span>
                            </div>
                        )}
                    </div>

                    <div className="px-4 mb-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">账号管理</h3>
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                                    <UserCog size={20} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-base font-medium text-gray-900">编辑资料</p>
                                    <p className="text-xs text-gray-500">更新姓名、头像及详细信息</p>
                                </div>
                                <ChevronRight size={20} className="text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="px-4 mt-6 mb-8">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">系统设置</h3>
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group border-b border-gray-100"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                                    <LogOut size={20} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-base font-medium text-gray-900">退出登录</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                                    <Trash2 size={20} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-base font-medium text-red-600">注销账号</p>
                                    <p className="text-xs text-red-400/70">永久删除您的数据</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="text-center pb-8 px-8">
                        <p className="text-xs text-gray-400">学生成长档案系统 v2.4.1</p>
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default Profile;