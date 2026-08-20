import React, { useState } from "react";
import { fetchSpotifyTrackInfo } from "@/utils/spotifyUtils";
import SpotifyPlayerBanner from "@/components/common/SpotifyPlayerBanner/SpotifyPlayerBanner";
import { Music, Search, Link2, Sparkles, Check, X, RefreshCw } from "lucide-react";
import { showToast } from "@/components/Toast";
import LoadingRing from "@/components/UI/Loading/ring";

export default function SpotifyExtractor({ onSelectSpotifyTrack, onClose }) {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedTrack, setExtractedTrack] = useState(null);

  const handleExtract = async (e) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) {
      return showToast("error", "Vui lòng nhập link bài hát Spotify hoặc tên bài hát!");
    }

    setLoading(true);
    try {
      const data = await fetchSpotifyTrackInfo(inputUrl.trim());
      if (data) {
        setExtractedTrack(data);
        showToast("success", `Đã trích xuất thành công: ${data.title}`);
      } else {
        showToast("error", "Không tìm thấy bài hát. Vui lòng kiểm tra lại link!");
      }
    } catch (err) {
      showToast("error", err.message || "Lỗi khi trích xuất Spotify");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!extractedTrack) return;
    if (onSelectSpotifyTrack) {
      onSelectSpotifyTrack(extractedTrack);
    }
    showToast("success", `Đã gắn bài hát "${extractedTrack.title}" vào Moment!`);
    if (onClose) onClose();
  };

  return (
    <div className="bg-base-100 rounded-3xl p-5 md:p-6 shadow-2xl border border-base-300 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-base-300">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-base-content">
              Trích Xuất Nhạc Spotify
            </h3>
            <p className="text-xs text-base-content/60">
              Dán link Spotify để phát nhạc khi bạn bè xem Moment
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn btn-circle btn-sm btn-ghost">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleExtract} className="space-y-3">
        <div className="relative">
          <Link2 className="absolute left-3.5 top-3 w-4 h-4 text-base-content/50" />
          <input
            type="text"
            placeholder="Dán link Spotify (vd: https://open.spotify.com/track/...) hoặc tên bài hát"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="input input-bordered w-full pl-10 pr-24 rounded-2xl text-xs sm:text-sm"
          />
          <button
            type="submit"
            disabled={loading || !inputUrl.trim()}
            className="btn btn-sm btn-primary rounded-xl absolute right-1.5 top-1.5"
          >
            {loading ? <LoadingRing size={16} color="white" /> : "Trích xuất"}
          </button>
        </div>
      </form>

      {/* Extracted Preview */}
      {extractedTrack && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-base-content/70 block">
            Xem trước & Nghe thử:
          </span>
          <SpotifyPlayerBanner spotifyData={extractedTrack} isPreview={true} />

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleConfirm}
              className="btn btn-sm btn-success text-white w-full rounded-2xl font-bold shadow-md"
            >
              <Check className="w-4 h-4 mr-1" /> Gắn bài hát này vào bài đăng Locket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
