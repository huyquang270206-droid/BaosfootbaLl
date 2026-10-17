import React from 'react';
import { Trophy, ShieldCheck, Database, Globe } from 'lucide-react';

interface ThanhChanTrangProps {
  onChuyenTrang: (trang: string) => void;
}

export const ThanhChanTrang: React.FC<ThanhChanTrangProps> = ({ onChuyenTrang }) => {
  return (
    <footer className="bg-[#09110d] border-t border-emerald-900/30 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Cột 1: Thương hiệu & sứ mệnh */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                FOOTBALL<span className="text-emerald-400">HUB</span> VIỆT NAM
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nền tảng thể thao bóng đá toàn diện, cung cấp tin tức, kết quả, tỷ số trực tiếp và số liệu chuyên sâu dành riêng cho người hâm mộ Việt Nam.
            </p>
          </div>

          {/* Cột 2: Giải đấu trọng điểm */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Giải đấu hàng đầu
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onChuyenTrang('bang_xep_hang')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  V.League 1 - Bóng đá Việt Nam
                </button>
              </li>
              <li>
                <button
                  onClick={() => onChuyenTrang('bang_xep_hang')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Ngoại hạng Anh (Premier League)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onChuyenTrang('bang_xep_hang')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  UEFA Champions League
                </button>
              </li>
              <li>
                <button
                  onClick={() => onChuyenTrang('bang_xep_hang')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  La Liga Tây Ban Nha
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 3: Chuyên mục tin tức */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Chuyên mục nội dung
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onChuyenTrang('tin_tuc')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Tin tức Bóng đá Việt Nam
                </button>
              </li>
              <li>
                <button
                  onClick={() => onChuyenTrang('tin_tuc')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Thị trường Chuyển nhượng
                </button>
              </li>
              <li>
                <button
                  onClick={() => onChuyenTrang('tin_tuc')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Phân tích Chiến thuật chuyên sâu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onChuyenTrang('quan_tri')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Bảng điều khiển Quản trị CMS
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 4: Tiêu chuẩn kỹ thuật */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Hạ tầng kỹ thuật
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-300">
                <Database className="w-3.5 h-3.5" />
                <span>PostgreSQL Supabase (Schema tiếng Việt)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>football-data.org Free API (0 VNĐ)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bảo mật RLS & Kiểm soát giới hạn tải</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Football Hub Việt Nam. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span>Tiếng Việt (Asia/Ho_Chi_Minh)</span>
            <span>·</span>
            <span>UTF-8</span>
            <span>·</span>
            <span>Phiên bản 1.0 Chuyên nghiệp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
