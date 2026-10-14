import { useEffect, useState } from "react";

export default function useCountUp(
  target: number,
  duration = 800
): number {
  const safeTarget = Number.isFinite(target) ? target : 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    let startTime: number | null = null;

    const startValue = 0;
    const difference = safeTarget - startValue;

    if (duration <= 0 || difference === 0) {
      setCount(safeTarget);
      return;
    }

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out: animasi cepat di awal dan melambat di akhir.
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + difference * easedProgress;

      setCount(
        progress === 1
          ? safeTarget
          : Math.round(nextValue)
      );

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [safeTarget, duration]);

  return count;
}
