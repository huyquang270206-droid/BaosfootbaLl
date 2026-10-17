import React from 'react';
import { TranDau } from '../types/bongDa.ts';
import {
  dinhDangNgayGioVN,
  layNhanTrangThai,
  layMauTrangThai,
} from '../utils/dinhDang.ts';
import { MapPin } from 'lucide-react';

interface TheTranDauProps {
  tran: TranDau;
  onChon: (tran: TranDau) => void;
}

export const TheTranDau: React.FC<TheTranDauProps> = ({ tran, onChon }) => {
  const laTrucTiep =
    tran.trang_thai === 'dang_dien_ra' || tran.trang_thai === 'nghi_giua_hiep';
  const mau = layMauTrangThai(tran.trang_thai);

  return (
    <div
      onClick={() => onChon(tran)}
      className="bg-[#12221a] hover:bg-[#162b21] border border-emerald-900/30 hover:border-emerald-700/50 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-md shadow-black/20 flex flex-col justify-between group"
    >
      {/* Đầu thẻ: Giải đấu & Vòng đấu */}
      <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-emerald-950/60 mb-3">
        <div className="flex items-center gap-1.5 font-medium truncate">
          <span className="text-emerald-400">{tran.ten_giai_dau}</span>
          {tran.ten_vong_dau && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">{tran.ten_vong_dau}</span>
            </>
          )}
        </div>

        {/* Trạng thái trận đấu */}
        <div className="flex items-center gap-1.5 shrink-0">
          {laTrucTiep && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          )}
          <span className={`text-[11px] font-semibold ${mau.chu}`}>
            {laTrucTiep ? `${tran.phut_thi_dau}'` : layNhanTrangThai(tran.trang_thai)}
          </span>
        </div>
      </div>

      {/* Thân thẻ: Hai đội và tỷ số */}
      <div className="space-y-3 my-1">
        {/* Đội chủ nhà */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-900/80 p-1 flex items-center justify-center shrink-0 border border-slate-700/30">
              <img
                src={tran.doi_chu_nha.logo}
                alt={tran.doi_chu_nha.ten}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="font-semibold text-slate-100 group-hover:text-emerald-300 text-sm truncate transition-colors">
              {tran.doi_chu_nha.ten}
            </span>
          </div>
          <span className="text-lg font-bold tabular-nums text-white shrink-0">
            {tran.trang_thai === 'chua_dien_ra' ? '-' : tran.ti_so_chu_nha}
          </span>
        </div>

        {/* Đội khách */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-900/80 p-1 flex items-center justify-center shrink-0 border border-slate-700/30">
              <img
                src={tran.doi_khach.logo}
                alt={tran.doi_khach.ten}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="font-semibold text-slate-100 group-hover:text-emerald-300 text-sm truncate transition-colors">
              {tran.doi_khach.ten}
            </span>
          </div>
          <span className="text-lg font-bold tabular-nums text-white shrink-0">
            {tran.trang_thai === 'chua_dien_ra' ? '-' : tran.ti_so_doi_khach}
          </span>
        </div>
      </div>

      {/* Chân thẻ: Sân vận động & Giờ thi đấu */}
      <div className="mt-3 pt-2.5 border-t border-emerald-950/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1 truncate text-slate-400">
          <MapPin className="w-3 h-3 shrink-0 text-emerald-500/70" />
          <span className="truncate">{tran.san_van_dong || 'Sân vận động'}</span>
        </div>
        <span className="tabular-nums text-slate-400 shrink-0">
          {dinhDangNgayGioVN(tran.thoi_gian_bat_dau)}
        </span>
      </div>
    </div>
  );
};
