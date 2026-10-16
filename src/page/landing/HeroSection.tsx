import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PathPreview from "./PathPreview";
import { CONTAINER, NIGHT_GRADIENT } from "./landingStyles";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden text-[var(--color-cream)]"
      style={{ background: NIGHT_GRADIENT }}
    >
      {/* Decoration continues the Auth world: one soft blob, constellation dots. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[26rem] -left-[18rem] -z-10 size-[44rem] rounded-full bg-[#c51f72] opacity-30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[22%] left-[46%] -z-10 size-1 rounded-full bg-[#ffb9ce] opacity-75"
        style={{
          boxShadow:
            "42px 60px 0 #c09cfa, 120px -30px 0 #ffcf77, -80px 180px 0 #ff90b3, 30px 260px 0 #a985ed, -160px 40px 0 #ffcf77",
        }}
      />

      <div
        className={`${CONTAINER} grid items-center gap-14 pt-28 pb-20 sm:pt-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:pt-36 lg:pb-28`}
      >
        <div>
          <h1
            id="hero-title"
            className="font-display max-w-[13ch] text-[clamp(36px,5vw,60px)] leading-[1.04] font-extrabold tracking-[-0.035em]! text-balance text-[#fff8fb]"
          >
            Yang sudah kamu kuasai, kami lewati.
          </h1>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-[#e6cfe1]">
            Cek kemampuanmu di satu topik, lalu pelajari hanya bagian yang belum. Mulai dari Dasar Pemrograman.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/auth" className="btn-primary inline-flex items-center justify-center gap-2">
              Mulai belajar
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <a
              href="#cara-kerja"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[var(--color-cream)]/85 underline-offset-4 hover:text-white hover:underline"
            >
              Lihat cara kerjanya
              <ArrowDown aria-hidden="true" size={16} />
            </a>
          </div>
          <p className="mt-6 text-sm text-[var(--color-cream)]/60">Gratis. Cukup daftar dengan email.</p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mr-0">
          {/* Orbit rings behind the product shot, the Auth orbit at hero scale. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff75a833]"
            style={{ boxShadow: "0 0 0 56px #ff75a80d, 0 0 0 112px #ff75a808" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#ffb1c640]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[6%] -right-3 -z-10 size-2.5 rounded-full bg-[#a88af9]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 left-[12%] -z-10 size-2 rounded-full bg-[#ffdc7c]"
          />

          <span
            aria-hidden="true"
            className="absolute -top-6 -right-3 z-10 grid size-14 rotate-12 place-items-center rounded-[17px] bg-gradient-to-br from-[#ff97b8] to-[#ef3677] shadow-[0_14px_30px_rgba(255,64,117,0.45)] sm:-right-6"
          >
            <Sparkles className="size-6 -rotate-12 fill-[#fff9db] text-[#fff9db]" />
          </span>

          <PathPreview />
        </div>
      </div>
    </section>
  );
}
