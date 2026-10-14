
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

type LearningGoal = {
  id: string;
  user_id: string;
  topic_id: number | null;
  requested_topic: string | null;
  description: string | null;
  target_outcome: string | null;
  target_level: string;
  status: string;
  created_at: string;
  updated_at?: string;
};

const levelLabels: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
};

const statusLabels: Record<string, string> = {
  pending: "Persiapan belajar",
  active: "Sedang belajar",
  in_progress: "Sedang belajar",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function LearningGoalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [goal, setGoal] = useState<LearningGoal | null>(null);
  const [topicName, setTopicName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGoal = useCallback(async () => {
    if (!id) {
      setError("ID tujuan belajar tidak ditemukan.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/login");
        return;
      }

      // Hanya mengambil tujuan belajar milik pengguna yang login.
      const { data, error: goalError } = await supabase
        .from("learning_goals")
        .select(
          "id, user_id, topic_id, requested_topic, description, target_outcome, target_level, status, created_at, updated_at"
        )
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (goalError) throw goalError;

      if (!data) {
        setGoal(null);
        setError(
          "Tujuan belajar tidak ditemukan atau kamu tidak memiliki akses."
        );
        return;
      }

      const learningGoal = data as LearningGoal;
      setGoal(learningGoal);

      // Topik dari katalog memakai nama pada tabel topics.
      // Topik yang diajukan sendiri memakai requested_topic.
      if (learningGoal.topic_id !== null) {
        const { data: topic, error: topicError } = await supabase
          .from("topics")
          .select("name")
          .eq("id", learningGoal.topic_id)
          .maybeSingle();

        if (topicError) throw topicError;
        setTopicName(topic?.name ?? learningGoal.requested_topic);
      } else {
        setTopicName(learningGoal.requested_topic);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat tujuan belajar."
      );
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    void loadGoal();
  }, [loadGoal]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl animate-pulse space-y-5">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="h-48 rounded-2xl bg-white" />
          <div className="h-40 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !goal) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="text-3xl">📚</div>
          <h1 className="mt-3 text-xl font-bold text-slate-900">
            Tujuan belajar tidak tersedia
          </h1>
          <p className="mt-2 break-words text-sm leading-6 text-slate-600">
            {error || "Data tujuan belajar tidak ditemukan."}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => void loadGoal()}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Coba lagi
            </button>
            <button
              onClick={() => navigate("/explore-topics")}
              className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Kembali ke katalog
            </button>
          </div>
        </div>
      </main>
    );
  }

  const displayTopic = topicName || goal.requested_topic || "Topik belajar";
  const displayStatus = statusLabels[goal.status] ?? goal.status;
  const displayLevel = levelLabels[goal.target_level] ?? goal.target_level;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/explore-topics")}
          className="mb-6 text-sm font-medium text-slate-600 hover:text-violet-700"
        >
          ← Kembali ke katalog
        </button>

        {/* Header tujuan belajar */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-600 p-6 text-white sm:p-9">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              Tujuan Belajar
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
              {displayStatus}
            </span>
          </div>

          <h1 className="mt-5 break-words text-3xl font-bold sm:text-4xl">
            {displayTopic}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-violet-100 sm:text-base">
            {goal.target_outcome ||
              goal.description ||
              "Mulai perjalanan belajarmu dan kembangkan kemampuan secara bertahap."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-xl bg-white/10 px-4 py-2">
              Tingkat: {displayLevel}
            </span>
            <span className="rounded-xl bg-white/10 px-4 py-2">
              Dibuat:{" "}
              {new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(goal.created_at))}
            </span>
          </div>
        </section>

        {/* Alur pembelajaran */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Perjalanan Belajarmu
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Kenali kemampuan awalmu, lalu susun langkah belajar yang sesuai.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🧠
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Langkah 1
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Diagnostic Quiz
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Jawab pertanyaan untuk mengukur pemahaman awal. Hasilnya
                akan menjadi dasar penentuan materi yang sesuai.
              </p>

              <button
                onClick={() =>
                  navigate(`/learning-goals/${goal.id}/diagnostic`)
                }
                className="mt-5 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                Mulai Tes Diagnostik →
              </button>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl">
                ✨
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-violet-700">
                Langkah 2
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                AI Learning Path
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Dapatkan roadmap belajar personal berdasarkan tujuan,
                tingkat kemampuan, dan hasil tes diagnostik.
              </p>

              <button
                onClick={() =>
                  navigate(`/learning-goals/${goal.id}/path`)
                }
                className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Lihat Learning Path →
              </button>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Jika roadmap belum dibuat, halaman berikutnya perlu
                menangani proses pembuatannya.
              </p>
            </article>
          </div>
        </section>

        {/* Detail tujuan */}
        {goal.description && goal.target_outcome && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-bold text-slate-900">
              Detail Tujuan Belajar
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {goal.description}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
