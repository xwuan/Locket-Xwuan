import React, { useState, useEffect } from "react";
import { showError, showSuccess, showToast } from "@/components/Toast";
import { CONFIG } from "@/config";
import SmartCaptionStudio from "@/components/common/SmartCaptionStudio/SmartCaptionStudio";
import { Sparkles, Trash2, Plus } from "lucide-react";

export default function ManageCaption() {
  const [captionId, setCaptionId] = useState("");
  const [captions, setCaptions] = useState([]);

  // Load captions từ localStorage khi component mount
  useEffect(() => {
    const storedCaptions = localStorage.getItem("Yourcaptions");
    if (storedCaptions) {
      try {
        setCaptions(JSON.parse(storedCaptions));
      } catch (e) {
        console.error("Lỗi parse captions từ localStorage:", e);
      }
    }
  }, []);

  const handleApplyCaptionFromStudio = (captionData) => {
    const newCaption = {
      id: "cap_" + Date.now(),
      text: captionData.caption || captionData.text,
      colortop: captionData.top,
      colorbottom: captionData.bottom,
      color_text: captionData.text_color || "#FFFFFF",
      icon_url: captionData.icon,
      type: captionData.isGif ? "image_gif" : "custom",
    };

    const updated = [newCaption, ...captions];
    setCaptions(updated);
    localStorage.setItem("Yourcaptions", JSON.stringify(updated));
    showSuccess("Đã lưu caption mới vào bộ sưu tập của bạn!");
  };

  // Xóa caption theo ID
  const handleDelete = (id) => {
    const updatedCaptions = captions.filter((c) => c.id !== id);
    setCaptions(updatedCaptions);
    localStorage.setItem("Yourcaptions", JSON.stringify(updatedCaptions));
    showSuccess("Xoá caption thành công");
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen bg-base-200 space-y-8">
      {/* Tiêu đề */}
      <div className="bg-base-100 rounded-3xl p-6 shadow-md border border-base-300">
        <h1 className="text-3xl font-extrabold text-base-content mb-2 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-primary" /> Quản Lý & Kho Caption Locket
        </h1>
        <p className="text-sm text-base-content/70">
          Khám phá bộ sưu tập tiện ích caption mới nhất: Giờ, Spotify, Thời tiết, Số khoảnh khắc, Lễ hội và Sticker GIF.
        </p>
      </div>

      {/* Smart Caption Studio Component */}
      <SmartCaptionStudio onApplyCaption={handleApplyCaptionFromStudio} />

      {/* Danh sách caption đã lưu */}
      <div className="bg-base-100 rounded-3xl p-6 shadow-md border border-base-300">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          📌 Caption đã lưu của bạn ({captions.length})
        </h2>

        {captions.length === 0 ? (
          <div className="text-center py-8 text-sm text-base-content/50 border border-dashed border-base-300 rounded-2xl p-6">
            <p>Chưa có caption nào được lưu vào danh sách cá nhân.</p>
            <p className="text-xs mt-1">Hãy chọn các mẫu caption ở Studio phía trên để lưu và dùng nhanh.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {captions.map((preset) => (
              <div key={preset.id} className="relative flex flex-col items-center">
                {/* Nút xoá */}
                <button
                  onClick={() => handleDelete(preset.id)}
                  className="absolute -top-2 -right-2 bg-error text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow-md hover:scale-110 transition z-10"
                >
                  ✕
                </button>

                {/* Nút chọn caption */}
                <button
                  className="flex flex-col whitespace-nowrap items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center shadow-md hover:shadow-lg transition"
                  style={{
                    background: `linear-gradient(to bottom, ${preset.colortop}, ${preset.colorbottom})`,
                    color: preset.color_text || "#fff",
                  }}
                >
                  <span className="text-sm sm:text-base flex items-center gap-2">
                    {preset.type === "image_gif" ? (
                      <img src={preset.icon_url} alt="icon" className="w-6 h-6 rounded-md object-contain" />
                    ) : (
                      <span>{preset.icon_url}</span>
                    )}
                    {preset.text}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
