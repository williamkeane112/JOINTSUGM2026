import { Brain, TrendingUp } from "lucide-react";

interface MasteryPoint {
  label: string;
  mastery: number;
}

interface MasteryChartProps {
  data?: MasteryPoint[];
  currentMastery?: number;
}

export default function MasteryChart({
  data = [],
  currentMastery = 0,
}: MasteryChartProps) {
  const safeMastery = Math.min(100, Math.max(0, currentMastery));
  const chartData = data.slice(-7);
  const hasData = chartData.length > 0;

  const points = chartData.map((item) => ({
    ...item,
    mastery: Math.min(100, Math.max(0, item.mastery)),
  }));

  const chartWidth = 600;
  const chartHeight = 220;
  const paddingX = 20;
  const paddingY = 20;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const coordinates = points.map((point, index) => ({
    ...point,
    x:
      points.length === 1
        ? chartWidth / 2
        : paddingX + (index / (points.length - 1)) * innerWidth,
    y: paddingY + ((100 - point.mastery) / 100) * innerHeight,
  }));

  const linePath = coordinates
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ");

  const areaPath = coordinates.length
    ? `${linePath} L ${coordinates[coordinates.length - 1].x} ${
        chartHeight - paddingY
      } L ${coordinates[0].x} ${chartHeight - paddingY} Z`
    : "";

  return (
    <section className="rounded-3xl border border-[#EAE2F0] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1EBFF] text-[#7560B5]">
            <Brain size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#29243B]">
              Penguasaan Materi
            </h2>
            <p className="mt-1 text-sm text-[#93879F]">
              Perkembangan kemampuan belajarmu.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#F1EBFF] px-4 py-3">
          <p className="text-xs text-[#81768B]">Penguasaan saat ini</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-[#7560B5]">
            {safeMastery}%
            <TrendingUp size={19} />
          </p>
        </div>
      </div>

      {hasData ? (
        <div className="mt-6">
          <div className="flex justify-between text-xs text-[#A49AAA]">
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
          </div>

          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="mt-2 w-full overflow-visible"
            role="img"
            aria-label="Grafik perkembangan penguasaan materi"
          >
            {[0, 50, 100].map((value) => {
              const y = paddingY + ((100 - value) / 100) * innerHeight;

              return (
                <line
                  key={value}
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#EAE2F0"
                  strokeDasharray="5 5"
                />
              );
            })}

            <path d={areaPath} fill="#9B87D5" fillOpacity="0.12" />

            <path
              d={linePath}
              fill="none"
              stroke="#7560B5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {coordinates.map((point, index) => (
              <circle
                key={`${point.label}-${index}`}
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#FFFFFF"
                stroke="#7560B5"
                strokeWidth="3"
              />
            ))}
          </svg>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {points.map((point, index) => (
              <div
                key={`${point.label}-${index}`}
                className="min-w-0 text-center"
              >
                <p className="truncate text-xs text-[#93879F]">
                  {point.label}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#7560B5]">
                  {point.mastery}%
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCD2E8] bg-[#FFFDFC] px-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1EBFF] text-[#7560B5]">
            <TrendingUp size={23} />
          </div>

          <h3 className="mt-3 font-semibold text-[#29243B]">
            Belum ada data perkembangan
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-[#93879F]">
            Mulai pelajari sebuah topik untuk melihat perkembangan
            penguasaan materimu di sini.
          </p>
        </div>
      )}
    </section>
  );
}
