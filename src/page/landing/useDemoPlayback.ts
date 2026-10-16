import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export interface DemoPlayback {
  frame: number;
  playing: boolean;
  finished: boolean;
  toggle: () => void;
  replay: () => void;
  goTo: (frame: number) => void;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Drives a short, scripted "demo" animation of `frameCount` frames (used by
 * `DemoSection` on the landing page).
 *
 * Autoplay starts once, the first time `target` scrolls into view at least 40%
 * (`IntersectionObserver`), and never restarts on its own afterwards — scrolling
 * back into view does nothing. If the user scrubs (`goTo`) or interacts
 * (`toggle`) before the observer fires, that pending autoplay is cancelled so it
 * never overrides the user's own choice. With `prefers-reduced-motion`, playback
 * starts (and stays) on the final frame and never autoplays.
 */
export function useDemoPlayback(
  target: RefObject<Element | null>,
  frameCount: number,
  intervalMs = 2200,
): DemoPlayback {
  const reduced = prefersReducedMotion();
  const [frame, setFrame] = useState(() => (reduced ? frameCount - 1 : 0));
  const [playing, setPlaying] = useState(false);

  // One-time "autoplay on scroll" slot: consumed either by the
  // IntersectionObserver firing, or by the user acting first.
  const autoStartConsumedRef = useRef(reduced);

  const consumeAutoStart = useCallback(() => {
    autoStartConsumedRef.current = true;
  }, []);

  useEffect(() => {
    if (reduced) return;

    if (typeof IntersectionObserver === "undefined") {
      if (!autoStartConsumedRef.current) {
        autoStartConsumedRef.current = true;
        setPlaying(true);
      }
      return;
    }

    const element = target.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        if (!autoStartConsumedRef.current) {
          autoStartConsumedRef.current = true;
          setPlaying(true);
        }
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced, target]);

  useEffect(() => {
    if (!playing) return;

    const timeout = setTimeout(() => {
      setFrame((current) => {
        const next = Math.min(frameCount - 1, current + 1);
        if (next >= frameCount - 1) setPlaying(false);
        return next;
      });
    }, intervalMs);

    return () => clearTimeout(timeout);
  }, [playing, frame, frameCount, intervalMs]);

  const finished = frame === frameCount - 1;

  const replay = useCallback(() => {
    consumeAutoStart();
    setFrame(0);
    setPlaying(true);
  }, [consumeAutoStart]);

  const toggle = useCallback(() => {
    consumeAutoStart();
    if (finished) {
      setFrame(0);
      setPlaying(true);
      return;
    }
    setPlaying((current) => !current);
  }, [consumeAutoStart, finished]);

  const goTo = useCallback(
    (nextFrame: number) => {
      consumeAutoStart();
      setFrame(Math.min(frameCount - 1, Math.max(0, nextFrame)));
      setPlaying(false);
    },
    [consumeAutoStart, frameCount],
  );

  return { frame, playing, finished, toggle, replay, goTo };
}
