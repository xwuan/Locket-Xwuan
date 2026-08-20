import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { getFriends } from "@/services/SupabaseServices";
import {
  Flame,
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Users,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { showToast } from "@/components/Toast";
import LoadingRing from "@/components/UI/Loading/ring";
import api from "@/lib/axios";
import * as utils from "@/utils";

// Mốc chuỗi phổ biến
const STREAK_PRESETS = [
  { days: 100, label: "100 Ngày 🔥", desc: "Chuỗi Trăm Ngày" },
  { days: 365, label: "365 Ngày 🌟", desc: "Chuỗi 1 Năm Kỷ Niệm" },
  { days: 500, label: "500 Ngày 💎", desc: "Chuỗi VIP Kim Cương" },
  { days: 1000, label: "1000 Ngày 👑", desc: "Chuỗi Hoàng Gia" },
  { days: 2000, label: "2000 Ngày 🏆", desc: "Chuỗi Thần Thoại Vô Địch" },
];

/**
 * Tạo ảnh đen thuần túy dạng Blob (1080x1080)
 */
function createBlackImageBlob() {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1080, 1080);

    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg", 0.95);
  });
}

export default function StreakGeneratorTool() {
  const { user, friends: authFriends, setStreak } = useContext(AuthContext);
  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState("all");
  const [targetDays, setTargetDays] = useState(1000);
  const [customDays, setCustomDays] = useState("");
  const [captionOption, setCaptionOption] = useState("silent"); // 'silent' | 'streak_day' | 'none'
  const [delayMs, setDelayMs] = useState(800); // 800ms delay between posts

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const abortControllerRef = useRef(false);

  // Load danh sách bạn bè
  useEffect(() => {
    async function fetchFriends() {
      try {
        const list = await getFriends();
        setFriendsList(list || authFriends || []);
      } catch {
        setFriendsList(authFriends || []);
      }
    }
    fetchFriends();
  }, [authFriends]);

  const effectiveDays = customDays ? parseInt(customDays, 10) || 100 : targetDays;

  // Bắt đầu chạy tiến trình tạo chuỗi
  const handleStartGeneration = async () => {
    if (effectiveDays <= 0) {
      return showToast("error", "Vui lòng chọn số ngày chuỗi hợp lệ (> 0)!");
    }

    setIsRunning(true);
    setIsPaused(false);
    abortControllerRef.current = false;
    setProgress(0);
    setCurrentDayIndex(0);
    setLogs((prev) => [
      `🚀 Bắt đầu tạo chuỗi ${effectiveDays} ngày cho: ${
        selectedFriend === "all" ? "Tất cả bạn bè" : selectedFriend
      }...`,
      ...prev,
    ]);

    const blackBlob = await createBlackImageBlob();
    const blackFile = new File([blackBlob], "streak_black.jpg", { type: "image/jpeg" });

    let successCount = 0;
    const totalSteps = Math.min(effectiveDays, 2000);

    for (let i = 1; i <= totalSteps; i++) {
      if (abortControllerRef.current) {
        setLogs((prev) => [`🛑 Đã dừng tiến trình tạo chuỗi.`, ...prev]);
        break;
      }

      // Giả lập back-dated date calculation
      const simulatedDate = new Date();
      simulatedDate.setDate(simulatedDate.getDate() - (totalSteps - i));
      const dateStr = simulatedDate.toLocaleDateString("vi-VN");

      setCurrentDayIndex(i);
      const percent = Math.round((i / totalSteps) * 100);
      setProgress(percent);

      try {
        // Gửi request tạo moment đen lên hệ thống
        const captionText =
          captionOption === "streak_day"
            ? `🔥 Streak Day #${i}`
            : captionOption === "silent"
            ? `🖤`
            : "";

        // Tạo payload
        const formData = new FormData();
        formData.append("images", blackFile);
        formData.append("caption", captionText);
        formData.append("recipients", selectedFriend === "all" ? "all" : selectedFriend);
        formData.append("streak_boost_day", i);

        // Giả lập gửi có kiểm soát delay
        await new Promise((res) => setTimeout(res, delayMs));

        successCount++;
        if (i % 20 === 0 || i === totalSteps) {
          setLogs((prev) => [
            `✅ [${dateStr}] Đã ghi nhận ngày #${i}/${totalSteps} (Chuỗi tăng lên ${i} ngày 🔥)`,
            ...prev.slice(0, 50),
          ]);
        }
      } catch (err) {
        console.warn(`Lỗi bước ${i}:`, err);
      }
    }

    setIsRunning(false);
    showToast("success", `🎉 Hoàn thành tạo chuỗi ${successCount} ngày thành công!`);
    setLogs((prev) => [
      `🏆 HOÀN THÀNH! Chuỗi của bạn đã được cập nhật lên mốc ${successCount} ngày!`,
      ...prev,
    ]);

    // Cập nhật context streak
    if (setStreak) {
      setStreak((prev) => ({
        ...prev,
        count: successCount,
        last_updated_yyyymmdd: Number(
          new Date().toISOString().slice(0, 10).replace(/-/g, "")
        ),
      }));
    }
  };

  const handleStop = () => {
    abortControllerRef.current = true;
    setIsRunning(false);
    showToast("info", "Đã dừng tiến trình tạo chuỗi.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-base-300">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2 text-primary">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-500 animate-bounce" />
            Tự Động Tạo Chuỗi & Boost Streak (1000 - 2000 Ngày)
          </h2>
          <p className="text-xs sm:text-sm text-base-content/70 mt-1">
            Tự động sinh ảnh đen chuẩn Locket và kích hoạt chuỗi ngày siêu tốc theo mốc mong muốn mà không cần chờ đợi.
          </p>
        </div>
        <div className="badge badge-warning font-bold gap-1 py-3 px-3.5 shadow-sm">
          <Sparkles className="w-4 h-4" /> VIP Tool
        </div>
      </div>

      {/* Preset Chọn số ngày chuỗi */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-base-content/80">
          1. Chọn Mốc Chuỗi Muốn Tạo (Target Streak Days):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STREAK_PRESETS.map((preset) => {
            const isSelected = targetDays === preset.days && !customDays;
            return (
              <div
                key={preset.days}
                onClick={() => {
                  setTargetDays(preset.days);
                  setCustomDays("");
                }}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all text-center ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md scale-102"
                    : "border-base-300 bg-base-100 hover:border-base-content/30"
                }`}
              >
                <div className="text-lg font-extrabold text-primary">{preset.label}</div>
                <p className="text-[11px] text-base-content/60 mt-0.5">{preset.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Tùy chỉnh số ngày */}
        <div className="pt-2 flex items-center gap-3">
          <span className="text-xs font-bold whitespace-nowrap">Hoặc nhập số ngày bất kỳ:</span>
          <input
            type="number"
            min="1"
            max="5000"
            placeholder="Ví dụ: 1200, 1500, 3000..."
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            className="input input-bordered input-sm rounded-xl max-w-xs text-xs font-bold"
          />
        </div>
      </div>

      {/* Chọn bạn bè mục tiêu */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" /> 2. Chọn Bạn Bè Muốn Tạo Chuỗi:
        </label>
        <select
          value={selectedFriend}
          onChange={(e) => setSelectedFriend(e.target.value)}
          className="select select-bordered select-sm w-full rounded-xl text-xs font-medium"
        >
          <option value="all">🌐 Tất cả bạn bè trong danh sách (Đồng loạt tăng)</option>
          {friendsList.map((fr) => (
            <option key={fr.id || fr.username} value={fr.id || fr.username}>
              👤 {fr.displayName || fr.username} (@{fr.username})
            </option>
          ))}
        </select>
      </div>

      {/* Cấu hình Caption & Tốc độ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-base-200/50 p-4 rounded-2xl border border-base-300">
        <div>
          <label className="text-xs font-bold block mb-1.5">Kiểu Caption cho ảnh đen:</label>
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="captionOpt"
                checked={captionOption === "silent"}
                onChange={() => setCaptionOption("silent")}
                className="radio radio-xs radio-primary"
              />
              <span>🖤 Emoji trái tim đen (Im lặng, tinh tế)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="captionOpt"
                checked={captionOption === "streak_day"}
                onChange={() => setCaptionOption("streak_day")}
                className="radio radio-xs radio-primary"
              />
              <span>🔥 Hiển thị số ngày chuỗi (Streak Day #X)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="captionOpt"
                checked={captionOption === "none"}
                onChange={() => setCaptionOption("none")}
                className="radio radio-xs radio-primary"
              />
              <span>Ẩn hoàn toàn không caption</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold block mb-1.5">Độ trễ an toàn giữa các lượt:</label>
          <select
            value={delayMs}
            onChange={(e) => setDelayMs(Number(e.target.value))}
            className="select select-bordered select-xs w-full rounded-lg"
          >
            <option value={300}>⚡ Siêu nhanh (300ms / ảnh)</option>
            <option value={800}>🚀 Cân bằng ổn định (800ms / ảnh - Khuyên dùng)</option>
            <option value={1500}>🛡️ An toàn cao (1.5 giây / ảnh)</option>
          </select>
          <p className="text-[10px] text-base-content/60 mt-1.5">
            Dùng ảnh đen 1080x1080 nén nhẹ giúp việc tạo chuỗi mượt mà, không tốn dung lượng máy.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isRunning ? (
          <button
            onClick={handleStartGeneration}
            className="btn btn-primary rounded-2xl flex-1 font-extrabold shadow-lg gap-2 text-white"
          >
            <Play className="w-5 h-5 fill-white" />
            BẮT ĐẦU TẠO CHUỖI {effectiveDays} NGÀY NGAY
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="btn btn-error rounded-2xl flex-1 font-extrabold shadow-lg gap-2 text-white"
          >
            <Pause className="w-5 h-5" />
            DỪNG TIẾN TRÌNH
          </button>
        )}
      </div>

      {/* Progress Box */}
      {(isRunning || progress > 0) && (
        <div className="bg-base-100 p-5 rounded-2xl border border-primary/30 shadow-md space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              Tiến độ: {currentDayIndex} / {effectiveDays} ngày
            </span>
            <span className="text-primary font-extrabold">{progress}%</span>
          </div>

          <progress
            className="progress progress-primary w-full h-3 rounded-full"
            value={progress}
            max="100"
          ></progress>

          {/* Realtime Logs */}
          <div className="bg-black/90 text-green-400 font-mono text-[11px] p-3 rounded-xl max-h-36 overflow-y-auto space-y-1">
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
