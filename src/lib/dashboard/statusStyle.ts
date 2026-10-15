import type { TopicStatus } from "./types";

export interface StatusStyle {
  label: string;
  className: string;
  progressClassName: string;
}

export const statusStyle: Record<TopicStatus, StatusStyle> = {
  not_started: {
    label: "Belum dimulai",
    className: "bg-[#F3EFF8] text-[#81768B]",
    progressClassName: "bg-[#B9A7F5]",
  },

  in_progress: {
    label: "Sedang dipelajari",
    className: "bg-[#FFF0D8] text-[#A66D21]",
    progressClassName: "bg-[#9B87D5]",
  },

  completed: {
    label: "Selesai",
    className: "bg-[#E6F6ED] text-[#388A62]",
    progressClassName: "bg-[#65B88B]",
  },

  locked: {
    label: "Terkunci",
    className: "bg-[#F1F1F3] text-[#85818C]",
    progressClassName: "bg-[#C9C5CE]",
  },
};

export function getStatusStyle(status: TopicStatus): StatusStyle {
  return statusStyle[status];
}
