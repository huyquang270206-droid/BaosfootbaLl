/**
 * Quản lý kho dữ liệu bóng đá và tương thích cơ sở dữ liệu PostgreSQL Supabase
 * Tên bảng và thuộc tính tuân thủ 100% quy ước tiếng Việt không dấu:
 * giai_dau, doi_bong, tran_dau, su_kien_tran_dau, thong_ke_tran_dau,
 * bang_xep_hang, bai_viet, danh_muc_bai_viet, binh_luan, nhat_ky_dong_bo
 */

import {
  GiaiDau,
  DoiBong,
  TranDau,
  HangBongDa,
  DanhMucBaiViet,
  BaiViet,
  BinhLuan,
  NhatKyDongBo,
  TrangThaiTranDau,
} from '../types/bongDa.ts';
import {
  GIAI_DAU_BAN_DAU,
  DOI_BONG_BAN_DAU,
  TRAN_DAU_BAN_DAU,
  BANG_XEP_HANG_BAN_DAU,
  DANH_MUC_BAN_DAU,
  BAI_VIET_BAN_DAU,
  BINH_LUAN_BAN_DAU,
  NHAT_KY_DONG_BO_BAN_DAU,
} from './duLieuBanDau.ts';

class KhoDuLieuBongDa {
  private giai_dau: GiaiDau[] = [...GIAI_DAU_BAN_DAU];
  private doi_bong: DoiBong[] = [...DOI_BONG_BAN_DAU];
  private tran_dau: TranDau[] = [...TRAN_DAU_BAN_DAU];
  private bang_xep_hang: HangBongDa[] = [...BANG_XEP_HANG_BAN_DAU];
  private danh_muc_bai_viet: DanhMucBaiViet[] = [...DANH_MUC_BAN_DAU];
  private bai_viet: BaiViet[] = [...BAI_VIET_BAN_DAU];
  private binh_luan: BinhLuan[] = [...BINH_LUAN_BAN_DAU];
  private nhat_ky_dong_bo: NhatKyDongBo[] = [...NHAT_KY_DONG_BO_BAN_DAU];
  private doi_bong_yeu_thich: Set<string> = new Set(['cong_an_ha_noi', 'arsenal']);
  private bai_viet_da_luu: Set<string> = new Set(['bv_1']);

  // --- GIẢI ĐẤU ---
  layDanhSachGiaiDau(): GiaiDau[] {
    return [...this.giai_dau].sort((a, b) => a.thu_tu_uu_tien - b.thu_tu_uu_tien);
  }

  layGiaiDauTheoSlug(slug: string): GiaiDau | undefined {
    return this.giai_dau.find((g) => g.slug === slug || g.id === slug);
  }

  // --- ĐỘI BÓNG ---
  layDanhSachDoiBong(giaiDauId?: string): DoiBong[] {
    if (giaiDauId) {
      return this.doi_bong.filter((d) => d.giai_dau_hien_tai === giaiDauId);
    }
    return [...this.doi_bong];
  }

  layDoiBongTheoId(id: string): DoiBong | undefined {
    return this.doi_bong.find((d) => d.id === id || d.slug === id);
  }

  // --- TRẬN ĐẤU ---
  layDanhSachTranDau(boLoc?: {
    giai_dau_id?: string;
    trang_thai?: string;
    hom_nay?: boolean;
    doi_bong_id?: string;
    gioi_han?: number;
  }): TranDau[] {
    let ketQua = [...this.tran_dau];

    if (boLoc?.giai_dau_id && boLoc.giai_dau_id !== 'tat_ca') {
      ketQua = ketQua.filter(
        (t) => t.giai_dau_id === boLoc.giai_dau_id || t.slug_giai_dau === boLoc.giai_dau_id
      );
    }

    if (boLoc?.trang_thai && boLoc.trang_thai !== 'tat_ca') {
      ketQua = ketQua.filter((t) => t.trang_thai === boLoc.trang_thai);
    }

    if (boLoc?.doi_bong_id) {
      ketQua = ketQua.filter(
        (t) => t.doi_chu_nha_id === boLoc.doi_bong_id || t.doi_khach_id === boLoc.doi_bong_id
      );
    }

    // Sắp xếp: Đang diễn ra lên đầu, sau đó theo thời gian bắt đầu
    ketQua.sort((a, b) => {
      const aLive = a.trang_thai === 'dang_dien_ra' || a.trang_thai === 'nghi_giua_hiep';
      const bLive = b.trang_thai === 'dang_dien_ra' || b.trang_thai === 'nghi_giua_hiep';
      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;
      return new Date(a.thoi_gian_bat_dau).getTime() - new Date(b.thoi_gian_bat_dau).getTime();
    });

    if (boLoc?.gioi_han) {
      ketQua = ketQua.slice(0, boLoc.gioi_han);
    }

    return ketQua;
  }

  layTranDauTheoId(id: string): TranDau | undefined {
    return this.tran_dau.find((t) => t.id === id);
  }

  capNhatHoacThemTranDau(tranMoi: TranDau) {
    const viTri = this.tran_dau.findIndex((t) => t.id === tranMoi.id);
    if (viTri >= 0) {
      this.tran_dau[viTri] = { ...this.tran_dau[viTri], ...tranMoi, lan_dong_bo_cuoi: new Date().toISOString() };
    } else {
      this.tran_dau.push({ ...tranMoi, lan_dong_bo_cuoi: new Date().toISOString() });
    }
  }

  // --- BẢNG XẾP HẠNG ---
  layBangXepHang(giaiDauSlug: string): HangBongDa[] {
    const giai = this.layGiaiDauTheoSlug(giaiDauSlug);
    const giaiId = giai ? giai.id : giaiDauSlug;
    return this.bang_xep_hang
      .filter((h) => h.giai_dau_id === giaiId)
      .sort((a, b) => a.thu_hang - b.thu_hang);
  }

  capNhatBangXepHang(giaiDauId: string, danhSachHang: HangBongDa[]) {
    // Xóa cũ thuộc giải này và thêm mới
    this.bang_xep_hang = this.bang_xep_hang.filter((h) => h.giai_dau_id !== giaiDauId);
    this.bang_xep_hang.push(...danhSachHang);
  }

  // --- BÀI VIẾT & TIN TỨC ---
  layDanhSachDanhMuc(): DanhMucBaiViet[] {
    return [...this.danh_muc_bai_viet].sort((a, b) => a.thu_tu - b.thu_tu);
  }

  layDanhSachBaiViet(boLoc?: {
    danh_muc_id?: string;
    noi_bat?: boolean;
    trang?: number;
    gioi_han?: number;
    tim_kiem?: string;
  }): { bai_viet: BaiViet[]; tong_so: number } {
    let ketQua = this.bai_viet.filter((b) => b.trang_thai === 'xuat_ban');

    if (boLoc?.danh_muc_id && boLoc.danh_muc_id !== 'tat_ca') {
      const dm = this.danh_muc_bai_viet.find((d) => d.slug === boLoc.danh_muc_id || d.id === boLoc.danh_muc_id);
      if (dm) {
        ketQua = ketQua.filter((b) => b.danh_muc_id === dm.id);
      }
    }

    if (boLoc?.noi_bat !== undefined) {
      ketQua = ketQua.filter((b) => b.noi_bat === boLoc.noi_bat);
    }

    if (boLoc?.tim_kiem) {
      const tuKhoa = this.chuanHoaTiengViet(boLoc.tim_kiem);
      ketQua = ketQua.filter(
        (b) =>
          this.chuanHoaTiengViet(b.tieu_de).includes(tuKhoa) ||
          this.chuanHoaTiengViet(b.mo_ta_ngan).includes(tuKhoa) ||
          b.the.some((t) => this.chuanHoaTiengViet(t).includes(tuKhoa))
      );
    }

    ketQua.sort((a, b) => new Date(b.ngay_xuat_ban).getTime() - new Date(a.ngay_xuat_ban).getTime());

    const tong_so = ketQua.length;
    const trang = boLoc?.trang || 1;
    const gioi_han = boLoc?.gioi_han || 10;
    const bat_dau = (trang - 1) * gioi_han;

    return {
      bai_viet: ketQua.slice(bat_dau, bat_dau + gioi_han),
      tong_so,
    };
  }

  layBaiVietTheoSlug(slug: string): BaiViet | undefined {
    const bai = this.bai_viet.find((b) => b.slug === slug || b.id === slug);
    if (bai) {
      bai.luot_xem += 1;
    }
    return bai;
  }

  themBaiViet(duLieu: Omit<BaiViet, 'id' | 'slug' | 'luot_xem' | 'ngay_xuat_ban' | 'ngay_cap_nhat'>): BaiViet {
    const id = `bv_${Date.now()}`;
    const slug = this.taoSlugTiengViet(duLieu.tieu_de) + `-${Date.now().toString().slice(-4)}`;
    const dm = this.danh_muc_bai_viet.find((d) => d.id === duLieu.danh_muc_id);
    const baiMoi: BaiViet = {
      ...duLieu,
      id,
      slug,
      ten_danh_muc: dm ? dm.ten : 'Tin tức',
      luot_xem: 0,
      ngay_xuat_ban: new Date().toISOString(),
      ngay_cap_nhat: new Date().toISOString(),
    };
    this.bai_viet.unshift(baiMoi);
    return baiMoi;
  }

  xoaBaiViet(id: string): boolean {
    const banDau = this.bai_viet.length;
    this.bai_viet = this.bai_viet.filter((b) => b.id !== id);
    return this.bai_viet.length < banDau;
  }

  // --- BÌNH LUẬN ---
  layBinhLuanCuaBaiViet(baiVietId: string): BinhLuan[] {
    return this.binh_luan
      .filter((b) => b.bai_viet_id === baiVietId && b.trang_thai === 'hien_thi')
      .sort((a, b) => new Date(b.ngay_tao).getTime() - new Date(a.ngay_tao).getTime());
  }

  themBinhLuan(baiVietId: string, tenNguoiGui: string, noiDung: string): BinhLuan {
    const binhLuanMoi: BinhLuan = {
      id: `bl_${Date.now()}`,
      bai_viet_id: baiVietId,
      ten_nguoi_gui: tenNguoiGui.trim() || 'Người hâm mộ bóng đá',
      noi_dung: noiDung.trim(),
      trang_thai: 'hien_thi',
      so_luot_thich: 0,
      ngay_tao: new Date().toISOString(),
    };
    this.binh_luan.unshift(binhLuanMoi);
    return binhLuanMoi;
  }

  // --- YÊU THÍCH & LƯU BÀI ---
  layDanhSachYeuThich(): { doi_bong_ids: string[]; bai_viet_ids: string[] } {
    return {
      doi_bong_ids: Array.from(this.doi_bong_yeu_thich),
      bai_viet_ids: Array.from(this.bai_viet_da_luu),
    };
  }

  chuyenTrangThaiYeuThichDoiBong(doiBongId: string): boolean {
    if (this.doi_bong_yeu_thich.has(doiBongId)) {
      this.doi_bong_yeu_thich.delete(doiBongId);
      return false;
    } else {
      this.doi_bong_yeu_thich.add(doiBongId);
      return true;
    }
  }

  chuyenTrangThaiLuuBaiViet(baiVietId: string): boolean {
    if (this.bai_viet_da_luu.has(baiVietId)) {
      this.bai_viet_da_luu.delete(baiVietId);
      return false;
    } else {
      this.bai_viet_da_luu.add(baiVietId);
      return true;
    }
  }

  // --- NHẬT KÝ ĐỒNG BỘ ---
  layNhatKyDongBo(gioiHan = 15): NhatKyDongBo[] {
    return [...this.nhat_ky_dong_bo]
      .sort((a, b) => new Date(b.ngay_tao).getTime() - new Date(a.ngay_tao).getTime())
      .slice(0, gioiHan);
  }

  ghiNhatKyDongBo(nhatKy: Omit<NhatKyDongBo, 'id' | 'ngay_tao'>): NhatKyDongBo {
    const banGhi: NhatKyDongBo = {
      ...nhatKy,
      id: `nk_${Date.now()}`,
      ngay_tao: new Date().toISOString(),
    };
    this.nhat_ky_dong_bo.unshift(banGhi);
    return banGhi;
  }

  // --- TÌM KIẾM TOÀN DIỆN TIẾNG VIỆT ---
  timKiemTongHop(tuKhoa: string) {
    if (!tuKhoa || !tuKhoa.trim()) {
      return { bai_viet: [], doi_bong: [], tran_dau: [], giai_dau: [] };
    }
    const q = this.chuanHoaTiengViet(tuKhoa);

    const bai_viet = this.bai_viet
      .filter(
        (b) =>
          this.chuanHoaTiengViet(b.tieu_de).includes(q) ||
          this.chuanHoaTiengViet(b.mo_ta_ngan).includes(q) ||
          b.the.some((t) => this.chuanHoaTiengViet(t).includes(q))
      )
      .slice(0, 6);

    const doi_bong = this.doi_bong
      .filter(
        (d) =>
          this.chuanHoaTiengViet(d.ten).includes(q) ||
          (d.ten_tieng_anh && this.chuanHoaTiengViet(d.ten_tieng_anh).includes(q)) ||
          (d.ten_viet_tat && d.ten_viet_tat.toLowerCase().includes(q))
      )
      .slice(0, 6);

    const giai_dau = this.giai_dau
      .filter(
        (g) =>
          this.chuanHoaTiengViet(g.ten).includes(q) ||
          (g.ten_tieng_anh && this.chuanHoaTiengViet(g.ten_tieng_anh).includes(q))
      )
      .slice(0, 4);

    const tran_dau = this.tran_dau
      .filter(
        (t) =>
          this.chuanHoaTiengViet(t.doi_chu_nha.ten).includes(q) ||
          this.chuanHoaTiengViet(t.doi_khach.ten).includes(q) ||
          this.chuanHoaTiengViet(t.ten_giai_dau).includes(q)
      )
      .slice(0, 6);

    return { bai_viet, doi_bong, tran_dau, giai_dau };
  }

  // Hàm loại bỏ dấu tiếng Việt để tìm kiếm thông minh
  chuanHoaTiengViet(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .trim();
  }

  taoSlugTiengViet(str: string): string {
    return this.chuanHoaTiengViet(str)
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}

export const csdlBongDa = new KhoDuLieuBongDa();
