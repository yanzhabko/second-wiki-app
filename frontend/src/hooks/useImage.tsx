import { useState, useEffect } from "react";
import { api } from "../utils/server";

export const useImage = (imageId: string | undefined) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!imageId) {
      setImageUrl(null);
      return;
    }

    setLoading(true);
    setError(null);

    let url: string | null = null;

    api
      .get(`/image/${imageId}`, { responseType: "blob" })
      .then((res) => {
        url = URL.createObjectURL(res.data);
        setImageUrl(url);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [imageId]);

  return { imageUrl, loading, error };
};
