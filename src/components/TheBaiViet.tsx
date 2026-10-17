import React from 'react';
import { BaiViet } from '../types/bongDa.ts';
import { dinhDangNgayVN, dinhDangSo } from '../utils/dinhDang.ts';
import { Bookmark } from 'lucide-react';

interface TheBaiVietProps {
  baiViet: BaiViet;
  onChon: (baiViet: BaiViet) => void;
  onLuu?: (baiVietId: string) => void;
  daLuu?: boolean;
  kichThuoc?: 'lon' | 'vua' | 'nho';
}

export const TheBaiViet: React.FC<TheBaiVietProps> = ({
  baiViet,
  onChon,
  onLuu,
  daLuu = false,
  kichThuoc = 'vua',
}) => {
  const handleLuu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLuu) onLuu(baiViet.id);
  };

  if (kichThuoc === 'lon') {
    return (
      <article
        onClick={() => onChon(baiViet)}
        className="group relative bg-[#112119] border border-emerald-900/30 hover:border-emerald-700/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-xl flex flex-col justify-between"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
          <img
            src={baiViet.anh_dai_dien}
            alt={baiViet.tieu_de}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1410] via-black/30 to-transparent" />
          
          {/* Nút lưu bài viết */}
          <button
            onClick={handleLuu}
            className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md transition-colors ${
              daLuu
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-black/50 text-slate-300 hover:text-white hover:bg-black/70'
            }`}
            title={daLuu ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Metadata mộc không dùng pill */}
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-2.5">
              <span>{baiViet.ten_danh_muc}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 tabular-nums">{dinhDangNgayVN(baiViet.ngay_xuat_ban)}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{dinhDangSo(baiViet.luot_xem)} lượt xem</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
              {baiViet.tieu_de}
            </h3>

            <p className="text-sm text-slate-300 mt-3 line-clamp-3 leading-relaxed">
              {baiViet.mo_ta_ngan}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-emerald-950/60 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">{baiViet.tac_gia}</span>
            <span className="text-emerald-400 group-hover:underline">Đọc toàn bộ bài viết →</span>
          </div>
        </div>
      </article>
    );
  }

  if (kichThuoc === 'nho') {
    return (
      <article
        onClick={() => onChon(baiViet)}
        className="group flex gap-4 p-3 rounded-xl bg-[#12221a]/60 hover:bg-[#162b21] border border-emerald-900/20 hover:border-emerald-800/40 transition-colors cursor-pointer"
      >
        <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-900 relative">
          <img
            src={baiViet.anh_dai_dien}
            alt={baiViet.tieu_de}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mb-1">
              <span>{baiViet.ten_danh_muc}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 tabular-nums">{dinhDangNgayVN(baiViet.ngay_xuat_ban)}</span>
            </div>
            <h4 className="font-semibold text-xs text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
              {baiViet.tieu_de}
            </h4>
          </div>
        </div>
      </article>
    );
  }

  // Kích thước vừa (mặc định)
  return (
    <article
      onClick={() => onChon(baiViet)}
      className="group bg-[#12221a] border border-emerald-900/30 hover:border-emerald-700/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={baiViet.anh_dai_dien}
          alt={baiViet.tieu_de}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <button
          onClick={handleLuu}
          className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
            daLuu
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-black/50 text-slate-300 hover:text-white'
          }`}
          title={daLuu ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mb-2">
            <span>{baiViet.ten_danh_muc}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 tabular-nums">{dinhDangNgayVN(baiViet.ngay_xuat_ban)}</span>
          </div>

          <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
            {baiViet.tieu_de}
          </h3>

          <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {baiViet.mo_ta_ngan}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">{baiViet.tac_gia}</span>
          <span className="tabular-nums">{dinhDangSo(baiViet.luot_xem)} lượt đọc</span>
        </div>
      </div>
    </article>
  );
};
