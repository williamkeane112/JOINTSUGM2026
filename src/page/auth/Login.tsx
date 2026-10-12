import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (error) throw error;

      if (data.session) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Login gagal. Silakan coba kembali."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/60">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Selamat Datang!</h1>
          <p className="mt-2 text-sm text-slate-500">Masuk ke akun SkillPath AI</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input id="email" name="email" type="email" placeholder="nama@email.com" value={form.email} onChange={handleChange} autoComplete="email" required disabled={loading} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100" />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Lupa password?
              </Link>
            </div>

            <div className="relative">
              <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" value={form.password} onChange={handleChange} autoComplete="current-password" required disabled={loading} className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100" />
              <button type="button" onClick={() => setShowPassword((previous) => !previous)} disabled={loading} className="absolute inset-y-0 right-3 text-sm font-medium text-slate-500 hover:text-indigo-600 disabled:opacity-50">
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>

          {message && (
            <p role="alert" className="break-words rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
              {message}
            </p>
          )}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Sedang masuk..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Daftar sekarang
          </Link>
        </p>

        <p className="mt-8 text-center text-xs text-slate-400">© 2026 SkillPath AI</p>
      </div>
    </div>
  );
}
