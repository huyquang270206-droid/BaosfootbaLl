import React, { useState } from 'react';
import { Search, Bookmark, Shield, Menu, X, Trophy } from 'lucide-react';

interface ThanhDieuHuongProps {
  trangHienTai: string;
  onChuyenTrang: (trang: string) => void;
  onMoTimKiem: () => void;
  soLuongYeuThich: number;
}

export const ThanhDieuHuong: React.FC<ThanhDieuHuongProps> = ({
  trangHienTai,
  onChuyenTrang,
  onMoTimKiem,
  soLuongYeuThich,
}) => {
  const [moMenuDiDong, setMoMenuDiDong] = useState(false);

  const danhSachMuc = [
    { ma: 'trang_chu', nhan: 'Trang chủ' },
    { ma: 'lich_thi_dau', nhan: 'Lịch & Kết quả' },
    { ma: 'bang_xep_hang', nhan: 'Bảng xếp hạng' },
    { ma: 'tin_tuc', nhan: 'Tin tức' },
    { ma: 'quan_tri', nhan: 'Quản trị CMS' },
  ];

  const handleChuyenTrang = (ma: string) => {
    onChuyenTrang(ma);
    setMoMenuDiDong(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b1410]/95 backdrop-blur-md border-b border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Thương hiệu */}
          <button
            onClick={() => handleChuyenTrang('trang_chu')}
            className="flex items-center gap-2.5 text-left focus:outline-none shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
                FOOTBALL<span className="text-emerald-400">HUB</span>
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 liên kết điều hướng dạng văn bản mộc */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {danhSachMuc.map((m) => {
              const active = trangHienTai === m.ma;
              return (
                <button
                  key={m.ma}
                  onClick={() => handleChuyenTrang(m.ma)}
                  className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                    active
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {m.nhan}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Hành động thao tác */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Nút tìm kiếm */}
            <button
              onClick={onMoTimKiem}
              className="p-2 text-slate-300 hover:text-white hover:bg-emerald-900/20 rounded-lg transition-colors"
              title="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Nút yêu thích */}
            <button
              onClick={() => handleChuyenTrang('yeu_thich')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                trangHienTai === 'yeu_thich'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/50'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Yêu thích</span>
              {soLuongYeuThich > 0 && (
                <span className="tabular-nums px-1.5 py-0.2 bg-emerald-900 text-emerald-200 rounded text-[11px]">
                  {soLuongYeuThich}
                </span>
              )}
            </button>

            {/* Nút menu di động */}
            <button
              onClick={() => setMoMenuDiDong(!moMenuDiDong)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-emerald-900/20 rounded-lg"
            >
              {moMenuDiDong ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu cho màn hình di động */}
      {moMenuDiDong && (
        <div className="md:hidden border-t border-emerald-900/40 bg-[#0e1b14] px-4 pt-3 pb-5 space-y-2">
          {danhSachMuc.map((m) => (
            <button
              key={m.ma}
              onClick={() => handleChuyenTrang(m.ma)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                trangHienTai === m.ma
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                  : 'text-slate-300 hover:bg-emerald-900/20 hover:text-white'
              }`}
            >
              {m.nhan}
            </button>
          ))}
          <button
            onClick={() => handleChuyenTrang('yeu_thich')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-300 hover:bg-emerald-900/20"
          >
            Đội bóng & Bài viết yêu thích ({soLuongYeuThich})
          </button>
        </div>
      )}
    </header>
  );
};
