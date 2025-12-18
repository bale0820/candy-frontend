"use client";

import { useEffect, useState } from "react";
import { useAutoSlider } from "@/shared/hooks/useAutoSlider";
import { IMAGE_BASE_URL } from "@/shared/constants/imageBaseUrl";

export function useHomeImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch(`${IMAGE_BASE_URL}/jsonData/homeDataImages.json`);
      const result = await res.json();
      setImages(result.images ?? []);
    };

    fetchImages();
  }, []);

  const { index, setIndex } = useAutoSlider(images.length, 5000);

  return { images, index, setIndex };
}
