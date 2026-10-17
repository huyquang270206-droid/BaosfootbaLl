import React, { useState } from 'react';
import { BaiViet, BinhLuan } from '../types/bongDa.ts';
import { dinhDangNgayVN, dinhDangSo } from '../utils/dinhDang.ts';
import { ArrowLeft, MessageSquare, Send, Bookmark, Eye } from 'lucide-react';
import { TheBaiViet } from './TheBaiViet.tsx';

interface TrangChiTietBaiVietProps {
  baiViet: BaiViet;
  binhLuan: BinhLuan[];
  baiLienQuan: BaiViet[];
  daLuu: boolean;
  onQuayLai: () => void;
  onChonBaiLienQuan: (bai: BaiViet) => void;
  onLuuBaiViet: (id: string) => void;
  onThemBinhLuan: (baiVietId: string, ten: string, noiDung: string) => Promise<void>;
}

export const TrangChiTietBaiViet: React.FC<TrangChiTietBaiVietProps> = ({
  baiViet,
  binhLuan,
  baiLienQuan,
  daLuu,
  onQuayLai,
  onChonBaiLienQuan,
  onLuuBaiViet,
  onThemBinhLuan,
}) => {
  const [tenNguoiGui, setTenNguoiGui] = useState('');
  const [noiDungBinhLuan, setNoiDungBinhLuan] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [thongBaoThanhCong, setThongBaoThanhCong] = useState(false);

  const handleSubmitBinhLuan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noiDungBinhLuan.trim()) return;
    setDangGui(true);
    try {
      await onThemBinhLuan(baiViet.id, tenNguoiGui, noiDungBinhLuan);
      setNoiDungBinhLuan('');
      setThongBaoThanhCong(true);
      setTimeout(() => setThongBaoThanhCong(false), 3000);
    } finally {
      setDangGui(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Nút quay lại */}
      <button
        onClick={onQuayLai}
        className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Quay lại trang tin tức</span>
      </button>

      {/* Đầu bài viết */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3">
          <span>{baiViet.ten_danh_muc}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400 tabular-nums">{dinhDangNgayVN(baiViet.ngay_xuat_ban)}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="tabular-nums">{dinhDangSo(baiViet.luot_xem)} lượt đọc</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
          {baiViet.tieu_de}
        </h1>

        <div className="mt-4 pt-4 border-t border-emerald-950/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            <span className="text-slate-400">Tác giả: </span>
            <span className="font-semibold text-slate-200">{baiViet.tac_gia}</span>
            <span className="mx-2 text-slate-600">·</span>
            <span className="text-slate-400">{baiViet.nguon_tin}</span>
          </div>

          <button
            onClick={() => onLuuBaiViet(baiViet.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              daLuu
                ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{daLuu ? 'Đã lưu' : 'Lưu bài'}</span>
          </button>
        </div>
      </header>

      {/* Ảnh bài viết */}
      <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 mb-8 border border-emerald-900/30 shadow-xl">
        <img
          src={baiViet.anh_dai_dien}
          alt={baiViet.tieu_de}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mô tả tóm tắt nổi bật */}
      <div className="text-base sm:text-lg font-medium text-emerald-200/90 leading-relaxed bg-[#12241b] border-l-4 border-emerald-500 p-4 rounded-r-xl mb-8">
        {baiViet.mo_ta_ngan}
      </div>

      {/* Nội dung chính bài viết */}
      <div className="prose prose-invert max-w-none text-slate-200 leading-loose text-base space-y-5">
        {baiViet.noi_dung.split('\n\n').map((doan, idx) => (
          <p key={idx}>{doan}</p>
        ))}
      </div>

      {/* Thẻ bài viết */}
      {baiViet.the && baiViet.the.length > 0 && (
        <div className="mt-8 pt-6 border-t border-emerald-950/60 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Chủ đề liên quan:</span>
          {baiViet.the.map((tag, idx) => (
            <span
              key={idx}
              className="text-emerald-300 bg-[#14261d] px-2.5 py-1 rounded-md border border-emerald-900/30"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ===================================== */}
      {/* PHẦN BÌNH LUẬN BÓNG ĐÁ               */}
      {/* ===================================== */}
      <section className="mt-12 pt-8 border-t border-emerald-900/30">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">
            Ý kiến độc giả ({binhLuan.length})
          </h3>
        </div>

        {/* Biểu mẫu gửi bình luận */}
        <form onSubmit={handleSubmitBinhLuan} className="bg-[#12221a] border border-emerald-900/30 rounded-xl p-5 mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
            Gửi bình luận của bạn
          </h4>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Họ và tên của bạn (tùy chọn)"
                value={tenNguoiGui}
                onChange={(e) => setTenNguoiGui(e.target.value)}
                className="w-full bg-[#0c1811] border border-emerald-900/40 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <textarea
                rows={3}
                required
                placeholder="Chia sẻ nhận định của bạn về trận đấu hoặc bài viết này..."
                value={noiDungBinhLuan}
                onChange={(e) => setNoiDungBinhLuan(e.target.value)}
                className="w-full bg-[#0c1811] border border-emerald-900/40 rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="flex items-center justify-between">
              {thongBaoThanhCong ? (
                <span className="text-xs text-emerald-400 font-medium">
                  Bình luận của bạn đã được đăng thành công!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">
                  Bình luận tuân thủ chuẩn mực văn hóa thể thao.
                </span>
              )}
              <button
                type="submit"
                disabled={dangGui}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{dangGui ? 'Đang gửi...' : 'Gửi bình luận'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Danh sách bình luận đã có */}
        <div className="space-y-4">
          {binhLuan.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              Chưa có bình luận nào. Hãy là người đầu tiên đưa ra nhận định!
            </p>
          ) : (
            binhLuan.map((bl) => (
              <div
                key={bl.id}
                className="bg-[#12221a]/60 border border-emerald-900/20 rounded-xl p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{bl.ten_nguoi_gui}</span>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    {dinhDangNgayVN(bl.ngay_tao)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {bl.noi_dung}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Bài viết liên quan */}
      {baiLienQuan && baiLienQuan.length > 0 && (
        <section className="mt-16 pt-8 border-t border-emerald-900/30">
          <h3 className="text-lg font-bold text-white mb-6">
            Bài viết cùng chuyên mục
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {baiLienQuan.slice(0, 3).map((bai) => (
              <TheBaiViet
                key={bai.id}
                baiViet={bai}
                onChon={onChonBaiLienQuan}
                onLuu={onLuuBaiViet}
                daLuu={false}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
