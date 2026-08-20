import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useContext,
} from "react";
import PropTypes from "prop-types";
import * as utils from "@/utils";
import { updateUserInfo } from "@/services";
import { fetchStreak } from "@/utils/SyncData/streakUtils";
import { useFriendStore } from "@/stores/useFriendStore";
import { showDevWarning } from "@/utils/logging/devConsole";

export const AuthContext = createContext();

// Gói VIP Vĩnh Viễn Không Giới Hạn cho người dùng
export const DEFAULT_VIP_PLAN = {
  customer_code: "VIP-LIFETIME",
  display_name: "VIP Unlimited Member",
  start_date: "2024-01-01",
  end_date: null, // Vĩnh viễn
  plan_info: {
    id: "vip_unlimited",
    name: "VIP Vĩnh Viễn (Không Giới Hạn)",
    description: "Toàn bộ tính năng cao cấp không giới hạn",
    billing_cycle: "lifetime",
    storage_limit_mb: -1, // Không giới hạn MB
    max_uploads: -1, // Không giới hạn lượt đăng
    ui: {
      badge: "👑 VIP MEMBER",
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      highlight_color: "#000000",
    },
    feature_flags: {
      all_tools: true,
      custom_theme: true,
      custom_frame: true,
      custom_caption: true,
      custom_music: true,
      unlimited_uploads: true,
      hd_quality: true,
      video_record_max_length: 60,
      early_access: true,
      priority_support: true,
      streak_restore: true,
      bulk_delete_friends: true,
      export_data: true,
      max_uploads: {
        image: null,
        video: null,
      },
    },
  },
  upload_stats: {
    image_uploaded: 0,
    video_uploaded: 0,
    total_storage_used_mb: 0,
    error_count: 0,
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(utils.getUser());
  const [authTokens, setAuthTokens] = useState(() => utils.getToken());
  const [loading, setLoading] = useState(false);

  const [friendDetails, setFriendDetails] = useState([]);

  // Mặc định luôn là gói VIP không giới hạn
  const [userPlan, setUserPlan] = useState(DEFAULT_VIP_PLAN);
  const [uploadStats, setUploadStats] = useState(DEFAULT_VIP_PLAN.upload_stats);
  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem("streak");
      if (!saved || saved === "undefined" || saved === "null") return null;
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  });

  const { loadFriends } = useFriendStore();

  useEffect(() => {
    showDevWarning();
    localStorage.removeItem("failedUploads");
    localStorage.removeItem("friendsList");
    localStorage.removeItem("uploadedMoments");
    localStorage.removeItem("uploadedPayloads");
  }, []);

  useEffect(() => {
    loadFriends(user, authTokens); // ✅ Tự load local + sync server
  }, [user, authTokens]);

  // 🔹 Luôn duy trì gói VIP
  useEffect(() => {
    if (!user || !authTokens?.idToken || !authTokens?.localId) return;

    const init = async () => {
      fetchStreak(setStreak);
      try {
        await updateUserInfo(user);
      } catch (e) {
        // Bỏ qua lỗi cập nhật nếu offline/local
      }
    };

    init();
  }, [user, authTokens?.idToken, authTokens?.localId]);

  // 🔹 Reset context
  const resetAuthContext = () => {
    setUser(null);
    setAuthTokens(null);
    setFriendDetails([]);
    setUserPlan(DEFAULT_VIP_PLAN);
    setUploadStats(DEFAULT_VIP_PLAN.upload_stats);

    utils.removeUser();
    utils.removeToken();
    localStorage.removeItem("friendsList");
    localStorage.removeItem("userPlan");
    localStorage.removeItem("uploadStats");
  };

  const refreshStreak = (newStreak) => {
    setStreak(newStreak);
    localStorage.setItem("streak", JSON.stringify(newStreak));
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      loading,
      friendDetails,
      setFriendDetails,
      userPlan,
      setUserPlan,
      authTokens,
      setAuthTokens,
      resetAuthContext,
      uploadStats,
      setUploadStats,
      streak,
      setStreak,
      fetchStreak,
      refreshStreak,
    }),
    [user, loading, friendDetails, userPlan, authTokens, uploadStats, streak]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}
