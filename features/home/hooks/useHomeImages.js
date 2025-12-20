"use client";

import { useEffect, useState } from "react";
import { useAutoSlider } from "@/shared/hooks/useAutoSlider";
import { IMAGE_BASE_URL } from "@/shared/constants/apiBaseUrl";

export function useHomeImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch(
        `${IMAGE_BASE_URL}/data/jsonData/homeDataImages.json`
      );

      if (!res.ok) {
        const text = await res.text();
        return new NextResponse(text, {
          status: res.status,
          headers: { "content-type": "text/plain" },
        });
      }
      const result = await res.json();
      setImages(result.images ?? []);
    };

    fetchImages();
  }, []);

  const { index, setIndex } = useAutoSlider(images.length, 5000);

  return { images, index, setIndex };
}
