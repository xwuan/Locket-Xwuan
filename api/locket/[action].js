const IOS_BUNDLE_ID = "com.locket.Locket";
const LOCKET_API_BASE = "https://api.locketcamera.com";

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

  // Lấy Authorization header
  const authHeader = req.headers["authorization"] || "";

  // 1. Nếu là getAllFriendsV2: gọi getLatestMomentV2 để bóc tách danh sách bạn bè
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
            date: m.date || new Date().toISOString(),
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

  // 2. Nếu là getMomentV2 hoặc getMoments: chuyển sang getLatestMomentV2
  if (action === "getMomentV2" || action === "getMoments") {
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
      const rawMoments = data?.result?.data || [];

      // Chuẩn hóa dữ liệu moments
      const normalizedMoments = rawMoments.map((m) => ({
        id: m.uid || m.id,
        user: m.user,
        userId: m.user,
        thumbnailUrl: m.thumbnail_url || m.image_url,
        videoUrl: m.video_url || null,
        caption: m.caption || "",
        createTime: m.date ? new Date(m.date).getTime() : Date.now(),
        date: m.date,
        recipients: m.recipients || [],
        overlay: m.overlay || null,
      }));

      return res.status(200).json({
        success: true,
        data: normalizedMoments,
      });
    } catch (err) {
      console.error("Proxy getMomentV2 error:", err);
      return res.status(200).json({ success: true, data: [] });
    }
  }

  // 3. Chuyển tiếp (Proxy) mọi endpoint còn lại tới Locket Camera API
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
