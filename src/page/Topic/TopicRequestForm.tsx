
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

type TargetLevel = "beginner" | "intermediate" | "advanced";

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

    if (!requestedTopic || !outcome.trim()) {
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
        navigate("/login");
        return;
      }

      // 1. Simpan pengajuan topik untuk ditinjau admin.
      const { error: requestError } = await supabase
        .from("topic_requests")
        .insert({
          user_id: user.id,
          requested_topic: requestedTopic,
          suggested_category: category.trim() || null,
          target_outcome: outcome.trim(),
          description: description.trim() || null,
          target_level: targetLevel,
          status: "pending",
        });

      if (requestError) {
        throw new Error(
          `Pengajuan topik gagal disimpan: ${requestError.message}`
        );
      }

      // 2. Buat tujuan belajar pribadi agar user bisa langsung belajar.
      const { data: goal, error: goalError } = await supabase
        .from("learning_goals")
        .insert({
          user_id: user.id,
          topic_id: null,
          requested_topic: requestedTopic,
          target_outcome: outcome.trim(),
          description: description.trim() || null,
          target_level: targetLevel,
          status: "pending",
        })
        .select("id")
        .single();

      if (goalError || !goal) {
        setError(
          "Pengajuan topik berhasil dikirim, tetapi tujuan belajar gagal dibuat. " +
          (goalError?.message ?? "")
        );
        return;
      }

      // 3. Buka halaman tujuan belajar.
      navigate(`/learning-goals/${goal.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim pengajuan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Kembali
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              Pengajuan topik
            </span>

            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              Ajukan Topik Baru
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tidak menemukan topik yang kamu cari? Ajukan topikmu
              dan mulai belajar secara personal sambil menunggu
              peninjauan admin.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="topic"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Nama topik <span className="text-red-500">*</span>
              </label>

              <input
                id="topic"
                type="text"
                required
                maxLength={150}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: React Native untuk Pemula"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Saran kategori
              </label>

              <input
                id="category"
                type="text"
                maxLength={100}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: Pengembangan Mobile"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Kategori ini hanya saran. Admin menentukan kategori
                final jika topik diterbitkan.
              </p>
            </div>

            <div>
              <label
                htmlFor="outcome"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Apa yang ingin kamu kuasai?{" "}
                <span className="text-red-500">*</span>
              </label>

              <textarea
                id="outcome"
                required
                rows={3}
                maxLength={1000}
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="Contoh: Saya ingin mampu membuat aplikasi mobile dengan React Native dan menghubungkannya ke API."
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="targetLevel"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Tingkat kemampuan
              </label>

              <select
                id="targetLevel"
                value={targetLevel}
                onChange={(e) =>
                  setTargetLevel(e.target.value as TargetLevel)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="beginner">Pemula</option>
                <option value="intermediate">Menengah</option>
                <option value="advanced">Lanjutan</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Deskripsi tambahan
              </label>

              <textarea
                id="description"
                rows={3}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Pengetahuan awal, kebutuhan khusus, atau konteks belajar (opsional)."
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="rounded-xl bg-violet-50 p-4 text-sm leading-6 text-violet-900">
              <strong>Belajar tanpa menunggu persetujuan.</strong>
              <p className="mt-1">
                Pengajuanmu akan ditinjau admin. Kamu tetap dapat
                melanjutkan pembelajaran pribadi, dan topik baru
                belum akan muncul di katalog publik.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={() => navigate(-1)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Mengirim..." : "Ajukan & Mulai Belajar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
