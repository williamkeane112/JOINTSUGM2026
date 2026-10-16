import { Check, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTAINER, SECTION, SECTION_LEAD, SECTION_TITLE } from "./landingStyles";

const FREE = [
  "Semua topik yang tersedia",
  "Cek kemampuan di awal tiap topik",
  "Jalur belajar yang menyesuaikan",
  "AI Tutor dengan batas harian",
];

const PRO = ["AI Tutor tanpa batas", "Topik lanjutan", "Riwayat belajar lengkap"];

export default function PricingSection() {
  return (
    <section id="harga" aria-labelledby="harga-title" className={SECTION}>
      <div className={CONTAINER}>
        <h2 id="harga-title" className={SECTION_TITLE}>
          Harga
        </h2>
        <p className={SECTION_LEAD}>Semua yang kamu butuhkan untuk mulai sudah ada di paket Gratis.</p>

        <div className="mt-10 grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <article className="rounded-[20px] bg-white p-6 shadow-[0_18px_44px_rgba(23,17,31,0.1)] sm:p-8">
            <h3 className="font-display text-xl font-bold tracking-[-0.02em]!">Gratis</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Untuk siapa saja yang mau mulai sekarang.</p>
            <p className="font-display mt-6 text-5xl leading-none font-extrabold tracking-[-0.03em]!">Rp0</p>
            <ul className="mt-6 space-y-3">
              {FREE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--color-mastered-tint)] text-[var(--color-mastered-ink)]">
                    <Check aria-hidden="true" size={13} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/auth" className="btn-primary mt-8 inline-flex w-full items-center justify-center sm:w-auto">
              Mulai belajar
            </Link>
          </article>

          <article className="rounded-[20px] border border-dashed border-[var(--color-silver)]/70 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl font-bold tracking-[-0.02em]!">Pro</h3>
              <span className="badge-locked badge-sm inline-flex items-center gap-1.5">
                <Clock aria-hidden="true" size={12} />
                Segera hadir
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Untuk yang belajar setiap hari.</p>
            <ul className="mt-6 space-y-3">
              {PRO.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-[var(--color-ink)]/80">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--color-locked-tint)] text-[var(--color-locked-ink)]">
                    <Check aria-hidden="true" size={13} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-[var(--color-muted)]">
              Harga diumumkan saat paket ini dibuka. Paket Gratis tetap ada.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
