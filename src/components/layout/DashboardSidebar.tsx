
import { useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

interface DashboardSidebarProps {
  studentName: string;
}

const navigation = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Topik Pembelajaran",
    to: "/topic",
    icon: BookOpen,
    end: false,
  },
];

export default function DashboardSidebar({
  studentName,
}: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const initial = studentName.trim().charAt(0).toUpperCase() || "S";

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(signOutError.message);
        return;
      }

      navigate("/auth", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  }

  const sidebarWidth = collapsed ? "lg:w-[88px]" : "lg:w-[260px]";

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-[#EAE2F0] bg-[#FFF9F0] px-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#29243B] text-[#F4A6C1]">
            <Sparkles size={21} />
          </span>

          <div>
            <p className="font-bold text-[#29243B]">SkillPath AI</p>
            <p className="text-xs text-[#93879F]">Adaptive learning</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
          className="flex size-10 items-center justify-center rounded-xl border border-[#EAE2F0] bg-white text-[#29243B]"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup navigasi"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#211829]/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#EAE2F0] bg-white transition-all duration-200 ${sidebarWidth} ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[84px] items-center justify-between border-b border-[#F0EAF5] px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#29243B] text-[#F4A6C1]">
              <Sparkles size={22} />
            </span>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="truncate font-bold tracking-tight text-[#29243B]">
                  SkillPath AI
                </h1>
                <p className="text-xs text-[#93879F]">
                  Adaptive learning
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Perluas sidebar" : "Perkecil sidebar"}
            className="hidden size-8 shrink-0 items-center justify-center rounded-lg text-[#93879F] transition hover:bg-[#F5F0FA] hover:text-[#7560B5] lg:flex"
          >
            <ChevronLeft
              size={18}
              className={collapsed ? "rotate-180" : ""}
            />
          </button>
        </div>

        {/* User profile */}
        <div
          className={`mx-3 mt-5 flex items-center gap-3 rounded-2xl bg-[#F8F5FF] p-3 ${
            collapsed ? "lg:justify-center lg:px-1" : ""
          }`}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EADCF8] font-bold text-[#594477]">
            {initial}
          </span>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#29243B]">
                {studentName}
              </p>
              <p className="mt-0.5 text-xs text-[#93879F]">
                Peserta belajar
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          aria-label="Navigasi dashboard"
          className="mt-7 flex-1 space-y-2 overflow-y-auto px-3"
        >
          {!collapsed && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A49AAA]">
              Menu utama
            </p>
          )}

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    collapsed ? "lg:justify-center lg:px-0" : ""
                  } ${
                    isActive
                      ? "bg-[#29243B] text-white shadow-sm"
                      : "text-[#766C80] hover:bg-[#F5F0FA] hover:text-[#7560B5]"
                  }`
                }
              >
                <Icon size={19} className="shrink-0" />

                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#F0EAF5] p-3">
          {error && (
            <p role="alert" className="mb-3 px-2 text-xs text-red-600">
              Gagal keluar: {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            title={collapsed ? "Keluar" : undefined}
            className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#A64F78] transition hover:bg-[#FFF0F5] disabled:cursor-not-allowed disabled:opacity-50 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <LogOut size={19} className="shrink-0" />
            {!collapsed && (
              <span>{loggingOut ? "Sedang keluar..." : "Keluar"}</span>
            )}
          </button>

          {!collapsed && (
            <p className="mt-3 px-2 text-center text-[10px] text-[#A49AAA]">
              SkillPath AI · Belajar lebih adaptif
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
