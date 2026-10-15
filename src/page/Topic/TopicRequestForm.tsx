import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  FileText,
  GraduationCap,
  Lightbulb,
  LoaderCircle,
  Sparkles,
  Target,
} from "lucide-react";

import { supabase } from "../../lib/supabaseClient";
import DashboardSidebar from "../../components/layout/DashboardSidebar";

type TargetLevel = "beginner" | "intermediate" | "advanced";

const levels: {
  value: TargetLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "beginner",
    label: "Pemula",
    description: "Saya baru mulai belajar",
  },
  {
    value: "intermediate",
    label: "Menengah",
    description: "Saya sudah memahami dasarnya",
  },
  {
    value: "advanced",
    label: "Lanjutan",
    description: "Saya ingin mendalami materi",
  },
];

export default function TopicRequestForm() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [outcome, setOutcome] = useState("");
  const [description, setDescription] = useState("");
  const [targetLevel, setTargetLevel] =
    useState<TargetLevel>("beginner");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const requestedTopic = topic.trim();
    const targetOutcome = outcome.trim();

    if (!requestedTopic || !targetOutcome) {
      setError("Nama topik dan tujuan belajar wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/auth");
        return;
      }

      // 1. Simpan pengajuan topik untuk ditinjau admin.
      const { error: requestError } = await supabase
        .from("topic_requests")
        .insert({
          user_id: user.id,
          requested_topic: requestedTopic,
          suggested_category: category.trim() || null,
          target_outcome: targetOutcome,
          description: description.trim() || null,
          target_level: targetLevel,
          status: "pending",
        });

      if (requestError) {
        throw new Error(
          `Pengajuan topik gagal disimpan: ${requestError.message}`,
        );
      }

      // 2. Buat tujuan belajar pribadi.
      const { data: goal, error: goalError } = await supabase
        .from("learning_goals")
        .insert({
          user_id: user.id,
          topic_id: null,
          requested_topic: requestedTopic,
          target_outcome: targetOutcome,
          description: description.trim() || null,
          target_level: targetLevel,
          status: "pending",
        })
        .select("id")
        .single();

      if (goalError || !goal) {
        setError(
          "Pengajuan topik berhasil dikirim, tetapi tujuan belajar gagal dibuat. " +
            (goalError?.message ?? ""),
        );
        return;
      }

      // 3. Buka halaman tujuan belajar.
      navigate(`/learning-goals/${goal.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim pengajuan.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#29243B] lg:pl-[260px]">
      {/* Sidebar utama */}
      <DashboardSidebar studentName="Pelajar" />

      {/* Konten halaman */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Tombol kembali */}
        <button
          type="button"
          onClick={() => navigate("/topic")}
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#766C80] transition hover:bg-white hover:text-[#7560B5]"
        >
          <ArrowLeft size={17} />
          Kembali ke katalog
        </button>

        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-[28px] bg-[#30213F] px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-[#7560B5]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-[#F43F91]/15 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#F6C4DC]">
              <Sparkles size={14} />
              Personalisasi perjalanan belajar
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Topik yang kamu cari
              <span className="block text-[#F4A6C1]">
                belum tersedia?
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
              Ajukan topik yang kamu inginkan. Tentukan kemampuan yang
              ingin kamu kuasai dan mulailah merancang perjalanan
              belajarmu bersama SkillPath AI.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-xs font-medium text-white/80">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                <Target size={15} className="text-[#F4A6C1]" />
                Tujuan personal
              </span>

              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                <GraduationCap size={15} className="text-[#C5B5FF]" />
                Sesuai kemampuan
              </span>
            </div>
          </div>
        </section>

        {/* Layout form dan informasi */}
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Form */}
          <section className="min-w-0 rounded-3xl border border-[#EAE2F0] bg-white p-5 shadow-[0_8px_30px_rgba(48,33,63,0.035)] sm:p-8">
            <div className="mb-7 flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1EBFF] text-[#7560B5]">
                <BookOpen size={21} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#29243B]">
                  Ajukan topik baru
                </h2>
                <p className="mt-1 text-sm leading-5 text-[#93879F]">
                  Lengkapi informasi berikut agar kebutuhan belajarmu
                  lebih mudah dipahami.
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
              >
                <CircleHelp size={19} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama topik */}
              <div>
                <label
                  htmlFor="topic"
                  className="mb-2 block text-sm font-semibold text-[#393047]"
                >
                  Nama topik
                  <span className="ml-1 text-[#F43F91]">*</span>
                </label>

                <input
                  id="topic"
                  type="text"
                  required
                  maxLength={150}
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="Contoh: React Native untuk Pemula"
                  className="w-full rounded-xl border border-[#E5DDEB] bg-[#FFFEFC] px-4 py-3.5 text-sm text-[#29243B] outline-none transition placeholder:text-[#B0A5B8] hover:border-[#CFC0DF] focus:border-[#7560B5] focus:ring-4 focus:ring-[#7560B5]/10"
                />

                <p className="mt-1.5 text-right text-xs text-[#A49AAA]">
                  {topic.length}/150
                </p>
              </div>

              {/* Kategori */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-[#393047]"
                >
                  Kategori yang disarankan
                  <span className="ml-2 text-xs font-normal text-[#A49AAA]">
                    Opsional
                  </span>
                </label>

                <input
                  id="category"
                  type="text"
                  maxLength={100}
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="Contoh: Pengembangan Mobile"
                  className="w-full rounded-xl border border-[#E5DDEB] bg-[#FFFEFC] px-4 py-3.5 text-sm text-[#29243B] outline-none transition placeholder:text-[#B0A5B8] hover:border-[#CFC0DF] focus:border-[#7560B5] focus:ring-4 focus:ring-[#7560B5]/10"
                />

                <p className="mt-2 text-xs leading-5 text-[#93879F]">
                  Admin akan menentukan kategori akhir jika topik
                  diterbitkan.
                </p>
              </div>

              {/* Tujuan belajar */}
              <div>
                <label
                  htmlFor="outcome"
                  className="mb-2 block text-sm font-semibold text-[#393047]"
                >
                  Apa yang ingin kamu kuasai?
                  <span className="ml-1 text-[#F43F91]">*</span>
                </label>

                <textarea
                  id="outcome"
                  required
                  rows={4}
                  maxLength={1000}
                  value={outcome}
                  onChange={(event) => setOutcome(event.target.value)}
                  placeholder="Contoh: Saya ingin mampu membuat aplikasi mobile menggunakan React Native dan menghubungkannya ke API."
                  className="w-full resize-y rounded-xl border border-[#E5DDEB] bg-[#FFFEFC] px-4 py-3.5 text-sm leading-6 text-[#29243B] outline-none transition placeholder:text-[#B0A5B8] hover:border-[#CFC0DF] focus:border-[#7560B5] focus:ring-4 focus:ring-[#7560B5]/10"
                />

                <p className="mt-1.5 text-right text-xs text-[#A49AAA]">
                  {outcome.length}/1000
                </p>
              </div>

              {/* Tingkat kemampuan */}
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-[#393047]">
                  Tingkat kemampuanmu saat ini
                </legend>

                <div className="grid gap-3 sm:grid-cols-3">
                  {levels.map((level) => {
                    const selected = targetLevel === level.value;

                    return (
                      <button
                        key={level.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setTargetLevel(level.value)}
                        className={`relative rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-[#7560B5] bg-[#F5F0FF] ring-2 ring-[#7560B5]/10"
                            : "border-[#EAE2F0] bg-white hover:border-[#CFC0DF] hover:bg-[#FFFCFF]"
                        }`}
                      >
                        <span
                          className={`mb-3 flex size-9 items-center justify-center rounded-xl ${
                            selected
                              ? "bg-[#7560B5] text-white"
                              : "bg-[#F5F0FA] text-[#93879F]"
                          }`}
                        >
                          {selected ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <GraduationCap size={18} />
                          )}
                        </span>

                        <span className="block text-sm font-bold text-[#30213F]">
                          {level.label}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-[#93879F]">
                          {level.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Deskripsi tambahan */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#393047]"
                >
                  <FileText size={16} className="text-[#7560B5]" />
                  Deskripsi tambahan
                  <span className="text-xs font-normal text-[#A49AAA]">
                    Opsional
                  </span>
                </label>

                <textarea
                  id="description"
                  rows={3}
                  maxLength={2000}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Ceritakan pengetahuan awal, kebutuhan khusus, atau konteks belajarmu."
                  className="w-full resize-y rounded-xl border border-[#E5DDEB] bg-[#FFFEFC] px-4 py-3.5 text-sm leading-6 text-[#29243B] outline-none transition placeholder:text-[#B0A5B8] hover:border-[#CFC0DF] focus:border-[#7560B5] focus:ring-4 focus:ring-[#7560B5]/10"
                />

                <p className="mt-1.5 text-right text-xs text-[#A49AAA]">
                  {description.length}/2000
                </p>
              </div>

              {/* Informasi pengajuan */}
              <div className="rounded-2xl border border-[#E8DDFB] bg-[#F8F4FF] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#7560B5] shadow-sm">
                    <Lightbulb size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#493763]">
                      Belajar tanpa menunggu persetujuan
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#78698C]">
                      Pengajuanmu akan ditinjau admin. Tujuan belajar
                      personal juga akan dibuat agar kamu bisa melanjutkan
                      ke halaman pembelajaran. Topik belum otomatis masuk
                      ke katalog publik.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tombol aksi */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#F0E9F2] pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => navigate("/topic")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5DDEB] bg-white px-5 py-3.5 text-sm font-semibold text-[#766C80] transition hover:bg-[#F9F6FC] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7560B5] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(117,96,181,0.22)] transition hover:bg-[#6550A3] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Mengirim pengajuan...
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />
                      Ajukan & Mulai Belajar
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Panel informasi samping */}
          <aside className="space-y-5">
            <section className="rounded-3xl border border-[#EAE2F0] bg-white p-5 sm:p-6">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#FCEAF2] text-[#D83B83]">
                <Sparkles size={21} />
              </div>

              <h2 className="mt-4 font-bold text-[#30213F]">
                Perjalanan belajarmu dimulai di sini
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#93879F]">
                Jelaskan hasil yang ingin kamu capai supaya tujuan
                pembelajaranmu lebih terarah.
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F1EBFF] text-xs font-bold text-[#7560B5]">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#393047]">
                      Ajukan topik
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#93879F]">
                      Ceritakan materi yang ingin kamu pelajari.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FCEAF2] text-xs font-bold text-[#D83B83]">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#393047]">
                      Buat tujuan belajar
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#93879F]">
                      Pengajuan tersimpan dan tujuan personal dibuat.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E8F7EF] text-xs font-bold text-[#2D9060]">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#393047]">
                      Lanjutkan perjalananmu
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#93879F]">
                      Masuk ke halaman tujuan belajar yang dibuat.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-[#30213F] p-5 text-white sm:p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-[#F4A6C1]">
                <Target size={20} />
              </div>

              <h3 className="mt-4 font-bold">
                Fokus pada hasil
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/65">
                Tujuan yang spesifik membantu perjalanan belajarmu
                menjadi lebih terarah dan mudah dievaluasi.
              </p>

              <button
                type="button"
                onClick={() => navigate("/topic")}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#F4A6C1] transition hover:text-white"
              >
                Jelajahi topik lain
                <ArrowRight size={16} />
              </button>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#EAE2F0] py-6 text-center">
          <p className="text-xs leading-5 text-[#93879F]">
            SkillPath AI · Belajar sesuai kemampuanmu, berkembang setiap hari.
          </p>
        </footer>
      </main>
    </div>
  );
}