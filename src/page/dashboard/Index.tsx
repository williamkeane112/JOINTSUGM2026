import { useSearchParams } from "react-router-dom";
import DashboardTopBar from "./DashboardTopBar";
import EmptyState from "./EmptyState";
import ExploreCard from "./ExploreCard";
import HeroCard from "./HeroCard";
import MasteryCurve from "./MasteryCurve";
import ProgressCard from "./ProgressCard";
import TopicCard from "./TopicCard";
import { curveForRecommendation, pickRecommendation, startedTopics, summarize } from "./dashboardLogic";
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

  const greeting = <h1 className="font-display text-xl font-bold tracking-[-0.01em]!">Halo, {data.studentName}</h1>;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <DashboardTopBar studentName={data.studentName} />
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        {recommendation.kind === "empty" ? (
          <div className="max-w-2xl space-y-4">
            {greeting}
            <EmptyState />
          </div>
        ) : (
          <div className="space-y-4">
            {greeting}

            <div className="grid gap-4 lg:grid-cols-12">
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

            <section aria-labelledby="topik-heading" className="pt-2">
              <h2 id="topik-heading" className="font-display mb-3 text-base font-bold tracking-[-0.01em]!">
                Topikmu
              </h2>
              {/* Locked topics live on the Topik page; the dashboard lists started topics and ends with an invitation to explore more. */}
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {startedTopics(data.topics).map((topic) => (
                  <li key={topic.id} className="flex [&>*]:flex-1">
                    <TopicCard topic={topic} />
                  </li>
                ))}
                <li className="flex [&>*]:flex-1">
                  <ExploreCard />
                </li>
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
