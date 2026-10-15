import { Plus } from "lucide-react";
import { BRAND_NAME } from "../../lib/brand";
import { CONTAINER, SECTION, SECTION_TITLE } from "./landingStyles";

const FAQ = [
  {
    q: "Apakah gratis?",
    a: "Ya. Paket Gratis bisa dipakai sekarang. Paket Pro segera hadir, dan paket Gratis tetap ada.",
  },
  {
    q: "Topik apa saja yang ada?",
    a: "Mulai dari Dasar Pemrograman. Katalog bertambah ke pemrograman lanjut, SMP, dan SMA. Topik baru dibuka setelah soalnya lengkap dan dicek.",
  },
  {
    q: "Kalau aku sudah paham sebagian, harus mulai dari awal?",
    a: "Tidak. Ada cek kemampuan singkat di awal topik. Skill yang sudah kamu kuasai dilewati.",
  },
  {
    q: "Apa bedanya dengan bertanya ke ChatGPT?",
    a: `ChatGPT menjawab pertanyaanmu. ${BRAND_NAME} mencatat apa yang sudah dan belum kamu kuasai dari setiap jawaban, lalu menyusun urutan belajarmu. AI membantu menjelaskan, bukan menentukan jalur.`,
  },
  {
    q: "Seberapa akurat cek kemampuan dari beberapa soal?",
    a: "Itu perkiraan awal. Makin banyak latihan, makin tepat, dan jalurmu disusun ulang.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className={`${SECTION} bg-white`}>
      <div className={`${CONTAINER} grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14`}>
        <h2 id="faq-title" className={SECTION_TITLE}>
          Pertanyaan yang sering muncul
        </h2>
        <div className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {FAQ.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  aria-hidden="true"
                  size={18}
                  className="shrink-0 text-[var(--color-pink-deep)] transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-[62ch] pb-5 text-base leading-relaxed text-[var(--color-muted)]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
