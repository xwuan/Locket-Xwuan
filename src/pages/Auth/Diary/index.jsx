import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { getMoments } from "@/services/SupabaseServices";
import { Calendar, Download, Eye, Heart, Sparkles, Filter, Grid, List, Film, Image as ImageIcon, Search } from "lucide-react";
import LoadingRing from "@/components/ui/Loading/ring";
import { showToast } from "@/components/Toast";
import SpotifyPlayerBanner from "@/components/common/SpotifyPlayerBanner/SpotifyPlayerBanner";

export default function DiaryPage() {
  const { user } = useContext(AuthContext);
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'timeline'
  const [filterType, setFilterType] = useState("all"); // 'all' | 'image' | 'video'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    async function loadDiary() {
      setLoading(true);
      try {
        const data = await getMoments(200);
        setMoments(data || []);
      } catch (err) {
        console.error("Lỗi tải nhật ký:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDiary();
  }, []);

  // Lọc moments
  const filteredMoments = useMemo(() => {
    return moments.filter((m) => {
      // Lọc theo loại media
      if (filterType === "image" && m.media_type === "video") return false;
      if (filterType === "video" && m.media_type !== "video") return false;

      // Lọc theo search caption / author
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const cap = (m.caption || "").toLowerCase();
        const author = (m.user_name || "").toLowerCase();
        if (!cap.includes(term) && !author.includes(term)) return false;
      }

      // Lọc theo tháng
      if (selectedMonth !== "all") {
        const mDate = new Date(m.created_at || m.date);
        const monthKey = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, "0")}`;
        if (monthKey !== selectedMonth) return false;
      }

      return true;
    });
  }, [moments, filterType, searchTerm, selectedMonth]);

  // Danh sách các tháng có bài đăng
  const availableMonths = useMemo(() => {
    const monthsSet = new Set();
    moments.forEach((m) => {
      const d = new Date(m.created_at || m.date);
      if (!isNaN(d)) {
        monthsSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
      }
    });
    return Array.from(monthsSet).sort().reverse();
  }, [moments]);

  const handleDownload = async (url, filename = "locket-moment.jpg") => {
    try {
      showToast("info", "Đang tải xuống tệp...");
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      showToast("success", "Đã tải xuống thành công!");
    } catch (e) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-4 md:p-8">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-7 h-7 text-yellow-300 animate-pulse" />
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                Locket Memories
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Nhật Ký Khoảnh Khắc
            </h1>
            <p className="mt-2 text-white/90 text-sm md:text-base max-w-xl">
              Lưu giữ trọn vẹn từng khoảnh khắc, kỷ niệm và dòng thời gian chia sẻ cùng bạn bè trên Locket.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-center px-3 border-r border-white/20">
              <p className="text-xs text-white/70">Tổng Moments</p>
              <p className="text-2xl font-black">{moments.length}</p>
            </div>
            <div className="text-center px-3">
              <p className="text-xs text-white/70">Ảnh & Video</p>
              <p className="text-2xl font-black">
                {moments.filter((m) => m.media_type === "video").length} 🎥 / {moments.filter((m) => m.media_type !== "video").length} 🖼️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="max-w-6xl mx-auto bg-base-100 p-4 rounded-2xl shadow-md border border-base-300 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-base-content/50" />
          <input
            type="text"
            placeholder="Tìm kiếm caption hoặc người đăng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-9 rounded-xl text-sm"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type filter */}
          <div className="join">
            <button
              onClick={() => setFilterType("all")}
              className={`join-item btn btn-sm ${filterType === "all" ? "btn-primary" : "btn-ghost"}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType("image")}
              className={`join-item btn btn-sm ${filterType === "image" ? "btn-primary" : "btn-ghost"}`}
            >
              <ImageIcon className="w-3.5 h-3.5 mr-1" /> Ảnh
            </button>
            <button
              onClick={() => setFilterType("video")}
              className={`join-item btn btn-sm ${filterType === "video" ? "btn-primary" : "btn-ghost"}`}
            >
              <Film className="w-3.5 h-3.5 mr-1" /> Video
            </button>
          </div>

          {/* Month select */}
          {availableMonths.length > 0 && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="select select-bordered select-sm rounded-xl text-xs"
            >
              <option value="all">Tất cả tháng</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>
          )}

          {/* View mode */}
          <div className="join hidden sm:flex">
            <button
              onClick={() => setViewMode("grid")}
              className={`join-item btn btn-sm ${viewMode === "grid" ? "btn-active" : "btn-ghost"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`join-item btn btn-sm ${viewMode === "timeline" ? "btn-active" : "btn-ghost"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Gallery */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingRing size={50} color="amber" />
            <p className="mt-4 text-sm text-base-content/60">Đang tải nhật ký khoảnh khắc...</p>
          </div>
        ) : filteredMoments.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-3xl border border-dashed border-base-300 p-8">
            <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold">Chưa có khoảnh khắc nào</h3>
            <p className="text-sm text-base-content/60 mt-1">
              Các khoảnh khắc bạn chụp hoặc nhận được từ bạn bè sẽ hiển thị tại đây.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {filteredMoments.map((moment) => {
              const isVideo = moment.media_type === "video";
              const formattedDate = new Date(moment.created_at || moment.date).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={moment.id}
                  onClick={() => setSelectedMoment(moment)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-black cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  {isVideo ? (
                    <video
                      src={moment.media_url}
                      className="w-full h-full object-cover pointer-events-none"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={moment.media_url}
                      alt={moment.caption || "Locket Moment"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center pointer-events-none">
                    <span className="text-[10px] bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-medium">
                      {formattedDate}
                    </span>
                    {isVideo && (
                      <span className="text-[10px] bg-red-600/90 text-white px-1.5 py-0.5 rounded-md font-bold">
                        VIDEO
                      </span>
                    )}
                  </div>

                  {/* Caption Overlay */}
                  {moment.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-6">
                      <p className="text-white text-xs font-semibold truncate drop-shadow-md">
                        {moment.icon && <span className="mr-1">{moment.icon}</span>}
                        {moment.caption}
                      </p>
                    </div>
                  )}

                  {/* Hover Action */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="btn btn-circle btn-sm btn-primary">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Timeline View */
          <div className="space-y-4">
            {filteredMoments.map((moment) => {
              const isVideo = moment.media_type === "video";
              const dateObj = new Date(moment.created_at || moment.date);
              const formattedDate = dateObj.toLocaleString("vi-VN");

              return (
                <div
                  key={moment.id}
                  className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-all"
                >
                  <div
                    onClick={() => setSelectedMoment(moment)}
                    className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-black cursor-pointer"
                  >
                    {isVideo ? (
                      <video src={moment.media_url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={moment.media_url} alt="" className="w-full h-full object-cover" />
                    )}
                    {isVideo && (
                      <span className="absolute bottom-1 right-1 text-[9px] bg-red-600 text-white px-1 rounded font-bold">
                        VIDEO
                      </span>
                    )}
                  </div>

                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="font-bold text-base-content">{moment.user_name || "Khoảnh khắc"}</span>
                      <span className="text-xs text-base-content/50">{formattedDate}</span>
                    </div>
                    {moment.caption ? (
                      <p className="text-sm font-medium text-base-content/80 mt-1">
                        {moment.icon} {moment.caption}
                      </p>
                    ) : (
                      <p className="text-xs text-base-content/40 italic">Không có caption</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(moment.media_url, `locket_${moment.id}.${isVideo ? "mp4" : "jpg"}`)}
                      className="btn btn-sm btn-outline rounded-xl"
                    >
                      <Download className="w-4 h-4" /> Tải về
                    </button>
                    <button
                      onClick={() => setSelectedMoment(moment)}
                      className="btn btn-sm btn-primary rounded-xl"
                    >
                      Xem
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Xem Chi Tiết Moment */}
      {selectedMoment && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedMoment(null)}
        >
          <div
            className="bg-base-100 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-base-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media Box */}
            <div className="relative aspect-square bg-black flex items-center justify-center">
              {selectedMoment.media_type === "video" ? (
                <video
                  src={selectedMoment.media_url}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={selectedMoment.media_url}
                  alt={selectedMoment.caption}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Spotify Player Banner */}
              {selectedMoment.spotify && (
                <div className="absolute top-4 inset-x-4 z-10">
                  <SpotifyPlayerBanner spotifyData={selectedMoment.spotify} />
                </div>
              )}

              {/* Caption Tag */}
              {selectedMoment.caption && (
                <div
                  className="absolute bottom-4 inset-x-4 p-2.5 rounded-xl text-center font-bold text-sm shadow-lg backdrop-blur-md"
                  style={{
                    backgroundColor: selectedMoment.color_top || "rgba(0,0,0,0.6)",
                    color: selectedMoment.text_color || "#FFFFFF",
                  }}
                >
                  {selectedMoment.icon} {selectedMoment.caption}
                </div>
              )}
            </div>

            {/* Details Footer */}
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="font-bold text-base">{selectedMoment.user_name || "Locket User"}</p>
                <p className="text-xs text-base-content/50">
                  {new Date(selectedMoment.created_at || selectedMoment.date).toLocaleString("vi-VN")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleDownload(
                      selectedMoment.media_url,
                      `locket_${selectedMoment.id}.${selectedMoment.media_type === "video" ? "mp4" : "jpg"}`
                    )
                  }
                  className="btn btn-sm btn-primary rounded-xl"
                >
                  <Download className="w-4 h-4" /> Tải về
                </button>
                <button
                  onClick={() => setSelectedMoment(null)}
                  className="btn btn-sm btn-ghost rounded-xl"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
