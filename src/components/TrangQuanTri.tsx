import React, { useState } from 'react';
import { BaiViet, DanhMucBaiViet, NhatKyDongBo } from '../types/bongDa.ts';
import { dinhDangNgayGioVN } from '../utils/dinhDang.ts';
import {
  Shield,
  RefreshCw,
  PlusCircle,
  FileText,
  Database,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface TrangQuanTriProps {
  baiViet: BaiViet[];
  danhMuc: DanhMucBaiViet[];
  nhatKyDongBo: NhatKyDongBo[];
  onTaoBaiViet: (duLieu: {
    tieu_de: string;
    mo_ta_ngan: string;
    noi_dung: string;
    anh_dai_dien: string;
    danh_muc_id: string;
    tac_gia: string;
    the: string[];
    noi_bat: boolean;
  }) => Promise<void>;
  onXoaBaiViet: (id: string) => Promise<void>;
  onYeuCauDongBo: (maGiai: string) => Promise<{ thanh_cong: boolean; thong_diep: string }>;
}

export const TrangQuanTri: React.FC<TrangQuanTriProps> = ({
  baiViet,
  danhMuc,
  nhatKyDongBo,
  onTaoBaiViet,
  onXoaBaiViet,
  onYeuCauDongBo,
}) => {
  const [tabHienTai, setTabHienTai] = useState<'tong_quan' | 'dang_bai' | 'danh_sach_bai' | 'co_so_du_lieu'>('tong_quan');
  const [dangDongBo, setDangDongBo] = useState(false);
  const [thongBaoDongBo, setThongBaoDongBo] = useState<string | null>(null);

  // Trạng thái form đăng bài
  const [tieuDe, setTieuDe] = useState('');
  const [moTaNgan, setMoTaNgan] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [danhMucId, setDanhMucId] = useState(danhMuc[0]?.id || 'bong_da_viet_nam');
  const [tacGia, setTacGia] = useState('Ban Biên Tập Football Hub');
  const [theText, setTheText] = useState('Bóng đá, V-League, Thể thao');
  const [noiBat, setNoiBat] = useState(false);
  const [anhChon, setAnhChon] = useState('/src/assets/images/article_vietnam_football_1792242634106.jpg');
  const [dangLuuBai, setDangLuuBai] = useState(false);
  const [thongBaoLuuBai, setThongBaoLuuBai] = useState<string | null>(null);

  const danhSachAnhCoSan = [
    { ten: 'Bóng đá Việt Nam rực lửa', url: '/src/assets/images/article_vietnam_football_1792242634106.jpg' },
    { ten: 'Sân vận động đêm hiện đại', url: '/src/assets/images/hero_football_stadium_1792242632732.jpg' },
    { ten: 'Hành động trận đấu kịch tính', url: '/src/assets/images/article_premier_league_1792242632278.jpg' },
    { ten: 'Sa bàn phân tích chiến thuật', url: '/src/assets/images/article_tactical_analysis_1792242634424.jpg' },
  ];

  const handleThucHienDongBo = async (maGiai = 'PL') => {
    setDangDongBo(true);
    setThongBaoDongBo(null);
    try {
      const res = await onYeuCauDongBo(maGiai);
      setThongBaoDongBo(res.thong_diep);
    } finally {
      setDangDongBo(false);
    }
  };

  const handleXuatBanBaiViet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tieuDe || !moTaNgan || !noiDung) return;
    setDangLuuBai(true);
    try {
      await onTaoBaiViet({
        tieu_de: tieuDe,
        mo_ta_ngan: moTaNgan,
        noi_dung: noiDung,
        anh_dai_dien: anhChon,
        danh_muc_id: danhMucId,
        tac_gia: tacGia,
        the: theText.split(',').map((t) => t.trim()).filter(Boolean),
        noi_bat: noiBat,
      });
      setTieuDe('');
      setMoTaNgan('');
      setNoiDung('');
      setThongBaoLuuBai('Đã xuất bản bài viết thành công lên trang tin tức!');
      setTimeout(() => setThongBaoLuuBai(null), 4000);
      setTabHienTai('danh_sach_bai');
    } finally {
      setDangLuuBai(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header trang quản trị */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-900/30 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Shield className="w-4 h-4" />
            <span>Hệ thống quản trị Football Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Quản trị nội dung & Đồng bộ dữ liệu
          </h1>
        </div>

        {/* Nút hành động nhanh */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleThucHienDongBo('PL')}
            disabled={dangDongBo}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dangDongBo ? 'animate-spin' : ''}`} />
            <span>{dangDongBo ? 'Đang đồng bộ...' : 'Đồng bộ API ngay'}</span>
          </button>
        </div>
      </div>

      {/* 4 Thẻ chỉ số tổng quan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12221a] p-4 rounded-xl border border-emerald-900/30">
          <span className="text-xs text-slate-400">Tổng số bài viết</span>
          <p className="text-2xl font-extrabold text-white tabular-nums mt-1">{baiViet.length}</p>
        </div>
        <div className="bg-[#12221a] p-4 rounded-xl border border-emerald-900/30">
          <span className="text-xs text-slate-400">Trạng thái API 0 đồng</span>
          <p className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Hoạt động
          </p>
        </div>
        <div className="bg-[#12221a] p-4 rounded-xl border border-emerald-900/30">
          <span className="text-xs text-slate-400">Quy ước Database</span>
          <p className="text-xs font-mono text-emerald-300 mt-1 truncate">PostgreSQL tieng_viet</p>
        </div>
        <div className="bg-[#12221a] p-4 rounded-xl border border-emerald-900/30">
          <span className="text-xs text-slate-400">Lần đồng bộ gần nhất</span>
          <p className="text-xs font-semibold text-slate-200 mt-1 tabular-nums">
            {nhatKyDongBo[0] ? dinhDangNgayGioVN(nhatKyDongBo[0].ngay_tao) : 'Mới cập nhật'}
          </p>
        </div>
      </div>

      {/* Tabs chuyển đổi chức năng */}
      <div className="flex items-center border-b border-emerald-900/30 overflow-x-auto scrollbar-none gap-2">
        {[
          { id: 'tong_quan', nhan: 'Tổng quan & Đồng bộ' },
          { id: 'dang_bai', nhan: 'Soạn thảo & Đăng bài mới' },
          { id: 'danh_sach_bai', nhan: 'Quản lý bài viết' },
          { id: 'co_so_du_lieu', nhan: 'Cơ sở dữ liệu PostgreSQL' },
        ].map((tab) => {
          const active = tabHienTai === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTabHienTai(tab.id as any)}
              className={`py-2.5 px-4 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                active
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.nhan}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TỔNG QUAN & ĐỒNG BỘ DỮ LIỆU */}
      {tabHienTai === 'tong_quan' && (
        <div className="space-y-6">
          {thongBaoDongBo && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{thongBaoDongBo}</span>
            </div>
          )}

          {/* Khối kiểm soát nguồn dữ liệu */}
          <div className="bg-[#12221a] border border-emerald-900/30 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-2">
              Nguồn dữ liệu bóng đá thực tế (0 VNĐ)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl mb-4">
              Hệ thống tích hợp dữ liệu thời gian thực từ <strong className="text-emerald-300">football-data.org</strong> cho các giải Ngoại hạng Anh, Cúp C1, La Liga, Serie A cùng với dữ liệu bóng đá Việt Nam (V.League và Đội tuyển Quốc gia). Toàn bộ dữ liệu được lưu vết và chuyển đổi sang tiếng Việt chuẩn.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleThucHienDongBo('PL')}
                disabled={dangDongBo}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Đồng bộ Ngoại hạng Anh (PL)
              </button>
              <button
                onClick={() => handleThucHienDongBo('CL')}
                disabled={dangDongBo}
                className="px-4 py-2 rounded-lg bg-[#183124] hover:bg-[#204030] text-emerald-300 border border-emerald-800/40 text-xs font-semibold transition-colors cursor-pointer"
              >
                Đồng bộ Champions League (CL)
              </button>
              <button
                onClick={() => handleThucHienDongBo('PD')}
                disabled={dangDongBo}
                className="px-4 py-2 rounded-lg bg-[#183124] hover:bg-[#204030] text-emerald-300 border border-emerald-800/40 text-xs font-semibold transition-colors cursor-pointer"
              >
                Đồng bộ La Liga (PD)
              </button>
            </div>
          </div>

          {/* Bảng nhật ký đồng bộ dữ liệu */}
          <div className="bg-[#12221a] border border-emerald-900/30 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-950/60 mb-4">
              <h3 className="text-sm font-bold text-white">
                Nhật ký đồng bộ hệ thống (bảng: nhat_ky_dong_bo)
              </h3>
              <span className="text-[11px] text-slate-400">Hiển thị {nhatKyDongBo.length} lần gần nhất</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-emerald-950/40 text-[11px] uppercase">
                    <th className="py-2.5 px-3">Thời gian</th>
                    <th className="py-2.5 px-3">Nhà cung cấp</th>
                    <th className="py-2.5 px-3">Loại dữ liệu</th>
                    <th className="py-2.5 px-3 text-center">Xử lý</th>
                    <th className="py-2.5 px-3 text-center">Mới</th>
                    <th className="py-2.5 px-3 text-center">Cập nhật</th>
                    <th className="py-2.5 px-3 text-center">Thời gian</th>
                    <th className="py-2.5 px-3 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/30">
                  {nhatKyDongBo.map((nk) => (
                    <tr key={nk.id} className="hover:bg-[#162b21] transition-colors">
                      <td className="py-2.5 px-3 tabular-nums font-mono text-slate-300">
                        {dinhDangNgayGioVN(nk.ngay_tao)}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-400">
                        {nk.ten_nha_cung_cap}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {nk.loai_dong_bo === 'tran_dau'
                          ? 'Trận đấu & Tỷ số'
                          : nk.loai_dong_bo === 'bang_xep_hang'
                          ? 'Bảng xếp hạng'
                          : nk.loai_dong_bo}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                        {nk.so_ban_ghi_xu_ly}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-emerald-400">
                        +{nk.so_ban_ghi_moi}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-300">
                        {nk.so_ban_ghi_cap_nhat}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-400">
                        {nk.thoi_gian_thuc_thi_ms}ms
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            nk.trang_thai === 'thanh_cong'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                          }`}
                        >
                          {nk.trang_thai === 'thanh_cong' ? 'Thành công' : 'Thất bại'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOẠN THẢO VÀ XUẤT BẢN BÀI VIẾT (CMS) */}
      {tabHienTai === 'dang_bai' && (
        <form onSubmit={handleXuatBanBaiViet} className="bg-[#12221a] border border-emerald-900/30 rounded-2xl p-6 space-y-6">
          <div className="border-b border-emerald-950/60 pb-3">
            <h3 className="text-base font-bold text-white">Soạn thảo và xuất bản tin thể thao</h3>
            <p className="text-xs text-slate-400 mt-0.5">Bài viết sau khi xuất bản sẽ hiển thị ngay trên trang chủ và chuyên mục tương ứng.</p>
          </div>

          {thongBaoLuuBai && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-xs text-emerald-300">
              {thongBaoLuuBai}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tiêu đề bài viết <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đại chiến Siêu kinh điển V-League tạo nên màn rượt đuổi nghẹt thở..."
                  value={tieuDe}
                  onChange={(e) => setTieuDe(e.target.value)}
                  className="w-full bg-[#0c1811] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Chuyên mục <span className="text-rose-400">*</span>
                </label>
                <select
                  value={danhMucId}
                  onChange={(e) => setDanhMucId(e.target.value)}
                  className="w-full bg-[#0c1811] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {danhMuc.map((dm) => (
                    <option key={dm.id} value={dm.id}>
                      {dm.ten}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tác giả / Bút danh
                </label>
                <input
                  type="text"
                  value={tacGia}
                  onChange={(e) => setTacGia(e.target.value)}
                  className="w-full bg-[#0c1811] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Thẻ từ khóa (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={theText}
                  onChange={(e) => setTheText(e.target.value)}
                  className="w-full bg-[#0c1811] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="noiBat"
                  checked={noiBat}
                  onChange={(e) => setNoiBat(e.target.checked)}
                  className="rounded border-emerald-800 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="noiBat" className="text-xs text-slate-200 font-medium cursor-pointer">
                  Đánh dấu bài viết nổi bật trên Trang chủ
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Chọn ảnh đại diện bài viết
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {danhSachAnhCoSan.map((anh) => (
                    <div
                      key={anh.url}
                      onClick={() => setAnhChon(anh.url)}
                      className={`aspect-[4/3] rounded-lg overflow-hidden border-2 cursor-pointer transition-all relative ${
                        anhChon === anh.url
                          ? 'border-emerald-400 ring-2 ring-emerald-400/40'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={anh.url} alt={anh.ten} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 right-1 bg-black/70 text-[10px] text-slate-200 px-1 py-0.5 rounded truncate">
                        {anh.ten}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mô tả ngắn (Lead) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Đoạn văn ngắn tóm tắt sự kiện hoặc diễn biến chính..."
                  value={moTaNgan}
                  onChange={(e) => setMoTaNgan(e.target.value)}
                  className="w-full bg-[#0c1811] border border-emerald-900/40 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nội dung chi tiết bài viết <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={8}
              required
              placeholder="Nhập toàn văn bài viết thể thao..."
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              className="w-full bg-[#0c1811] border border-emerald-900/40 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-950/60">
            <button
              type="submit"
              disabled={dangLuuBai}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              {dangLuuBai ? 'Đang xuất bản...' : 'Xuất bản bài viết ngay'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: DANH SÁCH BÀI VIẾT ĐÃ ĐĂNG */}
      {tabHienTai === 'danh_sach_bai' && (
        <div className="bg-[#12221a] border border-emerald-900/30 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-950/60 mb-4">
            <h3 className="text-base font-bold text-white">
              Tất cả bài viết ({baiViet.length})
            </h3>
            <button
              onClick={() => setTabHienTai('dang_bai')}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Viết bài mới</span>
            </button>
          </div>

          <div className="space-y-3">
            {baiViet.map((bv) => (
              <div
                key={bv.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#0e1c15] border border-emerald-900/20 hover:border-emerald-800/40 transition-colors gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                    <img src={bv.anh_dai_dien} alt={bv.tieu_de} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm text-white truncate">{bv.tieu_de}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="text-emerald-400">{bv.ten_danh_muc}</span>
                      <span>·</span>
                      <span className="tabular-nums">{dinhDangNgayGioVN(bv.ngay_xuat_ban)}</span>
                      <span>·</span>
                      <span className="tabular-nums">{bv.luot_xem} lượt đọc</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa bài viết "${bv.tieu_de}"?`)) {
                        onXoaBaiViet(bv.id);
                      }
                    }}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Xóa bài viết"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: THÔNG TIN CƠ SỞ DỮ LIỆU POSTGRESQL */}
      {tabHienTai === 'co_so_du_lieu' && (
        <div className="bg-[#12221a] border border-emerald-900/30 rounded-2xl p-6 space-y-4">
          <div className="border-b border-emerald-950/60 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Cấu trúc Cơ sở dữ liệu chuẩn PostgreSQL / Supabase</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Được thiết kế theo quy chuẩn tiếng Việt không dấu, chữ thường và snake_case.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#0e1c15] p-4 rounded-xl border border-emerald-900/30">
              <span className="font-bold text-emerald-400 block mb-2">Các bảng nghiệp vụ chính:</span>
              <ul className="space-y-1 font-mono text-slate-300">
                <li>• <strong className="text-white">giai_dau</strong>: Giải đấu (V.League, Premier League, Cúp C1)</li>
                <li>• <strong className="text-white">doi_bong</strong>: Câu lạc bộ bóng đá</li>
                <li>• <strong className="text-white">tran_dau</strong>: Lịch thi đấu, kết quả & tỷ số trực tiếp</li>
                <li>• <strong className="text-white">su_kien_tran_dau</strong>: Bàn thắng, thẻ vàng, thẻ đỏ</li>
                <li>• <strong className="text-white">thong_ke_tran_dau</strong>: Kiểm soát bóng, dứt điểm, phạm lỗi</li>
                <li>• <strong className="text-white">doi_hinh_tran_dau</strong>: Sơ đồ chiến thuật & đội hình ra sân</li>
                <li>• <strong className="text-white">bang_xep_hang</strong>: Điểm số, trận, hiệu số & phong độ</li>
              </ul>
            </div>

            <div className="bg-[#0e1c15] p-4 rounded-xl border border-emerald-900/30">
              <span className="font-bold text-emerald-400 block mb-2">Bảng nội dung & tương tác:</span>
              <ul className="space-y-1 font-mono text-slate-300">
                <li>• <strong className="text-white">bai_viet</strong>: Tin tức & bài viết bóng đá</li>
                <li>• <strong className="text-white">danh_muc_bai_viet</strong>: Danh mục thể thao tiếng Việt</li>
                <li>• <strong className="text-white">the_bai_viet</strong>: Từ khóa gắn với bài viết</li>
                <li>• <strong className="text-white">binh_luan</strong>: Bình luận ý kiến độc giả</li>
                <li>• <strong className="text-white">doi_bong_yeu_thich</strong>: Câu lạc bộ độc giả yêu thích</li>
                <li>• <strong className="text-white">bai_viet_da_luu</strong>: Đánh dấu bài đọc sau</li>
                <li>• <strong className="text-white">nhat_ky_dong_bo</strong>: Lịch sử đồng bộ API tự động</li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-[#0c1811] rounded-xl border border-emerald-900/20 text-xs text-slate-400">
            Tập tin Migration đã sẵn sàng tại: <code className="text-emerald-300 font-mono">/supabase/migrations/20261017000000_khoi_tao_co_so_du_lieu_bong_da.sql</code>
          </div>
        </div>
      )}
    </div>
  );
};
