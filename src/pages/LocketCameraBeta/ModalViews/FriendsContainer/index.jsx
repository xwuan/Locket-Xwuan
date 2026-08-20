import { useRef, useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { RefreshCcw, X } from "lucide-react";
import { FaUserFriends, FaSearchPlus } from "react-icons/fa";
import {
  FindFriendByUserName,
  refreshFriends,
  removeFriend,
  toggleHiddenFriend,
} from "@/services";
import LoadingRing from "@/components/UI/Loading/ring";
import FriendItem from "./FriendItem";
import SearchInput from "@/components/UI/Input/SearchInput";
import { showError } from "@/components/Toast";
import FriendFind from "./FriendFind";
import IncomingFriendRequests from "./IncomingRequests";
import {
  SonnerError,
  SonnerSuccess,
  SonnerWarning,
} from "@/components/UI/SonnerToast";
import OutgoingRequest from "./OutgoingRequest";
import {
  setFriendDetail,
  deleteFriendDetail,
  deleteFriendId,
  setFriendIds,
} from "@/cache/friendsDB";
import { useFriendStore } from "@/stores/useFriendStore";

const FriendsContainer = () => {
  const popupRef = useRef(null);
  const { navigation } = useApp();

  const { friendDetails, loading, setFriendDetails } = useFriendStore();

  const { isFriendsTabOpen, setFriendsTabOpen, isPWA } = navigation;

  const [showAllFriends, setShowAllFriends] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const [searchTermFind, setSearchTermFind] = useState("");
  const [foundUser, setFoundUser] = useState(null);

  const [isFocused, setIsFocused] = useState(null);
  const [isFocusedFind, setIsFocusedFind] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  //Khoá cuộn màn hình cho thẻ body
  useEffect(() => {
    if (isFriendsTabOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      setShowAllFriends(false);
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
      setShowAllFriends(false);
    };
  }, [isFriendsTabOpen]);

  const handleRefreshFriends = async () => {
    try {
      setIsRefreshing(true);
      const result = await refreshFriends();

      if (result) {
        SonnerSuccess("Cập nhật thành công", "Đã làm mới danh sách bạn bè!");

        // ✅ update DB
        await setFriendIds(result.friends);
        await setFriendDetail(result.friendDetails);

        // ✅ update state + localStorage
        setFriendDetails(result.friendDetails);
        setLastUpdated(result.updatedAt);
      } else {
        SonnerError("⚠️ Không thể làm mới danh sách bạn bè.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi làm mới bạn bè:", error);
      SonnerError("Có lỗi xảy ra khi làm mới danh sách.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteFriend = async (uid) => {
    try {
      const result = await removeFriend(uid);
      if (result === uid) {
        // ✅ update state
        await deleteFriendDetail(uid);
        await deleteFriendId(uid);
        const updatedFriends = friendDetails.filter((f) => f.uid !== uid);
        setFriendDetails(updatedFriends);
        // ✅ update DB + localStorage
        SonnerSuccess("Đã xoá bạn thành công.");
      } else {
        SonnerWarning("Vui lòng thử lại sau!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi xoá bạn:", error);
      SonnerError("Có lỗi xảy ra khi xoá bạn.");
    }
  };

  const handleHiddenFriend = async (uid) => {
    const prev = friendDetails;

    // setFriendDetails((prev) =>
    //   prev.map((f) => (f.uid === uid ? { ...f, hidden: !f.hidden } : f))
    // );

    try {
      // const res = await toggleHiddenFriend(uid);
      // if (!res?.success) throw new Error();

      SonnerSuccess("Chức năng này đang phát triển!");
    } catch {
      setFriendDetails(prev);
      SonnerError("Không thể cập nhật trạng thái");
    }
  };

  const handleFindFriend = async (searchTermFind) => {
    try {
      const result = await FindFriendByUserName(searchTermFind);
      setFoundUser(result);
    } catch (error) {
      console.error("❌ Lỗi khi tìm bạn:", error);
      setFoundUser(null);
      showError(error.message || "Người dùng không tồn tại");
    }
  };

  // Filter bạn bè theo tên hoặc username
  const filteredFriends = friendDetails.filter((friend) => {
    const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
    const username = (friend.username || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || username.includes(term);
  });

  const visibleFriends = showAllFriends
    ? filteredFriends
    : filteredFriends.slice(0, 3);

  return (
    <>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-base-100/10 backdrop-blur-[2px] bg-opacity-50 transition-opacity duration-500 z-0 ${
          isFriendsTabOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        onClick={() => {
          setFriendsTabOpen(false);
          setShowAllFriends(false);
        }}
      />

      {/* Popup */}
      <div
        className={`fixed inset-0 z-50 flex justify-center items-end transition-all duration-800 ease text-base-content ${
          isFriendsTabOpen
            ? "translate-y-0"
            : "translate-y-full pointer-events-none"
        }`}
      >
        <div
          ref={popupRef}
          className={`relative w-full ${isPWA ? "h-[95vh]" : "h-[85vh]"}
            bg-base-100 flex flex-col rounded-t-4xl shadow-lg
            will-change-transform outline-2 outline-base-content outline-dashed z-50`}
        >
          {/* Header */}
          <div className="sticky top-0 shadow-md z-10 flex flex-col items-center pb-2 px-3 bg-base-100 rounded-t-4xl">
            <div className="flex justify-between items-center w-full">
              <div className="w-12 h-1.5 bg-base-content rounded-full mx-auto my-2" />
              <button
                className="absolute top-2 right-3"
                onClick={() => setFriendsTabOpen(false)}
              >
                <X className="w-8 h-8 btn btn-circle p-1" />
              </button>
            </div>
            <h1 className="text-2xl font-semibold text-base-content">
              ❤️‍🔥 {friendDetails.length} người bạn
            </h1>
            <h2 className="text-md font-semibold text-base-content">
              Tìm kiếm và thêm bạn thân
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
            {/* Tìm kiếm */}
            <div>
              <h2 className="flex items-center gap-2 text-md font-semibold mb-1">
                <FaSearchPlus size={22} /> Tìm kiếm ai đó?
              </h2>
              <div className="flex gap-2 items-center">
                <SearchInput
                  searchTerm={searchTermFind}
                  setSearchTerm={setSearchTermFind}
                  isFocused={isFocusedFind}
                  setIsFocused={setIsFocusedFind}
                  placeholder="Thêm một người bạn mới..."
                />
                {searchTermFind && (
                  <button
                    className="btn btn-base-200 text-sm flex items-center gap-2"
                    onClick={() => handleFindFriend(searchTermFind)}
                  >
                    Tìm kiếm
                  </button>
                )}
              </div>
              <div className="w-full flex justify-center">
                {foundUser ? (
                  <FriendFind friend={foundUser} />
                ) : (
                  <p className="text-gray-400 h-[70px] text-center">
                    Không tìm thấy người dùng nào
                  </p>
                )}
              </div>
            </div>

            {/* Danh sách bạn bè */}
            <div>
              <h1 className="flex items-center gap-2 font-semibold text-md mb-1">
                <FaUserFriends size={25} className="scale-x-[-1]" /> Bạn bè của
                bạn
              </h1>

              {/* Search + refresh */}
              <div className="flex gap-2 items-center mt-2">
                <SearchInput
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  isFocused={isFocused}
                  setIsFocused={setIsFocused}
                  placeholder="Tìm kiếm bạn bè..."
                />
                <button
                  className={`btn btn-base-200 text-sm flex items-center gap-2 ${
                    isRefreshing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleRefreshFriends}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <>
                      <LoadingRing size={20} stroke={2} />
                      <span>Đang làm mới...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="w-4 h-4" />
                      <span>Làm mới</span>
                    </>
                  )}
                </button>
              </div>

              {/* Last updated */}
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-1">
                  Cập nhật lần cuối:{" "}
                  {new Date(lastUpdated).toLocaleString("vi-VN")}
                </p>
              )}

              {/* List */}
              <div className="mt-4">
                {filteredFriends.length === 0 && (
                  <p className="text-gray-400 text-center mt-10">
                    Không có bạn bè để hiển thị
                  </p>
                )}

                <FriendItem
                  friends={visibleFriends}
                  onDelete={handleDeleteFriend}
                  onHidden={handleHiddenFriend}
                />

                {filteredFriends.length > 3 && (
                  <div className="flex items-center gap-4 mt-4">
                    <hr className="flex-grow border-t border-base-content" />
                    <button
                      onClick={() => setShowAllFriends(!showAllFriends)}
                      className="bg-base-200 hover:bg-base-300 text-base-content font-semibold px-4 py-2 rounded-3xl"
                    >
                      {showAllFriends ? "Thu gọn" : "Xem thêm"}
                    </button>
                    <hr className="flex-grow border-t border-base-content" />
                  </div>
                )}
              </div>
            </div>

            {/* Requests */}
            <IncomingFriendRequests />
            <OutgoingRequest />
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendsContainer;
