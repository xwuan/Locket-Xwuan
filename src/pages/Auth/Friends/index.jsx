import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthLocket";
import { useFriendStore } from "@/stores/useFriendStore";
import {
  Users,
  Search,
  UserPlus,
  UserMinus,
  ExternalLink,
  Flame,
  Sparkles,
  Copy,
  Check,
  Send,
  Share2,
  QrCode,
  ArrowUpDown,
  Filter,
  Camera,
  X,
} from "lucide-react";
import { showToast } from "@/components/Toast";
import LoadingRing from "@/components/ui/Loading/ring";

export default function FriendsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { friendDetails, loading, loadFriends } = useFriendStore();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'vip' | 'streak'
  const [sortBy, setSortBy] = useState("name-asc"); // 'name-asc' | 'name-desc' | 'streak'
  
  // Instant Invite & Share state
  const [inviteInput, setInviteInput] = useState("");
  const [copiedUid, setCopiedUid] = useState(null);
  const [copiedMyLink, setCopiedMyLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [unfriendModal, setUnfriendModal] = useState(null);

  const friendsList = useMemo(() => {
    if (!friendDetails) return [];
    return Object.values(friendDetails);
  }, [friendDetails]);

  // Siêu lọc & Tìm kiếm tức thì
  const filteredFriends = useMemo(() => {
    let result = [...friendsList];

    // 1. Tìm kiếm tức thì (Search)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim().replace(/^@/, "");
      result = result.filter((f) => {
        const name = (f.displayName || f.name || "").toLowerCase();
        const username = (f.username || "").toLowerCase();
        return name.includes(term) || username.includes(term);
      });
    }

    // 2. Lọc theo danh mục
    if (filterType === "vip") {
      result = result.filter((f) => f.isCelebrity || f.isVip);
    } else if (filterType === "streak") {
      result = result.filter((f) => f.streak && f.streak > 0);
    }

    // 3. Sắp xếp
    result.sort((a, b) => {
      const nameA = (a.displayName || a.name || "").toLowerCase();
      const nameB = (b.displayName || b.name || "").toLowerCase();
      if (sortBy === "name-asc") return nameA.localeCompare(nameB);
      if (sortBy === "name-desc") return nameB.localeCompare(nameA);
      if (sortBy === "streak") return (b.streak || 0) - (a.streak || 0);
      return 0;
    });

    return result;
  }, [friendsList, searchTerm, filterType, sortBy]);

  const myUsername = user?.username || user?.displayName?.toLowerCase().replace(/\s+/g, "") || "myprofile";
  const myInviteLink = `https://locket.cam/${myUsername}`;

  // Sao chép link mời của bản thân
  const handleCopyMyInvite = () => {
    navigator.clipboard.writeText(myInviteLink);
    setCopiedMyLink(true);
    showToast("success", "Đã sao chép liên kết kết bạn của bạn!");
    setTimeout(() => setCopiedMyLink(false), 2500);
  };

  // Chia sẻ liên kết qua Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kết bạn Locket với ${user?.displayName || "tôi"}!`,
          text: `Hãy cùng chia sẻ khoảnh khắc với mình trên Locket nhé!`,
          url: myInviteLink,
        });
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      handleCopyMyInvite();
    }
  };

  // Gửi lời mời kết bạn tức thì
  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteInput.trim()) {
      return showToast("error", "Vui lòng nhập @username hoặc liên kết Locket!");
    }
    const cleanUser = inviteInput.trim().replace(/^https?:\/\/locket\.cam\/?@?/, "").replace(/^@/, "");
    showToast("success", `Đang gửi lời mời kết bạn tức thì đến @${cleanUser}...`);
    window.open(`https://locket.cam/${cleanUser}`, "_blank");
    setInviteInput("");
  };

  // Sao chép link của bạn bè
  const handleCopyFriendLink = (username, uid) => {
    const url = `https://locket.cam/${username}`;
    navigator.clipboard.writeText(url);
    setCopiedUid(uid);
    showToast("success", `Đã sao chép liên kết của @${username}!`);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  // Gửi khoảnh khắc riêng cho bạn bè
  const handleSendMomentToFriend = (friend) => {
    navigate("/postmoments", {
      state: { targetFriend: friend },
    });
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-4 md:p-8">
      {/* Top Banner */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-7 h-7 text-blue-200" />
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                Locket Friends Hub
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Quản Lý Bạn Bè & Lời Mời
            </h1>
            <p className="mt-2 text-white/90 text-sm md:text-base max-w-xl">
              Gửi lời mời kết bạn tức thì, tìm kiếm và lọc bạn bè siêu nhanh cùng Locket.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 self-stretch sm:self-auto justify-around">
            <div className="text-center px-3 border-r border-white/20">
              <p className="text-xs text-white/70">Tổng bạn bè</p>
              <p className="text-2xl font-black">{friendsList.length}</p>
            </div>
            <div className="text-center px-3">
              <p className="text-xs text-white/70">Kết quả lọc</p>
              <p className="text-2xl font-black text-yellow-300">{filteredFriends.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 Instant Invite Box (Gửi lời mời tức thì) */}
      <div className="max-w-6xl mx-auto bg-base-100 p-5 md:p-6 rounded-3xl shadow-lg border border-base-300 mb-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Left: Input Add Friend */}
          <div className="flex-1 w-full">
            <h3 className="text-base font-bold mb-2 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Gửi lời mời kết bạn tức thì
            </h3>
            <form onSubmit={handleSendInvite} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập @username hoặc dán link locket.cam..."
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  className="input input-bordered w-full rounded-2xl text-sm"
                />
              </div>
              <button type="submit" className="btn btn-primary rounded-2xl px-5 font-bold shadow-md">
                <Send className="w-4 h-4 mr-1" /> Mời ngay
              </button>
            </form>
          </div>

          {/* Right: My Invite Link & Actions */}
          <div className="w-full lg:w-auto flex flex-wrap sm:flex-nowrap items-center gap-2 pt-4 lg:pt-0 lg:border-l lg:pl-6 border-base-300">
            <button
              onClick={handleCopyMyInvite}
              className="btn btn-outline rounded-2xl flex-1 sm:flex-none"
            >
              {copiedMyLink ? <Check className="w-4 h-4 text-green-500 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              Sao chép Link của tôi
            </button>
            <button
              onClick={handleNativeShare}
              className="btn btn-secondary rounded-2xl flex-1 sm:flex-none"
              title="Chia sẻ liên kết"
            >
              <Share2 className="w-4 h-4 mr-1" /> Chia sẻ
            </button>
            <button
              onClick={() => setShowQrModal(true)}
              className="btn btn-ghost btn-circle"
              title="Mã QR kết bạn"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 Super Fast Search & Filter Toolbar */}
      <div className="max-w-6xl mx-auto bg-base-100 p-4 rounded-2xl shadow-md border border-base-300 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Instant Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-base-content/50" />
          <input
            type="text"
            placeholder="Tìm kiếm siêu tốc theo tên hoặc @username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 pr-8 rounded-xl text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-base-content/40 hover:text-base-content"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Filters */}
          <div className="join">
            <button
              onClick={() => setFilterType("all")}
              className={`join-item btn btn-sm ${filterType === "all" ? "btn-primary" : "btn-ghost"}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType("vip")}
              className={`join-item btn btn-sm ${filterType === "vip" ? "btn-primary" : "btn-ghost"}`}
            >
              👑 VIP
            </button>
            <button
              onClick={() => setFilterType("streak")}
              className={`join-item btn btn-sm ${filterType === "streak" ? "btn-primary" : "btn-ghost"}`}
            >
              🔥 Streak
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select select-bordered select-sm rounded-xl text-xs"
          >
            <option value="name-asc">Tên (A → Z)</option>
            <option value="name-desc">Tên (Z → A)</option>
            <option value="streak">Chuỗi Streak cao nhất</option>
          </select>

          <button
            onClick={() => loadFriends(user, null)}
            className="btn btn-sm btn-ghost rounded-xl"
            title="Làm mới"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Friends Cards Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingRing size={50} color="blue" />
            <p className="mt-4 text-sm text-base-content/60">Đang tìm kiếm và nạp danh sách bạn bè...</p>
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-3xl border border-dashed border-base-300 p-8">
            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold">Không tìm thấy bạn bè phù hợp</h3>
            <p className="text-sm text-base-content/60 mt-1">
              Thử xóa từ khóa tìm kiếm hoặc mời thêm bạn bè bằng link kết bạn ở trên.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFriends.map((friend) => {
              const uid = friend.uid || friend.id;
              const name = friend.displayName || friend.name || "Người dùng Locket";
              const username = friend.username || "user";
              const avatar = friend.profilePic || friend.avatar || friend.photoURL || "/default-avatar.png";

              return (
                <div
                  key={uid}
                  className="bg-base-100 p-5 rounded-3xl shadow-sm border border-base-300 hover:shadow-lg transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="avatar">
                      <div className="w-14 h-14 rounded-2xl ring ring-primary/20 ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
                        <img src={avatar} alt={name} className="object-cover w-full h-full" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-base-content truncate">{name}</h3>
                        {friend.isCelebrity && (
                          <span className="badge badge-warning badge-xs">VIP</span>
                        )}
                      </div>
                      <p className="text-xs text-base-content/60 truncate">@{username}</p>
                      {friend.streak && friend.streak > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-500 mt-1">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" /> {friend.streak} ngày
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-base-200">
                    <button
                      onClick={() => handleSendMomentToFriend(friend)}
                      className="btn btn-sm btn-primary rounded-xl flex-1 mr-2"
                    >
                      <Camera className="w-4 h-4 mr-1" /> Gửi Moment
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyFriendLink(username, uid)}
                        className="btn btn-circle btn-sm btn-ghost"
                        title="Sao chép link Locket"
                      >
                        {copiedUid === uid ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={`https://locket.cam/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-sm btn-ghost"
                        title="Mở trang cá nhân"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 📱 Modal Mã QR Kết Bạn */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-base-100 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-base-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Mã QR Kết Bạn Locket</h3>
              <button onClick={() => setShowQrModal(false)} className="btn btn-circle btn-sm btn-ghost">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Visual */}
            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  myInviteLink
                )}`}
                alt="Locket QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-sm font-bold">@{myUsername}</p>
            <p className="text-xs text-base-content/60 mt-1 mb-4">
              Quét mã này bằng Camera để kết bạn ngay lập tức trên Locket.
            </p>

            <button onClick={handleCopyMyInvite} className="btn btn-primary w-full rounded-2xl">
              <Copy className="w-4 h-4 mr-1" /> Sao chép liên kết kết bạn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
