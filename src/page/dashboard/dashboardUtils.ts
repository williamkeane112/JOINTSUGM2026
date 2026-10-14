import { useEffect, useState } from "react";
import type { TopicStatus } from "./mockData";

/* ------------------------------------------------------------------ */
/* statusStyle — single source of truth for status → visual mapping   */
/* ------------------------------------------------------------------ */

interface StatusVisual {
  badgeClass: string;
  fill: string;
  tint: string;
  label: string;
}

export function statusStyle(status: TopicStatus): StatusVisual {
  switch (status) {
    case "mastered":
      return {
        badgeClass: "badge-mastered",
        fill: "#1E9E6B",
        tint: "#E3F6EC",
        label: "Dikuasai",
      };
    case "progress":
      return {
        badgeClass: "badge-progress",
        fill: "#E8A33D",
        tint: "#FDF1DE",
        label: "Sedang Dipelajari",
      };
    case "weak":
      return {
        badgeClass: "badge-not-mastered",
        fill: "#E2544B",
        tint: "#FBE6E4",
        label: "Belum Dikuasai",
      };
    case "locked":
      return {
        badgeClass: "badge-locked",
        fill: "#AFA3AC",
        tint: "#F1EDEF",
        label: "Terkunci",
      };
  }
}

/** Respects the user's reduced-motion preference for the one authored load animation. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
