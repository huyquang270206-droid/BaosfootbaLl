import React, { useState } from 'react';
import { TranDau, GiaiDau } from '../types/bongDa.ts';
import { TheTranDau } from './TheTranDau.tsx';
import { Calendar, Filter } from 'lucide-react';

interface TrangLichThiDauProps {
  danhSachTranDau: TranDau[];
  danhSachGiaiDau: GiaiDau[];
  onChonTran: (tran: TranDau) => void;
}

export const TrangLichThiDau: React.FC<TrangLichThiDauProps> = ({
  danhSachTranDau,
  danhSachGiaiDau,
  onChonTran,
}) => {
  const [boLocTrangThai, setBoLocTrangThai] = useState<string>('tat_ca');
  const [boLocGiaiDau, setBoLocGiaiDau] = useState<string>('tat_ca');

  const danhSachLoc = danhSachTranDau.filter((tran) => {
    if (boLocTrangThai === 'dang_dien_ra' && tran.trang_thai !== 'dang_dien_ra' && tran.trang_thai !== 'nghi_giua_hiep') {
      return false;
    }
    if (boLocTrangThai === 'sap_toi' && tran.trang_thai !== 'chua_dien_ra') {
      return false;
    }
    if (boLocTrangThai === 'da_ket_thuc' && tran.trang_thai !== 'da_ket_thuc') {
      return false;
    }
    if (boLocGiaiDau !== 'tat_ca' && tran.giai_dau_id !== boLocGiaiDau && tran.slug_giai_dau !== boLocGiaiDau) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Tiêu đề trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-900/30 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-emerald-400" />
            <span>Lịch thi đấu & Kết quả</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi trực tiếp tỷ số, lịch thi đấu sắp tới và kết quả các giải đấu hàng đầu
          </p>
        </div>

        {/* Bộ lọc trạng thái trận */}
        <div className="flex items-center gap-1.5 p-1 bg-[#12221a] rounded-xl border border-emerald-900/30 self-start sm:self-auto overflow-x-auto">
          {[
            { id: 'tat_ca', nhan: 'Tất cả' },
            { id: 'dang_dien_ra', nhan: 'Trực tiếp' },
            { id: 'sap_toi', nhan: 'Sắp diễn ra' },
            { id: 'da_ket_thuc', nhan: 'Kết thúc' },
          ].map((tab) => {
            const active = boLocTrangThai === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setBoLocTrangThai(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.nhan}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thanh lọc theo giải đấu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" /> Giải đấu:
        </span>
        <button
          onClick={() => setBoLocGiaiDau('tat_ca')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 whitespace-nowrap border ${
            boLocGiaiDau === 'tat_ca'
              ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50'
              : 'bg-[#12221a] text-slate-400 border-emerald-900/20 hover:text-white'
          }`}
        >
          Tất cả giải đấu
        </button>
        {danhSachGiaiDau.map((giai) => {
          const active = boLocGiaiDau === giai.id || boLocGiaiDau === giai.slug;
          return (
            <button
              key={giai.id}
              onClick={() => setBoLocGiaiDau(giai.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 whitespace-nowrap border ${
                active
                  ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50'
                  : 'bg-[#12221a] text-slate-400 border-emerald-900/20 hover:text-white'
              }`}
            >
              {giai.ten}
            </button>
          );
        })}
      </div>

      {/* Danh sách trận đấu */}
      {danhSachLoc.length === 0 ? (
        <div className="bg-[#12221a] border border-emerald-900/30 rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <p className="text-base font-semibold text-slate-300">Chưa có trận đấu nào trong danh mục đã chọn</p>
          <p className="text-xs text-slate-500">Vui lòng chọn bộ lọc khác hoặc kiểm tra lại lịch thi đấu sau.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {danhSachLoc.map((tran) => (
            <TheTranDau key={tran.id} tran={tran} onChon={onChonTran} />
          ))}
        </div>
      )}
    </div>
  );
};
