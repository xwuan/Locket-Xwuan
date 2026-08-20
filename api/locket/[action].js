const IOS_BUNDLE_ID = "com.locket.Locket";
const LOCKET_API_BASE = "https://api.locketcamera.com";
const FIRESTORE_PROJECT = "locket-camera";

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

function parseFirestoreDoc(doc) {
  if (!doc || !doc.fields) return null;
  const fields = doc.fields || {};
  const id = doc.name ? doc.name.split("/").pop() : "";
  const timeMs = extractTimestamp(fields.date?.timestampValue || fields.created_at?.timestampValue);

  return {
    id,
    uid: id,
    user: fields.user?.stringValue || "",
    userId: fields.user?.stringValue || "",
    thumbnailUrl: fields.thumbnail_url?.stringValue || fields.thumbnailUrl?.stringValue || fields.image_url?.stringValue || "",
    thumbnail_url: fields.thumbnail_url?.stringValue || fields.thumbnailUrl?.stringValue || fields.image_url?.stringValue || "",
    videoUrl: fields.video_url?.stringValue || fields.videoUrl?.stringValue || null,
    video_url: fields.video_url?.stringValue || fields.videoUrl?.stringValue || null,
    caption: fields.caption?.stringValue || "",
    createTime: timeMs,
    date: timeMs,
    recipients: fields.recipients?.arrayValue?.values?.map((v) => v.stringValue) || [],
    overlay: fields.overlay?.stringValue || null,
  };
}

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
      const normalizedMoments = [];
      const seenIds = new Set();

      // A. Truy vấn Firestore Database chính thức của Locket để lấy toàn bộ lịch sử moments
      if (authHeader) {
        try {
          const friendFilter = req.body?.friendId || req.body?.userUid;
          const queryPayload = {
            structuredQuery: {
              from: [{ collectionId: "moments" }],
              orderBy: [{ field: { fieldPath: "date" }, direction: "DESCENDING" }],
              limit: req.body?.limit || 50,
            },
          };

          if (friendFilter) {
            queryPayload.structuredQuery.where = {
              fieldFilter: {
                field: { fieldPath: "user" },
                op: "EQUAL",
                value: { stringValue: friendFilter },
              },
            };
          }

          const firestoreRes = await fetch(
            `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents:runQuery`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader,
                "X-Ios-Bundle-Identifier": IOS_BUNDLE_ID,
                "User-Agent": "Locket/1.196.0 (iPhone; iOS 17.5.1; Scale/3.00)",
              },
              body: JSON.stringify(queryPayload),
            }
          );

          if (firestoreRes.ok) {
            const firestoreData = await firestoreRes.json();
            if (Array.isArray(firestoreData)) {
              firestoreData.forEach((item) => {
                if (item.document) {
                  const m = parseFirestoreDoc(item.document);
                  if (m && m.id && !seenIds.has(m.id)) {
                    seenIds.add(m.id);
                    normalizedMoments.push(m);
                  }
                }
              });
            }
          }
        } catch (fErr) {
          console.warn("Firestore query fallback:", fErr.message);
        }
      }

      // B. Gọi getLatestMomentV2 từ Locket API để lấy khoảnh khắc mới nhất
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
        const initialMoments = data?.result?.data || [];

        initialMoments.forEach((m) => {
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
      } catch (lErr) {
        console.warn("getLatestMomentV2 error:", lErr.message);
      }

      // Sắp xếp giảm dần theo thời gian tạo
      normalizedMoments.sort((a, b) => (b.createTime || 0) - (a.createTime || 0));

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

  // 6. postMomentV2
  if (action === "postMomentV2" || action === "post") {
    try {
      const { options = {}, mediaInfo = {} } = req.body || {};
      const isVideo = mediaInfo.type === "video" || req.body?.contentType === "video";
      const mediaUrl = mediaInfo.url || req.body?.url;

      const locketPayload = {
        data: {
          thumbnail_url: mediaUrl,
          image_url: mediaUrl,
          video_url: isVideo ? mediaUrl : null,
          caption: options.caption || "",
          recipients: options.recipients || [],
          overlay: options.overlay_id ? {
            id: options.overlay_id,
            icon: options.icon,
            type: options.type,
            text_color: options.text_color,
            color_top: options.color_top,
            color_bottom: options.color_bottom,
          } : null,
        },
      };

      const locketRes = await fetch(`${LOCKET_API_BASE}/postMomentV2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "X-Ios-Bundle-Identifier": IOS_BUNDLE_ID,
          "User-Agent": "Locket/1.196.0 (iPhone; iOS 17.5.1; Scale/3.00)",
        },
        body: JSON.stringify(locketPayload),
      });

      const data = await locketRes.json();
      return res.status(locketRes.status).json({
        success: true,
        data: data?.result || data,
      });
    } catch (err) {
      console.error("postMomentV2 proxy error:", err);
      return res.status(500).json({ error: { message: "Lỗi đăng bài lên Locket" } });
    }
  }

  // 7. Chuyển tiếp chung cho các endpoint khác
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
