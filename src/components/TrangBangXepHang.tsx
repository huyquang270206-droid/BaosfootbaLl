import React, { useState } from 'react';
import { GiaiDau, HangBongDa } from '../types/bongDa.ts';
import { BangXepHangWidget } from './BangXepHangWidget.tsx';
import { Award } from 'lucide-react';

interface TrangBangXepHangProps {
  danhSachGiaiDau: GiaiDau[];
  layBangXepHangTheoGiai: (giaiSlug: string) => HangBongDa[];
}

export const TrangBangXepHang: React.FC<TrangBangXepHangProps> = ({
  danhSachGiaiDau,
  layBangXepHangTheoGiai,
}) => {
  const [giaiDauChon, setGiaiDauChon] = useState<string>('ngoai-hang-anh');

  const giaiHienTai =
    danhSachGiaiDau.find((g) => g.slug === giaiDauChon || g.id === giaiDauChon) ||
    danhSachGiaiDau[0];

  const bangXepHang = layBangXepHangTheoGiai(giaiDauChon);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-900/30 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Award className="w-7 h-7 text-emerald-400" />
            <span>Bảng xếp hạng bóng đá</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bảng điểm chi tiết, hiệu số bàn thắng bại và phong độ 5 trận gần nhất
          </p>
        </div>

        {/* Nút chọn giải đấu */}
        <div className="flex items-center gap-1.5 p-1 bg-[#12221a] rounded-xl border border-emerald-900/30 overflow-x-auto">
          {danhSachGiaiDau.map((giai) => {
            const active = giaiDauChon === giai.slug || giaiDauChon === giai.id;
            return (
              <button
                key={giai.id}
                onClick={() => setGiaiDauChon(giai.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {giai.ten}
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget Bảng xếp hạng chi tiết */}
      {bangXepHang && bangXepHang.length > 0 ? (
        <BangXepHangWidget
          danhSachHang={bangXepHang}
          tenGiaiDau={giaiHienTai?.ten || 'Giải đấu'}
          hienThiToanBo={true}
        />
      ) : (
        <div className="bg-[#12221a] border border-emerald-900/30 rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <p className="text-base font-semibold text-slate-300">Chưa có bảng xếp hạng cho giải đấu này</p>
          <p className="text-xs text-slate-500">Dữ liệu sẽ được đồng bộ ngay khi mùa giải bắt đầu.</p>
        </div>
      )}
    </div>
  );
};
