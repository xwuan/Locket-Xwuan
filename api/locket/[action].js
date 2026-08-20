const IOS_BUNDLE_ID = "com.locket.Locket";
const LOCKET_API_BASE = "https://api.locketcamera.com";

const extractTimestamp = (rawDate) => {
  if (!rawDate) return Date.now();
  if (typeof rawDate === "number") return rawDate < 1e11 ? rawDate * 1000 : rawDate;
  if (typeof rawDate === "string") {
    const num = Number(rawDate);
    if (!isNaN(num)) return num < 1e11 ? num * 1000 : num;
    const parsed = new Date(rawDate).getTime();
    return isNaN(parsed) ? Date.now() : parsed;
  }
  if (typeof rawDate === "object") {
    if (rawDate._seconds) return rawDate._seconds * 1000;
    if (rawDate.seconds) return rawDate.seconds * 1000;
  }
  return Date.now();
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-api-key, x-app-author, x-app-name, x-app-client, x-app-api, x-app-env"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { action } = req.query;
  const authHeader = req.headers["authorization"] || "";

  // 1. Lấy danh sách bạn bè (getAllFriendsV2)
  if (action === "getAllFriendsV2") {
    try {
      const response = await fetch(`${LOCKET_API_BASE}/getLatestMomentV2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "X-Ios-Bundle-Identifier": IOS_BUNDLE_ID,
          "User-Agent": "Locket/1.196.0 (iPhone; iOS 17.5.1; Scale/3.00)",
        },
        body: JSON.stringify({
          data: {
            excluded_users: [],
            fetch_streak: true,
            should_count_missed_moments: true,
          },
        }),
      });

      const data = await response.json();
      const moments = data?.result?.data || [];

      // Trích xuất các friend UIDs từ các bài đăng
      const friendMap = new Map();
      moments.forEach((m) => {
        if (m.user) {
          friendMap.set(m.user, {
            uid: m.user,
            date: extractTimestamp(m.date),
          });
        }
      });

      return res.status(200).json({
        success: true,
        data: Array.from(friendMap.values()),
      });
    } catch (err) {
      console.error("Proxy getAllFriendsV2 error:", err);
      return res.status(200).json({ success: true, data: [] });
    }
  }

  // 2. Lấy toàn bộ Moments (getMomentV2 / getMoments)
  if (action === "getMomentV2" || action === "getMoments") {
    try {
      let allRawMoments = [];
      let excludedUsers = [];

      // Gọi lấy bài viết mới nhất
      const response = await fetch(`${LOCKET_API_BASE}/getLatestMomentV2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "X-Ios-Bundle-Identifier": IOS_BUNDLE_ID,
          "User-Agent": "Locket/1.196.0 (iPhone; iOS 17.5.1; Scale/3.00)",
        },
        body: JSON.stringify({
          data: {
            excluded_users: [],
            fetch_streak: true,
            should_count_missed_moments: true,
          },
        }),
      });

      const data = await response.json();
      const initialMoments = data?.result?.data || [];
      allRawMoments.push(...initialMoments);

      // Chuẩn hóa dữ liệu moments
      const seenIds = new Set();
      const normalizedMoments = [];

      allRawMoments.forEach((m) => {
        const id = m.uid || m.id;
        if (!id || seenIds.has(id)) return;
        seenIds.add(id);

        const timeMs = extractTimestamp(m.date || m.created_at || m.timestamp);
        normalizedMoments.push({
          id: id,
          uid: id,
          user: m.user,
          userId: m.user,
          thumbnailUrl: m.thumbnail_url || m.image_url || m.thumbnailUrl,
          thumbnail_url: m.thumbnail_url || m.image_url || m.thumbnailUrl,
          videoUrl: m.video_url || m.videoUrl || null,
          video_url: m.video_url || m.videoUrl || null,
          caption: m.caption || "",
          createTime: timeMs,
          date: timeMs,
          recipients: m.recipients || [],
          overlay: m.overlay || null,
        });
      });

      return res.status(200).json({
        success: true,
        data: normalizedMoments,
      });
    } catch (err) {
      console.error("Proxy getMomentV2 error:", err);
      return res.status(200).json({ success: true, data: [] });
    }
  }

  // 3. fetchUserV2
  if (action === "fetchUserV2" || action === "fetchUser") {
    try {
      const targetUid = req.body?.data?.user_uid || req.body?.user_uid;
      const locketRes = await fetch(`${LOCKET_API_BASE}/fetchUserV2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "X-Ios-Bundle-Identifier": IOS_BUNDLE_ID,
          "User-Agent": "Locket/1.196.0 (iPhone; iOS 17.5.1; Scale/3.00)",
        },
        body: JSON.stringify({
          data: { user_uid: targetUid },
        }),
      });

      const data = await locketRes.json();
      return res.status(locketRes.status).json(data);
    } catch (err) {
      console.error("fetchUser proxy error:", err);
      return res.status(500).json({ error: { message: "Lỗi tải thông tin người dùng" } });
    }
  }

  // 4. reactToMoment
  if (action === "reactToMoment") {
    try {
      const payload = req.body || {};
      const locketRes = await fetch(`${LOCKET_API_BASE}/reactToMoment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "X-Ios-Bundle-Identifier": IOS_BUNDLE_ID,
          "User-Agent": "Locket/1.196.0 (iPhone; iOS 17.5.1; Scale/3.00)",
        },
        body: JSON.stringify(payload),
      });

      const data = await locketRes.json();
      return res.status(locketRes.status).json(data);
    } catch (err) {
      console.error("reactToMoment proxy error:", err);
      return res.status(500).json({ error: { message: "Lỗi gửi react" } });
    }
  }

  // 5. sendChatMessageV2
  if (action === "sendChatMessageV2" || action === "sendChatMessage") {
    try {
      const payload = req.body || {};
      const locketRes = await fetch(`${LOCKET_API_BASE}/sendChatMessageV2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "X-Ios-Bundle-Identifier": IOS_BUNDLE_ID,
          "User-Agent": "Locket/1.196.0 (iPhone; iOS 17.5.1; Scale/3.00)",
        },
        body: JSON.stringify(payload),
      });

      const data = await locketRes.json();
      return res.status(locketRes.status).json(data);
    } catch (err) {
      console.error("sendChatMessage proxy error:", err);
      return res.status(500).json({ error: { message: "Lỗi gửi tin nhắn" } });
    }
  }

  // 6. Chuyển tiếp chung cho các endpoint khác
  try {
    const locketRes = await fetch(`${LOCKET_API_BASE}/${action}`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
        "X-Ios-Bundle-Identifier": IOS_BUNDLE_ID,
        "User-Agent": "Locket/1.196.0 (iPhone; iOS 17.5.1; Scale/3.00)",
      },
      body: req.method !== "GET" && req.body ? JSON.stringify(req.body) : undefined,
    });

    const data = await locketRes.json();
    return res.status(locketRes.status).json(data);
  } catch (error) {
    console.error(`Proxy error for /${action}:`, error);
    return res.status(500).json({
      error: { status: 500, message: "Lỗi kết nối tới máy chủ Locket" },
    });
  }
}
