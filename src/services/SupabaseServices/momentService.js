import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "moments-media";

/**
 * Tải file hình ảnh hoặc video lên Supabase Storage
 * @param {File|Blob} file 
 * @param {string} userId 
 * @returns {Promise<string>} publicUrl
 */
export async function uploadMediaToSupabase(file, userId = "anonymous") {
  try {
    const fileExt = file.name ? file.name.split(".").pop() : (file.type?.includes("video") ? "mp4" : "jpg");
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("❌ Lỗi upload media lên Supabase Storage:", error);
    throw error;
  }
}

/**
 * Lưu bài đăng (Moment) vào bảng moments trong Supabase
 * @param {Object} momentData 
 */
export async function createMoment(momentData) {
  try {
    const { data, error } = await supabase
      .from("moments")
      .insert([
        {
          user_id: momentData.userId || momentData.user_id,
          user_name: momentData.userName || momentData.user_name,
          user_avatar: momentData.userAvatar || momentData.user_avatar,
          media_url: momentData.mediaUrl || momentData.media_url,
          media_type: momentData.mediaType || momentData.media_type || "image",
          caption: momentData.caption || "",
          overlay_id: momentData.overlayId || momentData.overlay_id,
          icon: momentData.icon || "",
          text_color: momentData.textColor || momentData.text_color,
          color_top: momentData.colorTop || momentData.color_top,
          color_bottom: momentData.colorBottom || momentData.color_bottom,
          music_url: momentData.musicUrl || momentData.music_url,
          audience: momentData.audience || "all",
          recipients: momentData.recipients || [],
          date: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Lỗi tạo Moment trong Supabase:", error);
    throw error;
  }
}

/**
 * Lấy danh sách moments mới nhất
 * @param {number} limit 
 */
export async function getMoments(limit = 50) {
  try {
    const { data, error } = await supabase
      .from("moments")
      .select(`
        *,
        reactions:moment_reactions(*)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Lỗi lấy moments từ Supabase:", error);
    throw error;
  }
}

/**
 * Thả cảm xúc / reaction vào một moment
 */
export async function addReaction(momentId, userId, userName, emoji) {
  try {
    const { data, error } = await supabase
      .from("moment_reactions")
      .insert([
        {
          moment_id: momentId,
          user_id: userId,
          user_name: userName,
          emoji,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Lỗi thả reaction:", error);
    throw error;
  }
}

/**
 * Lắng nghe bài đăng mới thời gian thực (Supabase Realtime)
 */
export function subscribeToNewMoments(onNewMoment) {
  const subscription = supabase
    .channel("public:moments")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "moments" },
      (payload) => {
        if (onNewMoment && typeof onNewMoment === "function") {
          onNewMoment(payload.new);
        }
      }
    )
    .subscribe();

  return subscription;
}
