// utils/gifUtils.js - Tìm kiếm và xử lý GIF từ Giphy & Tenor

// API Key miễn phí của Giphy
const GIPHY_API_KEY = "3o6ozh46Am3od35mHY"; // Giphy Web Public Key

// Bộ sưu tập preset GIF theo chủ đề phong phú
export const TRENDING_GIF_CATEGORIES = {
  love: {
    label: "Tình Yêu ❤️",
    items: [
      { id: "g1", name: "Trái Tim Đập", url: "https://media.giphy.com/media/LpDmM2WXO5GmpNS2Ke/giphy.gif" },
      { id: "g2", name: "Gấu Ôm Tim", url: "https://media.giphy.com/media/R6gVNROjZa40JYgSJj/giphy.gif" },
      { id: "g3", name: "Cute Kiss", url: "https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif" },
      { id: "g4", name: "Sparkle Heart", url: "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif" },
      { id: "g5", name: "Love Arrow", url: "https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif" },
    ],
  },
  cats: {
    label: "Mèo & Cute 🐱",
    items: [
      { id: "c1", name: "Mèo Nhún Nhảy", url: "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" },
      { id: "c2", name: "Mèo Bongo Cat", url: "https://media.giphy.com/media/ule4akeXnUSdg2F9Y3/giphy.gif" },
      { id: "c3", name: "Mèo Tải Vui Vẻ", url: "https://media.giphy.com/media/yFQ0ywscgobJK/giphy.gif" },
      { id: "c4", name: "Capybara Chill", url: "https://media.giphy.com/media/VCImBo2uUBqqQ/giphy.gif" },
      { id: "c5", name: "Cute Hamster", url: "https://media.giphy.com/media/11s7Ke7jcNxCHS/giphy.gif" },
    ],
  },
  anime: {
    label: "Anime & Pixel 🌸",
    items: [
      { id: "a1", name: "Pixel Sunset", url: "https://media.giphy.com/media/3o7TKTDnUxE0g2fSE8/giphy.gif" },
      { id: "a2", name: "Chibi Wow", url: "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif" },
      { id: "a3", name: "Lofi Rain Window", url: "https://media.giphy.com/media/t79qVnPD6n7gJb05bL/giphy.gif" },
      { id: "a4", name: "Sparkle Star", url: "https://media.giphy.com/media/3o7TKqgqfaKaON25jO/giphy.gif" },
      { id: "a5", name: "Pixel Coffee", url: "https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif" },
    ],
  },
  chill: {
    label: "Chill & Vibe ☕",
    items: [
      { id: "ch1", name: "Sóng Nhạc Wave", url: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif" },
      { id: "ch2", name: "Tách Cà Phê Bốc Khói", url: "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif" },
      { id: "ch3", name: "Bầu Trời Sao Đêm", url: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif" },
      { id: "ch4", name: "Lửa Trại Ấm Áp", url: "https://media.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif" },
    ],
  },
  meme: {
    label: "Hài Hước & Meme 😂",
    items: [
      { id: "m1", name: "Party Confetti", url: "https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif" },
      { id: "m2", name: "Popcorn Ăn Liền", url: "https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif" },
      { id: "m3", name: "Clapping Vỗ Tay", url: "https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif" },
      { id: "m4", name: "Dance Quẩy", url: "https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif" },
    ],
  },
};

/**
 * Tìm kiếm GIF từ Giphy API
 */
export async function searchGiphy(query = "", limit = 20) {
  if (!query.trim()) return [];

  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=GlVGYHkr3WSBnllCa54iNt0yFbjz7L65&q=${encoded}&limit=${limit}&rating=g`
    );
    if (!res.ok) throw new Error("Giphy API error");
    const data = await res.json();
    if (!data.data || data.data.length === 0) return [];

    return data.data.map((item) => ({
      id: item.id,
      name: item.title || query,
      url: item.images?.fixed_height_small?.url || item.images?.original?.url,
      preview: item.images?.fixed_height_small?.url,
    }));
  } catch (err) {
    console.warn("Giphy Search error, using fallback matching:", err);
    // Fallback: Tìm trong kho có sẵn
    const allItems = Object.values(TRENDING_GIF_CATEGORIES).flatMap((c) => c.items);
    const term = query.toLowerCase();
    return allItems.filter((i) => i.name.toLowerCase().includes(term));
  }
}
