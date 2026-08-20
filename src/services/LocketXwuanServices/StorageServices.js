import { supabase } from "@/lib/supabase";

export const uploadFileAndGetInfoR2 = async (
  file,
  previewType = "other",
  localId
) => {
  if (!file) throw new Error("Không tìm thấy tệp phương tiện để tải lên.");

  const safeType = (previewType || "image").toLowerCase();
  const timestamp = Date.now();
  const extension = file.name ? file.name.split(".").pop() : (safeType === "video" ? "mp4" : "jpg");
  const fileName = `locket-xwuan_${timestamp}_${localId || "user"}.${extension}`;
  const filePath = `uploads/${localId || "anonymous"}/${fileName}`;

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("moments-media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ Supabase upload error:", uploadError);
      throw new Error(uploadError.message || "Lỗi tải ảnh lên Supabase Storage");
    }

    const { data } = supabase.storage.from("moments-media").getPublicUrl(filePath);

    return {
      downloadURL: data.publicUrl,
      metadata: {
        name: fileName,
        size: file.size || 0,
        type: file.type || (safeType === "video" ? "video/mp4" : "image/jpeg"),
        uploadedAt: new Date().toISOString(),
        path: filePath,
      },
    };
  } catch (err) {
    console.error("❌ Lỗi uploadFileAndGetInfoR2:", err);
    throw err;
  }
};
