import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Filter, Calendar, ChevronRight } from 'lucide-react';

const PenaltyList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md w-full relative min-h-screen flex flex-col bg-white pb-20">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-50">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-900">惩罚详情列表</h1>
          <button className="p-2 -mr-2 text-slate-600">
            <Filter size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* Item 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-red-500 px-2 py-0.5 bg-red-50 rounded-full w-fit">学术不端</span>
              <h3 className="text-base font-bold text-slate-900">期末考试违纪行为</h3>
            </div>
            <div className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
              <span className="text-[11px] font-bold">已记入档案</span>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            在2023-2024学年第一学期《高等数学》期末考试中，存在违规携带与考试内容相关的纸质资料行为。
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Calendar size={16} />
              <span className="text-xs">2023年12月15日</span>
            </div>
            <button className="text-primary text-xs font-bold flex items-center">
              查看详情 <ChevronRight size={14} className="ml-0.5" />
            </button>
          </div>
        </div>

        {/* Item 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-amber-500 px-2 py-0.5 bg-amber-50 rounded-full w-fit">日常行为违规</span>
              <h3 className="text-base font-bold text-slate-900">宿舍违规使用大功率电器</h3>
            </div>
            <div className="flex items-center text-primary bg-blue-50 px-2 py-0.5 rounded-md">
              <span className="text-[11px] font-bold">申诉处理中</span>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            在11月份宿舍安全大检查中，被发现寝室内违规使用电热毯，违反了《学生宿舍管理条例》。
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Calendar size={16} />
              <span className="text-xs">2023年11月08日</span>
            </div>
            <button className="text-primary text-xs font-bold flex items-center">
              查看详情 <ChevronRight size={14} className="ml-0.5" />
            </button>
          </div>
        </div>

        {/* Item 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full w-fit">考勤违规</span>
              <h3 className="text-base font-bold text-slate-900">早操/晨跑多次无故缺勤</h3>
            </div>
            <div className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
              <span className="text-[11px] font-bold">已记入档案</span>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            本学期累计旷课/缺勤次数达到警戒值，现予以通报记录。
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Calendar size={16} />
              <span className="text-xs">2023年10月22日</span>
            </div>
            <button className="text-primary text-xs font-bold flex items-center">
              查看详情 <ChevronRight size={14} className="ml-0.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PenaltyList;