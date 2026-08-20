import { useState, useEffect } from "react";
import {
  getMoments,
  subscribeToNewMoments,
  createMoment,
  uploadMediaToSupabase,
} from "@/services/SupabaseServices";

export function useSupabaseMoments() {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMoments() {
      try {
        setLoading(true);
        const data = await getMoments();
        if (isMounted) setMoments(data);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMoments();

    // Lắng nghe realtime
    const sub = subscribeToNewMoments((newMoment) => {
      if (isMounted) {
        setMoments((prev) => [newMoment, ...prev]);
      }
    });

    return () => {
      isMounted = false;
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
  }, []);

  const uploadAndPost = async (file, momentMetadata, userId) => {
    try {
      const mediaUrl = await uploadMediaToSupabase(file, userId);
      const newMoment = await createMoment({
        ...momentMetadata,
        mediaUrl,
        userId,
      });
      return newMoment;
    } catch (err) {
      console.error("Lỗi upload & đăng moment:", err);
      throw err;
    }
  };

  return { moments, loading, error, uploadAndPost, setMoments };
}
