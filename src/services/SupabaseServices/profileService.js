import { supabase } from "@/lib/supabase";

/**
 * Lấy hoặc cập nhật thông tin hồ sơ người dùng
 */
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  } catch (error) {
    console.error("❌ Lỗi lấy profile:", error);
    throw error;
  }
}

/**
 * Đồng bộ hoặc cập nhật profile
 */
export async function syncProfile(user) {
  if (!user || !user.uid) return null;
  try {
    const profileData = {
      id: user.uid,
      email: user.email || null,
      username: user.username || user.email?.split("@")[0] || null,
      display_name: user.displayName || user.name || "Locket User",
      avatar_url: user.photoURL || user.avatar || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(profileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Lỗi đồng bộ profile:", error);
    throw error;
  }
}

/**
 * Điểm danh hàng ngày & duy trì chuỗi Streak
 */
export async function checkinDaily(userId) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("rollcalls")
      .upsert({
        user_id: userId,
        checkin_date: today,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Lỗi điểm danh hàng ngày:", error);
    throw error;
  }
}
