import React, { useState, useEffect, useMemo } from "react";
import {
  OFFICIAL_LOCKET_ICONS,
  LOCKET_GOLD_CATEGORIES,
  applyAppIcon,
} from "@/utils/appIconUtils";
import { Sparkles, Check, Smartphone, Share, Plus } from "lucide-react";
import { showToast } from "@/components/Toast";

export default function AppIconPicker() {
  const [selectedIconId, setSelectedIconId] = useState("gold_on_black");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("app_selected_icon") || "gold_on_black";
    setSelectedIconId(saved);
  }, []);

  const handleSelectIcon = (icon) => {
    setSelectedIconId(icon.id);
    applyAppIcon(icon.id);
    showToast(
      "success",
      `Đã chọn icon "${icon.name}"! Mở menu trình duyệt và nhấn 'Thêm vào MH chính' để lưu icon này.`
    );
  };

  const currentIcon = useMemo(() => {
    return (
      OFFICIAL_LOCKET_ICONS.find((i) => i.id === selectedIconId) ||
      OFFICIAL_LOCKET_ICONS[0]
    );
  }, [selectedIconId]);

  const filteredIcons = useMemo(() => {
    if (selectedCategory === "all") return OFFICIAL_LOCKET_ICONS;
    return OFFICIAL_LOCKET_ICONS.filter((i) => i.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="bg-base-100 rounded-3xl p-5 md:p-8 shadow-xl border border-base-300">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-base-300">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400 px-3 py-0.5 rounded-full">
              Locket Gold App Icons ({OFFICIAL_LOCKET_ICONS.length} Mẫu)
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-base-content">
            Bộ Sưu Tập Icon Locket Gold
          </h2>
          <p className="text-sm text-base-content/70 mt-1">
            Chọn bất kỳ mẫu icon Locket Gold chính thức nào bạn thích để làm biểu tượng trên màn hình chính điện thoại.
          </p>
        </div>

        {/* Live Preview of Selected Icon */}
        <div className="flex items-center gap-3.5 bg-base-200/90 p-3.5 rounded-2xl border border-base-300 self-stretch sm:self-auto justify-center shadow-inner">
          <div className="relative">
            <img
              src={currentIcon.file}
              alt={currentIcon.name}
              className="w-16 h-16 rounded-2xl shadow-xl object-cover ring-2 ring-amber-400 transform hover:scale-105 transition-transform"
              draggable="false"
              onError={(e) => {
                if (!e.currentTarget.dataset.retried) {
                  e.currentTarget.dataset.retried = "1";
                  e.currentTarget.src = `${currentIcon.file}?v=${Date.now()}`;
                }
              }}
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-md">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-[11px] text-base-content/60 block font-medium">
              Icon đang sử dụng:
            </span>
            <span className="text-sm font-bold text-base-content block">
              {currentIcon.name}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded">
              {currentIcon.tag}
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`btn btn-sm rounded-xl transition-all ${
            selectedCategory === "all"
              ? "btn-primary shadow-md font-bold"
              : "btn-ghost bg-base-200"
          }`}
        >
          Tất cả ({OFFICIAL_LOCKET_ICONS.length})
        </button>
        {LOCKET_GOLD_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`btn btn-sm rounded-xl transition-all ${
              selectedCategory === cat.id
                ? "btn-primary shadow-md font-bold"
                : "btn-ghost bg-base-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Icon Grid Selector */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3.5 sm:gap-4 mb-8">
        {filteredIcons.map((icon) => {
          const isSelected = icon.id === selectedIconId;
          return (
            <div
              key={icon.id}
              onClick={() => handleSelectIcon(icon)}
              className={`relative bg-base-200/70 hover:bg-base-200 p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center group ${
                isSelected
                  ? "border-amber-500 shadow-xl bg-amber-500/10 scale-105 ring-2 ring-amber-400/50"
                  : "border-base-300 hover:border-base-content/30"
              }`}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 bg-amber-500 text-white rounded-full p-1 shadow-md z-10">
                  <Check className="w-3 h-3" />
                </div>
              )}

              {/* Icon Visual */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl shadow-md overflow-hidden mb-2 group-hover:scale-110 transition-transform duration-300 bg-black/5">
                <img
                  src={icon.file}
                  alt={icon.name}
                  className="w-full h-full object-cover"
                  draggable="false"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.retried) {
                      e.currentTarget.dataset.retried = "1";
                      e.currentTarget.src = `${icon.file}?v=${Date.now()}`;
                    }
                  }}
                />
              </div>

              <h4 className="text-xs font-bold text-base-content line-clamp-1">
                {icon.name}
              </h4>
              <span className="text-[9px] text-base-content/50 mt-0.5">
                {icon.tag}
              </span>
            </div>
          );
        })}
      </div>

      {/* How-to Guide Tip */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-base-content">
              Cách áp dụng icon đã chọn ra màn hình chính:
            </h4>
            <p className="text-xs text-base-content/70 mt-0.5 leading-relaxed">
              1. Bấm vào chiếc icon bạn muốn ở trên.
              <br />
              2. Mở menu trình duyệt (nút <strong>Chia sẻ <Share className="w-3.5 h-3.5 inline text-blue-500" /> trên Safari iOS</strong> hoặc <strong>⋮ trên Chrome Android</strong>) ➔ Chọn <strong>"Thêm vào Màn hình chính" <Plus className="w-3.5 h-3.5 inline text-green-500" /></strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
