import { supabase } from "@/lib/supabase";

/**
 * Lấy danh sách bạn bè của người dùng
 */
export async function getFriends(userId) {
  try {
    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách bạn bè:", error);
    throw error;
  }
}

/**
 * Thêm bạn bè mới
 */
export async function addFriend(userId, friend) {
  try {
    const { data, error } = await supabase
      .from("friends")
      .insert([
        {
          user_id: userId,
          friend_id: friend.uid || friend.id,
          friend_username: friend.username || "",
          friend_name: friend.displayName || friend.name || "",
          friend_avatar: friend.avatar || friend.photoURL || "",
          status: "accepted",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Lỗi thêm bạn bè:", error);
    throw error;
  }
}

/**
 * Xoá bạn bè
 */
export async function removeFriend(userId, friendId) {
  try {
    const { data, error } = await supabase
      .from("friends")
      .delete()
      .match({ user_id: userId, friend_id: friendId });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Lỗi xoá bạn bè:", error);
    throw error;
  }
}
