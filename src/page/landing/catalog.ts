/**
 * Topic catalog shown on the landing page (`TopicsSection`).
 *
 * `available` must only be set to `true` once a topic's skills, diagnostic/practice
 * questions, and learning materials are complete and checked manually (see
 * `.kiro/steering/01-mvp-scope.md` — "sedikit tapi dalam"). Topics with
 * `available: false` render as "Segera hadir" and are not meant to be opened yet.
 */

export interface CatalogTopic {
  name: string;
  blurb: string;
  available: boolean;
}

export interface Category {
  name: string;
  topics: readonly CatalogTopic[];
}

export const CATALOG: readonly Category[] = [
  {
    name: "Pemrograman",
    topics: [
      { name: "Dasar Pemrograman", blurb: "Variabel, kondisi, perulangan, fungsi", available: true },
      { name: "Struktur Data", blurb: "List, stack, queue, dictionary", available: false },
      { name: "Pemrograman Web", blurb: "HTML, CSS, JavaScript dasar", available: false },
    ],
  },
  {
    name: "Matematika SMP",
    topics: [
      { name: "Pecahan", blurb: "Senilai, operasi, soal cerita", available: false },
      { name: "Persamaan Linear", blurb: "Satu variabel, soal cerita", available: false },
    ],
  },
  {
    name: "SMA",
    topics: [
      { name: "Fisika Dasar", blurb: "Gerak lurus, gaya, energi", available: false },
    ],
  },
];
