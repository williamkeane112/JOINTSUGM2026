
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Network,
  Brain,
  TrendingUp,
  ArrowRight,
  CircleHelp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export interface MasteryPoint {
  label: string;
  mastery: number;
}

interface MasteryChartProps {
  data?: MasteryPoint[];
  currentMastery?: number;
  learningGoalId?: string;
}

const NODE_POSITIONS = [
  { x: 50, y: 20 },
  { x: 27, y: 39 },
  { x: 73, y: 39 },
  { x: 19, y: 70 },
  { x: 50, y: 60 },
  { x: 82, y: 70 },
  { x: 35, y: 83 },
  { x: 68, y: 83 },
];

const CONNECTIONS: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 5],
  [3, 4],
  [4, 5],
  [3, 6],
  [4, 6],
  [4, 7],
  [5, 7],
];

const COLORS = [
  "#FF6B13",
  "#8B5CF6",
  "#8B5CF6",
  "#F59E0B",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#EC4899",
];

function clamp(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getMasteryColor(value: number): string {
  if (value >= 80) return "#00B981";
  if (value >= 50) return "#8B5CF6";
  if (value > 0) return "#FF9800";
  return "#D1C5F0";
}

function getStatus(value: number): string {
  if (value >= 80) return "Mahir";
  if (value >= 50) return "Berkembang";
  if (value > 0) return "Perlu latihan";
  return "Belum dikuasai";
}

function getSuggestion(value: number): string {
  if (value >= 80) {
    return "Bagus! Pertahankan penguasaanmu dan coba latihan yang lebih menantang.";
  }

  if (value >= 50) {
    return "Kamu sudah mulai memahami skill ini. Lanjutkan latihan untuk memperkuat pemahaman.";
  }

  if (value > 0) {
    return "Skill ini masih perlu dilatih. Pelajari kembali konsep dasar dan kerjakan latihan.";
  }

  return "Mulai belajar dan kerjakan latihan untuk skill ini.";
}

function getNodeColor(label: string, mastery: number): string {
  // Warna berdasarkan tingkat penguasaan agar konsisten dengan legenda.
  if (mastery >= 80) return "#00B981";
  if (mastery >= 50) return "#8B5CF6";
  if (mastery > 0) return "#FF9800";

  // Skill 0% tetap memiliki warna visual agar node mudah dibedakan.
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) | 0;
  }

  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function MasteryChart({
  data = [],
  currentMastery,
  learningGoalId,
}: MasteryChartProps) {
  const navigate = useNavigate();

  const points = useMemo(() => {
    const unique = new Map<string, MasteryPoint>();

    for (const item of data) {
      if (
        typeof item.label !== "string" ||
        !item.label.trim() ||
        !Number.isFinite(item.mastery)
      ) {
        continue;
      }

      const label = item.label.replace(/_/g, " ").trim();
      const key = label.toLowerCase();

      if (!unique.has(key)) {
        unique.set(key, {
          label,
          mastery: clamp(item.mastery),
        });
      }
    }

    return Array.from(unique.values()).slice(
      0,
      NODE_POSITIONS.length,
    );
  }, [data]);

  const [selectedLabel, setSelectedLabel] = useState<string | null>(
    null,
  );

  const selectedIndex = points.findIndex(
    (point) => point.label === selectedLabel,
  );

  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const selectedPoint = points[activeIndex] ?? null;

  const averageMastery =
    currentMastery !== undefined &&
    Number.isFinite(currentMastery)
      ? clamp(currentMastery)
      : points.length > 0
        ? Math.round(
            points.reduce((sum, point) => sum + point.mastery, 0) /
              points.length,
          )
        : 0;

  const positions = points.map((point, index) => ({
    ...point,
    ...NODE_POSITIONS[index],
    index,
  }));

  const connections = CONNECTIONS.filter(
    ([from, to]) =>
      from < positions.length && to < positions.length,
  );

  function selectSkill(point: MasteryPoint) {
    setSelectedLabel(point.label);
  }

  function handleNavigate() {
    if (!learningGoalId) return;

    navigate(
      `/learning-goals/${encodeURIComponent(learningGoalId)}`,
    );
  }

  return (
    <section className="w-full rounded-[26px] border border-[#E9DFF1] bg-white p-5 shadow-sm sm:p-6 lg:p-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0E9FF] text-[#7960C0]">
            <Network size={23} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-[#29243B]">
                Jaringan Penguasaan Skill
              </h2>

              <span className="inline-flex items-center gap-1 rounded-full border border-[#E9DFFF] bg-[#F8F4FF] px-2 py-1 text-[10px] font-medium text-[#7960C0]">
                <Sparkles size={11} />
                Interactive
              </span>
            </div>

            <p className="mt-1 text-sm text-[#93879F]">
              Jelajahi skill dan lihat perkembangan belajarmu.
            </p>
          </div>
        </div>

        <div className="w-fit rounded-2xl border border-[#EDE7FF] bg-gradient-to-br from-[#F6F2FF] to-[#EDEEFF] px-4 py-3">
          <p className="text-xs text-[#81768B]">
            Rata-rata penguasaan
          </p>

          <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-[#7960C0]">
            {averageMastery}%
            <TrendingUp size={18} />
          </p>
        </div>
      </div>

      {points.length === 0 ? (
        <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-[#FBF9FF] p-6 text-center">
          <Brain size={32} className="text-[#7960C0]" />

          <h3 className="mt-3 font-semibold text-[#29243B]">
            Jaringan skill belum tersedia
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-[#93879F]">
            Tambahkan tujuan belajar atau kerjakan kuis untuk mulai
            membangun jaringan penguasaan skill.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.35fr_1fr]">
          {/* Panel jaringan kiri */}
          <div className="min-w-0">
            <div className="relative min-h-[390px] overflow-hidden rounded-[24px] border border-[#EAE2FF] bg-gradient-to-br from-[#FAF7FF] via-white to-[#F0F3FF] p-4 sm:min-h-[500px] sm:p-5">
              <div className="absolute left-5 top-5">
                <p className="text-[11px] font-bold tracking-[0.18em] text-[#7960C0]">
                  SKILL MAP
                </p>
                <p className="mt-1 text-xs text-[#93879F]">
                  Pilih node untuk melihat detail
                </p>
              </div>

              <span className="absolute right-4 top-5 rounded-full border border-[#F0EBF7] bg-white px-3 py-2 text-[11px] font-medium text-[#7960C0] shadow-sm">
                {points.length} skill
              </span>

              <svg
                viewBox="0 0 100 100"
                role="group"
                aria-label="Jaringan penguasaan skill"
                className="absolute inset-x-4 bottom-[58px] top-[70px] h-[calc(100%-128px)] w-[calc(100%-32px)]"
              >
                {connections.map(([from, to]) => {
                  const a = positions[from];
                  const b = positions[to];

                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="#DAD5F8"
                      strokeWidth="0.65"
                    />
                  );
                })}

                {positions.map((point) => {
                  const color = getNodeColor(
                    point.label,
                    point.mastery,
                  );

                  const selected = point.index === activeIndex;
                  const radius = selected ? 3.8 : 3.1;

                  return (
                    <g
                      key={`${point.label}-${point.index}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${point.label}, ${point.mastery}%`}
                      aria-pressed={selected}
                      className="cursor-pointer outline-none"
                      onClick={() => selectSkill(point)}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          selectSkill(point);
                        }
                      }}
                    >
                      <title>
                        {`${point.label}: ${point.mastery}%`}
                      </title>

                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={radius + 3}
                        fill={color}
                        opacity={selected ? 0.13 : 0.09}
                      />

                      {selected && (
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={radius + 4.2}
                          fill="none"
                          stroke={color}
                          strokeWidth="0.55"
                          strokeDasharray="1.5 1.5"
                        />
                      )}

                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={radius}
                        fill={color}
                        stroke="white"
                        strokeWidth="1.2"
                      />

                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="0.8"
                        fill="white"
                      />
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap justify-center gap-x-3 gap-y-1 border-t border-[#EEE8FA] pt-3 text-[10px] text-[#81768B]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  Klik node untuk memilih
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-violet-400" />
                  Pilih skill untuk melihat detail
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-[#81768B]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Mahir: 80–100%
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Berkembang: 50–79%
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Perlu latihan: 1–49%
              </span>
            </div>
          </div>

          {/* Panel detail kanan */}
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#29243B]">
                  Detail penguasaan
                </h3>

                <p className="mt-1 text-xs text-[#93879F]">
                  Informasi skill yang sedang dipilih
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-[#F0EBF7] bg-[#FAF9FC] px-3 py-2 text-xs text-[#7960C0]">
                {activeIndex + 1} / {points.length}
              </span>
            </div>

            {selectedPoint && (
              <div className="mt-4 overflow-hidden rounded-[24px] border border-[#E9DFFF] bg-white shadow-sm">
                <div className="h-1.5 bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD]" />

                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F2ECFF] text-[#8B5CF6]">
                      <Brain size={23} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold tracking-[0.16em] text-[#93879F]">
                        SKILL TERPILIH
                      </p>

                      <h4 className="mt-1 break-words font-bold text-[#29243B]">
                        {selectedPoint.label}
                      </h4>

                      <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-[#E8EAF0] bg-[#F4F6FA] px-2.5 py-1 text-[11px] font-medium text-[#64748B]">
                        {selectedPoint.mastery >= 80 ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <CircleHelp size={12} />
                        )}
                        {getStatus(selectedPoint.mastery)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#81768B]">
                          Tingkat penguasaan
                        </p>
                        <p className="mt-1 text-xs text-[#A49AAF]">
                          Berdasarkan data pembelajaran
                        </p>
                      </div>

                      <p
                        className="shrink-0 text-3xl font-semibold"
                        style={{
                          color: getMasteryColor(
                            selectedPoint.mastery,
                          ),
                        }}
                      >
                        {selectedPoint.mastery}
                        <span className="text-base">%</span>
                      </p>
                    </div>

                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#F0F2F7]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${selectedPoint.mastery}%`,
                          backgroundColor: getMasteryColor(
                            selectedPoint.mastery,
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#64748B]">
                    {getSuggestion(selectedPoint.mastery)}
                  </p>

                  <button
                    type="button"
                    onClick={handleNavigate}
                    disabled={!learningGoalId}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7960B8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#684EA9] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Lanjutkan Belajar
                    <ArrowRight size={17} />
                  </button>

                  {!learningGoalId && (
                    <p className="mt-2 text-xs leading-5 text-[#93879F]">
                      ID learning goal belum tersedia. Kirim
                      learningGoalId dari komponen induk agar tombol
                      dapat digunakan.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Semua skill */}
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h4 className="text-[11px] font-bold text-[#64748B]">
                  SEMUA SKILL
                </h4>

                <p className="text-[11px] text-[#93879F]">
                  Pilih untuk melihat detail
                </p>
              </div>

              <div className="space-y-2">
                {points.map((point, index) => {
                  const selected = index === activeIndex;
                  const color = getNodeColor(
                    point.label,
                    point.mastery,
                  );

                  return (
                    <button
                      type="button"
                      key={`${point.label}-${index}`}
                      onClick={() => selectSkill(point)}
                      aria-pressed={selected}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        selected
                          ? "border-[#D9CCFF] bg-[#F8F5FF] shadow-sm ring-1 ring-[#E7DEFF]"
                          : "border-[#EEF0F5] bg-white hover:border-[#DDD2F8] hover:bg-[#FCFAFF]"
                      }`}
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${color}18`,
                          color,
                        }}
                      >
                        <Brain size={18} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-[#29243B]">
                          {point.label}
                        </span>

                        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#EEF1F6]">
                          <span
                            className="block h-full rounded-full transition-all"
                            style={{
                              width: `${point.mastery}%`,
                              backgroundColor: color,
                            }}
                          />
                        </span>
                      </span>

                      <span className="shrink-0 text-right">
                        <span
                          className="block text-sm font-semibold"
                          style={{ color }}
                        >
                          {point.mastery}%
                        </span>

                        <span className="mt-1 block text-[10px] text-[#A49AAF]">
                          {selected ? "Dipilih" : "Penguasaan"}
                        </span>
                      </span>

                      {selected && (
                        <ArrowRight
                          size={15}
                          className="shrink-0 text-[#7960C0]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-[#F0ECF5] pt-4">
        <p className="text-xs leading-5 text-[#A49AAF]">
          <CircleHelp
            size={14}
            className="mr-2 inline-block align-[-2px]"
          />
          Setiap node mewakili satu skill. Warna node mengikuti tingkat
          penguasaan, sedangkan garis menunjukkan hubungan visual
          antarskill.
        </p>
      </div>
    </section>
  );
}
