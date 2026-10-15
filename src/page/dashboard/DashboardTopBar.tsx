import { LogOut, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const pill =
  "inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors pointer-coarse:h-11 sm:px-4";
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
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 py-2 sm:gap-3 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          aria-label="SkillPath AI, ke dashboard"
          className="font-display flex min-h-9 items-center justify-center gap-2 text-base font-bold tracking-[-0.01em]! pointer-coarse:min-h-11 pointer-coarse:min-w-11 justify-self-start"
        >
          <Sparkles
            aria-hidden="true"
            size={20}
            className="text-[var(--color-pink)]"
          />
          <span className="hidden sm:inline">SkillPath AI</span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="flex items-center gap-2"
        >
          <NavLink to="/dashboard" end className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/topicSelect" className={navClass}>
            Topik
          </NavLink>
        </nav>

        <div className="flex items-center justify-self-end gap-2 sm:gap-3">
          {initial && (
            <span
              aria-hidden="true"
              className="font-display hidden size-8 items-center justify-center rounded-full bg-[var(--color-night)] text-xs font-bold text-[var(--color-cream)] sm:flex"
            >
              {initial}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            aria-label={loading ? "Keluar..." : "Keluar"}
            className={`${pill} ${pillIdle} gap-2 disabled:cursor-not-allowed disabled:opacity-60 max-sm:min-w-9 max-sm:px-0 pointer-coarse:max-sm:min-w-11`}
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
          className="mx-auto max-w-6xl px-4 pb-3 text-sm text-[var(--color-weak-ink)] sm:px-6 lg:px-8"
        >
          {error}
        </p>
      )}
    </header>
  );
}
