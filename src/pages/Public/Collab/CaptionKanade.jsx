import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Copy, Check, Palette, ArrowRight, Heart, Star, Flame, Smile, Music, Quote } from "lucide-react";
import { showToast } from "@/components/Toast";

const CAPTION_CATEGORIES = [
  { id: "love", label: "Tình Yêu ❤️", icon: Heart },
  { id: "chill", label: "Chill & Vibe ☕", icon: Music },
  { id: "mood", label: "Tâm Trạng 🌧️", icon: Quote },
  { id: "funny", label: "Hài Hước 😂", icon: Smile },
  { id: "aesthetic", label: "Aesthetic ✨", icon: Sparkles },
  { id: "anime", label: "Anime & Quote 🌸", icon: Star },
];

const SAMPLE_CAPTIONS = {
  love: [
    { text: "U are my sweetest habit 🍯", icon: "❤️", theme: "pink" },
    { text: "Em là điều dịu dàng nhất hôm nay 🌷", icon: "✨", theme: "love" },
    { text: "Yêu người là việc cả đời 💌", icon: "💖", theme: "gradient" },
    { text: "Somewhere between you & me 🪐", icon: "💫", theme: "sunset" },
  ],
  chill: [
    { text: "Một ngày trôi qua thật bình yên ☕", icon: "🌿", theme: "emerald" },
    { text: "Hít một hơi thật sâu và mỉm cười ⛅", icon: "🍃", theme: "pastel" },
    { text: "Chậm lại một chút để yêu bản thân 🎧", icon: "☁️", theme: "lofi" },
    { text: "Every little thing is gonna be alright 🎵", icon: "🌻", theme: "bumblebee" },
  ],
  mood: [
    { text: "Có những ngày lòng trĩu hạt mưa 🌧️", icon: "💧", theme: "dark" },
    { text: "Đôi khi im lặng là câu trả lời tốt nhất 🌑", icon: "🖤", theme: "synthwave" },
    { text: "Người qua đường hay người từng thương? 🍂", icon: "🥀", theme: "autumn" },
    { text: "Vạn vật đều có vết nứt, đó là nơi ánh sáng đi vào 🕯️", icon: "🌌", theme: "forest" },
  ],
  funny: [
    { text: "Đẹp trai không bằng chai mặt 😎", icon: "🔥", theme: "acid" },
    { text: "Nghèo nhưng sang chảnh 💸", icon: "💅", theme: "luxury" },
    { text: "Ăn không mập, ngủ không mơ 🍕", icon: "🍔", theme: "cupcake" },
    { text: "Lạc quan giữa dòng đời bão tố 🚀", icon: "⚡", theme: "dracula" },
  ],
  aesthetic: [
    { text: "aesthetic vibes only 🎞️", icon: "✨", theme: "valentine" },
    { text: "sunset lover & golden hour 🌅", icon: "🌇", theme: "autumn" },
    { text: "living in a 90s polaroid film 📸", icon: "📽️", theme: "retro" },
    { text: "stargazing with my favorite soul 🌌", icon: "🌙", theme: "night" },
  ],
  anime: [
    { text: "Tương lai thuộc về những ai tin vào giấc mơ 🌸", icon: "⛩️", theme: "fantasy" },
    { text: "Cố lên, ngày mai trời lại sáng thôi! 🎏", icon: "🍡", theme: "pastel" },
    { text: "Watashi no locket moment 🍥", icon: "🍙", theme: "cupcake" },
  ],
};

export default function CaptionKanadePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("love");
  const [customCaption, setCustomCaption] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("❤️");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    showToast("success", "Đã sao chép caption!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleUseInLocket = (text, icon) => {
    // Chuyển hướng sang trang camera hoặc post moments với caption
    navigate("/postmoments", { state: { caption: text, icon } });
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-4 md:p-8">
      {/* Banner */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-7 h-7 text-yellow-300 animate-spin" />
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                Collab x Kanade
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Kho Caption Nghệ Thuật Kanade
            </h1>
            <p className="mt-2 text-white/90 text-sm md:text-base max-w-xl">
              Tuyển tập những mẫu caption độc đáo, sáng tạo nhất kết hợp giữa Locket Xwuan và Kanade để trang trí khoảnh khắc của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-wrap gap-2 justify-center">
        {CAPTION_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn btn-sm md:btn-md rounded-2xl transition-all ${
                isActive ? "btn-primary shadow-lg scale-105" : "btn-outline bg-base-100"
              }`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Captions Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {(SAMPLE_CAPTIONS[selectedCategory] || []).map((item, idx) => (
          <div
            key={idx}
            className="bg-base-100 p-5 rounded-3xl shadow-sm border border-base-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl p-2 bg-base-200 rounded-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-base font-bold text-base-content leading-relaxed">{item.text}</p>
                <span className="text-xs text-base-content/50 mt-1 inline-block">Mẫu: {item.theme}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-200">
              <button
                onClick={() => handleCopy(`${item.icon} ${item.text}`, idx)}
                className="btn btn-sm btn-ghost rounded-xl"
              >
                {copiedIndex === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                Sao chép
              </button>
              <button
                onClick={() => handleUseInLocket(item.text, item.icon)}
                className="btn btn-sm btn-primary rounded-xl"
              >
                Dùng ngay <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Studio Box */}
      <div className="max-w-5xl mx-auto bg-base-100 p-6 md:p-8 rounded-3xl shadow-lg border border-base-300">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" /> Tự tạo Caption của bạn
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nhập caption của bạn tại đây..."
            value={customCaption}
            onChange={(e) => setCustomCaption(e.target.value)}
            className="input input-bordered flex-1 rounded-2xl text-base"
          />
          <button
            onClick={() => {
              if (!customCaption) return showToast("error", "Vui lòng nhập caption!");
              handleUseInLocket(customCaption, selectedIcon);
            }}
            className="btn btn-primary rounded-2xl px-6"
          >
            Áp dụng vào Locket
          </button>
        </div>
      </div>
    </div>
  );
}
