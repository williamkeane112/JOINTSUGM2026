
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

import { BRAND_NAME } from "../../lib/brand";
import { supabase } from "../../lib/supabaseClient";
import BrandMark from "./BrandMark";
import { CONTAINER } from "./landingStyles";

const ANCHORS = [
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#topik", label: "Topik" },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
];

const navLink =
  "inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold text-[var(--color-cream)]/80 transition-colors hover:bg-white/10 hover:text-white pointer-coarse:h-11";

export default function LandingNav() {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("Gagal memeriksa sesi login:", error.message);
      }

      setSession(data?.session ?? null);
      setAuthChecked(true);
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setAuthChecked(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isLoggedIn = Boolean(session?.user);

  return (
    <header className="absolute inset-x-0 top-0 z-20 text-[var(--color-cream)]">
      <div
        className={`${CONTAINER} grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 py-4`}
      >
        <Link
          to="/"
          aria-label={`${BRAND_NAME}, beranda`}
          className="flex min-h-11 min-w-11 items-center justify-self-start rounded-xl"
        >
          <BrandMark hideNameOnMobile />
        </Link>

        <nav
          aria-label="Bagian halaman"
          className="hidden items-center gap-1 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10 md:flex"
        >
          {ANCHORS.map((anchor) => (
            <a
              key={anchor.href}
              href={anchor.href}
              className={navLink}
            >
              {anchor.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 justify-self-end sm:gap-2">
          {authChecked && !isLoggedIn && (
            <Link to="/auth" className={navLink}>
              Masuk
            </Link>
          )}

          <Link
            to={isLoggedIn ? "/dashboard" : "/auth"}
            className="btn-primary btn-sm inline-flex items-center justify-center whitespace-nowrap"
          >
            {isLoggedIn ? "Dashboard" : "Mulai belajar"}
          </Link>
        </div>
      </div>
    </header>
  );
}
