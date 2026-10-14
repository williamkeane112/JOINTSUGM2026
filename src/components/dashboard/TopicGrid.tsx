import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import TopicCard, { type TopicStatus } from "./TopicCard";

export interface DashboardTopic {
  id: string;
  title: string;
  description?: string;
  progress?: number;
  status?: TopicStatus;
  href?: string;
}

interface TopicGridProps {
  topics?: DashboardTopic[];
  title?: string;
  description?: string;
  limit?: number;
}

export default function TopicGrid({
  topics = [],
  title = "Topik Pembelajaran",
  description = "Lanjutkan perjalanan belajarmu dari topik yang tersedia.",
  limit = 6,
}: TopicGridProps) {
  const visibleTopics = topics.slice(0, limit);

  return (
    <section>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EBFF] text-[#7560B5]">
              <BookOpen size={19} />
            </div>

            <h2 className="text-lg font-bold text-[#29243B]">
              {title}
            </h2>
          </div>

          <p className="mt-2 text-sm leading-6 text-[#93879F]">
            {description}
          </p>
        </div>

        <Link
          to="/topicSelect"
          className="inline-flex items-center gap-2 self-start text-sm font-semibold text-[#7560B5] transition hover:text-[#55428F] sm:self-auto"
        >
          Lihat semua topik
          <ArrowRight size={16} />
        </Link>
      </div>

      {visibleTopics.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={topic.title}
              description={topic.description}
              progress={topic.progress}
              status={topic.status}
              href={topic.href}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#DCD2E8] bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1EBFF] text-[#7560B5]">
            <BookOpen size={23} />
          </div>

          <h3 className="mt-4 font-semibold text-[#29243B]">
            Belum ada topik pembelajaran
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#93879F]">
            Pilih topik yang ingin kamu pelajari untuk mulai membangun
            perjalanan belajar yang sesuai dengan kemampuanmu.
          </p>

          <Link
            to="/topicSelect"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7560B5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#62509B]"
          >
            Pilih Topik
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
