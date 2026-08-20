import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Clock,
  CloudSun,
  Music,
  Camera,
  Gift,
  Palette,
  Search,
  Link2,
  Check,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  Flame,
  Layers,
} from "lucide-react";
import { showToast } from "@/components/Toast";
import { useLocationWeather } from "@/utils/enviroment/weather";
import { TRENDING_GIF_CATEGORIES, searchGiphy } from "@/utils/gifUtils";
import LoadingRing from "@/components/ui/Loading/ring";

// 1. Các danh mục Caption
export const CAPTION_TABS = [
  { id: "widgets", label: "Tiện Ích Động ⚡", icon: Clock },
  { id: "spotify", label: "Spotify 🎵", icon: Music },
  { id: "weather", label: "Thời Tiết 🌤️", icon: CloudSun },
  { id: "moments", label: "Số Lockets 📸", icon: Camera },
  { id: "holidays", label: "Lễ Hội & Sự Kiện 🎆", icon: Gift },
  { id: "gif", label: "Giphy & Tenor GIF ✨", icon: Sparkles },
  { id: "custom", label: "Tự Tạo Màu 🎨", icon: Palette },
];

// 2. Mẫu Preset Gradient
export const GRADIENT_PALETTES = [
  { name: "Gold VIP 👑", top: "#FFDF00", bottom: "#FF8C00", text: "#000000" },
  { name: "Obsidian Black 🖤", top: "#18181B", bottom: "#09090B", text: "#FFFFFF" },
  { name: "Neon Cyberpunk 💜", top: "#8A2387", bottom: "#E94057", text: "#FFFFFF" },
  { name: "Sakura Pink 🌸", top: "#FF9A8B", bottom: "#FF6A88", text: "#FFFFFF" },
  { name: "Ocean Breeze 🌊", top: "#2193B0", bottom: "#6DD5ED", text: "#FFFFFF" },
  { name: "Sunset Flame 🔥", top: "#F83600", bottom: "#FE8C00", text: "#FFFFFF" },
  { name: "Emerald Mint 🌿", top: "#0BA360", bottom: "#3CBA92", text: "#FFFFFF" },
  { name: "Aurora Northern 🌌", top: "#4A00E0", bottom: "#8E2DE2", text: "#FFFFFF" },
  { name: "Candy Sweet 🍬", top: "#FF758C", bottom: "#FF7EB3", text: "#FFFFFF" },
  { name: "Retro Violet 🔮", top: "#654EA3", bottom: "#EAAFC8", text: "#FFFFFF" },
];

export default function SmartCaptionStudio({ onApplyCaption }) {
  const [activeTab, setActiveTab] = useState("widgets");
  const { weather } = useLocationWeather();

  // Live time
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // GIF Search & Live picker state
  const [gifSearchQuery, setGifSearchQuery] = useState("");
  const [gifDirectUrl, setGifDirectUrl] = useState("");
  const [gifSearchResults, setGifSearchResults] = useState([]);
  const [gifSearching, setGifSearching] = useState(false);
  const [selectedGifCategory, setSelectedGifCategory] = useState("love");
  const [gifMode, setGifMode] = useState("icon"); // 'icon' | 'background'
  const [gifCaptionText, setGifCaptionText] = useState("Vibing with Locket ✨");

  // Customizer state
  const [customText, setCustomText] = useState("");
  const [customIcon, setCustomIcon] = useState("✨");
  const [customTopColor, setCustomTopColor] = useState("#FF8C00");
  const [customBottomColor, setCustomBottomColor] = useState("#FFDF00");
  const [customTextColor, setCustomTextColor] = useState("#FFFFFF");

  // Tìm kiếm GIF từ Giphy / Tenor
  const handleSearchGif = async (e) => {
    if (e) e.preventDefault();
    if (!gifSearchQuery.trim()) return;

    setGifSearching(true);
    try {
      const results = await searchGiphy(gifSearchQuery.trim());
      setGifSearchResults(results);
      if (results.length === 0) {
        showToast("info", "Không tìm thấy GIF, đang hiển thị các mẫu gợi ý.");
      }
    } catch {
      showToast("error", "Lỗi tìm kiếm GIF");
    } finally {
      setGifSearching(false);
    }
  };

  const handleSelect = (captionData) => {
    if (onApplyCaption) {
      onApplyCaption(captionData);
    }
    showToast("success", `Đã chọn caption: "${captionData.caption || captionData.text}"`);
  };

  return (
    <div className="bg-base-100 rounded-3xl p-5 md:p-6 shadow-xl border border-base-300 space-y-5">
      {/* Title */}
      <div className="flex justify-between items-center pb-3 border-b border-base-300">
        <div>
          <h3 className="text-xl font-extrabold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            Locket Smart Caption Studio
          </h3>
          <p className="text-xs text-base-content/60 mt-0.5">
            Tuyển tập widget động, Spotify, Giờ, Thời tiết, Lễ hội và Giphy/Tenor GIF
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CAPTION_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm rounded-xl flex-shrink-0 transition-all ${
                isActive ? "btn-primary shadow-md font-bold" : "btn-ghost bg-base-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5 mr-1" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area according to Tab */}
      <div className="min-h-[220px]">
        {/* 1. Tiện ích động (Time, Date, Day) */}
        {activeTab === "widgets" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: "🕒",
                caption: `Bây giờ là ${currentTime}`,
                top: "#2C3E50",
                bottom: "#000000",
                text: "#FFFFFF",
              },
              {
                icon: "🌙",
                caption: `23:59 • Đêm muộn`,
                top: "#0F2027",
                bottom: "#203A43",
                text: "#00FFFF",
              },
              {
                icon: "🌅",
                caption: `06:00 • Đón bình minh`,
                top: "#FF512F",
                bottom: "#F09819",
                text: "#FFFFFF",
              },
              {
                icon: "📅",
                caption: `Thứ ${new Date().getDay() + 1 || "Chủ Nhật"} rạng rỡ`,
                top: "#11998E",
                bottom: "#38EF7D",
                text: "#FFFFFF",
              },
              {
                icon: "🔋",
                caption: `Nạp 100% năng lượng`,
                top: "#00C9FF",
                bottom: "#92FE9D",
                text: "#000000",
              },
              {
                icon: "📍",
                caption: `Check-in khoảnh khắc đẹp`,
                top: "#8E2DE2",
                bottom: "#4A00E0",
                text: "#FFFFFF",
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                className="p-3.5 rounded-2xl flex items-center justify-between text-left shadow-sm hover:scale-102 transition-transform cursor-pointer border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${item.top}, ${item.bottom})`,
                  color: item.text,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-sm">{item.caption}</span>
                </div>
                <span className="text-xs opacity-70 bg-white/20 px-2 py-0.5 rounded-full">Chọn</span>
              </button>
            ))}
          </div>
        )}

        {/* 2. Spotify / Music */}
        {activeTab === "spotify" && (
          <div className="space-y-3">
            <p className="text-xs text-base-content/70">
              Hiển thị badge bài hát bạn đang nghe như trên Spotify:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: "🟢",
                  caption: "Spotify • Nơi Này Có Anh 🎧",
                  top: "#1DB954",
                  bottom: "#191414",
                  text: "#FFFFFF",
                },
                {
                  icon: "🎵",
                  caption: "Spotify • Chúng Ta Của Hiện Tại",
                  top: "#1ED760",
                  bottom: "#121212",
                  text: "#FFFFFF",
                },
                {
                  icon: "🎧",
                  caption: "Spotify • Lofi Chill & Sleep ☕",
                  top: "#53346B",
                  bottom: "#000000",
                  text: "#FFFFFF",
                },
                {
                  icon: "🎶",
                  caption: "Spotify • Từng Quen - Wren Evans",
                  top: "#FF416C",
                  bottom: "#191414",
                  text: "#FFFFFF",
                },
                {
                  icon: "📻",
                  caption: "Spotify • Nhạc Không Lời Thư Giãn",
                  top: "#3A6073",
                  bottom: "#16222A",
                  text: "#FFFFFF",
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="p-3.5 rounded-2xl flex items-center justify-between text-left shadow-sm hover:scale-102 transition-transform cursor-pointer border border-white/20"
                  style={{
                    background: `linear-gradient(135deg, ${item.top}, ${item.bottom})`,
                    color: item.text,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-bold text-xs sm:text-sm">{item.caption}</span>
                  </div>
                  <span className="text-[10px] opacity-80 bg-black/40 px-2 py-0.5 rounded-full">
                    Dùng ngay
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Thời Tiết */}
        {activeTab === "weather" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: "☀️",
                caption: `${weather?.temp_c ? Math.round(weather.temp_c) + "°C" : "30°C"} • Trời Nắng Đẹp`,
                top: "#F3904F",
                bottom: "#3B4371",
                text: "#FFFFFF",
              },
              {
                icon: "🌧️",
                caption: `${weather?.temp_c ? Math.round(weather.temp_c) + "°C" : "24°C"} • Mưa Rào Mát Rượi`,
                top: "#3A7BD5",
                bottom: "#3A6073",
                text: "#FFFFFF",
              },
              {
                icon: "⛅",
                caption: "Trời Nhiều Mây & Gió Nhẹ 🍃",
                top: "#56CCF2",
                bottom: "#2F80ED",
                text: "#FFFFFF",
              },
              {
                icon: "❄️",
                caption: "18°C • Se Lạnh Đầu Đông 🧣",
                top: "#E0EAFC",
                bottom: "#CFDEF3",
                text: "#1E3C72",
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                className="p-3.5 rounded-2xl flex items-center justify-between text-left shadow-sm hover:scale-102 transition-transform cursor-pointer border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${item.top}, ${item.bottom})`,
                  color: item.text,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-sm">{item.caption}</span>
                </div>
                <span className="text-xs opacity-70 bg-white/20 px-2 py-0.5 rounded-full">Áp dụng</span>
              </button>
            ))}
          </div>
        )}

        {/* 4. Số Khoảnh Khắc Lockets */}
        {activeTab === "moments" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: "💖",
                caption: "Khoảnh khắc đầu tiên #1",
                top: "#FF758C",
                bottom: "#FF7EB3",
                text: "#FFFFFF",
              },
              {
                icon: "🎉",
                caption: "Locket Moment #100 ✨",
                top: "#FFD700",
                bottom: "#FF8C00",
                text: "#000000",
              },
              {
                icon: "🌟",
                caption: "Khoảnh khắc thứ #500",
                top: "#8A2387",
                bottom: "#E94057",
                text: "#FFFFFF",
              },
              {
                icon: "👑",
                caption: "Locket Master #1000",
                top: "#141E30",
                bottom: "#243B55",
                text: "#FFD700",
              },
              {
                icon: "🔥",
                caption: "Chuỗi 365 Ngày Streak",
                top: "#FF416C",
                bottom: "#FF4B2B",
                text: "#FFFFFF",
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                className="p-3.5 rounded-2xl flex items-center justify-between text-left shadow-sm hover:scale-102 transition-transform cursor-pointer border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${item.top}, ${item.bottom})`,
                  color: item.text,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-sm">{item.caption}</span>
                </div>
                <span className="text-xs opacity-70 bg-white/20 px-2 py-0.5 rounded-full">Dùng</span>
              </button>
            ))}
          </div>
        )}

        {/* 5. Lễ Hội & Holidays */}
        {activeTab === "holidays" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: "🧧",
                caption: "Chúc Mừng Năm Mới 2026 🎆",
                top: "#D31027",
                bottom: "#EA384D",
                text: "#FFD700",
              },
              {
                icon: "🎄",
                caption: "Merry Christmas 2026 ❄️",
                top: "#0F9B0F",
                bottom: "#000000",
                text: "#FFFFFF",
              },
              {
                icon: "💌",
                caption: "Happy Valentine's Day 🌹",
                top: "#FF4E50",
                bottom: "#F9D423",
                text: "#FFFFFF",
              },
              {
                icon: "🎃",
                caption: "Spooky Halloween Night 👻",
                top: "#FF8008",
                bottom: "#111111",
                text: "#FFFFFF",
              },
              {
                icon: "🎂",
                caption: "Happy Birthday to Me 🎉",
                top: "#F857A6",
                bottom: "#FF5858",
                text: "#FFFFFF",
              },
              {
                icon: "🏮",
                caption: "Tết Trung Thu Rằm Tháng 8 🌕",
                top: "#F7971E",
                bottom: "#FFD200",
                text: "#000000",
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                className="p-3.5 rounded-2xl flex items-center justify-between text-left shadow-sm hover:scale-102 transition-transform cursor-pointer border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${item.top}, ${item.bottom})`,
                  color: item.text,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-sm">{item.caption}</span>
                </div>
                <span className="text-xs opacity-70 bg-white/20 px-2 py-0.5 rounded-full">Chọn</span>
              </button>
            ))}
          </div>
        )}

        {/* 6. GIPHY & TENOR LIVE GIF PICKER */}
        {activeTab === "gif" && (
          <div className="space-y-4">
            {/* Search and Direct URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <form onSubmit={handleSearchGif} className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Tìm GIF trên Giphy/Tenor (vd: cat, love, meme, anime...)"
                  value={gifSearchQuery}
                  onChange={(e) => setGifSearchQuery(e.target.value)}
                  className="input input-sm input-bordered w-full pl-9 pr-20 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  disabled={gifSearching || !gifSearchQuery.trim()}
                  className="btn btn-xs btn-primary rounded-lg absolute right-1.5 top-1.5"
                >
                  {gifSearching ? <LoadingRing size={12} color="white" /> : "Tìm GIF"}
                </button>
              </form>

              {/* Direct GIF URL Input */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Hoặc dán link GIF trực tiếp (https://...*.gif)"
                  value={gifDirectUrl}
                  onChange={(e) => setGifDirectUrl(e.target.value)}
                  className="input input-sm input-bordered flex-1 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!gifDirectUrl.trim()) return showToast("error", "Vui lòng nhập link GIF!");
                    handleSelect({
                      icon: gifDirectUrl.trim(),
                      isGif: true,
                      caption: gifCaptionText,
                      top: "#18181B",
                      bottom: "#000000",
                      text: "#FFFFFF",
                    });
                  }}
                  className="btn btn-xs btn-secondary rounded-lg font-bold"
                >
                  Dùng link
                </button>
              </div>
            </div>

            {/* GIF Category Filters */}
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(TRENDING_GIF_CATEGORIES).map((catKey) => {
                const isSelected = selectedGifCategory === catKey && !gifSearchResults.length;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      setSelectedGifCategory(catKey);
                      setGifSearchResults([]);
                    }}
                    className={`btn btn-xs rounded-xl ${
                      isSelected ? "btn-primary font-bold shadow-xs" : "btn-ghost bg-base-200"
                    }`}
                  >
                    {TRENDING_GIF_CATEGORIES[catKey].label}
                  </button>
                );
              })}
            </div>

            {/* Caption Text input for GIF */}
            <div className="flex gap-2 items-center bg-base-200/50 p-2.5 rounded-xl">
              <span className="text-xs font-bold whitespace-nowrap">Chữ kèm GIF:</span>
              <input
                type="text"
                placeholder="Nhập nội dung hiển thị cùng GIF..."
                value={gifCaptionText}
                onChange={(e) => setGifCaptionText(e.target.value)}
                className="input input-xs input-bordered flex-1 rounded-lg"
              />
            </div>

            {/* GIF Grid Display */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-1">
              {(gifSearchResults.length > 0
                ? gifSearchResults
                : TRENDING_GIF_CATEGORIES[selectedGifCategory]?.items || []
              ).map((gif) => (
                <div
                  key={gif.id}
                  onClick={() =>
                    handleSelect({
                      icon: gif.url,
                      isGif: true,
                      caption: gifCaptionText || gif.name,
                      top: "#18181B",
                      bottom: "#09090B",
                      text: "#FFFFFF",
                    })
                  }
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-black/10 border border-base-300 hover:border-primary cursor-pointer hover:scale-105 transition-all shadow-xs"
                >
                  <img
                    src={gif.preview || gif.url}
                    alt={gif.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold bg-primary/80 px-2 py-0.5 rounded-full">
                      Dùng GIF
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Tự Tạo Màu & Gradient */}
        {activeTab === "custom" && (
          <div className="space-y-4 bg-base-200/50 p-4 rounded-2xl border border-base-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1">Nội dung Caption</label>
                <input
                  type="text"
                  placeholder="Nhập caption của bạn..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="input input-bordered input-sm w-full rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Icon / Emoji</label>
                <input
                  type="text"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  className="input input-bordered input-sm w-full rounded-xl text-center"
                />
              </div>
            </div>

            {/* Gradient Preset Palette Selection */}
            <div>
              <label className="block text-xs font-bold mb-1.5">Chọn mẫu màu Gradient</label>
              <div className="flex flex-wrap gap-2">
                {GRADIENT_PALETTES.map((pal, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setCustomTopColor(pal.top);
                      setCustomBottomColor(pal.bottom);
                      setCustomTextColor(pal.text);
                    }}
                    className="cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:scale-105 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${pal.top}, ${pal.bottom})`,
                      color: pal.text,
                    }}
                  >
                    {pal.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Preview */}
            <div className="pt-2">
              <label className="block text-xs font-bold mb-1.5">Xem trước Caption của bạn:</label>
              <div
                className="p-3 rounded-2xl text-center font-bold text-sm shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${customTopColor}, ${customBottomColor})`,
                  color: customTextColor,
                }}
              >
                {customIcon} {customText || "Nhập caption để xem trước..."}
              </div>
            </div>

            <button
              onClick={() => {
                if (!customText.trim()) return showToast("error", "Vui lòng nhập nội dung caption!");
                handleSelect({
                  icon: customIcon,
                  caption: customText.trim(),
                  top: customTopColor,
                  bottom: customBottomColor,
                  text: customTextColor,
                });
              }}
              className="btn btn-primary btn-sm w-full rounded-xl font-bold"
            >
              Áp dụng Caption Tự Tạo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
