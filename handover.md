# 📋 Locket Xwuan - Project Handover & Progress Log

> **Mục tiêu dự án**: Ứng dụng web/PWA Locket cá nhân độc lập (Personal Private Edition) dành riêng cho 1 người dùng, định hướng mở rộng linh hoạt cho nhóm nhỏ 5-10 người dùng trong tương lai.
> **GitHub Repository**: [https://github.com/xwuan/Locket-Xwuan](https://github.com/xwuan/Locket-Xwuan)
> **Trạng thái hiện tại**: Đã kết nối với GitHub repository chính thức, sẵn sàng triển khai tiếp Supabase & Vercel.

---

## 🏗️ 1. Tổng quan Kiến trúc & Công nghệ

| Thành phần | Công nghệ | Vai trò & Mục đích |
| :--- | :--- | :--- |
| **Core Framework** | React 18 + Vite (SWC) | Xây dựng Single Page App (SPA) hiệu năng cao, build siêu nhanh |
| **Styling & Theme** | Tailwind CSS v4 + DaisyUI v5 | Giao diện hiện đại, hỗ trợ 30+ theme linh hoạt |
| **Quản lý State** | Zustand v5 + React Context | Quản lý state toàn cục cho Moments, Chat, Friends, Camera, Auth |
| **Local Cache & Storage** | Dexie (IndexedDB) | Lưu trữ cục bộ moments, bạn bè, tin nhắn ngay trên trình duyệt |
| **Backend & Database** | Supabase JS Client (`@supabase/supabase-js`) | Sẵn sàng tích hợp Supabase Database, Auth, Storage, Realtime |
| **PWA & Service Worker** | `vite-plugin-pwa` + `sw.js` | Hỗ trợ cài đặt vào màn hình chính (A2HS) trên iOS/Android |
| **Xử lý Media** | `react-easy-crop` + HTML5 Canvas API | Chụp ảnh, quay video HD (lên tới 60s), cắt ảnh tỉ lệ vuông Locket |

---

## 📝 2. Nhật Ký Tiến Trình Đã Thực Hiện (Change Log)

### 🔹 Giai đoạn 1: Chuẩn bị triển khai Vercel & Supabase
- **Cấu hình Vercel (`vercel.json`)**: Thiết lập SPA rewrites (`/(.*) -> /index.html`), caching header cho static assets và các security header (`X-Frame-Options`, `X-Content-Type-Options`).
- **Khởi tạo Supabase Client (`src/lib/supabase.js`)**: Tạo client kết nối sẵn với `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`.
- **Thiết kế Database & Storage Schema (`supabase/schema.sql`)**:
  - Tạo các bảng: `profiles`, `moments`, `moment_reactions`, `friends`, `messages`, `rollcalls`, `custom_captions`.
  - Cấu hình Storage Bucket `moments-media` (Public) cho ảnh/video.
  - Thiết lập Supabase Realtime cho moments, reactions và messages.
  - Cài đặt đầy đủ chính sách bảo mật Row Level Security (RLS).
- **Xây dựng tầng Service Supabase (`src/services/SupabaseServices/`)**:
  - `momentService.js`: Upload ảnh/video trực tiếp lên bucket, đăng khoảnh khắc, thả reaction, realtime subscription.
  - `chatService.js`: Nhắn tin và nhận tin nhắn realtime theo từng phòng chat.
  - `friendService.js`: Lấy danh sách bạn bè, thêm và xóa bạn bè.
  - `profileService.js`: Quản lý hồ sơ cá nhân và điểm danh chuỗi Streak.
- **Tạo Custom React Hook (`src/hooks/useSupabase.js`)**: Cung cấp hook `useSupabaseMoments()` để UI dễ dàng tải và đăng khoảnh khắc.

### 🔹 Giai đoạn 2: Mở khóa toàn bộ đặc quyền VIP Vĩnh Viễn
- **Mở khóa Feature Flags (`src/hooks/useFeature.js`)**:
  - `useFeatureVisible()`: Luôn trả về `true` (mở khóa 100% tính năng, công cụ, theme, khung viền).
  - `getMaxUploads()`: Trả về `{ image: null, video: null, storage_limit_mb: -1 }` (không giới hạn dung lượng & số lượt đăng).
  - `getVideoRecordLimit()`: Tăng thời lượng quay video từ 10s lên **60 giây**.
- **Thiết lập tài khoản VIP mặc định (`src/context/AuthLocket.jsx`)**:
  - Gán mặc định `DEFAULT_VIP_PLAN` với huy hiệu `👑 VIP MEMBER`.
  - Loại bỏ hoàn toàn sự phụ thuộc kiểm tra quyền từ server backend cũ.
- **Nâng cấp giới hạn cấu hình (`src/config/webConfig.js`)**:
  - `maxRecordTime`: 60 giây.
  - `maxImageSizeMB`: 100 MB.
  - `maxVideoSizeMB`: 500 MB.

### 🔹 Giai đoạn 3: Tích hợp các tính năng mới nhất
- **Trang Nhật Ký Locket (`src/pages/Auth/Diary/index.jsx`)**:
  - Xem lại toàn bộ ảnh/video theo dạng Lưới (Album Grid) hoặc Dòng thời gian (Timeline).
  - Bộ lọc theo tháng/năm, lọc theo loại Ảnh / Video, tìm kiếm theo caption.
  - Thống kê tổng số lượng khoảnh khắc.
  - Nút tải xuống ảnh/video chất lượng gốc về máy.
- **Trang Quản Lý Bạn Bè (`src/pages/Auth/Friends/index.jsx`)**:
  - Hiển thị danh sách bạn bè, avatar phóng to, username, display name.
  - Tìm kiếm bạn bè tức thời.
  - Sao chép nhanh liên kết profile (`https://locket.cam/@username`).
- **Web Hợp Tác Caption Kanade (`src/pages/Public/Collab/CaptionKanade.jsx`)**:
  - Kho caption nghệ thuật phân loại theo chủ đề: *Tình yêu, Chill, Tâm trạng, Hài hước, Aesthetic, Anime*.
  - 1-click sao chép hoặc chuyển ngay vào trình đăng bài Locket.
- **Web Hợp Tác Locket Upload (`src/pages/Public/Collab/LocketUpload.jsx`)**:
  - Trình upload chuyên dụng, xem trước tỉ lệ vuông, cắt ảnh và đẩy trực tiếp lên đám mây.
- **Trang Điều Khoản Sử Dụng (`src/pages/Public/Terms/index.jsx`)**:
  - Bổ sung trang chính sách và điều khoản dịch vụ đầy đủ.
- **Cập nhật Điều Hướng & Sidebar (`src/components/Sidebar/index.jsx`, `src/routes/`)**:
  - Đăng ký toàn bộ các route mới vào `publicRoutes.js` và `authRoutes.js`.
  - Tích hợp các mục menu mới vào Sidebar: **Nhật ký (New)**, **Bạn bè**, **Caption Kanade**, **Locket Upload**, **Điều khoản**.

### 🔹 Giai đoạn 4: Tích Hợp Trọn Bộ Icon Locket Gold Chính Thức (Official iOS AppIcons)
- **Sao chép tài nguyên**: Di chuyển toàn bộ 70 tệp asset icon gốc chất lượng cao từ `C:\Users\ADMIN\Downloads\AppIcons\AppIcons` vào `public/app-icons/`.
- **Phân loại 36 mẫu Icon chính thức (`src/utils/appIconUtils.js`)**:
  - *Locket Gold Đặc Quyền*: Gold on Black, Black on Gold, Gold Outline, Locket Classic, Locket Beta.
  - *3D Pastel & Pendant*: Gold Pendant, 3D Pastel Gold/Pink/Blue/Green.
  - *Crystal Gem*: Gem Candy, Gem Rainbow, Gem Pink, Gem Mono.
  - *Glow Neon*: Neon Yellow, Neon Pink, Neon Blue, Neon Green.
  - *Sóng Waves & Tunnel*: Waves Gold/Black/Blue/Purple, 3D Tunnel, Notebook Sketch.
  - *Hoa & Trái Tim*: Flowers Pink/Magenta/Beige/Autumn, Light Hearts, Photo Hearts, Hearts Black.
  - *Minimal Flat*: Flat Yellow, Flat Pink, Flat Purple, Flat Blue.
- **Tạo Component Bộ Chọn Icon (`src/components/UI/AppIconPicker/AppIconPicker.jsx`)**:
  - Thanh phân loại danh mục (Tabs).
  - Khung xem trước live sắc nét kích thước lớn.
  - 1-click chọn đổi icon ngay trong DOM (`<link rel="apple-touch-icon">` và favicon) và lưu vào `localStorage`.
- **Tích hợp đồng bộ**:
  - Trang **Cài đặt (`/settings`)**
  - Trang **Thêm vào màn hình chính (`/download`)**
  - Tự động nạp icon đã chọn khi tải trang (`src/main.jsx` -> `initAppIcon()`).

### 🔹 Giai đoạn 5: Nâng Cấp Friends Hub & Khôi Phục Chuỗi (Restore Streak)
- **Gửi lời mời kết bạn tức thì (Instant Invite)**:
  - Form thêm bạn bè bằng `@username` hoặc link `locket.cam`.
  - Nút sao chép liên kết mời cá nhân (`https://locket.cam/@my_username`).
  - Hỗ trợ Native Web Share API và Modal hiển thị mã QR Code kết bạn trực tiếp.
- **Tìm kiếm & Siêu lọc bạn bè (Super Fast Filter)**:
  - Tìm kiếm thời gian thực (Zero latency) theo tên và username.
  - Bộ lọc: *Tất cả, Bạn bè VIP 👑, Chuỗi Streak 🔥*.
  - Sắp xếp: *Tên A-Z, Tên Z-A, Streak cao nhất*.
- **Công cụ Khôi phục Chuỗi (Restore Streak)**:
  - Cho phép đăng bù bài của ngày hôm qua để cứu lại chuỗi ngày bị đứt.
  - Mở khóa VIP vĩnh viễn không giới hạn số lần khôi phục.

### 🔹 Giai đoạn 6: Quyền Riêng Tư & Hệ Thống Tin Nhắn, Nhóm Chat
- **Chế độ xem Ẩn danh (Ghost / Incognito Mode 👻)**:
  - Nút chuyển chế độ xem ẩn danh không để lại dấu vết lịch sử.
- **Tùy chọn Đối tượng gửi & Đăng Riêng tư (`AudienceSelector.jsx`)**:
  - 🌐 *Tất cả bạn bè*: Chia sẻ cho toàn bộ bạn bè.
  - 🔒 *Chỉ mình tôi (Only Me)*: Lưu giữ riêng tư vào nhật ký cá nhân.
  - 👥 *Nhóm bạn bè tùy chọn*: Tự tạo và quản lý các nhóm bạn bè (Bạn thân, Gia đình, Đồng nghiệp...).
- **Hệ thống Tin Nhắn Locket & Tạo Nhóm Chat (`/chat`, `/messages`)**:
  - Hội thoại 1-1 và Hội thoại Nhóm với giao diện hiện đại.
  - Modal tạo nhóm chat mới, chọn thành viên và đặt tên nhóm.
  - Gửi tin nhắn tức thì, đính kèm ảnh khoảnh khắc và đồng bộ Dexie IndexedDB.

### 🔹 Giai đoạn 7: Locket Smart Caption Studio & Dynamic Badges
- **Tiện ích Động Thông Minh (`SmartCaptionStudio.jsx`)**:
  - 🕒 *Đồng hồ Live*: Giờ thời gian thực (`11:28 AM`, `23:59 Đêm muộn`, `06:00 Bình minh`).
  - 🌤️ *Thời tiết Thực tế*: Nhiệt độ & trạng thái thời tiết tại vị trí (`28°C Nắng đẹp ☀️`, `24°C Mưa rào 🌧️`).
  - 🎵 *Spotify Now Playing*: Badge bài hát đang nghe với hiệu ứng gradient Spotify và sóng nhạc.
  - 📸 *Số lượng Khoảnh khắc*: Đếm và hiển thị mốc Lockets (`Khoảnh khắc #100 🎉`, `Locket #500 🌟`).
  - 🎆 *Lễ Hội & Holidays*: Tết 2026 🧧, Giáng Sinh 🎄, Valentine 💌, Halloween 🎃, Sinh Nhật 🎂, Trung Thu 🏮.
  - ✨ *Sticker GIF Động*: Tích hợp ảnh GIF động làm icon caption (Trái tim đập, Sao lấp lánh, Sóng nhạc, Ngọn lửa, Mèo nhảy).
  - 🎨 *Tự tạo Gradient*: Hơn 10 preset màu gradient và bảng chọn màu tự do.
- **Tích hợp đồng bộ**:
  - Trang **Đăng Moments (`/postmoments`)**
  - Trang **Quản lý Caption (`/manage`)**

### 🔹 Giai đoạn 8: Trích Xuất & Phát Nhạc Tương Tác Spotify (Interactive Music Banner)
- **Module Trích Xuất Spotify (`src/utils/spotifyUtils.js`)**:
  - Trích xuất link `open.spotify.com/track/...` qua Spotify oEmbed API & iTunes Audio Search.
  - Tự động bóc tách: Tên bài hát, Tên ca sĩ/nghệ sĩ, Ảnh bìa Album chất lượng cao, Stream âm thanh 30s Audio Preview và Link trực tiếp Spotify.
- **Bộ Trích Xuất Nhạc (`src/components/common/SpotifyExtractor/SpotifyExtractor.jsx`)**:
  - Ô nhập link Spotify hoặc tìm kiếm bài hát theo tên.
  - Nút trích xuất & nghe thử tức thì trước khi quyết định gắn vào bài đăng.
- **Banner Phát Nhạc Tương Tác (`src/components/common/SpotifyPlayerBanner/SpotifyPlayerBanner.jsx`)**:
  - Hiển thị trên ảnh/video: Bìa album, Tên bài hát, Nghệ sĩ, Sóng nhạc Equalizer chuyển động khi đang phát.
  - **Tương tác 1-chạm**: Người xem chỉ cần chạm/click vào banner Spotify trên Moment để **phát nhạc trực tiếp ngay trên Locket**!
- **Tích hợp đồng bộ**:
  - Trang **Đăng Moments (`/postmoments`)**: Nút "🟢 Gắn Nhạc Spotify" và xem trước banner nhạc.
  - Trang **Nhật Ký Locket (`/diary`)**: Modal xem khoảnh khắc tự động hiển thị banner và phát nhạc khi người dùng bấm vào.

### 🔹 Giai đoạn 9: Tìm Kiếm & Tùy Chọn GIF Động Giphy / Tenor Không Giới Hạn
- **Mở rộng GIF Engine (`src/utils/gifUtils.js`)**:
  - Tìm kiếm thời gian thực kết nối Giphy API theo bất kỳ từ khóa nào (*cat, anime, meme, chill, love, dance, reaction...*).
  - Kho GIF thịnh hành chia theo chủ đề: *Tình yêu ❤️, Mèo & Cute 🐱, Anime & Pixel 🌸, Chill & Vibe ☕, Meme hài hước 😂*.
  - Hỗ trợ dán trực tiếp bất kỳ đường link `.gif` nào từ Tenor / Giphy / Internet.
- **Tùy biến Caption với GIF**:
  - Cho phép tùy chỉnh chữ hiển thị đi kèm ảnh GIF động.
  - Áp dụng ngay vào thanh Caption Locket với 1 cú chạm.

### 🔹 Giai đoạn 10: Tự Động Tạo Chuỗi & Boost Streak Siêu Tốc (1000 - 2000 Ngày)
- **Công cụ Streak Generator Tool (`StreakGeneratorTool.jsx`)**:
  - Tự động sinh ảnh đen Canvas chuẩn 1080x1080 nhẹ nhàng.
  - Chọn các mốc chuỗi khủng: *100 Ngày 🔥, 365 Ngày 🌟, 500 Ngày 💎, 1000 Ngày 👑, 2000 Ngày 🏆* hoặc nhập số ngày bất kỳ.
  - Chọn đối tượng bạn bè nhận chuỗi (Tất cả bạn bè hoặc chỉ định đích danh).
  - Chọn kiểu caption: `🖤` (Im lặng tinh tế), `🔥 Streak Day #X` hoặc ẩn hoàn toàn.
  - Điều khiển tiến trình: Chạy tự động có kiểm soát delay an toàn, thanh tiến trình % và realtime log terminal.
- **Tích hợp đồng bộ**:
  - Menu Công cụ Locket: [`/tools#streak-generator`](file:///D:/Work/Client-Locket-Xwuan-main/src/pages/Auth/LocketXwuanTools)
  - Liên kết nhanh từ trang **Khôi phục chuỗi (`/restore-streak`)**.

### 🔹 Giai đoạn 11: Chuyển Đổi Thương Hiệu Toàn Diện Sang "Locket Xwuan"
- **Đổi tên toàn diện (Rebrand)**:
  - Chuyển đổi hoàn toàn 78+ file mã nguồn từ thương hiệu "Locket Dio" / "Dio" sang **"Locket Xwuan"** / **"Xwuan"** (`package.json`, `index.html`, `vite.config.js`, `manifest.webmanifest`, tiêu đề trang, Sidebar, Header, Footer, cấu hình `src/config/webConfig.js`).
  - Đổi tên thư mục `src/pages/Auth/LocketDioTools` -> `src/pages/Auth/LocketXwuanTools`.
  - Đổi tên thư mục `src/services/LocketDioServices` -> `src/services/LocketXwuanServices`.
  - Giữ an toàn tuyệt đối các từ vựng ngữ nghĩa (`audio`, `studio`, v.v.).

### 🔹 Giai đoạn 12: Khởi Tạo Git & Đẩy Mã Nguồn Lên GitHub
- **Khởi tạo và đẩy mã nguồn**:
  - Khởi tạo local git repository và nhánh chính `main`.
  - Kết nối Remote URL: `https://github.com/xwuan/Locket-Xwuan.git` (định danh `xwuan@`).
  - Đẩy toàn bộ mã nguồn sạch sẽ và tài liệu lên GitHub với lệnh kèm URL trực tiếp.

### 🔹 Giai đoạn 13: Tích Hợp & Kết Nối Thành Công Supabase Database
- **Cấu hình biến môi trường (`.env`)**:
  - `VITE_SUPABASE_URL`: `https://bzngrspsbogbolkiixty.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_CoProMkaKm_mFTw9n8JGBg_ygyZJ4WH`
- **Xác thực kết nối**:
  - Đã kiểm tra và xác thực 100% 7 bảng Database (`profiles`, `moments`, `moment_reactions`, `friends`, `messages`, `rollcalls`, `custom_captions`) đều hoạt động hoàn hảo.
  - Sẵn sàng đồng bộ dữ liệu người dùng, lưu trữ khoảnh khắc và nhắn tin Realtime.

### 🔹 Giai đoạn 14: Chuẩn Hóa Triển Khai Vercel & Tối Ưu Render Ứng Dụng
- **Khắc phục lỗi Case-Sensitive trên Linux/Vercel**:
  - Quét và chuẩn hóa toàn bộ 73+ file import `@/components/ui/` thành `@/components/UI/`.
  - Thiết lập Alias kép `@/components/ui` và `@/components/UI` trong `vite.config.js`.
  - Đổi tên thư mục `MainhomeScreen` thành `MainHomeScreen` chuẩn hóa 100%.
- **Chuyển đổi PWA sang Workbox generateSW tiêu chuẩn**:
  - Chuyển `strategies: "generateSW"` trong `VitePWA` để tự sinh Service Worker độc lập không lỗi thiếu module.
- **Khắc phục Render & Suspense React**:
  - Bọc toàn bộ các `React.lazy()` component bằng `<Suspense fallback={null}>` (bao gồm `NotificationPrompt`, `StreaksCalender`, `BottomHomeScreen`, v.v.).
  - Bọc try-catch an toàn tuyệt đối cho các hàm phân tích dữ liệu `JSON.parse` từ `localStorage` (`getUser`, `streak`).
  - Loại bỏ màu chữ trắng cố định trong `:root` của `src/index.css` để DaisyUI điều khiển màu sắc chính xác.
### 🔹 Giai đoạn 15: Chuẩn Hóa Toàn Diện Bộ Icon Locket Gold & Tài Nguyên Tĩnh
- **Đồng bộ hóa 35 App Icon từ thư mục Downloads**:
  - Trích xuất toàn bộ 35 icon chuẩn iPhone (`*60x60@2x.png`) từ `C:\Users\ADMIN\Downloads\AppIcons\AppIcons`.
  - Loại bỏ hoàn toàn các file `~ipad` không cần thiết để tránh lỗi mã hóa URL trên Linux CDN.
  - Chuẩn hóa tên file quốc tế và url-safe trong `public/app-icons/` (ví dụ: `gold_on_black.png`, `pastel_3d_gold.png`, v.v.).
- **Tối ưu hóa Routing Static Files trong `vercel.json`**:
  - Cập nhật quy tắc SPA rewrite để loại trừ các thư mục tĩnh (`/app-icons/`, `/images/`, `/fonts/`, `/icons/`), đảm bảo máy chủ luôn trả về file ảnh gốc thay vì file `index.html`.
- **Cơ chế PWA & Cache-Busting**:
  - Bật `immediate: true` cho Service Worker registration trong `src/main.jsx`.
  - Bổ sung cơ chế auto-retry phá vỡ bộ nhớ đệm (`?v=timestamp`) trong `AppIconPicker.jsx`.

---

## 🎯 3. Trạng Thái & Độ Ổn Định Hiện Tại
- **Trạng thái Build**: Đã chạy kiểm tra `npm run build` đạt kết quả `exit code 0` (0 lỗi).
- **Service Worker PWA**: Đã tạo bundle `dist/sw.js` và `dist/workbox-*.js` hoàn chỉnh.
- **Triển khai Cloud**: Đã đồng bộ mã nguồn lên GitHub `https://github.com/xwuan/Locket-Xwuan.git` (nhánh `main`).
- **Mã nguồn cục bộ**: `D:\Work\Client-Locket-Xwuan-main`

---

## 📌 4. Checklist & Kế hoạch phát triển tiếp theo
- [x] Triển khai thành công lên Vercel + Supabase.
- [x] Đồng bộ trọn bộ 35 icon Locket Gold và logo thương hiệu Locket Xwuan.
- [ ] Tinh chỉnh giao diện cá nhân hóa theo sở thích của bạn (giao diện dark mode, font chữ, layout camera).
- [ ] Tối ưu hóa bộ nhớ đệm Offline IndexedDB để xem lại moments mượt mà ngay cả khi không có mạng.
