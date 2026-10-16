import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  LockKeyhole,
} from "lucide-react";
import { Link } from "react-router-dom";

export type TopicStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "locked";

interface TopicCardProps {
  id: string;
  title: string;
  description?: string;
  progress?: number;
  status?: TopicStatus;
  href?: string;
}

const statusConfig: Record<
  TopicStatus,
  {
    label: string;
    className: string;
    icon: typeof BookOpen;
  }
> = {
  not_started: {
    label: "Belum dimulai",
    className: "bg-[#F3EFF8] text-[#81768B]",
    icon: BookOpen,
  },
  in_progress: {
    label: "Sedang dipelajari",
    className: "bg-[#FFF0D8] text-[#A66D21]",
    icon: Clock3,
  },
  completed: {
    label: "Selesai",
    className: "bg-[#E6F6ED] text-[#388A62]",
    icon: CheckCircle2,
  },
  locked: {
    label: "Terkunci",
    className: "bg-[#F1F1F3] text-[#85818C]",
    icon: LockKeyhole,
  },
};

export default function TopicCard({
  id,
  title,
  description = "Pelajari materi ini secara bertahap sesuai kemampuanmu.",
  progress = 0,
  status = "not_started",
}: TopicCardProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isLocked = status === "locked";

  // href harus berupa URL detail learning goal jika tersedia.
  // Fallback memakai ID yang diterima komponen.
  const destination = `/learning-goals/${id}`; 

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#EAE2F0] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#C9B9EB] hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1EBFF] text-[#7560B5] transition group-hover:bg-[#E7DEFC]">
          <BookOpen size={23} />
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ${config.className}`}
        >
          <StatusIcon size={13} />
          {config.label}
        </span>
      </div>

      <div className="mt-5 flex-1">
        <h3 className="text-base font-bold leading-6 text-[#29243B]">
          {title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#93879F]">
          {description}
        </p>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-[#93879F]">Progres belajar</span>
          <span className="font-semibold text-[#7560B5]">
            {safeProgress}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-[#F0EAF5]"
          role="progressbar"
          aria-label={`Progres ${title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeProgress}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === "completed"
                ? "bg-[#65B88B]"
                : "bg-[#9B87D5]"
            }`}
            style={{ width: `${safeProgress}%` }}
          />
        </div>
      </div>

      {isLocked ? (
        <button
          type="button"
          disabled
          className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#F3F1F5] px-4 py-3 text-sm font-semibold text-[#A49AAA]"
        >
          <LockKeyhole size={16} />
          Topik Terkunci
        </button>
      ) : (
        <Link
          to={destination}
          state={{ topicId: id }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCD2E8] px-4 py-3 text-sm font-semibold text-[#7560B5] transition hover:border-[#7560B5] hover:bg-[#F8F5FF] focus:outline-none focus:ring-2 focus:ring-[#9B87D5] focus:ring-offset-2"
        >
          {status === "completed"
            ? "Pelajari Lagi"
            : status === "in_progress"
              ? "Lanjutkan"
              : "Mulai Belajar"}

          <ArrowRight size={16} />
        </Link>
      )}
    </article>
  );
}
