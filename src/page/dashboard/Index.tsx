import { ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardTopBar from "./DashboardTopBar";
import EmptyState from "./EmptyState";
import HeroCard from "./HeroCard";
import MasteryCurve from "./MasteryCurve";
import ProgressCard from "./ProgressCard";
import TopicCard from "./TopicCard";
import { curveForRecommendation, pickRecommendation, summarize } from "./dashboardLogic";
import { getMockDashboard } from "./mockData";

// Grid cells stretch their single child so cards in a row share the same height.
const cell = "flex [&>*]:flex-1";

export default function Index() {
  const [searchParams] = useSearchParams();
  // TODO: ganti getMockDashboard dengan data Supabase (student_progress, student_answers); ?demo= hanya untuk fase mock.
  const data = getMockDashboard(searchParams.get("demo"));
  const recommendation = pickRecommendation(data.topics);
  const summary = summarize(data);
  const curve = curveForRecommendation(data, recommendation);

  const greeting = <h1 className="font-display text-2xl font-bold sm:text-3xl">Halo, {data.studentName}</h1>;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <DashboardTopBar studentName={data.studentName} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {recommendation.kind === "empty" ? (
          <div className="max-w-2xl space-y-5">
            {greeting}
            <EmptyState />
          </div>
        ) : (
          <div className="space-y-5">
            {greeting}

            <div className="grid gap-5 lg:grid-cols-12">
              <div className={`${cell} lg:col-span-8`}>
                <HeroCard recommendation={recommendation} />
              </div>
              <div className={`${cell} lg:col-span-4`}>
                <ProgressCard topics={data.topics} summary={summary} />
              </div>
              {curve && (
                <div className={`${cell} lg:col-span-12`}>
                  <MasteryCurve topicName={curve.topicName} points={curve.points} />
                </div>
              )}
            </div>

            <section aria-labelledby="topik-heading" className="pt-3">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 id="topik-heading" className="font-display text-lg font-bold">
                  Topikmu
                </h2>
                <Link
                  to="/topicSelect"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[var(--color-pink-deep)] hover:underline"
                >
                  Jelajahi topik
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.topics.map((topic) => (
                  <li key={topic.id} className="flex [&>*]:flex-1">
                    <TopicCard topic={topic} />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
