import React, { useState, useEffect } from 'react';
import { Search, X, Trophy, FileText, ArrowRight } from 'lucide-react';
import { BaiViet, DoiBong, TranDau } from '../types/bongDa.ts';

interface HopThoaiTimKiemProps {
  mo: boolean;
  onDong: () => void;
  onChonBaiViet: (bai: BaiViet) => void;
  onChonTranDau: (tran: TranDau) => void;
}

export const HopThoaiTimKiem: React.FC<HopThoaiTimKiemProps> = ({
  mo,
  onDong,
  onChonBaiViet,
  onChonTranDau,
}) => {
  const [tuKhoa, setTuKhoa] = useState('');
  const [dangTai, setDangTai] = useState(false);
  const [ketQua, setKetQua] = useState<{
    bai_viet: BaiViet[];
    doi_bong: DoiBong[];
    tran_dau: TranDau[];
  }>({
    bai_viet: [],
    doi_bong: [],
    tran_dau: [],
  });

  useEffect(() => {
    if (!mo) {
      setTuKhoa('');
      setKetQua({ bai_viet: [], doi_bong: [], tran_dau: [] });
      return;
    }
  }, [mo]);

  useEffect(() => {
    if (!tuKhoa.trim()) {
      setKetQua({ bai_viet: [], doi_bong: [], tran_dau: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setDangTai(true);
      try {
        const res = await fetch(`/api/tim-kiem?q=${encodeURIComponent(tuKhoa)}`);
        const json = await res.json();
        if (json.thanh_cong) {
          setKetQua(json.du_lieu);
        }
      } catch (err) {
        console.error('Lỗi tìm kiếm:', err);
      } finally {
        setDangTai(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [tuKhoa]);

  if (!mo) return null;

  const coKetQua =
    ketQua.bai_viet.length > 0 ||
    ketQua.doi_bong.length > 0 ||
    ketQua.tran_dau.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1f17] border border-emerald-800/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Khung nhập từ khóa */}
        <div className="p-4 border-b border-emerald-900/30 flex items-center gap-3 bg-[#0c1811]">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Tìm kiếm bài viết, câu lạc bộ, giải đấu hoặc cầu thủ..."
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {tuKhoa && (
            <button
              onClick={() => setTuKhoa('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onDong}
            className="text-xs font-semibold px-2.5 py-1 text-slate-400 hover:text-white bg-slate-800/60 rounded-md"
          >
            Đóng
          </button>
        </div>

        {/* Nội dung kết quả tìm kiếm */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {dangTai && (
            <div className="text-center py-6 text-slate-400">
              Đang tìm kiếm dữ liệu...
            </div>
          )}

          {!dangTai && tuKhoa.trim() && !coKetQua && (
            <div className="text-center py-8 text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Không tìm thấy kết quả phù hợp</p>
              <p className="text-[11px] text-slate-500">Hãy thử với từ khóa khác như &quot;Arsenal&quot;, &quot;Hà Nội&quot;, &quot;V-League&quot;...</p>
            </div>
          )}

          {!dangTai && !tuKhoa.trim() && (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <p className="text-slate-400 font-medium">Gợi ý tìm kiếm phổ biến:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Hà Nội FC', 'Công An Hà Nội', 'Arsenal', 'Liverpool', 'V-League', 'Quang Hải', 'Chiến thuật'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTuKhoa(tag)}
                    className="px-2.5 py-1 rounded bg-[#14261d] text-emerald-300 hover:bg-emerald-900/40 border border-emerald-900/30"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nhóm Đội bóng */}
          {ketQua.doi_bong.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Câu lạc bộ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ketQua.doi_bong.map((doi) => (
                  <div
                    key={doi.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-[#14261d] border border-emerald-900/30"
                  >
                    <img src={doi.logo} alt={doi.ten} className="w-5 h-5 object-contain" />
                    <span className="font-semibold text-white">{doi.ten}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nhóm Bài viết */}
          {ketQua.bai_viet.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Tin tức & Bài viết
              </h4>
              <div className="space-y-2">
                {ketQua.bai_viet.map((bv) => (
                  <div
                    key={bv.id}
                    onClick={() => {
                      onChonBaiViet(bv);
                      onDong();
                    }}
                    className="p-3 rounded-lg bg-[#14261d] hover:bg-[#1a3327] border border-emerald-900/30 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <h5 className="font-semibold text-white group-hover:text-emerald-300 truncate">
                          {bv.tieu_de}
                        </h5>
                        <span className="text-[10px] text-slate-400">{bv.ten_danh_muc}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nhóm Trận đấu */}
          {ketQua.tran_dau.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Trận đấu
              </h4>
              <div className="space-y-2">
                {ketQua.tran_dau.map((tran) => (
                  <div
                    key={tran.id}
                    onClick={() => {
                      onChonTranDau(tran);
                      onDong();
                    }}
                    className="p-2.5 rounded-lg bg-[#14261d] hover:bg-[#1a3327] border border-emerald-900/30 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{tran.doi_chu_nha.ten}</span>
                      <span className="font-bold tabular-nums text-emerald-400">
                        {tran.ti_so_chu_nha} - {tran.ti_so_doi_khach}
                      </span>
                      <span className="font-semibold text-white">{tran.doi_khach.ten}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{tran.ten_giai_dau}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
