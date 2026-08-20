export const parseToDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return isNaN(timestamp.getTime()) ? null : timestamp;
  if (typeof timestamp === "number") {
    return new Date(timestamp < 1e11 ? timestamp * 1000 : timestamp);
  }
  if (typeof timestamp === "string") {
    const num = Number(timestamp);
    if (!isNaN(num) && String(num) === timestamp.trim()) {
      return new Date(num < 1e11 ? num * 1000 : num);
    }
    const d = new Date(timestamp);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof timestamp === "object") {
    if (typeof timestamp.toDate === "function") return timestamp.toDate();
    if (timestamp._seconds) return new Date(timestamp._seconds * 1000);
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
  }
  return null;
};

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";

  const target = parseToDate(timestamp);
  if (!target) return "";

  const now = new Date();
  const diffMs = now.getTime() - target.getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 3) return `${diffDays} ngày trước`;

  const day = target.getDate();
  const month = target.getMonth() + 1;
  const year = target.getFullYear();

  if (isNaN(day) || isNaN(month) || isNaN(year)) return "Vừa xong";

  // Nếu cùng năm
  if (year === now.getFullYear()) {
    return `${day} thg ${month}`;
  }

  return `ngày ${day} thg ${month}, ${year}`;
};

export const formatTimeAgoV2 = formatTimeAgo;
