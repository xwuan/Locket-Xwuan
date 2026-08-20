# 🚀 Hướng dẫn Triển khai Locket Xwuan trên Vercel & Lưu trữ dữ liệu với Supabase

Tài liệu này hướng dẫn chi tiết cách cấu hình cơ sở dữ liệu **Supabase** và triển khai ứng dụng **Locket Xwuan** lên **Vercel**.

---

## 📦 PHẦN 1: CẤU HÌNH CƠ SỞ DỮ LIỆU VỚI SUPABASE

### Bước 1: Tạo Project trên Supabase
1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập (hoặc đăng ký miễn phí).
2. Nhấn **New Project**, đặt tên (ví dụ: `locket-xwuan-db`), chọn khu vực (Region) gần Việt Nam nhất (ví dụ: `Singapore - ap-southeast-1`), đặt mật khẩu database và nhấn **Create new project**.

### Bước 2: Chạy Script khởi tạo bảng (Schema SQL)
1. Trong giao diện Supabase Dashboard, vào mục **SQL Editor** (icon `>_` ở thanh bên trái).
2. Mở file [supabase/schema.sql](file:///C:/Users/ADMIN/Downloads/Client-Locket-Xwuan-main/Client-Locket-Xwuan-main/supabase/schema.sql) trong dự án này, copy toàn bộ nội dung.
3. Dán vào SQL Editor trên Supabase và nhấn **Run**.
4. Script sẽ tự động:
   - Tạo các bảng: `profiles`, `moments`, `moment_reactions`, `friends`, `messages`, `rollcalls`, `custom_captions`.
   - Bật tính năng **Supabase Realtime** cho tin nhắn, bài đăng và reaction.
   - Tạo Storage Bucket `moments-media` (Public) để lưu ảnh/video.
   - Cài đặt đầy đủ Row Level Security (RLS) policies.

### Bước 3: Lấy API Keys
1. Vào **Project Settings** (icon bánh răng ở góc dưới bên trái) -> chọn **API**.
2. Copy 2 giá trị:
   - **Project URL** (ví dụ: `https://xyzcompany.supabase.co`)
   - **anon public key** (chuỗi ký tự dài bắt đầu bằng `eyJ...`)

---

## ☁️ PHẦN 2: TRIỂN KHAI LÊN VERCEL

### Bước 1: Đẩy mã nguồn lên GitHub / GitLab
Nếu chưa đẩy code lên GitHub:
```bash
git init
git add .
git commit -m "feat: setup vercel deployment and supabase integration"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Bước 2: Import dự án vào Vercel
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng GitHub.
2. Nhấn **Add New...** -> chọn **Project**.
3. Tìm và chọn repository vừa đẩy lên, nhấn **Import**.

### Bước 3: Cấu hình Build & Environment Variables trên Vercel
- **Framework Preset**: Chọn `Vite` (Vercel thường tự nhận diện).
- **Root Directory**: `./` (để mặc định).
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Trong phần **Environment Variables**, thêm các biến sau:
| Key | Giá trị mẫu | Ghi chú |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Lấy từ Supabase Settings > API |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Lấy từ Supabase Settings > API |
| `VITE_BASE_API_URL` | `https://apilocket-xwuanv2.onrender.com` | API Backend logic phụ trợ (nếu dùng) |
| `VITE_DATA_API_URL` | `https://data.locket-xwuan.com` | API data |
| `VITE_STORAGE_API_URL` | `https://storage.locket-xwuan.com` | API storage |

### Bước 4: Triển khai
- Nhấn **Deploy**.
- Vercel sẽ tự động build và cấp cho bạn một domain trực tiếp (dạng `https://your-project.vercel.app`).

---

## 🛠️ CÁC TÍNH NĂNG SUPABASE ĐÃ ĐƯỢC TÍCH HỢP TRONG SOURCE CODE

1. **Khởi tạo kết nối Supabase**: [`src/lib/supabase.js`](file:///C:/Users/ADMIN/Downloads/Client-Locket-Xwuan-main/Client-Locket-Xwuan-main/src/lib/supabase.js)
2. **Supabase Services**:
   - `src/services/SupabaseServices/momentService.js`: Upload ảnh/video trực tiếp vào Supabase Storage, lưu bài đăng và reaction, lắng nghe bài đăng mới qua Realtime.
   - `src/services/SupabaseServices/chatService.js`: Nhắn tin và nhận tin nhắn trực tiếp qua Supabase Realtime Channel.
   - `src/services/SupabaseServices/friendService.js`: Quản lý danh sách bạn bè.
   - `src/services/SupabaseServices/profileService.js`: Quản lý hồ sơ cá nhân và điểm danh chuỗi ngày (Streak).
3. **React Hook**: [`src/hooks/useSupabase.js`](file:///C:/Users/ADMIN/Downloads/Client-Locket-Xwuan-main/Client-Locket-Xwuan-main/src/hooks/useSupabase.js) để component gọi dữ liệu Supabase chỉ với 1 dòng code.
4. **Cấu hình Vercel SPA**: [`vercel.json`](file:///C:/Users/ADMIN/Downloads/Client-Locket-Xwuan-main/Client-Locket-Xwuan-main/vercel.json) với rewrite rules và security/caching headers.
