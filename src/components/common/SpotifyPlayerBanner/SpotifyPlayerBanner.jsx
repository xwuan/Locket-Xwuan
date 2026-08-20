import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, ExternalLink, Music } from "lucide-react";
import { showToast } from "@/components/Toast";

export default function SpotifyPlayerBanner({ spotifyData, isPreview = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!spotifyData || !spotifyData.title) return null;

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Không thể phát nhạc:", err);
          if (spotifyData.spotifyUrl) {
            window.open(spotifyData.spotifyUrl, "_blank");
          } else {
            showToast("info", "Không tìm thấy đoạn âm thanh phát thử cho bài hát này.");
          }
        });
    }
  };

  return (
    <div
      onClick={togglePlay}
      className="group relative flex items-center justify-between gap-3 bg-black/75 hover:bg-black/90 backdrop-blur-xl border border-white/20 p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all shadow-xl max-w-sm w-full mx-auto select-none"
    >
      {/* Audio element */}
      {spotifyData.previewUrl && (
        <audio
          ref={audioRef}
          src={spotifyData.previewUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          preload="none"
        />
      )}

      {/* Left: Album Cover & Play Icon */}
      <div className="relative flex-shrink-0">
        <img
          src={spotifyData.albumCover || "/icons/spotify_icon.png"}
          alt={spotifyData.title}
          className={`w-11 h-11 rounded-xl object-cover shadow-md transition-transform ${
            isPlaying ? "animate-spin-slow ring-2 ring-green-400" : ""
          }`}
        />
        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
          {isPlaying ? (
            <Pause className="w-5 h-5 text-green-400 fill-green-400" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          )}
        </div>
      </div>

      {/* Middle: Track Title, Artist & Wave Visualizer */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-400">
            Spotify Music
          </span>
        </div>
        <h4 className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-sm">
          {spotifyData.title}
        </h4>
        <p className="text-[11px] text-white/70 truncate">
          {spotifyData.artist || "Spotify"}
        </p>
      </div>

      {/* Right: Music Wave Animation / Open Link */}
      <div className="flex items-center gap-1.5 flex-shrink-0 pr-1">
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4">
            <span className="w-1 bg-green-400 rounded-full animate-bounce h-3" />
            <span className="w-1 bg-green-400 rounded-full animate-bounce h-4 delay-75" />
            <span className="w-1 bg-green-400 rounded-full animate-bounce h-2 delay-150" />
            <span className="w-1 bg-green-400 rounded-full animate-bounce h-4 delay-100" />
          </div>
        ) : (
          <a
            href={spotifyData.spotifyUrl || "https://spotify.com"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn btn-circle btn-xs btn-ghost text-white/70 hover:text-white"
            title="Mở trên Spotify"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
