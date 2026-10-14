import { LogOut, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const pill =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors sm:px-5";
const pillIdle =
  "bg-white text-[var(--color-ink)] ring-1 ring-[var(--color-line)] hover:bg-[#fff0f5]";
const pillActive = "bg-[var(--color-night)] text-[var(--color-cream)]";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `${pill} ${isActive ? pillActive : pillIdle}`;

export default function DashboardTopBar({
  studentName,
}: {
  studentName: string;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loading) return;

    setLoading(true);
    setError("");

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      setLoading(false);
      return;
    }

    navigate("/auth", { replace: true });
  }

  const initial = studentName.trim().charAt(0).toUpperCase();

  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-cream)] sm:sticky sm:top-0 sm:z-10">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          aria-label="SkillPath AI, ke dashboard"
          className="font-display flex min-h-11 items-center gap-2 text-lg font-bold sm:mr-4"
        >
          <Sparkles
            aria-hidden="true"
            size={22}
            className="text-[var(--color-pink)]"
          />
          <span className="hidden sm:inline">SkillPath AI</span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="flex flex-1 items-center gap-2"
        >
          <NavLink to="/dashboard" end className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/topicSelect" className={navClass}>
            Topik
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {initial && (
            <span
              aria-hidden="true"
              className="font-display hidden size-10 items-center justify-center rounded-full bg-[var(--color-night)] text-sm font-bold text-[var(--color-cream)] sm:flex"
            >
              {initial}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            aria-label={loading ? "Keluar..." : "Keluar"}
            className={`${pill} ${pillIdle} gap-2 disabled:cursor-not-allowed disabled:opacity-60 max-sm:min-w-11 max-sm:px-0`}
          >
            <LogOut aria-hidden="true" size={16} />
            <span className="hidden sm:inline">
              {loading ? "Keluar..." : "Keluar"}
            </span>
          </button>
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="mx-auto max-w-7xl px-4 pb-3 text-sm text-[var(--color-weak-ink)] sm:px-6 lg:px-8"
        >
          {error}
        </p>
      )}
    </header>
  );
}
