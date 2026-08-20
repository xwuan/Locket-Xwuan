# 🤖 GEMINI / AI ASSISTANT WORKING RULES & INSTRUCTIONS

Tài liệu này định nghĩa các **quy tắc cốt lõi, tiêu chuẩn phát triển và quy trình bắt buộc** dành cho Trợ lý AI (Gemini / Antigravity) khi làm việc trên dự án **Locket Xwuan**.

---

## 🎯 1. Định Hướng Dự Án (Project Scope)
- **Repository chính thức**: [`https://github.com/xwuan/Locket-Xwuan`](https://github.com/xwuan/Locket-Xwuan)
- **Mục đích sử dụng**: Ứng dụng phục vụ riêng cho **1 người dùng cá nhân (Personal Private Edition)**, không phục vụ khách hàng công cộng bên ngoài.
- **Mở rộng tương lai**: Có thể mở rộng quy mô nhỏ cho **5 - 10 người dùng thân thiết**.
- **Môi trường**: Phát triển và đồng bộ giữa Local (`D:\Work\Client-Locket-Xwuan-main`) và GitHub Repo.

---

## 🚨 2. Các Quy Tắc Bắt Buộc (Mandatory Rules)

### 📌 QUY TẮC 1: CẬP NHẬT `handover.md` SAU MỖI LẦN SỬA ĐỔI
* **Bất kỳ khi nào** bạn sửa lỗi (bug fix), tái cấu trúc (refactor), tối ưu hóa (optimize) hoặc chỉnh sửa bất kỳ logic code nào:
  👉 **BẮT BUỘC** phải cập nhật chi tiết nội dung thay đổi vào file [`handover.md`](./handover.md) (mục *Nhật Ký Tiến Trình / Change Log*).

### 📌 QUY TẮC 2: CẬP NHẬT CẢ `handover.md` VÀ `gemini.md` KHI CÓ TÍNH NĂNG MỚI
* Khi bổ sung **tính năng mới**, tạo trang mới hoặc có các **thay đổi kiến trúc lớn**:
  👉 **BẮT BUỘC** phải cập nhật đồng thời cả 2 file:
  1. [`handover.md`](./handover.md): Ghi rõ chức năng mới, cách hoạt động và danh sách file liên quan.
  2. [`gemini.md`](./gemini.md): Cập nhật quy tắc, hướng dẫn hoặc kiến trúc tương ứng.

### 📌 QUY TẮC 3: QUY TRÌNH GIT COMMIT & PUSH BẮT BUỘC KÈM URL TRỰC TIẾP
* **Lý do**: Máy tính người dùng sử dụng Git Bash với **nhiều tài khoản GitHub khác nhau**, do đó để tránh xung đột SSH / Credential / Remote:
* 👉 **BẮT BUỘC** mọi lệnh `git push` hoặc thao tác liên quan tới Remote PHẢI **kèm đích danh URL**:
  ```bash
  # Cấu hình remote origin chuẩn
  git remote set-url origin https://github.com/xwuan/Locket-Xwuan.git

  # Lệnh push tường minh kèm URL trực tiếp:
  git push https://github.com/xwuan/Locket-Xwuan.git main
  # hoặc:
  git push origin main
  ```
* **Quy trình chuẩn**:
  1. **Bước 1**: Thực hiện sửa đổi và kiểm tra code.
  2. **Bước 2**: Cập nhật đầy đủ vào [`handover.md`](./handover.md) (và [`gemini.md`](./gemini.md) nếu có tính năng mới).
  3. **Bước 3**: Chạy `npm run build` để kiểm tra biên dịch đạt `exit code 0` (0 lỗi).
  4. **Bước 4**: Chạy `git add .` và `git commit -m "..."`.
  5. **Bước 5**: Chạy `git push https://github.com/xwuan/Locket-Xwuan.git <branch>` kèm URL trực tiếp.

### 📌 QUY TẮC 4: TIÊU CHUẨN MÃ NGUỒN & BẢN QUYỀN
* **Bản quyền VIP Vĩnh Viễn**: Toàn bộ các kiểm tra giới hạn gói người dùng phải luôn được mở khóa (`useFeatureVisible = true`, `max_uploads = -1`, `storage_limit_mb = -1`, quay video tối đa 60s).
* **Không phụ thuộc Backend bên ngoài**: Code phải đảm bảo chạy độc lập, tự chủ hoàn toàn.
* **Tương thích Supabase & Vercel**: Duy trì tính tương thích chuẩn để khi người dùng quyết định đưa lên Supabase + Vercel chỉ cần 1 bước cấu hình là hoạt động ngay.

---

## 📂 3. Cấu Trúc Các File Tài Liệu Trọng Yếu
- [`handover.md`](./handover.md): Toàn bộ thông tin bàn giao dự án, kiến trúc hệ thống, nhật ký thay đổi chi tiết và checklist công việc.
- [`gemini.md`](./gemini.md): Quy tắc làm việc và kim chỉ nam bắt buộc cho AI.
- [`DEPLOY_VERCEL_SUPABASE.md`](./DEPLOY_VERCEL_SUPABASE.md): Hướng dẫn chi tiết khi chuyển từ Local lên Supabase + Vercel.
- [`supabase/schema.sql`](./supabase/schema.sql): Script khởi tạo toàn bộ cơ sở dữ liệu và Storage.
