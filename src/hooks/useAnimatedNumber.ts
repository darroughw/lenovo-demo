import { useEffect, useRef, useState } from "react";

const DURATION_MS = 400;

// Counts from the previous value to the next over a short animation, using
// requestAnimationFrame since CSS can't interpolate text content. Skips the
// animation entirely for prefers-reduced-motion.
export function useAnimatedNumber(value: number): number {
  const [displayValue, setDisplayValue] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    if (value === fromRef.current) return;

    const from = fromRef.current;
    const start = performance.now();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let rafId: number;

    function tick(now: number) {
      if (prefersReducedMotion) {
        fromRef.current = value;
        setDisplayValue(value);
        return;
      }

      const progress = Math.min(1, (now - start) / DURATION_MS);
      setDisplayValue(Math.round(from + (value - from) * progress));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    }

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return displayValue;
}
