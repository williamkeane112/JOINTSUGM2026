
interface Props {
  value: unknown;
}

type SkillRow = Record<string, unknown>;

const SKILL_NAMES: Record<string, string> = {
  testing_authorization: "Otorisasi Pengujian",
  safe_lab: "Lab Aman",
  network_fundamentals: "Dasar Jaringan",
  web_security: "Keamanan Web",
  access_control: "Kontrol Akses",
  input_security: "Keamanan Input",
  account_security: "Keamanan Akun",
  vulnerability_reporting: "Pelaporan Kerentanan",
};

function formatLabel(value: string): string {
  const normalized = value.trim().toLowerCase();

  if (SKILL_NAMES[normalized]) {
    return SKILL_NAMES[normalized];
  }

  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSkillName(row: SkillRow, index: number): string {
  const candidates = [
    row.skill_name,
    row.skill,
    row.name,
    row.label,
    row.skill_key,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      const name = candidate.trim();

      if (!/^(kemampuan|skill|kompetensi)\s*\d*$/i.test(name)) {
        return formatLabel(name);
      }
    }
  }

  return `Kemampuan ${index + 1}`;
}

function formatValue(value: unknown): string {
  if (typeof value === "number") {
    return `${value}%`;
  }

  const text = String(value ?? "Belum ada analisis");

  const labels: Record<string, string> = {
    strong: "Kuat",
    developing: "Berkembang",
    needs_improvement: "Perlu ditingkatkan",
    beginner: "Pemula",
    intermediate: "Menengah",
    advanced: "Mahir",
  };

  return labels[text.toLowerCase()] ?? formatLabel(text);
}

function getItems(value: unknown): [string, string][] {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (typeof item === "string") {
        return [`Kemampuan ${index + 1}`, item];
      }

      if (!item || typeof item !== "object") {
        return [`Kemampuan ${index + 1}`, String(item ?? "—")];
      }

      const row = item as SkillRow;
      const name = getSkillName(row, index);

      const result =
        row.level ??
        row.status ??
        row.mastery ??
        row.analysis ??
        row.description ??
        row.percentage ??
        "Belum ada analisis";

      return [name, formatValue(result)];
    });
  }

  return Object.entries(value as Record<string, unknown>).map(
    ([key, item]) => {
      if (item && typeof item === "object") {
        const row = item as SkillRow;

        return [
          getSkillName(row, 0) === "Kemampuan 1"
            ? formatLabel(key)
            : getSkillName(row, 0),
          formatValue(
            row.level ??
              row.status ??
              row.mastery ??
              row.analysis ??
              row.description ??
              row.percentage ??
              "Belum ada analisis",
          ),
        ];
      }

      return [formatLabel(key), formatValue(item)];
    },
  );
}

export default function SkillAnalysis({ value }: Props) {
  const items = getItems(value);

  if (items.length === 0) {
    return (
      <p className="text-sm text-[#93879F]">
        Analisis kemampuan belum tersedia.
      </p>
    );
  }

  return (
    <div className="divide-y divide-[#F0E9F2]">
      {items.map(([label, result], index) => {
        const normalized = result.toLowerCase();

        const isStrong =
          normalized === "kuat" || normalized === "strong";

        return (
          <div
            key={`${label}-${index}`}
            className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-1 last:pb-1"
          >
            <span className="text-sm text-[#493763]">
              {label}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                isStrong
                  ? "bg-[#E8F7EF] text-[#2D9060]"
                  : "bg-[#FFF3DF] text-[#98702A]"
              }`}
            >
              {result}
            </span>
          </div>
        );
      })}
    </div>
  );
}
