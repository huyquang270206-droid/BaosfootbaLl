import { TrangThaiTranDau, NHAN_TRANG_THAI_TRAN_DAU } from '../types/bongDa.ts';

/**
 * Định dạng ngày theo chuẩn Việt Nam: DD/MM/YYYY
 */
export function dinhDangNgayVN(isoString: string): string {
  try {
    const d = new Date(isoString);
    const ngay = String(d.getDate()).padStart(2, '0');
    const thang = String(d.getMonth() + 1).padStart(2, '0');
    const nam = d.getFullYear();
    return `${ngay}/${thang}/${nam}`;
  } catch {
    return '17/10/2026';
  }
}

/**
 * Định dạng giờ theo chuẩn 24 giờ: HH:mm
 */
export function dinhDangGioVN(isoString: string): string {
  try {
    const d = new Date(isoString);
    const gio = String(d.getHours()).padStart(2, '0');
    const phut = String(d.getMinutes()).padStart(2, '0');
    return `${gio}:${phut}`;
  } catch {
    return '19:00';
  }
}

/**
 * Định dạng ngày giờ đầy đủ: HH:mm - DD/MM/YYYY
 */
export function dinhDangNgayGioVN(isoString: string): string {
  return `${dinhDangGioVN(isoString)} · ${dinhDangNgayVN(isoString)}`;
}

/**
 * Lấy nhãn tiếng Việt của trạng thái trận đấu
 */
export function layNhanTrangThai(trangThai: TrangThaiTranDau): string {
  return NHAN_TRANG_THAI_TRAN_DAU[trangThai] || 'Chưa diễn ra';
}

/**
 * Lớp CSS màu sắc tương ứng trạng thái
 */
export function layMauTrangThai(trangThai: TrangThaiTranDau): {
  chu: string;
  nen: string;
  vien: string;
} {
  switch (trangThai) {
    case 'dang_dien_ra':
    case 'nghi_giua_hiep':
    case 'hiep_phu':
    case 'luan_luu':
      return {
        chu: 'text-emerald-400',
        nen: 'bg-emerald-950/60',
        vien: 'border-emerald-700/50',
      };
    case 'da_ket_thuc':
      return {
        chu: 'text-slate-400',
        nen: 'bg-slate-900/60',
        vien: 'border-slate-800',
      };
    case 'hoan':
    case 'huy':
    case 'tam_dung':
      return {
        chu: 'text-rose-400',
        nen: 'bg-rose-950/50',
        vien: 'border-rose-800/40',
      };
    case 'chua_dien_ra':
    default:
      return {
        chu: 'text-emerald-200',
        nen: 'bg-slate-800/60',
        vien: 'border-slate-700/40',
      };
  }
}

/**
 * Định dạng số lượt xem hoặc số lớn
 */
export function dinhDangSo(n: number): string {
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'k';
  }
  return n.toLocaleString('vi-VN');
}
