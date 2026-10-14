import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  BookOpen,
  Clock,
  LayoutDashboard,
  Lock,
  LogOut,
  Map,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { TopicStatus } from "./mockData";
import { statusStyle, usePrefersReducedMotion } from "./dashboardUtils";

/* ------------------------------------------------------------------ */
/* CircularProgress — the single bold data-viz moment on the page     */
/* ------------------------------------------------------------------ */

export function CircularProgress({
  value,
  size = 64,
}: {
  value: number;
  size?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [animatedValue, setAnimatedValue] = useState(() =>
    reducedMotion ? value : 0,
  );
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimatedValue(value));
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const offset = circumference * (1 - animatedValue / 100);

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Mastery keseluruhan ${value} persen`}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EADFE4"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FF4F87"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: reducedMotion
              ? "none"
              : "stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
      <span className="absolute font-display text-lg font-bold text-[#17111F] tabular">
        {value}%
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StatCard — flat 1px-line elevation, differentiated secondary slot  */
/* ------------------------------------------------------------------ */

export function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  valueColor,
  children,
}: {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  valueColor: string;
  children?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-2 rounded-[14px] bg-white p-5"
      style={{ border: "1px solid #EADFE4" }}
    >
      <span
        className="grid h-8 w-8 place-items-center rounded-full"
        style={{ background: iconBg, color: iconColor }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span
        className="font-display text-2xl font-bold tabular"
        style={{ color: valueColor }}
      >
        {value}
      </span>
      <span className="text-xs text-[#766B7F]">{label}</span>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TopicMiniCard — knowledge-map preview item                          */
/* ------------------------------------------------------------------ */

export function TopicMiniCard({
  name,
  status,
  mastery,
}: {
  name: string;
  status: TopicStatus;
  mastery: number;
}) {
  const visual = statusStyle(status);
  const locked = status === "locked";

  return (
    <div
      className="min-w-[160px] flex-none rounded-[14px] bg-white p-4"
      style={{ border: "1px solid #EADFE4" }}
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-full ${locked ? "grayscale" : ""}`}
        style={{ background: visual.tint, color: visual.fill }}
        aria-hidden="true"
      >
        {locked ? <Lock className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </span>
      <p className="mt-3 truncate text-sm font-semibold text-[#17111F]">
        {name}
      </p>
      <span className={`mt-2 inline-block ${visual.badgeClass}`}>
        {visual.label}
      </span>
      <p className="mt-2 text-xs text-[#766B7F] tabular">
        {locked ? "Terkunci" : `${mastery}% dikuasai`}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AchievementCard                                                     */
/* ------------------------------------------------------------------ */

export function AchievementCard({
  title,
  description,
  unlocked,
}: {
  title: string;
  description: string;
  unlocked: boolean;
}) {
  return (
    <div
      className="min-w-[140px] flex-none rounded-[14px] bg-white p-4 text-center"
      style={{
        border: "1px solid #EADFE4",
        boxShadow: unlocked ? "0 4px 16px rgba(23,17,31,0.08)" : "none",
      }}
    >
      <span
        className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
          unlocked ? "" : "grayscale opacity-50"
        }`}
        style={{
          background: unlocked ? "#FDF1DE" : "#F1EDEF",
          color: unlocked ? "#92591A" : "#766B7F",
        }}
        aria-hidden="true"
      >
        {unlocked ? (
          <Sparkles className="h-7 w-7" />
        ) : (
          <Lock className="h-7 w-7" />
        )}
      </span>
      <p className="mt-3 text-sm font-semibold text-[#17111F]">{title}</p>
      <p className="mt-1 text-xs text-[#766B7F]">
        {unlocked ? description : "???"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar (desktop) + MobileBottomNav                                 */
/* ------------------------------------------------------------------ */

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function SegeraBadge() {
  return (
    <span
      className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ background: "#F1EDEF", color: "#766B7F" }}
    >
      Segera
    </span>
  );
}

export function Sidebar({
  userName,
  level,
  activePath,
  onLogout,
}: {
  userName: string;
  level: number;
  activePath: string;
  onLogout: () => void;
}) {
  const isDashboardActive = activePath === "/dashboard";

  return (
    <aside
      className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-white p-6 lg:flex"
      style={{ borderRight: "1px solid #EADFE4" }}
      aria-label="Navigasi utama"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ff9ab8] to-[#ff3f7e] shadow-[0_8px_20px_rgba(255,79,135,0.44)]">
          <Sparkles className="h-5 w-5 fill-[#fff8df] text-[#fff8df]" />
        </span>
        <span className="font-display text-lg font-extrabold tracking-tight text-[#17111F]">
          SkillPath AI
        </span>
      </div>

      <nav className="mt-8 flex flex-col gap-1" aria-label="Menu dashboard">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 rounded-[13px] px-4 py-3 text-sm font-semibold transition-colors ${
            isDashboardActive ? "" : "hover:bg-[#FFF0F5]"
          }`}
          style={
            isDashboardActive
              ? {
                  background: "#FFF0F5",
                  color: "#E62F72",
                  borderLeft: "3px solid #FF4F87",
                }
              : { color: "#17111F", borderLeft: "3px solid transparent" }
          }
          aria-current={isDashboardActive ? "page" : undefined}
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          Dashboard
        </Link>

        <Link
          to="/topicSelect"
          className="flex items-center gap-3 rounded-[13px] px-4 py-3 text-sm font-semibold text-[#17111F] transition-colors hover:bg-[#FFF0F5]"
          style={{ borderLeft: "3px solid transparent" }}
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Topik Belajar
        </Link>

        <span
          className="flex cursor-not-allowed items-center gap-3 rounded-[13px] px-4 py-3 text-sm font-semibold"
          style={{ color: "#AFA3AC" }}
          aria-disabled="true"
        >
          <Map className="h-4 w-4" aria-hidden="true" />
          Peta Kemampuan
          <SegeraBadge />
        </span>

        <span
          className="flex cursor-not-allowed items-center gap-3 rounded-[13px] px-4 py-3 text-sm font-semibold"
          style={{ color: "#AFA3AC" }}
          aria-disabled="true"
        >
          <Bot className="h-4 w-4" aria-hidden="true" />
          AI Tutor
          <SegeraBadge />
        </span>
      </nav>

      <div className="mt-auto pt-6" style={{ borderTop: "1px solid #EADFE4" }}>
        <div className="mt-4 flex items-center gap-3">
          <span
            className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
            style={{ background: "#6D36BD" }}
            aria-hidden="true"
          >
            {initials(userName)}
          </span>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-[#17111F]">
              {userName}
            </p>
            <span
              className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ background: "#F3ECFA", color: "#6D36BD" }}
            >
              Level {level}
            </span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Keluar"
            className="grid h-11 w-11 flex-none place-items-center rounded-[13px] text-[#766B7F] transition-colors hover:bg-[#FFF0F5] hover:text-[#E62F72]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav({
  activePath,
  onLogout,
}: {
  activePath: string;
  onLogout: () => void;
}) {
  const isDashboardActive = activePath === "/dashboard";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex h-16 bg-white lg:hidden"
      style={{
        borderTop: "1px solid #EADFE4",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="Navigasi bawah"
    >
      <Link
        to="/dashboard"
        className="relative flex min-h-11 flex-1 flex-col items-center justify-center gap-1"
        style={{ color: isDashboardActive ? "#FF4F87" : "#AFA3AC" }}
        aria-current={isDashboardActive ? "page" : undefined}
      >
        {isDashboardActive && (
          <span
            className="absolute top-1.5 h-1 w-1 rounded-full"
            style={{ background: "#FF4F87" }}
            aria-hidden="true"
          />
        )}
        <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
        <span className="text-[10px] font-medium">Dashboard</span>
      </Link>

      <span
        className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1"
        style={{ color: "#AFA3AC" }}
        aria-disabled="true"
      >
        <Map className="h-5 w-5" aria-hidden="true" />
        <span className="text-[10px] font-medium">Peta</span>
      </span>

      <Link
        to="/topicSelect"
        className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1"
        style={{ color: "#AFA3AC" }}
      >
        <BookOpen className="h-5 w-5" aria-hidden="true" />
        <span className="text-[10px] font-medium">Topik</span>
      </Link>

      <span
        className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1"
        style={{ color: "#AFA3AC" }}
        aria-disabled="true"
      >
        <Bot className="h-5 w-5" aria-hidden="true" />
        <span className="text-[10px] font-medium">AI Tutor</span>
      </span>

      <button
        type="button"
        onClick={onLogout}
        aria-label="Keluar"
        className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1"
        style={{ color: "#AFA3AC" }}
      >
        <UserRound className="h-5 w-5" aria-hidden="true" />
        <span className="text-[10px] font-medium">Profil</span>
      </button>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* RecommendationCard + DiagnosticBanner                               */
/* ------------------------------------------------------------------ */

export function RecommendationCard({
  topic,
  onStart,
}: {
  topic: { name: string; mastery: number; estimatedMinutes: number; status: "weak" | "progress" };
  onStart: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [width, setWidth] = useState(() =>
    reducedMotion ? topic.mastery : 0,
  );
  const visual = statusStyle(topic.status);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(topic.mastery));
    return () => cancelAnimationFrame(frame);
  }, [topic.mastery]);

  return (
    <div className="card">
      <span className={visual.badgeClass}>{visual.label}</span>
      <h3 className="mt-3 font-display text-xl font-bold tracking-[-0.02em] text-[#17111F]">
        {topic.name}
      </h3>
      <div className="mt-2 flex items-start gap-2">
        <Sparkles
          className="mt-0.5 h-4 w-4 flex-none text-[#6D36BD]"
          aria-hidden="true"
        />
        <p className="text-sm italic text-[#766B7F]">
          Nilaimu masih {topic.mastery}% — ayo kita tingkatkan! 💡
        </p>
      </div>

      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full"
        style={{ background: "#EADFE4" }}
        role="progressbar"
        aria-label={`Mastery topik ${topic.name}`}
        aria-valuenow={topic.mastery}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: visual.fill,
            transition: reducedMotion
              ? "none"
              : "width 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-[#766B7F]">
        <span className="tabular">{topic.mastery}% dikuasai</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />~
          {topic.estimatedMinutes} menit
        </span>
      </div>

      <button type="button" onClick={onStart} className="btn-primary mt-5 flex w-full items-center justify-center gap-2">
        Mulai Sekarang
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function DiagnosticBanner({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="rounded-[14px] p-6"
      style={{ background: "#FFF0F5", border: "1px solid #FF4F87" }}
    >
      <p className="flex items-center gap-2 font-display text-base font-bold text-[#17111F]">
        Mulai tes diagnostik untuk rekomendasi personal!
        <ArrowRight className="h-4 w-4 text-[#E62F72]" aria-hidden="true" />
      </p>
      <p className="mt-1 text-sm text-[#766B7F]">
        Kami belum punya data belajarmu. Kerjakan tes singkat supaya Spark
        bisa menyusun jalur belajar yang pas untukmu.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="btn-primary mt-4 flex items-center justify-center gap-2"
      >
        Mulai Tes Diagnostik
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
