import React, { useState, useEffect } from 'react';
import {
  GiaiDau,
  TranDau,
  HangBongDa,
  BaiViet,
  DanhMucBaiViet,
  BinhLuan,
  NhatKyDongBo,
  DoiBong,
} from './types/bongDa.ts';
import { ThanhDieuHuong } from './components/ThanhDieuHuong.tsx';
import { ThanhTrucTiep } from './components/ThanhTrucTiep.tsx';
import { TheTranDau } from './components/TheTranDau.tsx';
import { TheBaiViet } from './components/TheBaiViet.tsx';
import { BangXepHangWidget } from './components/BangXepHangWidget.tsx';
import { HopThoaiChiTietTranDau } from './components/HopThoaiChiTietTranDau.tsx';
import { TrangChiTietBaiViet } from './components/TrangChiTietBaiViet.tsx';
import { TrangLichThiDau } from './components/TrangLichThiDau.tsx';
import { TrangBangXepHang } from './components/TrangBangXepHang.tsx';
import { TrangQuanTri } from './components/TrangQuanTri.tsx';
import { TrangYeuThich } from './components/TrangYeuThich.tsx';
import { HopThoaiTimKiem } from './components/HopThoaiTimKiem.tsx';
import { ThanhChanTrang } from './components/ThanhChanTrang.tsx';
import { Trophy, ArrowRight, Flame, Newspaper } from 'lucide-react';

export default function App() {
  const [trangHienTai, setTrangHienTai] = useState<string>('trang_chu');
  const [dangTai, setDangTai] = useState<boolean>(true);
  const [loiTai, setLoiTai] = useState<string | null>(null);

  // Dữ liệu ứng dụng
  const [giaiDau, setGiaiDau] = useState<GiaiDau[]>([]);
  const [doiBong, setDoiBong] = useState<DoiBong[]>([]);
  const [tranDau, setTranDau] = useState<TranDau[]>([]);
  const [baiViet, setBaiViet] = useState<BaiViet[]>([]);
  const [danhMuc, setDanhMuc] = useState<DanhMucBaiViet[]>([]);
  const [bxhNgoaiHangAnh, setBxhNgoaiHangAnh] = useState<HangBongDa[]>([]);
  const [bxhVLeague, setBxhVLeague] = useState<HangBongDa[]>([]);
  const [nhatKyDongBo, setNhatKyDongBo] = useState<NhatKyDongBo[]>([]);

  // Tương tác người dùng
  const [doiBongYeuThichIds, setDoiBongYeuThichIds] = useState<string[]>(['cong_an_ha_noi', 'arsenal']);
  const [baiVietDaLuuIds, setBaiVietDaLuuIds] = useState<string[]>(['bv_1']);
  const [tranDauDangChon, setTranDauDangChon] = useState<TranDau | null>(null);
  const [baiVietDangDoc, setBaiVietDangDoc] = useState<BaiViet | null>(null);
  const [binhLuanBaiDangDoc, setBinhLuanBaiDangDoc] = useState<BinhLuan[]>([]);
  const [baiLienQuanDangDoc, setBaiLienQuanDangDoc] = useState<BaiViet[]>([]);
  const [moTimKiem, setMoTimKiem] = useState<boolean>(false);

  // Bộ lọc trang tin tức
  const [danhMucTinChon, setDanhMucTinChon] = useState<string>('tat_ca');

  // Tải dữ liệu ban đầu từ máy chủ
  const taiDuLieu = async () => {
    try {
      setDangTai(true);
      setLoiTai(null);

      const [resTrangChu, resGiaiDau, resDoiBong, resDanhMuc, resBaiViet, resNhatKy] = await Promise.all([
        fetch('/api/trang-chu'),
        fetch('/api/giai-dau'),
        fetch('/api/doi-bong'),
        fetch('/api/danh-muc-bai-viet'),
        fetch('/api/bai-viet?gioi_han=20'),
        fetch('/api/quan-tri/nhat-ky-dong-bo'),
      ]);

      const dataTrangChu = await resTrangChu.json();
      const dataGiaiDau = await resGiaiDau.json();
      const dataDoiBong = await resDoiBong.json();
      const dataDanhMuc = await resDanhMuc.json();
      const dataBaiViet = await resBaiViet.json();
      const dataNhatKy = await resNhatKy.json();

      if (dataTrangChu.thanh_cong) {
        setGiaiDau(dataGiaiDau.du_lieu || []);
        setDoiBong(dataDoiBong.du_lieu || []);
        setDanhMuc(dataDanhMuc.du_lieu || []);
        setBaiViet(dataBaiViet.du_lieu?.bai_viet || []);
        setBxhNgoaiHangAnh(dataTrangChu.du_lieu.bang_xep_hang_ngoai_hang_anh || []);
        setBxhVLeague(dataTrangChu.du_lieu.bang_xep_hang_v_league || []);
        setNhatKyDongBo(dataNhatKy.du_lieu || []);

        // Tổng hợp danh sách trận
        const resTran = await fetch('/api/tran-dau');
        const dataTran = await resTran.json();
        setTranDau(dataTran.du_lieu || []);
      }
    } catch (err: any) {
      console.error('Lỗi nạp dữ liệu:', err);
      setLoiTai('Không thể tải dữ liệu bóng đá từ máy chủ. Vui lòng thử lại sau.');
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDuLieu();
  }, []);

  // Xử lý mở chi tiết bài viết
  const handleChonBaiViet = async (bv: BaiViet) => {
    try {
      setBaiVietDangDoc(bv);
      const res = await fetch(`/api/bai-viet/${bv.slug}`);
      const json = await res.json();
      if (json.thanh_cong) {
        setBinhLuanBaiDangDoc(json.du_lieu.binh_luan || []);
        setBaiLienQuanDangDoc(json.du_lieu.bai_lien_quan || []);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Lỗi tải bài viết:', err);
    }
  };

  // Xử lý gửi bình luận
  const handleThemBinhLuan = async (baiVietId: string, ten: string, noiDung: string) => {
    const res = await fetch(`/api/bai-viet/${baiVietId}/binh-luan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ten_nguoi_gui: ten, noi_dung: noiDung }),
    });
    const json = await res.json();
    if (json.thanh_cong && json.du_lieu) {
      setBinhLuanBaiDangDoc((prev) => [json.du_lieu, ...prev]);
    }
  };

  // Xử lý toggle yêu thích đội bóng
  const handleChuyenYeuThichDoiBong = async (doiBongId: string) => {
    try {
      const res = await fetch('/api/nguoi-dung/yeu-thich/doi-bong', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doi_bong_id: doiBongId }),
      });
      const json = await res.json();
      if (json.thanh_cong) {
        setDoiBongYeuThichIds((prev) =>
          json.da_yeu_thich ? [...prev, doiBongId] : prev.filter((id) => id !== doiBongId)
        );
      }
    } catch (err) {
      console.error('Lỗi yêu thích:', err);
    }
  };

  // Xử lý lưu/bỏ lưu bài viết
  const handleLuuBaiViet = async (baiVietId: string) => {
    try {
      const res = await fetch('/api/nguoi-dung/luu-bai-viet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bai_viet_id: baiVietId }),
      });
      const json = await res.json();
      if (json.thanh_cong) {
        setBaiVietDaLuuIds((prev) =>
          json.da_luu ? [...prev, baiVietId] : prev.filter((id) => id !== baiVietId)
        );
      }
    } catch (err) {
      console.error('Lỗi lưu bài viết:', err);
    }
  };

  // Xử lý tạo bài viết mới từ CMS
  const handleTaoBaiViet = async (duLieu: any) => {
    const res = await fetch('/api/quan-tri/bai-viet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duLieu),
    });
    const json = await res.json();
    if (json.thanh_cong && json.du_lieu) {
      setBaiViet((prev) => [json.du_lieu, ...prev]);
    }
  };

  // Xử lý xóa bài viết
  const handleXoaBaiViet = async (id: string) => {
    const res = await fetch(`/api/quan-tri/bai-viet/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.thanh_cong) {
      setBaiViet((prev) => prev.filter((b) => b.id !== id));
      if (baiVietDangDoc?.id === id) {
        setBaiVietDangDoc(null);
      }
    }
  };

  // Xử lý yêu cầu đồng bộ API
  const handleYeuCauDongBo = async (maGiai: string) => {
    const res = await fetch('/api/quan-tri/dong-bo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ma_giai: maGiai }),
    });
    const json = await res.json();
    // Tải lại các trận và log
    taiDuLieu();
    return json;
  };

  // Lấy bảng xếp hạng theo giải đấu
  const layBangXepHangTheoGiai = (giaiSlug: string) => {
    if (giaiSlug === 'v-league-1' || giaiSlug === 'v_league_1') {
      return bxhVLeague;
    }
    return bxhNgoaiHangAnh;
  };

  const baiVietNoiBat = baiViet.find((b) => b.noi_bat) || baiViet[0];
  const danhSachBaiPhu = baiViet.filter((b) => b.id !== baiVietNoiBat?.id).slice(0, 3);
  const tranDangDienRa = tranDau.filter((t) => t.trang_thai === 'dang_dien_ra' || t.trang_thai === 'nghi_giua_hiep');
  const tranSapDienRa = tranDau.filter((t) => t.trang_thai === 'chua_dien_ra').slice(0, 3);
  const ketQuaMoiNhat = tranDau.filter((t) => t.trang_thai === 'da_ket_thuc').slice(0, 3);
  const baiVietDaLuuList = baiViet.filter((b) => baiVietDaLuuIds.includes(b.id));

  // Lọc bài viết cho trang Tin tức
  const baiVietTrangTin = danhMucTinChon === 'tat_ca'
    ? baiViet
    : baiViet.filter((b) => b.danh_muc_id === danhMucTinChon);

  return (
    <div className="min-h-screen bg-[#0b1410] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Thanh điều hướng Top Bar Contract */}
      <ThanhDieuHuong
        trangHienTai={trangHienTai}
        onChuyenTrang={(t) => {
          setTrangHienTai(t);
          setBaiVietDangDoc(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onMoTimKiem={() => setMoTimKiem(true)}
        soLuongYeuThich={baiVietDaLuuIds.length + doiBongYeuThichIds.length}
      />

      {/* 2. Dải tỷ số trực tiếp trận đấu */}
      <ThanhTrucTiep
        danhSachTranDau={tranDau}
        onChonTran={(tran) => setTranDauDangChon(tran)}
      />

      {/* 3. Nội dung trang chính */}
      <main className="flex-1">
        {dangTai ? (
          <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-emerald-400">Đang tải dữ liệu bóng đá...</p>
            <p className="text-xs text-slate-500">Đang đồng bộ lịch thi đấu, tỷ số và tin tức mới nhất</p>
          </div>
        ) : loiTai ? (
          <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-sm">
              {loiTai}
            </div>
            <button
              onClick={taiDuLieu}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              Thử tải lại dữ liệu
            </button>
          </div>
        ) : baiVietDangDoc ? (
          /* TRANG ĐỌC BÀI VIẾT CHI TIẾT */
          <TrangChiTietBaiViet
            baiViet={baiVietDangDoc}
            binhLuan={binhLuanBaiDangDoc}
            baiLienQuan={baiLienQuanDangDoc}
            daLuu={baiVietDaLuuIds.includes(baiVietDangDoc.id)}
            onQuayLai={() => setBaiVietDangDoc(null)}
            onChonBaiLienQuan={handleChonBaiViet}
            onLuuBaiViet={handleLuuBaiViet}
            onThemBinhLuan={handleThemBinhLuan}
          />
        ) : trangHienTai === 'lich_thi_dau' ? (
          /* TRANG LỊCH THI ĐẤU & KẾT QUẢ */
          <TrangLichThiDau
            danhSachTranDau={tranDau}
            danhSachGiaiDau={giaiDau}
            onChonTran={(t) => setTranDauDangChon(t)}
          />
        ) : trangHienTai === 'bang_xep_hang' ? (
          /* TRANG BẢNG XẾP HẠNG */
          <TrangBangXepHang
            danhSachGiaiDau={giaiDau}
            layBangXepHangTheoGiai={layBangXepHangTheoGiai}
          />
        ) : trangHienTai === 'quan_tri' ? (
          /* TRANG QUẢN TRỊ CMS & HỆ THỐNG */
          <TrangQuanTri
            baiViet={baiViet}
            danhMuc={danhMuc}
            nhatKyDongBo={nhatKyDongBo}
            onTaoBaiViet={handleTaoBaiViet}
            onXoaBaiViet={handleXoaBaiViet}
            onYeuCauDongBo={handleYeuCauDongBo}
          />
        ) : trangHienTai === 'yeu_thich' ? (
          /* TRANG YÊU THÍCH */
          <TrangYeuThich
            tatCaDoiBong={doiBong}
            doiBongYeuThichIds={doiBongYeuThichIds}
            baiVietDaLuu={baiVietDaLuuList}
            onChuyenYeuThichDoiBong={handleChuyenYeuThichDoiBong}
            onChonBaiViet={handleChonBaiViet}
            onBoLuuBaiViet={handleLuuBaiViet}
          />
        ) : trangHienTai === 'tin_tuc' ? (
          /* TRANG TIN TỨC */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="border-b border-emerald-900/30 pb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
                <Newspaper className="w-7 h-7 text-emerald-400" />
                <span>Tin tức thể thao 24/7</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Tin nóng bóng đá Việt Nam, Ngoại hạng Anh, Champions League, chuyển nhượng và nhận định chiến thuật
              </p>
            </div>

            {/* Thanh chọn chuyên mục */}
            <div className="flex items-center gap-1.5 p-1 bg-[#12221a] rounded-xl border border-emerald-900/30 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setDanhMucTinChon('tat_ca')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  danhMucTinChon === 'tat_ca'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả tin
              </button>
              {danhMuc.map((dm) => (
                <button
                  key={dm.id}
                  onClick={() => setDanhMucTinChon(dm.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    danhMucTinChon === dm.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {dm.ten}
                </button>
              ))}
            </div>

            {/* Lưới bài viết */}
            {baiVietTrangTin.length === 0 ? (
              <div className="bg-[#12221a] border border-emerald-900/30 rounded-2xl p-12 text-center text-slate-400">
                Chưa có bài viết nào trong chuyên mục này.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {baiVietTrangTin.map((bv) => (
                  <TheBaiViet
                    key={bv.id}
                    baiViet={bv}
                    onChon={handleChonBaiViet}
                    onLuu={handleLuuBaiViet}
                    daLuu={baiVietDaLuuIds.includes(bv.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* TRANG CHỦ (TRANG_CHU) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* 1. KHU VỰC HERO: BÀI NỔI BẬT + TIN MỚI */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2">
                {baiVietNoiBat && (
                  <TheBaiViet
                    baiViet={baiVietNoiBat}
                    onChon={handleChonBaiViet}
                    onLuu={handleLuuBaiViet}
                    daLuu={baiVietDaLuuIds.includes(baiVietNoiBat.id)}
                    kichThuoc="lon"
                  />
                )}
              </div>

              <div className="bg-[#112119] border border-emerald-900/30 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-950/60 mb-4">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                        Đang được quan tâm
                      </h3>
                    </div>
                    <button
                      onClick={() => setTrangHienTai('tin_tuc')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Xem tất cả →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {danhSachBaiPhu.map((bv) => (
                      <TheBaiViet
                        key={bv.id}
                        baiViet={bv}
                        onChon={handleChonBaiViet}
                        kichThuoc="nho"
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-emerald-950/60 text-center">
                  <button
                    onClick={() => setTrangHienTai('tin_tuc')}
                    className="w-full py-2 bg-[#183124] hover:bg-[#204030] border border-emerald-800/40 rounded-xl text-xs font-semibold text-emerald-300 transition-colors"
                  >
                    Xem thêm tin mới nhất
                  </button>
                </div>
              </div>
            </section>

            {/* 2. KHU VỰC TRẬN ĐẤU: ĐANG DIỄN RA & SẮP TỚI */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/30">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Tâm điểm vòng đấu hôm nay
                  </h2>
                </div>
                <button
                  onClick={() => setTrangHienTai('lich_thi_dau')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                >
                  <span>Toàn bộ lịch thi đấu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Trận đang diễn ra hoặc trận nổi bật */}
                {tranDangDienRa.length > 0
                  ? tranDangDienRa.map((tran) => (
                      <TheTranDau
                        key={tran.id}
                        tran={tran}
                        onChon={(t) => setTranDauDangChon(t)}
                      />
                    ))
                  : null}
                {tranSapDienRa.map((tran) => (
                  <TheTranDau
                    key={tran.id}
                    tran={tran}
                    onChon={(t) => setTranDauDangChon(t)}
                  />
                ))}
              </div>
            </section>

            {/* 3. KHU VỰC KẾT QUẢ MỚI NHẤT & BẢNG XẾP HẠNG */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cột trái: Kết quả mới nhất */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-900/30">
                  <h2 className="text-lg font-bold text-white">
                    Kết quả các trận vừa kết thúc
                  </h2>
                  <button
                    onClick={() => setTrangHienTai('lich_thi_dau')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Xem thêm →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ketQuaMoiNhat.map((tran) => (
                    <TheTranDau
                      key={tran.id}
                      tran={tran}
                      onChon={(t) => setTranDauDangChon(t)}
                    />
                  ))}
                </div>

                {/* Khối tin tức chuyển nhượng & chiến thuật bên dưới */}
                <div className="pt-6 border-t border-emerald-900/30">
                  <h3 className="text-base font-bold text-white mb-4">
                    Góc nhìn chuyên môn & Chuyển nhượng
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {baiViet.slice(2, 4).map((bv) => (
                      <TheBaiViet
                        key={bv.id}
                        baiViet={bv}
                        onChon={handleChonBaiViet}
                        onLuu={handleLuuBaiViet}
                        daLuu={baiVietDaLuuIds.includes(bv.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Cột phải: Bảng xếp hạng V-League & Ngoại hạng Anh */}
              <div className="space-y-6">
                <BangXepHangWidget
                  danhSachHang={bxhVLeague}
                  tenGiaiDau="V.League 1"
                  onXemToanBo={() => setTrangHienTai('bang_xep_hang')}
                />
                <BangXepHangWidget
                  danhSachHang={bxhNgoaiHangAnh}
                  tenGiaiDau="Ngoại hạng Anh"
                  onXemToanBo={() => setTrangHienTai('bang_xep_hang')}
                />
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 4. Hộp thoại chi tiết trận đấu */}
      <HopThoaiChiTietTranDau
        tran={tranDauDangChon}
        onDong={() => setTranDauDangChon(null)}
      />

      {/* 5. Hộp thoại tìm kiếm toàn diện */}
      <HopThoaiTimKiem
        mo={moTimKiem}
        onDong={() => setMoTimKiem(false)}
        onChonBaiViet={(bv) => {
          handleChonBaiViet(bv);
        }}
        onChonTranDau={(tr) => {
          setTranDauDangChon(tr);
        }}
      />

      {/* 6. Chân trang tiếng Việt */}
      <ThanhChanTrang onChuyenTrang={(t) => setTrangHienTai(t)} />
    </div>
  );
}
