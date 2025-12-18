"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAutoSlider(length, delay) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (length === 0) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, delay);
  }, [length, delay]);

  useEffect(() => {
    start();
    return () => clearInterval(intervalRef.current);
  }, [start]);

  const handleClick = (i) => {
    setIndex(i);
    start();
  };

  return { index, setIndex: handleClick };
}
