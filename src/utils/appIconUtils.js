// utils/appIconUtils.js - Quản lý trọn bộ Icon Locket Gold chính thức từ iOS

export const LOCKET_GOLD_CATEGORIES = [
  { id: "gold", name: "Locket Gold Đặc Quyền 👑" },
  { id: "3d", name: "3D Pastel & Pendant ✨" },
  { id: "gem", name: "Đá Quý & Gem Crystal 💎" },
  { id: "neon", name: "Neon Dạ Quang 🔮" },
  { id: "waves", name: "Sóng Waves & 3D Tunnel 🌊" },
  { id: "flowers", name: "Hoa & Trái Tim Hearts 🌸" },
  { id: "flat", name: "Màu Tối Giản Flat 🎨" },
];

export const OFFICIAL_LOCKET_ICONS = [
  // 1. Locket Gold Đặc Quyền
  {
    id: "gold_on_black",
    name: "Gold on Black",
    category: "gold",
    tag: "Locket Gold",
    file: "/app-icons/gold_on_black.png",
  },
  {
    id: "black_on_gold",
    name: "Black on Gold",
    category: "gold",
    tag: "Locket Gold",
    file: "/app-icons/black_on_gold.png",
  },
  {
    id: "gold_on_black_outline",
    name: "Gold Outline",
    category: "gold",
    tag: "Locket Gold",
    file: "/app-icons/gold_on_black_outline.png",
  },
  {
    id: "app_icon",
    name: "Locket Classic",
    category: "gold",
    tag: "Nguyên bản",
    file: "/app-icons/app_icon.png",
  },
  {
    id: "app_icon_beta",
    name: "Locket Beta",
    category: "gold",
    tag: "Beta Edition",
    file: "/app-icons/app_icon_beta.png",
  },

  // 2. 3D Pastel & Pendant
  {
    id: "pendant",
    name: "Gold Pendant",
    category: "3d",
    tag: "Mặt dây chuyền",
    file: "/app-icons/pendant.png",
  },
  {
    id: "pastel_3d_gold",
    name: "3D Pastel Gold",
    category: "3d",
    tag: "3D Pastel",
    file: "/app-icons/pastel_3d_gold.png",
  },
  {
    id: "pastel_3d_pink",
    name: "3D Pastel Pink",
    category: "3d",
    tag: "3D Pastel",
    file: "/app-icons/pastel_3d_pink.png",
  },
  {
    id: "pastel_3d_blue",
    name: "3D Pastel Blue",
    category: "3d",
    tag: "3D Pastel",
    file: "/app-icons/pastel_3d_blue.png",
  },
  {
    id: "pastel_3d_green",
    name: "3D Pastel Green",
    category: "3d",
    tag: "3D Pastel",
    file: "/app-icons/pastel_3d_green.png",
  },

  // 3. Đá Quý Gem
  {
    id: "gem_bg_candy",
    name: "Gem Candy",
    category: "gem",
    tag: "Crystal Gem",
    file: "/app-icons/gem_bg_candy.png",
  },
  {
    id: "gem_bg_multi",
    name: "Gem Rainbow",
    category: "gem",
    tag: "Crystal Gem",
    file: "/app-icons/gem_bg_multi.png",
  },
  {
    id: "gem_bg_pink",
    name: "Gem Pink",
    category: "gem",
    tag: "Crystal Gem",
    file: "/app-icons/gem_bg_pink.png",
  },
  {
    id: "gem_bg_mono",
    name: "Gem Monochrome",
    category: "gem",
    tag: "Crystal Gem",
    file: "/app-icons/gem_bg_mono.png",
  },

  // 4. Neon Dạ Quang
  {
    id: "neon_yellow",
    name: "Neon Yellow",
    category: "neon",
    tag: "Glow Neon",
    file: "/app-icons/neon_yellow.png",
  },
  {
    id: "neon_pink",
    name: "Neon Pink",
    category: "neon",
    tag: "Glow Neon",
    file: "/app-icons/neon_pink.png",
  },
  {
    id: "neon_blue",
    name: "Neon Blue",
    category: "neon",
    tag: "Glow Neon",
    file: "/app-icons/neon_blue.png",
  },
  {
    id: "neon_green",
    name: "Neon Green",
    category: "neon",
    tag: "Glow Neon",
    file: "/app-icons/neon_green.png",
  },

  // 5. Waves & 3D Tunnel
  {
    id: "waves_gold",
    name: "Waves Gold",
    category: "waves",
    tag: "Abstract Wave",
    file: "/app-icons/waves_gold.png",
  },
  {
    id: "waves_black",
    name: "Waves Black",
    category: "waves",
    tag: "Abstract Wave",
    file: "/app-icons/waves_black.png",
  },
  {
    id: "waves_blue",
    name: "Waves Blue",
    category: "waves",
    tag: "Abstract Wave",
    file: "/app-icons/waves_blue.png",
  },
  {
    id: "waves_purple",
    name: "Waves Purple",
    category: "waves",
    tag: "Abstract Wave",
    file: "/app-icons/waves_purple.png",
  },
  {
    id: "tunnel",
    name: "3D Tunnel",
    category: "waves",
    tag: "3D Warp",
    file: "/app-icons/tunnel.png",
  },
  {
    id: "notebook",
    name: "Notebook Sketch",
    category: "waves",
    tag: "Hand Drawn",
    file: "/app-icons/notebook.png",
  },

  // 6. Hoa & Trái Tim
  {
    id: "flowers_pink",
    name: "Flowers Pink",
    category: "flowers",
    tag: "Floral Heart",
    file: "/app-icons/flowers_pink.png",
  },
  {
    id: "flowers_magenta",
    name: "Flowers Magenta",
    category: "flowers",
    tag: "Floral Heart",
    file: "/app-icons/flowers_magenta.png",
  },
  {
    id: "flowers_beige",
    name: "Flowers Beige",
    category: "flowers",
    tag: "Floral Heart",
    file: "/app-icons/flowers_beige.png",
  },
  {
    id: "flowers_autumn",
    name: "Flowers Autumn",
    category: "flowers",
    tag: "Floral Heart",
    file: "/app-icons/flowers_autumn.png",
  },
  {
    id: "light_hearts",
    name: "Light Hearts",
    category: "flowers",
    tag: "Floating Hearts",
    file: "/app-icons/light_hearts.png",
  },
  {
    id: "photos_hearts",
    name: "Photo Hearts",
    category: "flowers",
    tag: "Polaroid Hearts",
    file: "/app-icons/photos_hearts.png",
  },
  {
    id: "photos_hearts_black",
    name: "Hearts Black",
    category: "flowers",
    tag: "Polaroid Hearts",
    file: "/app-icons/photos_hearts_black.png",
  },

  // 7. Màu Tối Giản Flat
  {
    id: "flat_yellow",
    name: "Flat Yellow Gold",
    category: "flat",
    tag: "Minimal Flat",
    file: "/app-icons/flat_yellow.png",
  },
  {
    id: "flat_pink",
    name: "Flat Pink",
    category: "flat",
    tag: "Minimal Flat",
    file: "/app-icons/flat_pink.png",
  },
  {
    id: "flat_purple",
    name: "Flat Purple",
    category: "flat",
    tag: "Minimal Flat",
    file: "/app-icons/flat_purple.png",
  },
  {
    id: "flat_blue",
    name: "Flat Blue",
    category: "flat",
    tag: "Minimal Flat",
    file: "/app-icons/flat_blue.png",
  },
];

/**
 * Cập nhật App Icon trên trang (thẻ apple-touch-icon và favicon)
 */
export function applyAppIcon(iconId) {
  const iconConfig =
    OFFICIAL_LOCKET_ICONS.find((i) => i.id === iconId) || OFFICIAL_LOCKET_ICONS[0];

  // 1. Cập nhật apple-touch-icon cho iOS
  let appleTouch = document.querySelector('link[rel="apple-touch-icon"]');
  if (!appleTouch) {
    appleTouch = document.createElement("link");
    appleTouch.rel = "apple-touch-icon";
    document.head.appendChild(appleTouch);
  }
  appleTouch.href = iconConfig.file;

  // 2. Cập nhật favicon cho trình duyệt
  let favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.href = iconConfig.file;
  }

  // 3. Lưu vào localStorage
  try {
    localStorage.setItem("app_selected_icon", iconId);
  } catch (e) {}
  return iconConfig;
}

/**
 * Khởi tạo icon từ localStorage khi trang load
 */
export function initAppIcon() {
  let savedIconId = "gold_on_black";
  try {
    savedIconId = localStorage.getItem("app_selected_icon") || "gold_on_black";
  } catch (e) {}
  return applyAppIcon(savedIconId);
}
