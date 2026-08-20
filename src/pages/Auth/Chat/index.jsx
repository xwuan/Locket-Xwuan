import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { useFriendStore } from "@/stores/useFriendStore";
import {
  MessageSquare,
  Users,
  Send,
  Plus,
  Search,
  Image as ImageIcon,
  Smile,
  X,
  Check,
  CheckCheck,
  Sparkles,
  Phone,
  Video,
  Info,
} from "lucide-react";
import { showToast } from "@/components/Toast";
import LoadingRing from "@/components/UI/Loading/ring";
import {
  saveMessageWithUsers,
  getAllMessages,
  addMessageToConversation,
} from "@/cache/chatsDB";

export default function ChatPage() {
  const { user } = useContext(AuthContext);
  const { friendDetails } = useFriendStore();

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchChat, setSearchChat] = useState("");
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedFriendsForGroup, setSelectedFriendsForGroup] = useState([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const friendsList = useMemo(() => {
    if (!friendDetails) return [];
    return Object.values(friendDetails);
  }, [friendDetails]);

  // Nạp danh sách hội thoại từ local cache
  useEffect(() => {
    async function loadChats() {
      const stored = (await getAllMessages()) || [];
      if (stored.length > 0) {
        setConversations(stored);
        if (!activeChat) setActiveChat(stored[0]);
      } else if (friendsList.length > 0) {
        // Tạo hội thoại mẫu với bạn bè đầu tiên
        const initial = {
          uid: "chat_" + friendsList[0].uid,
          isGroup: false,
          name: friendsList[0].displayName || friendsList[0].name || "Bạn bè",
          avatar: friendsList[0].profilePic || "/default-avatar.png",
          messages: [
            {
              id: "msg_1",
              senderId: friendsList[0].uid,
              senderName: friendsList[0].displayName || "Bạn bè",
              text: "Chào bạn! Cùng chia sẻ khoảnh khắc trên Locket nhé ✨",
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        };
        setConversations([initial]);
        setActiveChat(initial);
      }
    }
    loadChats();
  }, [friendsList]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // Lọc danh sách hội thoại
  const filteredConversations = useMemo(() => {
    if (!searchChat.trim()) return conversations;
    const term = searchChat.toLowerCase().trim();
    return conversations.filter((c) => (c.name || "").toLowerCase().includes(term));
  }, [conversations, searchChat]);

  // Gửi tin nhắn
  const handleSendMessage = (mediaUrl = null) => {
    if (!inputText.trim() && !mediaUrl) return;
    if (!activeChat) return;

    const newMsg = {
      id: "msg_" + Date.now(),
      senderId: user?.uid || "my_user",
      senderName: user?.displayName || "Tôi",
      text: inputText.trim(),
      mediaUrl: mediaUrl,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...(activeChat.messages || []), newMsg];
    const updatedActiveChat = { ...activeChat, messages: updatedMessages };

    setActiveChat(updatedActiveChat);
    setConversations((prev) =>
      prev.map((c) => (c.uid === activeChat.uid ? updatedActiveChat : c))
    );

    // Lưu vào IndexedDB
    saveMessageWithUsers(activeChat.uid, activeChat.name, updatedMessages);
    setInputText("");
  };

  // Tạo nhóm chat mới
  const handleCreateGroupChat = () => {
    if (!newGroupName.trim()) {
      return showToast("error", "Vui lòng nhập tên nhóm chat!");
    }
    if (selectedFriendsForGroup.length === 0) {
      return showToast("error", "Vui lòng chọn ít nhất 1 bạn bè vào nhóm!");
    }

    const newGroup = {
      uid: "group_" + Date.now(),
      isGroup: true,
      name: newGroupName.trim(),
      members: selectedFriendsForGroup,
      avatar: "/default-avatar.png",
      messages: [
        {
          id: "msg_system",
          senderId: "system",
          senderName: "Hệ thống",
          text: `🎉 Nhóm "${newGroupName.trim()}" đã được tạo!`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    const updated = [newGroup, ...conversations];
    setConversations(updated);
    setActiveChat(newGroup);
    saveMessageWithUsers(newGroup.uid, newGroup.name, newGroup.messages);

    setShowNewGroupModal(false);
    setNewGroupName("");
    setSelectedFriendsForGroup([]);
    showToast("success", `Đã tạo nhóm chat "${newGroup.name}" thành công!`);
  };

  // Bắt đầu chat 1-1 với một người bạn
  const handleStartDirectChat = (friend) => {
    const existing = conversations.find((c) => c.uid === "chat_" + friend.uid);
    if (existing) {
      setActiveChat(existing);
    } else {
      const newDirect = {
        uid: "chat_" + friend.uid,
        isGroup: false,
        name: friend.displayName || friend.name || friend.username,
        avatar: friend.profilePic || "/default-avatar.png",
        messages: [],
      };
      setConversations([newDirect, ...conversations]);
      setActiveChat(newDirect);
    }
  };

  // Xử lý gửi ảnh trong khung chat
  const handleImageSend = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    handleSendMessage(previewUrl);
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-2 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-base-100 rounded-3xl shadow-xl border border-base-300 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-100px)]">
        {/* LEFT: Sidebar Hội thoại */}
        <div className="w-full md:w-80 lg:w-96 border-r border-base-300 flex flex-col bg-base-100 flex-shrink-0">
          {/* Header Bar */}
          <div className="p-4 border-b border-base-300 flex justify-between items-center">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Tin Nhắn Locket
            </h2>
            <button
              onClick={() => setShowNewGroupModal(true)}
              className="btn btn-sm btn-primary rounded-xl"
              title="Tạo nhóm chat mới"
            >
              <Plus className="w-4 h-4 mr-1" /> Tạo nhóm
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-base-300">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Tìm hội thoại hoặc bạn bè..."
                value={searchChat}
                onChange={(e) => setSearchChat(e.target.value)}
                className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-base-200">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-sm text-base-content/50">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Chưa có cuộc trò chuyện nào</p>
                <p className="text-xs mt-1">Chọn bạn bè bên dưới để bắt đầu chat</p>
              </div>
            ) : (
              filteredConversations.map((chat) => {
                const isActive = activeChat?.uid === chat.uid;
                const lastMsg = chat.messages?.[chat.messages.length - 1];
                return (
                  <div
                    key={chat.uid}
                    onClick={() => setActiveChat(chat)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all hover:bg-base-200 ${
                      isActive ? "bg-primary/10 border-r-4 border-primary" : ""
                    }`}
                  >
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-2xl ring-1 ring-base-300 overflow-hidden bg-base-300 flex items-center justify-center">
                        {chat.isGroup ? (
                          <Users className="w-6 h-6 text-primary" />
                        ) : (
                          <img src={chat.avatar || "/default-avatar.png"} alt={chat.name} className="object-cover" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-sm truncate text-base-content">{chat.name}</h4>
                        {lastMsg?.time && (
                          <span className="text-[10px] text-base-content/50">{lastMsg.time}</span>
                        )}
                      </div>
                      <p className="text-xs text-base-content/60 truncate">
                        {lastMsg ? (lastMsg.mediaUrl ? "📷 [Hình ảnh]" : lastMsg.text) : "Bắt đầu cuộc trò chuyện..."}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            {/* Quick Friends Horizontal Section */}
            {friendsList.length > 0 && (
              <div className="p-3 bg-base-200/50">
                <span className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider block mb-2">
                  Bạn bè trực tuyến:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {friendsList.map((f) => (
                    <div
                      key={f.uid}
                      onClick={() => handleStartDirectChat(f)}
                      className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 group"
                      title={f.displayName}
                    >
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full ring-2 ring-primary/40 group-hover:scale-105 transition-transform overflow-hidden">
                          <img src={f.profilePic || "/default-avatar.png"} alt="" />
                        </div>
                      </div>
                      <span className="text-[10px] max-w-[50px] truncate">{f.displayName || f.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Khung Chat Chi Tiết */}
        <div className="flex-1 flex flex-col bg-base-100 h-full">
          {activeChat ? (
            <>
              {/* Chat Topbar */}
              <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-100/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-11 h-11 rounded-2xl bg-base-200 flex items-center justify-center overflow-hidden">
                      {activeChat.isGroup ? (
                        <Users className="w-6 h-6 text-primary" />
                      ) : (
                        <img src={activeChat.avatar || "/default-avatar.png"} alt="" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-base-content flex items-center gap-1.5">
                      {activeChat.name}
                      {activeChat.isGroup && (
                        <span className="badge badge-sm badge-primary">Nhóm</span>
                      )}
                    </h3>
                    <span className="text-xs text-base-content/50">
                      {activeChat.isGroup
                        ? `${activeChat.members?.length || 0} thành viên`
                        : "Đang hoạt động trên Locket"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-base-200/30">
                {(activeChat.messages || []).map((msg) => {
                  const isMe = msg.senderId === (user?.uid || "my_user");
                  return (
                    <div key={msg.id} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                      {!isMe && (
                        <div className="chat-header text-[11px] opacity-70 mb-1">
                          {msg.senderName}
                        </div>
                      )}
                      <div
                        className={`chat-bubble rounded-2xl shadow-sm text-sm font-medium ${
                          isMe ? "chat-bubble-primary text-white" : "bg-base-200 text-base-content"
                        }`}
                      >
                        {msg.mediaUrl && (
                          <div className="mb-2 rounded-xl overflow-hidden max-w-xs shadow-md">
                            <img src={msg.mediaUrl} alt="" className="w-full object-cover" />
                          </div>
                        )}
                        {msg.text}
                      </div>
                      <div className="chat-footer opacity-50 text-[10px] mt-1">{msg.time}</div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Toolbar */}
              <div className="p-3 md:p-4 border-t border-base-300 bg-base-100 flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSend}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-circle btn-sm btn-ghost"
                  title="Gửi ảnh"
                >
                  <ImageIcon className="w-5 h-5 text-base-content/70" />
                </button>

                <input
                  type="text"
                  placeholder={`Gửi tin nhắn cho ${activeChat.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="input input-bordered flex-1 rounded-2xl text-sm"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="btn btn-circle btn-primary shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-base-content/50">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="font-bold text-lg text-base-content">Chào mừng tới Locket Chat</h3>
              <p className="text-sm max-w-sm mt-1">
                Chọn một cuộc trò chuyện từ danh sách hoặc tạo nhóm mới để bắt đầu nhắn tin.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 👥 Modal Tạo Nhóm Chat Mới */}
      {showNewGroupModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowNewGroupModal(false)}
        >
          <div
            className="bg-base-100 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-base-300 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-base-300">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Tạo Nhóm Chat Mới
              </h3>
              <button onClick={() => setShowNewGroupModal(false)} className="btn btn-circle btn-sm btn-ghost">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-base-content/70 mb-1.5 uppercase">
                  Tên nhóm chat
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên nhóm (ví dụ: Hội Locket 2026 💖)..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="input input-bordered w-full rounded-2xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-base-content/70 mb-1.5 uppercase">
                  Thêm thành viên ({selectedFriendsForGroup.length} đã chọn)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-base-200">
                  {friendsList.map((friend) => {
                    const isSelected = selectedFriendsForGroup.includes(friend.uid);
                    return (
                      <div
                        key={friend.uid}
                        onClick={() => {
                          setSelectedFriendsForGroup((prev) =>
                            isSelected ? prev.filter((id) => id !== friend.uid) : [...prev, friend.uid]
                          );
                        }}
                        className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                          isSelected ? "bg-primary/10" : "hover:bg-base-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-9 h-9 rounded-full overflow-hidden">
                              <img src={friend.profilePic || "/default-avatar.png"} alt="" />
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-sm">{friend.displayName || friend.username}</p>
                            <p className="text-[11px] text-base-content/50">@{friend.username}</p>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-base-300 flex justify-end gap-2">
              <button onClick={() => setShowNewGroupModal(false)} className="btn btn-sm btn-ghost rounded-xl">
                Hủy
              </button>
              <button onClick={handleCreateGroupChat} className="btn btn-sm btn-primary rounded-xl px-5">
                Tạo nhóm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
