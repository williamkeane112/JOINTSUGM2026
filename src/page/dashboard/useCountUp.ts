import { useEffect, useState } from "react";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Counts from 0 up to `target` once on mount (and again whenever `target` changes).
 * With prefers-reduced-motion it returns the final value immediately.
 */
export function useCountUp(target: number, durationMs = 800): number {
  const [value, setValue] = useState(0);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      start ??= now;
      const t = Math.min(1, (now - start) / durationMs);
      // exponential ease-out; snap to the exact target on the last frame
      const eased = t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, reduced]);

  return reduced ? Math.round(target) : value;
}
