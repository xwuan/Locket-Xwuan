import { supabase } from "@/lib/supabase";

/**
 * Lấy lịch sử tin nhắn trong một cuộc trò chuyện
 */
export async function getMessagesByConversation(conversationId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Lỗi lấy tin nhắn:", error);
    throw error;
  }
}

/**
 * Gửi tin nhắn mới
 */
export async function sendMessage(messageData) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: messageData.conversation_id || messageData.conversationId,
          sender_id: messageData.sender_id || messageData.senderId,
          sender_name: messageData.sender_name || messageData.senderName,
          recipient_id: messageData.recipient_id || messageData.recipientId,
          message: messageData.message || "",
          media_url: messageData.media_url || messageData.mediaUrl || null,
          media_type: messageData.media_type || messageData.mediaType || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Lỗi gửi tin nhắn:", error);
    throw error;
  }
}

/**
 * Lắng nghe tin nhắn realtime theo cuộc trò chuyện
 */
export function subscribeToMessages(conversationId, onMessageReceived) {
  const channel = supabase
    .channel(`chat:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        if (onMessageReceived && typeof onMessageReceived === "function") {
          onMessageReceived(payload.new);
        }
      }
    )
    .subscribe();

  return channel;
}
