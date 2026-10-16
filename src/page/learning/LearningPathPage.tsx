
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import { supabase } from "../../lib/supabaseClient";
import { useLearningPath } from "../../hooks/useLearningPath";
import type { LearningPathStep } from "../../types/learning-path";

import DashboardSidebar from "../../components/layout/DashboardSidebar";
import LearningPathHeader from "../../components/learning-path/LearningPathHeader";
import LearningPathSidebar from "../../components/learning-path/LearningPathSidebar";
import LearningStepCard from "../../components/learning-path/LearningStepCard";
import LearningCompleteModal from "../../components/learning-path/LearningCompleteModal";

export default function LearningPathPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    learningPath,
    progress,
    loading,
    actionLoading,
    error,
    reload,
    startStep,
    completeStep,
  } = useLearningPath(id);

  const [studentName, setStudentName] = useState("Siswa");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionModalDismissed, setCompletionModalDismissed] =
  useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadStudentName() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error(
            "Gagal mengambil profil pengguna:",
            userError.message
          );
          return;
        }

        if (!mounted || !user) return;

        const name =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email?.split("@")[0] ??
          "Siswa";

        setStudentName(name);
      } catch (err) {
        console.error("Gagal memuat nama pengguna:", err);
      }
    }

    void loadStudentName();

    return () => {
      mounted = false;
    };
  }, []);

  const steps = learningPath?.learning_path_steps ?? [];

  const currentStep =
    steps.find((step) => step.status === "in_progress") ??
    steps.find((step) => step.status === "available") ??
    null;

  const totalSteps = progress?.total_steps ?? steps.length;

  const completedSteps =
    progress?.completed_steps ??
    steps.filter((step) => step.status === "completed").length;

  const allCompleted =
    totalSteps > 0 && completedSteps === totalSteps;

  const completionPercentage =
    totalSteps > 0
      ? Math.min(
          100,
          Math.round((completedSteps / totalSteps) * 100)
        )
      : 0;

  async function handleStartStep(
    step: LearningPathStep
  ): Promise<boolean> {
    setActionError("");
    setActionMessage("");

    try {
      await startStep(step.id);
      await reload();

      setActionMessage(
        `Tahap "${step.title}" berhasil dimulai.`
      );

      return true;
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Gagal memulai tahap belajar."
      );

      return false;
    }
  }

  async function handleCompleteStep(step: LearningPathStep) {
    if (!id || actionLoading) return;

    setActionError("");
    setActionMessage("");

    try {
      // Selesaikan tahap pembelajaran terlebih dahulu.
      await completeStep(step.id);

      // Muat ulang progres agar data yang ditampilkan terbaru.
      await reload();

      /*
       * CHECKPOINT:
       * Setiap 3 tahap merupakan satu checkpoint.
       *
       * Contoh:
       * order_sequence 3 -> checkpoint 1
       * order_sequence 6 -> checkpoint 2
       * order_sequence 9 -> checkpoint 3
       *
       * Ini mengasumsikan order_sequence dimulai dari 1.
       */
      const isCheckpointBoundary =
        step.order_sequence > 0 &&
        step.order_sequence % 3 === 0;

      if (isCheckpointBoundary) {
        const checkpointNumber = Math.floor(
          step.order_sequence / 3
        );

        navigate(
          `/learning-path/${id}/checkpoint/${checkpointNumber}`
        );

        return;
      }

      setActionMessage(
        `Tahap "${step.title}" berhasil diselesaikan.`
      );

      // Jika semua tahap selesai, tampilkan modal penyelesaian.
      const nextCompletedCount = Math.min(
        totalSteps,
        completedSteps + 1
      );

      if (totalSteps > 0 && nextCompletedCount >= totalSteps) {
        setCompletionModalDismissed(false);
        setShowCompleteModal(true);
      }
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Gagal menyelesaikan tahap belajar."
      );
    }
  }

  async function handleContinue() {
    if (!currentStep || actionLoading || !id) return;

    if (currentStep.status === "available") {
      const started = await handleStartStep(currentStep);

      // Jangan pindah halaman jika proses memulai tahap gagal.
      if (!started) return;

      navigate(
        `/learning-path/${id}/steps/${currentStep.id}`
      );

      return;
    }

    if (currentStep.status === "in_progress") {
      navigate(
        `/learning-path/${id}/steps/${currentStep.id}`
      );
    }
  }

  const pageShell = (content: ReactNode) => (
    <div className="min-h-screen bg-[#fbf9fe] text-[#29243b]">
      <DashboardSidebar studentName={studentName} />

      <div className="min-h-screen min-w-0 lg:ml-[260px]">
        {content}
      </div>
    </div>
  );

  if (loading) {
    return pageShell(
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-3xl border border-[#eee8f8] bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0eaff]">
            <LoaderCircle className="h-7 w-7 animate-spin text-[#7956c8]" />
          </div>

          <p className="mt-4 font-semibold text-[#342a4b]">
            Memuat learning path...
          </p>

          <p className="mt-1 text-sm text-[#898197]">
            Menyiapkan jalur belajarmu
          </p>
        </div>
      </main>
    );
  }

  if (error && !learningPath) {
    return pageShell(
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-3xl border border-[#eee8f8] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#342a4b]">
            Learning path gagal dimuat
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#81788f]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void reload()}
            className="mt-6 rounded-xl bg-[#7653c5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6542b4]"
          >
            Coba lagi
          </button>

          <Link
            to="/dashboard"
            className="ml-4 text-sm font-semibold text-[#7653c5] hover:underline"
          >
            Dashboard
          </Link>
        </section>
      </main>
    );
  }

  if (!learningPath) {
    return pageShell(
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-lg rounded-3xl border border-[#eee8f8] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0eaff] text-[#7956c8]">
            <BookOpen className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#342a4b]">
            Learning path tidak ditemukan
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#81788f]">
            Learning path mungkin belum dibuat atau kamu tidak
            memiliki akses ke data tersebut.
          </p>

          <Link
            to="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-[#7653c5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6542b4]"
          >
            Kembali ke dashboard
          </Link>
        </section>
      </main>
    );
  }

  return pageShell(
    <>
      <LearningPathHeader
        learningPath={learningPath}
        onReload={() => void reload()}
        loading={loading}
      />

      <main className="px-4 pb-10 pt-6 sm:px-6 xl:px-8">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0 space-y-5">
            <section className="rounded-2xl border border-[#eee8f8] bg-white p-5 shadow-[0_5px_24px_-18px_rgba(51,36,83,0.3)] sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0eaff] text-[#7956c8]">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#8b7aa9]">
                      Ruang belajarmu
                    </p>

                    <h2 className="mt-0.5 text-xl font-extrabold tracking-tight text-[#302744]">
                      Tahapan pembelajaran
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[#898197]">
                      Pelajari materi secara berurutan untuk membuka
                      tahap berikutnya.
                    </p>
                  </div>
                </div>

                <div className="min-w-[150px] rounded-xl bg-[#f8f5ff] px-4 py-3">
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[#766a8e]">
                    <span>Progres jalur</span>
                    <span>{completionPercentage}%</span>
                  </div>

                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8e0f5]"
                    role="progressbar"
                    aria-label="Progres jalur belajar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={completionPercentage}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7855c8] to-[#a28ae2] transition-all"
                      style={{
                        width: `${completionPercentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1.5 text-right text-[11px] text-[#8b819d]">
                    {completedSteps} dari {totalSteps} tahap
                  </p>
                </div>
              </div>
            </section>

            {actionMessage && (
              <div
                role="status"
                className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{actionMessage}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setActionMessage("")}
                  aria-label="Tutup notifikasi"
                  className="rounded-lg px-2 text-lg leading-none text-emerald-700 hover:bg-emerald-100"
                >
                  ×
                </button>
              </div>
            )}

            {(actionError || error) && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{actionError || error}</p>
              </div>
            )}

            <section className="rounded-2xl border border-[#eee8f8] bg-white p-5 shadow-[0_5px_24px_-18px_rgba(51,36,83,0.3)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0ebf6] pb-5">
                <div>
                  <h3 className="font-bold text-[#342a4b]">
                    Perjalanan belajarmu
                  </h3>

                  <p className="mt-1 text-sm text-[#898197]">
                    {steps.length === 0
                      ? "Tahap belajar belum tersedia."
                      : "Ikuti alur tahap dari awal sampai selesai."}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1ebff] px-3 py-1.5 text-xs font-bold text-[#7653c5]">
                  <BookOpen className="h-3.5 w-3.5" />
                  {completedSteps}/{totalSteps} selesai
                </span>
              </div>

              {steps.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-[#dcd2eb] bg-[#fcfaff] px-5 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0eaff] text-[#7956c8]">
                    <BookOpen className="h-6 w-6" />
                  </div>

                  <p className="mt-4 font-semibold text-[#423754]">
                    Belum ada tahap pembelajaran
                  </p>

                  <p className="mt-1 text-sm text-[#898197]">
                    Tahapan akan muncul di sini setelah tersedia.
                  </p>
                </div>
              ) : (
              <div className="pt-5 space-y-1">
  {steps.map((step, index) => {
    const isCheckpointBoundary =
      step.order_sequence > 0 &&
      step.order_sequence % 3 === 0;

    const checkpointNumber = Math.floor(
      step.order_sequence / 3
    );

    const checkpointSteps = steps.filter(
      (item) =>
        item.order_sequence > step.order_sequence - 3 &&
        item.order_sequence <= step.order_sequence
    );

    const checkpointReady =
      isCheckpointBoundary &&
      checkpointSteps.length === 3 &&
      checkpointSteps.every(
        (item) => item.status === "completed"
      );

    return (
      <div key={step.id}>
        <LearningStepCard
          step={step}
          isLast={index === steps.length - 1}
          actionLoading={actionLoading}
          onStart={async (selectedStep) => {
            const started =
              await handleStartStep(selectedStep);

            if (started && id) {
              navigate(
                `/learning-path/${id}/steps/${selectedStep.id}`
              );
            }
          }}
          onOpen={(selectedStep) =>
            navigate(
              `/learning-path/${id}/steps/${selectedStep.id}`
            )
          }
          onComplete={(selectedStep) =>
            void handleCompleteStep(selectedStep)
          }
        />

        {isCheckpointBoundary && (
          <div className="relative ml-5 border-l-2 border-dashed border-[#d5c4f5] py-4 pl-6 sm:ml-7 sm:pl-8">
            <div className="rounded-2xl border border-[#ded1fa] bg-gradient-to-r from-[#f7f2ff] to-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7956c8] text-white shadow-sm">
                    <Sparkles className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-[#e9ddff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6945b4]">
                      Evaluasi pembelajaran
                    </span>

                    <h4 className="mt-2 font-bold text-[#34264e]">
                      Checkpoint {checkpointNumber}
                    </h4>

                    <p className="mt-1 text-sm leading-5 text-[#817493]">
                      Uji pemahamanmu dari 3 tahap sebelumnya
                      melalui 10 soal pilihan ganda.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-lg bg-white px-2.5 py-1.5 text-[#7653c5] ring-1 ring-[#e7dcf8]">
                        10 soal
                      </span>
                      <span className="rounded-lg bg-white px-2.5 py-1.5 text-[#7653c5] ring-1 ring-[#e7dcf8]">
                        Nilai minimum 70%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {checkpointReady ? (
                    <Link
                      to={`/learning-path/${id}/checkpoint/${checkpointNumber}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7956c8] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6845b7] sm:w-auto"
                    >
                      Mulai checkpoint
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-xl bg-[#eee8f8] px-4 py-3 text-sm font-semibold text-[#897ba3]">
                      <AlertCircle className="h-4 w-4" />
                      Selesaikan 3 tahap
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  })}
</div>
              )}
            </section>
          </div>

          <div className="min-w-0 xl:sticky xl:top-[100px]">
            <LearningPathSidebar
              progress={progress}
              currentStep={currentStep}
              allCompleted={allCompleted}
              actionLoading={actionLoading}
              onContinue={() => void handleContinue()}
            />
          </div>
        </div>
      </main>

    
      <LearningCompleteModal
        open={showCompleteModal && !completionModalDismissed}
        title="Selamat, kamu berhasil!"
        description="Semua tahap pembelajaran telah kamu selesaikan. Kamu tetap bisa membaca ulang materi kapan saja."
        statusLabel="Learning path selesai"
        onClose={() => {
          setShowCompleteModal(false);
          setCompletionModalDismissed(true);
        }}
      />

    </>
  );
}
