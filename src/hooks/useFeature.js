// hooks/useFeature.js - Mở khóa toàn bộ tính năng VIP không giới hạn
export const useFeatureVisible = (type) => {
  // Mở khóa toàn bộ tính năng VIP
  return true;
};

export const useGetCode = (type) => {
  return "VIP-LIFETIME";
};

export const getMaxUploads = () => {
  return {
    image: null, // Không giới hạn dung lượng ảnh
    video: null, // Không giới hạn dung lượng video
    storage_limit_mb: -1, // Không giới hạn tổng dung lượng lưu trữ
  };
};

export const getVideoRecordLimit = () => {
  // Cho phép quay video chất lượng cao lên tới 60 giây (hoặc tùy chỉnh)
  return 60;
};
