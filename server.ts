import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { csdlBongDa } from './src/server/db.ts';
import { kiemTraTrangThaiAPI, thucHienDongBoGiaiDau } from './src/server/dongBoDuLieu.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ==========================================
  // CÁC ĐIỂM CUỐI API HỆ THỐNG FOOTBALL HUB
  // ==========================================

  // 1. Dữ liệu tổng hợp Trang chủ
  app.get('/api/trang-chu', (req, res) => {
    try {
      const baiVietNoiBat = csdlBongDa.layDanhSachBaiViet({ noi_bat: true, gioi_han: 4 });
      const baiVietMoiNhat = csdlBongDa.layDanhSachBaiViet({ gioi_han: 6 });
      const tranDangDienRa = csdlBongDa.layDanhSachTranDau({ trang_thai: 'dang_dien_ra' });
      const tranSapDienRa = csdlBongDa.layDanhSachTranDau({ trang_thai: 'chua_dien_ra', gioi_han: 6 });
      const ketQuaMoiNhat = csdlBongDa.layDanhSachTranDau({ trang_thai: 'da_ket_thuc', gioi_han: 6 });
      const giaiDau = csdlBongDa.layDanhSachGiaiDau();
      const bxhNgoaiHangAnh = csdlBongDa.layBangXepHang('ngoai_hang_anh').slice(0, 5);
      const bxhVLeague = csdlBongDa.layBangXepHang('v_league_1').slice(0, 5);

      res.json({
        thanh_cong: true,
        du_lieu: {
          bai_viet_noi_bat: baiVietNoiBat.bai_viet,
          bai_viet_moi_nhat: baiVietMoiNhat.bai_viet,
          tran_dang_dien_ra: tranDangDienRa,
          tran_sap_dien_ra: tranSapDienRa,
          ket_qua_moi_nhat: ketQuaMoiNhat,
          giai_dau: giaiDau,
          bang_xep_hang_ngoai_hang_anh: bxhNgoaiHangAnh,
          bang_xep_hang_v_league: bxhVLeague,
        },
      });
    } catch (err: any) {
      res.status(500).json({ thanh_cong: false, thong_bao_loi: err.message });
    }
  });

  // 2. Danh sách giải đấu
  app.get('/api/giai-dau', (req, res) => {
    res.json({ thanh_cong: true, du_lieu: csdlBongDa.layDanhSachGiaiDau() });
  });

  // 3. Danh sách đội bóng
  app.get('/api/doi-bong', (req, res) => {
    const giaiDauId = req.query.giai_dau_id as string | undefined;
    res.json({ thanh_cong: true, du_lieu: csdlBongDa.layDanhSachDoiBong(giaiDauId) });
  });

  app.get('/api/doi-bong/:id', (req, res) => {
    const doiBong = csdlBongDa.layDoiBongTheoId(req.params.id);
    if (!doiBong) {
      return res.status(404).json({ thanh_cong: false, thong_bao_loi: 'Không tìm thấy đội bóng' });
    }
    const tranDau = csdlBongDa.layDanhSachTranDau({ doi_bong_id: doiBong.id, gioi_han: 6 });
    res.json({ thanh_cong: true, du_lieu: { doi_bong: doiBong, tran_dau: tranDau } });
  });

  // 4. Lịch thi đấu & kết quả trận đấu
  app.get('/api/tran-dau', (req, res) => {
    const { giai_dau_id, trang_thai, doi_bong_id, gioi_han } = req.query;
    const danhSach = csdlBongDa.layDanhSachTranDau({
      giai_dau_id: giai_dau_id as string,
      trang_thai: trang_thai as string,
      doi_bong_id: doi_bong_id as string,
      gioi_han: gioi_han ? Number(gioi_han) : undefined,
    });
    res.json({ thanh_cong: true, du_lieu: danhSach });
  });

  // Chi tiết 1 trận đấu
  app.get('/api/tran-dau/:id', (req, res) => {
    const tran = csdlBongDa.layTranDauTheoId(req.params.id);
    if (!tran) {
      return res.status(404).json({ thanh_cong: false, thong_bao_loi: 'Không tìm thấy trận đấu' });
    }
    res.json({ thanh_cong: true, du_lieu: tran });
  });

  // 5. Bảng xếp hạng theo giải đấu
  app.get('/api/bang-xep-hang/:giaiDauSlug', (req, res) => {
    const bxh = csdlBongDa.layBangXepHang(req.params.giaiDauSlug);
    res.json({ thanh_cong: true, du_lieu: bxh });
  });

  // 6. Tin tức & Bài viết
  app.get('/api/danh-muc-bai-viet', (req, res) => {
    res.json({ thanh_cong: true, du_lieu: csdlBongDa.layDanhSachDanhMuc() });
  });

  app.get('/api/bai-viet', (req, res) => {
    const { danh_muc_id, trang, gioi_han, tim_kiem } = req.query;
    const ketQua = csdlBongDa.layDanhSachBaiViet({
      danh_muc_id: danh_muc_id as string,
      trang: trang ? Number(trang) : 1,
      gioi_han: gioi_han ? Number(gioi_han) : 10,
      tim_kiem: tim_kiem as string,
    });
    res.json({ thanh_cong: true, du_lieu: ketQua });
  });

  app.get('/api/bai-viet/:slug', (req, res) => {
    const bai = csdlBongDa.layBaiVietTheoSlug(req.params.slug);
    if (!bai) {
      return res.status(404).json({ thanh_cong: false, thong_bao_loi: 'Không tìm thấy bài viết' });
    }
    const binhLuan = csdlBongDa.layBinhLuanCuaBaiViet(bai.id);
    const baiLienQuan = csdlBongDa
      .layDanhSachBaiViet({ danh_muc_id: bai.danh_muc_id, gioi_han: 4 })
      .bai_viet.filter((b) => b.id !== bai.id);

    res.json({
      thanh_cong: true,
      du_lieu: {
        bai_viet: bai,
        binh_luan: binhLuan,
        bai_lien_quan: baiLienQuan,
      },
    });
  });

  // Bình luận bài viết
  app.post('/api/bai-viet/:id/binh-luan', (req, res) => {
    const { ten_nguoi_gui, noi_dung } = req.body;
    if (!noi_dung || !noi_dung.trim()) {
      return res.status(400).json({ thanh_cong: false, thong_bao_loi: 'Nội dung bình luận không được để trống' });
    }
    const blMoi = csdlBongDa.themBinhLuan(req.params.id, ten_nguoi_gui, noi_dung);
    res.json({ thanh_cong: true, du_lieu: blMoi, thong_diep: 'Bình luận đã được gửi thành công' });
  });

  // 7. Tìm kiếm toàn diện
  app.get('/api/tim-kiem', (req, res) => {
    const tuKhoa = (req.query.q as string) || '';
    const ketQua = csdlBongDa.timKiemTongHop(tuKhoa);
    res.json({ thanh_cong: true, du_lieu: ketQua });
  });

  // 8. Quản lý Yêu thích & Bài viết đã lưu
  app.get('/api/nguoi-dung/yeu-thich', (req, res) => {
    res.json({ thanh_cong: true, du_lieu: csdlBongDa.layDanhSachYeuThich() });
  });

  app.post('/api/nguoi-dung/yeu-thich/doi-bong', (req, res) => {
    const { doi_bong_id } = req.body;
    if (!doi_bong_id) {
      return res.status(400).json({ thanh_cong: false, thong_bao_loi: 'Thiếu mã đội bóng' });
    }
    const daYeuThich = csdlBongDa.chuyenTrangThaiYeuThichDoiBong(doi_bong_id);
    res.json({ thanh_cong: true, da_yeu_thich: daYeuThich });
  });

  app.post('/api/nguoi-dung/luu-bai-viet', (req, res) => {
    const { bai_viet_id } = req.body;
    if (!bai_viet_id) {
      return res.status(400).json({ thanh_cong: false, thong_bao_loi: 'Thiếu mã bài viết' });
    }
    const daLuu = csdlBongDa.chuyenTrangThaiLuuBaiViet(bai_viet_id);
    res.json({ thanh_cong: true, da_luu: daLuu });
  });

  // 9. Quản trị CMS & Hệ thống
  app.get('/api/quan-tri/tong-quan', async (req, res) => {
    const trangThaiApi = await kiemTraTrangThaiAPI();
    const tongSoBaiViet = csdlBongDa.layDanhSachBaiViet({ gioi_han: 1000 }).tong_so;
    const tongSoTranDau = csdlBongDa.layDanhSachTranDau().length;
    const tongSoDoiBong = csdlBongDa.layDanhSachDoiBong().length;
    const nhatKy = csdlBongDa.layNhatKyDongBo(5);

    res.json({
      thanh_cong: true,
      du_lieu: {
        tong_so_bai_viet: tongSoBaiViet,
        tong_so_tran_dau: tongSoTranDau,
        tong_so_doi_bong: tongSoDoiBong,
        nhat_ky_gan_nhat: nhatKy,
        trang_thai_api: trangThaiApi,
      },
    });
  });

  app.post('/api/quan-tri/bai-viet', (req, res) => {
    const { tieu_de, mo_ta_ngan, noi_dung, anh_dai_dien, danh_muc_id, tac_gia, the, noi_bat } = req.body;
    if (!tieu_de || !mo_ta_ngan || !noi_dung || !danh_muc_id) {
      return res.status(400).json({ thanh_cong: false, thong_bao_loi: 'Vui lòng điền đầy đủ tiêu đề, mô tả và nội dung' });
    }
    const baiMoi = csdlBongDa.themBaiViet({
      tieu_de,
      mo_ta_ngan,
      noi_dung,
      anh_dai_dien: anh_dai_dien || '/src/assets/images/hero_football_stadium_1792242632732.jpg',
      tac_gia: tac_gia || 'Ban Biên Tập Football Hub',
      nguon_tin: 'Football Hub Việt Nam',
      danh_muc_id,
      ten_danh_muc: '',
      noi_bat: !!noi_bat,
      trang_thai: 'xuat_ban',
      the: Array.isArray(the) ? the : ['Bóng đá'],
    });

    res.json({ thanh_cong: true, du_lieu: baiMoi, thong_diep: 'Đã xuất bản bài viết thành công' });
  });

  app.delete('/api/quan-tri/bai-viet/:id', (req, res) => {
    const thanhCong = csdlBongDa.xoaBaiViet(req.params.id);
    if (!thanhCong) {
      return res.status(404).json({ thanh_cong: false, thong_bao_loi: 'Không tìm thấy bài viết cần xóa' });
    }
    res.json({ thanh_cong: true, thong_diep: 'Đã xóa bài viết thành công' });
  });

  app.get('/api/quan-tri/nhat-ky-dong-bo', (req, res) => {
    res.json({ thanh_cong: true, du_lieu: csdlBongDa.layNhatKyDongBo(20) });
  });

  app.post('/api/quan-tri/dong-bo', async (req, res) => {
    const maGiai = (req.body.ma_giai as string) || 'PL';
    const ketQua = await thucHienDongBoGiaiDau(maGiai);
    res.json(ketQua);
  });

  // ==========================================
  // TÍCH HỢP VITE DEV / PRODUCTION STATIC
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, 'localhost', () => {
    console.log(`[Football Hub Việt Nam] Máy chủ đang chạy tại cổng http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Football Hub Việt Nam] Lỗi khởi động máy chủ:', err);
});
