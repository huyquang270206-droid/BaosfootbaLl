import React, { useState } from 'react';
import { TranDau } from '../types/bongDa.ts';
import {
  dinhDangNgayGioVN,
  layNhanTrangThai,
  layMauTrangThai,
} from '../utils/dinhDang.ts';
import { X, Trophy, MapPin, User, ShieldAlert } from 'lucide-react';

interface HopThoaiChiTietTranDauProps {
  tran: TranDau | null;
  onDong: () => void;
}

export const HopThoaiChiTietTranDau: React.FC<HopThoaiChiTietTranDauProps> = ({
  tran,
  onDong,
}) => {
  const [tabHienTai, setTabHienTai] = useState<'tong_quan' | 'dien_bien' | 'doi_hinh' | 'thong_ke'>('tong_quan');

  if (!tran) return null;

  const laTrucTiep = tran.trang_thai === 'dang_dien_ra' || tran.trang_thai === 'nghi_giua_hiep';
  const mau = layMauTrangThai(tran.trang_thai);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1f17] border border-emerald-800/40 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Thanh tiêu đề hộp thoại */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/30 bg-[#0c1912]">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>{tran.ten_giai_dau}</span>
            {tran.ten_vong_dau && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{tran.ten_vong_dau}</span>
              </>
            )}
          </div>
          <button
            onClick={onDong}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-950/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Khung tỷ số & thông tin trận đấu chính */}
        <div className="px-6 py-6 bg-gradient-to-b from-[#13261d] to-[#0f1f17] border-b border-emerald-900/30">
          <div className="flex items-center justify-between gap-4">
            {/* Đội chủ nhà */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-900/80 p-2 border border-slate-700/40 flex items-center justify-center mb-2 shadow-lg">
                <img
                  src={tran.doi_chu_nha.logo}
                  alt={tran.doi_chu_nha.ten}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-bold text-white text-base sm:text-lg leading-tight">
                {tran.doi_chu_nha.ten}
              </h3>
              <span className="text-xs text-slate-400 mt-0.5">Chủ nhà</span>
            </div>

            {/* Tỷ số & Trạng thái */}
            <div className="flex flex-col items-center justify-center px-4">
              <div className="flex items-center gap-3 text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-wider bg-black/40 px-5 py-2 rounded-xl border border-emerald-900/40">
                <span>{tran.trang_thai === 'chua_dien_ra' ? '-' : tran.ti_so_chu_nha}</span>
                <span className="text-emerald-500">:</span>
                <span>{tran.trang_thai === 'chua_dien_ra' ? '-' : tran.ti_so_doi_khach}</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {laTrucTiep && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                <span className={`text-xs font-semibold ${mau.chu}`}>
                  {laTrucTiep ? `Phút ${tran.phut_thi_dau}'` : layNhanTrangThai(tran.trang_thai)}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 tabular-nums mt-1">
                {dinhDangNgayGioVN(tran.thoi_gian_bat_dau)}
              </div>
            </div>

            {/* Đội khách */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-900/80 p-2 border border-slate-700/40 flex items-center justify-center mb-2 shadow-lg">
                <img
                  src={tran.doi_khach.logo}
                  alt={tran.doi_khach.ten}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-bold text-white text-base sm:text-lg leading-tight">
                {tran.doi_khach.ten}
              </h3>
              <span className="text-xs text-slate-400 mt-0.5">Đội khách</span>
            </div>
          </div>

          {/* Sân vận động & trọng tài */}
          <div className="mt-4 pt-3 border-t border-emerald-900/20 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            {tran.san_van_dong && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tran.san_van_dong}</span>
              </div>
            )}
            {tran.trong_tai && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trọng tài: {tran.trong_tai}</span>
              </div>
            )}
          </div>
        </div>

        {/* Thanh tab điều hướng các góc nhìn trận đấu */}
        <div className="flex items-center border-b border-emerald-900/30 px-6 bg-[#0c1811] overflow-x-auto scrollbar-none">
          {[
            { id: 'tong_quan', nhan: 'Tổng quan' },
            { id: 'dien_bien', nhan: 'Diễn biến' },
            { id: 'doi_hinh', nhan: 'Đội hình' },
            { id: 'thong_ke', nhan: 'Thống kê' },
          ].map((tab) => {
            const active = tabHienTai === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTabHienTai(tab.id as any)}
                className={`py-3 px-4 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  active
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-950/30'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.nhan}
              </button>
            );
          })}
        </div>

        {/* Nội dung các tab */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-200 space-y-4">
          {/* TAB 1: TỔNG QUAN */}
          {tabHienTai === 'tong_quan' && (
            <div className="space-y-4">
              <div className="bg-[#14281e] p-4 rounded-xl border border-emerald-900/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                  Thông tin trận đấu
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Giải đấu:</span>
                    <p className="font-medium text-white">{tran.ten_giai_dau}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Thời gian bắt đầu:</span>
                    <p className="font-medium text-white tabular-nums">
                      {dinhDangNgayGioVN(tran.thoi_gian_bat_dau)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Địa điểm thi đấu:</span>
                    <p className="font-medium text-white">{tran.san_van_dong || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Trạng thái:</span>
                    <p className={`font-medium ${mau.chu}`}>{layNhanTrangThai(tran.trang_thai)}</p>
                  </div>
                </div>
              </div>

              {/* Bàn thắng nổi bật */}
              {tran.su_kien && tran.su_kien.filter((s) => s.loai_su_kien === 'ban_thang' || s.loai_su_kien === 'penalty_thanh_cong').length > 0 ? (
                <div className="bg-[#14281e] p-4 rounded-xl border border-emerald-900/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                    Bàn thắng trong trận
                  </h4>
                  <div className="space-y-2">
                    {tran.su_kien
                      .filter((s) => s.loai_su_kien === 'ban_thang' || s.loai_su_kien === 'penalty_thanh_cong')
                      .map((sk) => (
                        <div key={sk.id} className="flex items-center justify-between text-xs py-1 border-b border-emerald-950/40">
                          <div className="flex items-center gap-2">
                            <span className="tabular-nums font-bold text-emerald-400">{sk.phut}&apos;</span>
                            <span className="font-semibold text-white">{sk.ten_cau_thu_chinh}</span>
                            <span className="text-slate-400">({sk.ten_doi_bong})</span>
                          </div>
                          <span className="text-slate-400 italic text-[11px] truncate max-w-[200px]">{sk.mo_ta}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  {tran.trang_thai === 'chua_dien_ra'
                    ? 'Trận đấu chưa bắt đầu. Sự kiện sẽ được cập nhật trực tiếp khi bóng lăn.'
                    : 'Chưa có bàn thắng nào được ghi.'}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DIỄN BIẾN TRẬN ĐẤU */}
          {tabHienTai === 'dien_bien' && (
            <div className="space-y-3">
              {tran.su_kien && tran.su_kien.length > 0 ? (
                <div className="space-y-2.5">
                  {tran.su_kien.map((sk) => (
                    <div
                      key={sk.id}
                      className="p-3 rounded-lg bg-[#14281e] border border-emerald-900/30 flex items-start gap-3"
                    >
                      <div className="w-10 text-center font-bold text-emerald-400 tabular-nums shrink-0 pt-0.5">
                        {sk.phut}&apos;
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{sk.ten_cau_thu_chinh}</span>
                          <span className="text-xs text-slate-400">({sk.ten_doi_bong})</span>
                        </div>
                        {sk.mo_ta && (
                          <p className="text-xs text-slate-300 mt-1">{sk.mo_ta}</p>
                        )}
                      </div>
                      <span className="text-xs uppercase font-medium px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                        {sk.loai_su_kien === 'ban_thang'
                          ? 'Bàn thắng'
                          : sk.loai_su_kien === 'penalty_thanh_cong'
                          ? 'Phạt đền'
                          : sk.loai_su_kien === 'the_vang'
                          ? 'Thẻ vàng'
                          : 'Sự kiện'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có dữ liệu sự kiện diễn biến cho trận đấu này.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ĐỘI HÌNH RA SÂN */}
          {tabHienTai === 'doi_hinh' && (
            <div>
              {tran.doi_hinh ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Đội chủ nhà */}
                  <div className="bg-[#14281e] p-4 rounded-xl border border-emerald-900/30">
                    <div className="flex items-center justify-between border-b border-emerald-900/30 pb-2 mb-3">
                      <span className="font-bold text-emerald-400">{tran.doi_hinh.doi_chu_nha.ten_doi_bong}</span>
                      <span className="text-xs text-slate-400 font-mono">Sơ đồ: {tran.doi_hinh.doi_chu_nha.so_do}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">HLV: {tran.doi_hinh.doi_chu_nha.huan_luyen_vien}</p>
                    <div className="space-y-1.5 text-xs">
                      <p className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">Đội hình chính:</p>
                      {tran.doi_hinh.doi_chu_nha.da_chinh.map((ct) => (
                        <div key={ct.so_ao} className="flex items-center justify-between py-0.5 border-b border-emerald-950/30">
                          <div className="flex items-center gap-2">
                            <span className="w-5 font-mono text-emerald-400 font-bold">{ct.so_ao}</span>
                            <span className="text-white">{ct.ho_ten}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">{ct.vi_tri}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Đội khách */}
                  <div className="bg-[#14281e] p-4 rounded-xl border border-emerald-900/30">
                    <div className="flex items-center justify-between border-b border-emerald-900/30 pb-2 mb-3">
                      <span className="font-bold text-emerald-400">{tran.doi_hinh.doi_khach.ten_doi_bong}</span>
                      <span className="text-xs text-slate-400 font-mono">Sơ đồ: {tran.doi_hinh.doi_khach.so_do}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">HLV: {tran.doi_hinh.doi_khach.huan_luyen_vien}</p>
                    <div className="space-y-1.5 text-xs">
                      <p className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">Đội hình chính:</p>
                      {tran.doi_hinh.doi_khach.da_chinh.map((ct) => (
                        <div key={ct.so_ao} className="flex items-center justify-between py-0.5 border-b border-emerald-950/30">
                          <div className="flex items-center gap-2">
                            <span className="w-5 font-mono text-emerald-400 font-bold">{ct.so_ao}</span>
                            <span className="text-white">{ct.ho_ten}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">{ct.vi_tri}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Đội hình chính thức sẽ được ban tổ chức công bố trước giờ bóng lăn 60 phút.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: THỐNG KÊ TRẬN ĐẤU */}
          {tabHienTai === 'thong_ke' && (
            <div>
              {tran.thong_ke ? (
                <div className="space-y-4 bg-[#14281e] p-4 rounded-xl border border-emerald-900/30 text-xs">
                  {/* So sánh kiểm soát bóng */}
                  <div>
                    <div className="flex justify-between font-bold text-white mb-1">
                      <span>{tran.thong_ke.kiem_soat_bong_chu_nha}%</span>
                      <span className="text-slate-400 font-normal">Kiểm soát bóng</span>
                      <span>{tran.thong_ke.kiem_soat_bong_doi_khach}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 flex overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${tran.thong_ke.kiem_soat_bong_chu_nha}%` }}
                      />
                      <div
                        className="bg-emerald-800 h-full"
                        style={{ width: `${tran.thong_ke.kiem_soat_bong_doi_khach}%` }}
                      />
                    </div>
                  </div>

                  {/* Cú sút */}
                  <div className="flex justify-between py-2 border-b border-emerald-950/40">
                    <span className="font-bold tabular-nums">{tran.thong_ke.so_cu_dut_diem_chu_nha}</span>
                    <span className="text-slate-400">Tổng số cú dứt điểm</span>
                    <span className="font-bold tabular-nums">{tran.thong_ke.so_cu_dut_diem_doi_khach}</span>
                  </div>

                  {/* Dứt điểm trúng đích */}
                  <div className="flex justify-between py-2 border-b border-emerald-950/40">
                    <span className="font-bold tabular-nums">{tran.thong_ke.dut_diem_trung_dich_chu_nha}</span>
                    <span className="text-slate-400">Dứt điểm trúng đích</span>
                    <span className="font-bold tabular-nums">{tran.thong_ke.dut_diem_trung_dich_doi_khach}</span>
                  </div>

                  {/* Phạt góc */}
                  <div className="flex justify-between py-2 border-b border-emerald-950/40">
                    <span className="font-bold tabular-nums">{tran.thong_ke.so_qua_phat_goc_chu_nha}</span>
                    <span className="text-slate-400">Phạt góc</span>
                    <span className="font-bold tabular-nums">{tran.thong_ke.so_qua_phat_goc_doi_khach}</span>
                  </div>

                  {/* Phạm lỗi */}
                  <div className="flex justify-between py-2 border-b border-emerald-950/40">
                    <span className="font-bold tabular-nums">{tran.thong_ke.pham_loi_chu_nha}</span>
                    <span className="text-slate-400">Phạm lỗi</span>
                    <span className="font-bold tabular-nums">{tran.thong_ke.pham_loi_doi_khach}</span>
                  </div>

                  {/* Thẻ phạt */}
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-1 font-bold">
                      <span className="text-yellow-400">{tran.thong_ke.the_vang_chu_nha} vàng</span>
                    </div>
                    <span className="text-slate-400">Thẻ phạt</span>
                    <div className="flex items-center gap-1 font-bold">
                      <span className="text-yellow-400">{tran.thong_ke.the_vang_doi_khach} vàng</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Dữ liệu thống kê trận đấu sẽ được cập nhật trong quá trình trận đấu diễn ra.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
