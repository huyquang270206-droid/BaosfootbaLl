import React from 'react';
import { DoiBong, BaiViet } from '../types/bongDa.ts';
import { TheBaiViet } from './TheBaiViet.tsx';
import { Bookmark, Heart, Star, Check } from 'lucide-react';

interface TrangYeuThichProps {
  tatCaDoiBong: DoiBong[];
  doiBongYeuThichIds: string[];
  baiVietDaLuu: BaiViet[];
  onChuyenYeuThichDoiBong: (doiBongId: string) => void;
  onChonBaiViet: (bai: BaiViet) => void;
  onBoLuuBaiViet: (baiVietId: string) => void;
}

export const TrangYeuThich: React.FC<TrangYeuThichProps> = ({
  tatCaDoiBong,
  doiBongYeuThichIds,
  baiVietDaLuu,
  onChuyenYeuThichDoiBong,
  onChonBaiViet,
  onBoLuuBaiViet,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Tiêu đề */}
      <div className="border-b border-emerald-900/30 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Heart className="w-7 h-7 text-emerald-400" />
          <span>Không gian người hâm mộ & Yêu thích</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Theo dõi câu lạc bộ thân thuộc của bạn và quản lý danh sách bài viết đã lưu để đọc lại
        </p>
      </div>

      {/* Phần 1: Chọn Đội bóng yêu thích */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Đội bóng bạn quan tâm ({doiBongYeuThichIds.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Nhấp vào thẻ để bật/tắt theo dõi</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tatCaDoiBong.map((doi) => {
            const daThich = doiBongYeuThichIds.includes(doi.id);
            return (
              <button
                key={doi.id}
                onClick={() => onChuyenYeuThichDoiBong(doi.id)}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer relative ${
                  daThich
                    ? 'bg-[#153022] border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-[#12221a] border-emerald-900/30 hover:border-emerald-700/50 opacity-70 hover:opacity-100'
                }`}
              >
                {daThich && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className="w-10 h-10 rounded-full bg-slate-900/80 p-1.5 flex items-center justify-center mb-2">
                  <img
                    src={doi.logo}
                    alt={doi.ten}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-white leading-tight line-clamp-1">
                  {doi.ten}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {doi.giai_dau_hien_tai === 'v_league_1' ? 'V-League' : 'Quốc tế'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Phần 2: Bài viết đã lưu */}
      <section className="space-y-4 pt-6 border-t border-emerald-900/30">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white">
            Bài viết đã lưu ({baiVietDaLuu.length})
          </h2>
        </div>

        {baiVietDaLuu.length === 0 ? (
          <div className="bg-[#12221a] border border-emerald-900/30 rounded-2xl p-10 text-center text-slate-400 space-y-2">
            <p className="text-sm font-semibold text-slate-300">Chưa có bài viết nào được lưu</p>
            <p className="text-xs text-slate-500">
              Khi đọc các bài phân tích hoặc tin tức thể thao, hãy nhấn biểu tượng Bookmark để lưu vào đây.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {baiVietDaLuu.map((bai) => (
              <TheBaiViet
                key={bai.id}
                baiViet={bai}
                onChon={onChonBaiViet}
                onLuu={onBoLuuBaiViet}
                daLuu={true}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
