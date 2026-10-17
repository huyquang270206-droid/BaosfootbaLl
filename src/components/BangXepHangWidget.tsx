import React from 'react';
import { HangBongDa } from '../types/bongDa.ts';

interface BangXepHangWidgetProps {
  danhSachHang: HangBongDa[];
  tenGiaiDau: string;
  onXemToanBo?: () => void;
  hienThiToanBo?: boolean;
}

export const BangXepHangWidget: React.FC<BangXepHangWidgetProps> = ({
  danhSachHang,
  tenGiaiDau,
  onXemToanBo,
  hienThiToanBo = false,
}) => {
  return (
    <div className="bg-[#12221a] border border-emerald-900/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-emerald-950/60 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              Bảng xếp hạng {tenGiaiDau}
            </h3>
          </div>
          {onXemToanBo && !hienThiToanBo && (
            <button
              onClick={onXemToanBo}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Chi tiết →
            </button>
          )}
        </div>

        {/* Bảng số liệu */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-emerald-950/40 text-[11px] uppercase">
                <th className="py-2 px-1 text-center font-semibold">#</th>
                <th className="py-2 px-2 font-semibold">Câu lạc bộ</th>
                <th className="py-2 px-1 text-center font-semibold">Tr</th>
                <th className="py-2 px-1 text-center font-semibold">T</th>
                <th className="py-2 px-1 text-center font-semibold">H</th>
                <th className="py-2 px-1 text-center font-semibold">B</th>
                <th className="py-2 px-1 text-center font-semibold">+/-</th>
                <th className="py-2 px-1 text-center font-bold text-emerald-400">Đ</th>
                {hienThiToanBo && (
                  <th className="py-2 px-2 text-center font-semibold">5 trận gần nhất</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/30">
              {danhSachHang.map((hang) => {
                // Top 1-4 Champions League/Thăng hạng
                const topZone = hang.thu_hang <= 4;
                return (
                  <tr
                    key={hang.id}
                    className="hover:bg-[#162b21] transition-colors group"
                  >
                    {/* Thứ hạng */}
                    <td className="py-2 px-1 text-center font-mono tabular-nums">
                      <span
                        className={`inline-block w-5 h-5 leading-5 rounded text-center font-bold text-[11px] ${
                          topZone
                            ? 'bg-emerald-900/60 text-emerald-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {hang.thu_hang}
                      </span>
                    </td>

                    {/* Tên & logo đội bóng */}
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2 truncate max-w-[160px] sm:max-w-[200px]">
                        <img
                          src={hang.doi_bong.logo}
                          alt={hang.doi_bong.ten}
                          className="w-4 h-4 object-contain shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="font-medium text-slate-100 group-hover:text-emerald-300 truncate">
                          {hang.doi_bong.ten}
                        </span>
                      </div>
                    </td>

                    {/* Số trận */}
                    <td className="py-2 px-1 text-center font-mono tabular-nums text-slate-300">
                      {hang.so_tran}
                    </td>

                    {/* Thắng */}
                    <td className="py-2 px-1 text-center font-mono tabular-nums text-slate-300">
                      {hang.thang}
                    </td>

                    {/* Hòa */}
                    <td className="py-2 px-1 text-center font-mono tabular-nums text-slate-400">
                      {hang.hoa}
                    </td>

                    {/* Thua */}
                    <td className="py-2 px-1 text-center font-mono tabular-nums text-slate-400">
                      {hang.thua}
                    </td>

                    {/* Hiệu số */}
                    <td className="py-2 px-1 text-center font-mono tabular-nums text-slate-300">
                      {hang.hieu_so > 0 ? `+${hang.hieu_so}` : hang.hieu_so}
                    </td>

                    {/* Điểm số */}
                    <td className="py-2 px-1 text-center font-mono tabular-nums font-bold text-emerald-400 text-sm">
                      {hang.diem}
                    </td>

                    {/* Phong độ gần nhất */}
                    {hienThiToanBo && (
                      <td className="py-2 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {hang.phong_do_gan_nhat
                            .split('')
                            .slice(0, 5)
                            .map((p, idx) => (
                              <span
                                key={idx}
                                className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center font-mono ${
                                  p === 'W'
                                    ? 'bg-emerald-600 text-white'
                                    : p === 'D'
                                    ? 'bg-amber-600 text-white'
                                    : p === 'L'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-700 text-slate-300'
                                }`}
                              >
                                {p === 'W' ? 'T' : p === 'D' ? 'H' : p === 'L' ? 'B' : '-'}
                              </span>
                            ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 pt-2 text-[11px] text-slate-400 border-t border-emerald-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Top 4 (Cúp C1)
          </span>
        </div>
        <span>Mùa giải 2026/27</span>
      </div>
    </div>
  );
};
