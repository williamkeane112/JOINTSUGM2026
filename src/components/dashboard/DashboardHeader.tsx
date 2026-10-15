import { LogOut, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2.5 text-sm font-semibold transition ${
    isActive
      ? "bg-[#29243B] text-[#FFF9F0]"
      : "text-[#625C6D] hover:bg-white hover:text-[#29243B]"
  }`;

export default function DashboardHeader({
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
    <header className="sticky top-0 z-30 border-b border-[#EAE3DC] bg-[#FFF9F0]/95 backdrop-blur">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="SkillPath AI Dashboard"
        >
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[#29243B] text-[#E8B6D0]">
            <Sparkles size={21} />
          </span>

          <span className="hidden sm:block">
            <span className="block font-bold tracking-tight text-[#29243B]">
              SkillPath AI
            </span>
            <span className="block text-xs text-[#8A8190]">
              Adaptive learning
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="flex flex-1 items-center justify-center gap-1 sm:justify-start sm:pl-6"
        >
          <NavLink to="/dashboard" end className={navClass}>
            Dashboard
          </NavLink>

          <NavLink to="/topic" className={navClass}>
            Topik
          </NavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#29243B]">
              {studentName}
            </p>
            <p className="text-xs text-[#8A8190]">Peserta belajar</p>
          </div>

          <span className="flex size-10 items-center justify-center rounded-full bg-[#EADCF8] font-bold text-[#594477]">
            {initial || "U"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            aria-label="Keluar dari akun"
            title="Keluar"
            className="flex size-10 items-center justify-center rounded-full border border-[#EAE3DC] bg-white text-[#625C6D] transition hover:bg-[#FFF0F5] hover:text-[#A64F78] disabled:opacity-50"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mx-auto max-w-7xl px-4 pb-3 text-sm text-red-600 sm:px-6 lg:px-8"
        >
          Gagal keluar: {error}
        </p>
      )}
    </header>
  );
}
