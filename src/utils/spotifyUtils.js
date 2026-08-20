// utils/spotifyUtils.js - Trích xuất dữ liệu bài hát Spotify và Preview Audio

/**
 * Trích xuất Spotify Track ID từ URL
 */
export function extractSpotifyTrackId(url = "") {
  if (!url) return null;
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

/**
 * Trích xuất thông tin bài hát từ link Spotify (Tên bài hát, Nghệ sĩ, Bìa Album, Preview Audio Stream)
 */
export async function fetchSpotifyTrackInfo(spotifyUrl = "") {
  if (!spotifyUrl) {
    throw new Error("Vui lòng nhập đường link Spotify hợp lệ!");
  }

  const trackId = extractSpotifyTrackId(spotifyUrl);
  if (!trackId && !spotifyUrl.includes("spotify.com")) {
    // Nếu là từ khóa tìm kiếm, tìm trực tiếp qua iTunes API
    return await searchMusicTrack(spotifyUrl);
  }

  try {
    // 1. Gọi Spotify oEmbed API để lấy Title và Thumbnail
    const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`;
    const oembedRes = await fetch(oembedUrl);
    
    if (!oembedRes.ok) {
      throw new Error("Không thể trích xuất thông tin từ liên kết Spotify này.");
    }
    
    const oembedData = await oembedRes.json();
    const rawTitle = oembedData.title || "Spotify Track";
    const albumCover = oembedData.thumbnail_url || "/icons/spotify_icon.png";

    // 2. Tìm kiếm audio stream preview tương ứng
    const audioData = await searchMusicTrack(rawTitle);

    return {
      trackId: trackId || "spotify_" + Date.now(),
      title: audioData?.title || rawTitle,
      artist: audioData?.artist || "Spotify Music",
      albumCover: albumCover || audioData?.albumCover,
      previewUrl: audioData?.previewUrl || null,
      spotifyUrl: spotifyUrl,
      embedUrl: oembedData.iframe_url || `https://open.spotify.com/embed/track/${trackId}`,
    };
  } catch (err) {
    console.error("Lỗi trích xuất Spotify:", err);
    // Fallback: Tìm qua search
    const cleanQuery = spotifyUrl.replace(/https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+.*/, "");
    if (cleanQuery) {
      return await searchMusicTrack(cleanQuery);
    }
    throw err;
  }
}

/**
 * Tìm kiếm bài hát và lấy 30s Audio Stream Preview
 */
export async function searchMusicTrack(query = "") {
  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(`https://itunes.apple.com/search?term=${encoded}&entity=song&limit=1`);
    if (!res.ok) return null;
    
    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;

    return {
      trackId: result.trackId ? String(result.trackId) : "track_" + Date.now(),
      title: result.trackName || query,
      artist: result.artistName || "Unknown Artist",
      albumCover: result.artworkUrl100 ? result.artworkUrl100.replace("100x100bb", "600x600bb") : "/icons/spotify_icon.png",
      previewUrl: result.previewUrl || null,
      spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(result.trackName + " " + result.artistName)}`,
    };
  } catch (error) {
    console.error("Lỗi tìm kiếm audio:", error);
    return null;
  }
}
