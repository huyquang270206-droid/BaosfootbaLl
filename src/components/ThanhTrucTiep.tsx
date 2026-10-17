import React from 'react';
import { TranDau } from '../types/bongDa.ts';
import { layMauTrangThai, dinhDangGioVN } from '../utils/dinhDang.ts';

interface ThanhTrucTiepProps {
  danhSachTranDau: TranDau[];
  onChonTran: (tran: TranDau) => void;
}

export const ThanhTrucTiep: React.FC<ThanhTrucTiepProps> = ({
  danhSachTranDau,
  onChonTran,
}) => {
  if (!danhSachTranDau || danhSachTranDau.length === 0) return null;

  return (
    <div className="bg-[#0e1c15] border-b border-emerald-900/30 overflow-x-auto py-2.5 px-4 scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center gap-3 min-w-max">
        <div className="flex items-center gap-2 pr-3 border-r border-emerald-900/40 text-xs font-semibold text-emerald-400 uppercase tracking-wider shrink-0">
          <span>Tỷ số trận</span>
        </div>

        {danhSachTranDau.map((tran) => {
          const laTrucTiep = tran.trang_thai === 'dang_dien_ra' || tran.trang_thai === 'nghi_giua_hiep';
          const mau = layMauTrangThai(tran.trang_thai);

          return (
            <button
              key={tran.id}
              onClick={() => onChonTran(tran)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#14261d] hover:bg-[#1a3327] border border-emerald-900/30 transition-all text-left text-xs shrink-0 cursor-pointer group"
            >
              <div className="flex flex-col gap-0.5 min-w-[130px]">
                {/* Đội nhà */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <img
                      src={tran.doi_chu_nha.logo}
                      alt={tran.doi_chu_nha.ten}
                      className="w-3.5 h-3.5 object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="truncate text-slate-200 group-hover:text-emerald-300">
                      {tran.doi_chu_nha.ten_viet_tat || tran.doi_chu_nha.ten}
                    </span>
                  </div>
                  <span className="font-bold tabular-nums text-slate-100">
                    {tran.trang_thai === 'chua_dien_ra' ? '-' : tran.ti_so_chu_nha}
                  </span>
                </div>

                {/* Đội khách */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <img
                      src={tran.doi_khach.logo}
                      alt={tran.doi_khach.ten}
                      className="w-3.5 h-3.5 object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="truncate text-slate-200 group-hover:text-emerald-300">
                      {tran.doi_khach.ten_viet_tat || tran.doi_khach.ten}
                    </span>
                  </div>
                  <span className="font-bold tabular-nums text-slate-100">
                    {tran.trang_thai === 'chua_dien_ra' ? '-' : tran.ti_so_doi_khach}
                  </span>
                </div>
              </div>

              {/* Trạng thái / thời gian */}
              <div className="border-l border-emerald-900/40 pl-2.5 text-[11px] flex flex-col items-center justify-center shrink-0">
                {laTrucTiep ? (
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {tran.phut_thi_dau}&apos;
                  </span>
                ) : tran.trang_thai === 'da_ket_thuc' ? (
                  <span className="text-slate-400 font-medium">FT</span>
                ) : (
                  <span className="text-emerald-300 tabular-nums">
                    {dinhDangGioVN(tran.thoi_gian_bat_dau)}
                  </span>
                )}
                <span className="text-[10px] text-slate-400 uppercase truncate max-w-[50px]">
                  {tran.slug_giai_dau === 'v-league-1' ? 'V-League' : 'EPL'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
