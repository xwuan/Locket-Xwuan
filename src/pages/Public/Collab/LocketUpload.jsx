import React, { useState, useRef, useContext } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { uploadMediaToSupabase, createMoment } from "@/services/SupabaseServices";
import { UploadCloud, Image as ImageIcon, Film, CheckCircle2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { showToast } from "@/components/Toast";
import LoadingRing from "@/components/UI/Loading/ring";
import { useNavigate } from "react-router-dom";

export default function LocketUploadCollabPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState("image");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith("video/");
    const isImg = file.type.startsWith("image/");

    if (!isVid && !isImg) {
      return showToast("error", "Chỉ hỗ trợ định dạng hình ảnh hoặc video!");
    }

    setSelectedFile(file);
    setFileType(isVid ? "video" : "image");
    setPreviewUrl(URL.createObjectURL(file));
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return showToast("error", "Vui lòng chọn ảnh hoặc video để tải lên!");
    }

    setUploading(true);
    try {
      // Upload lên Supabase Storage
      const mediaUrl = await uploadMediaToSupabase(selectedFile, user?.uid || "anonymous");

      // Lưu Moment
      await createMoment({
        userId: user?.uid || "anonymous",
        userName: user?.displayName || "Locket User",
        userAvatar: user?.profilePicture || user?.photoURL || "",
        mediaUrl,
        mediaType: fileType,
        caption,
      });

      setUploadSuccess(true);
      showToast("success", "Đã đăng khoảnh khắc lên Locket thành công!");
    } catch (err) {
      console.error("Upload error:", err);
      showToast("error", "Đăng tải thất bại. Vui lòng thử lại!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-4 md:p-8">
      {/* Banner */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-7 h-7 text-emerald-200" />
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                Collab x Locket Upload
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Công Cụ Upload Trực Tiếp
            </h1>
            <p className="mt-2 text-white/90 text-sm md:text-base max-w-xl">
              Tải ảnh và video chất lượng cao lên Locket nhanh chóng, hỗ trợ xử lý mượt mà và lưu trữ đám mây an toàn.
            </p>
          </div>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="max-w-4xl mx-auto bg-base-100 p-6 md:p-8 rounded-3xl shadow-xl border border-base-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Preview / Dropzone */}
          <div>
            {previewUrl ? (
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-black shadow-inner">
                {fileType === "video" ? (
                  <video src={previewUrl} className="w-full h-full object-cover" controls autoPlay playsInline />
                ) : (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                )}

                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="btn btn-circle btn-sm btn-error absolute top-3 right-3 shadow-lg"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-base-300 hover:border-primary rounded-3xl aspect-square flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-base-200/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base md:text-lg">Nhấn để chọn ảnh hoặc video</h3>
                <p className="text-xs text-base-content/60 mt-1 max-w-xs">
                  Hỗ trợ JPG, PNG, WEBP, MP4, MOV. Tự động tối ưu tỉ lệ vuông Locket.
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Right Form Controls */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Thêm Caption cho khoảnh khắc</label>
              <textarea
                rows={3}
                placeholder="Nhập cảm nghĩ của bạn..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="textarea textarea-bordered w-full rounded-2xl text-sm"
              />
            </div>

            {uploadSuccess && (
              <div className="alert alert-success rounded-2xl text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Khoảnh khắc đã được đăng tải thành công!</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="btn btn-primary w-full rounded-2xl text-base font-bold shadow-lg"
              >
                {uploading ? (
                  <>
                    <LoadingRing size={20} color="white" />
                    Đang đăng tải...
                  </>
                ) : (
                  <>
                    Đăng lên Locket <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/locket-beta")}
                className="btn btn-outline w-full rounded-2xl"
              >
                Mở Locket Camera Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
