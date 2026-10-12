import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function Register() {
  const navigate = useNavigate();

  const submitting = useRef(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Mencegah request registrasi ganda
    if (submitting.current) return;

    submitting.current = true;
    setLoading(true);
    setMessage("");

    try {
      const fullName = form.full_name.trim();
      const username = form.username.trim();
      const email = form.email.trim().toLowerCase();
      const phoneNumber = form.phone_number.trim();

      if (!fullName || !username || !email || !form.password) {
        throw new Error("Mohon lengkapi semua kolom wajib.");
      }

      if (form.password.length < 8) {
        throw new Error("Password minimal 8 karakter.");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password: form.password,
        options: {
          data: {
            full_name: fullName,
            username,
            phone_number: phoneNumber || null,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("rate limit")) {
          throw new Error(
            "Terlalu banyak percobaan registrasi. Silakan tunggu sebelum mencoba lagi."
          );
        }

        throw error;
      }

      if (data.session) {
        setMessageType("success");
        setMessage("Registrasi berhasil. Mengalihkan ke dashboard...");
        navigate("/dashboard", { replace: true });
        return;
      }

      setMessageType("success");
      setMessage(
        "Registrasi berhasil. Silakan cek email untuk verifikasi akun sebelum masuk."
      );
    } catch (error) {
      console.error("Register error:", error);

      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Registrasi gagal. Silakan coba kembali."
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/60">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Buat Akun</h1>
          <p className="mt-2 text-sm text-slate-500">
            Bergabung dengan SkillPath AI
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-slate-700">
              Nama lengkap
            </label>
            <input id="full_name" name="full_name" type="text" placeholder="Nama lengkap kamu" value={form.full_name} onChange={handleChange} autoComplete="name" required disabled={loading} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100" />
          </div>

          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input id="username" name="username" type="text" placeholder="Contoh: jhondoe" value={form.username} onChange={handleChange} autoComplete="username" required disabled={loading} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100" />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input id="email" name="email" type="email" placeholder="name@example.com" value={form.email} onChange={handleChange} autoComplete="email" required disabled={loading} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100" />
          </div>

          <div>
            <label htmlFor="phone_number" className="mb-2 block text-sm font-medium text-slate-700">
              Nomor HP <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <input id="phone_number" name="phone_number" type="tel" placeholder="08xxxxxxxxxx" value={form.phone_number} onChange={handleChange} autoComplete="tel" disabled={loading} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100" />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" value={form.password} onChange={handleChange} autoComplete="new-password" minLength={8} required disabled={loading} className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100" />
              <button type="button" onClick={() => setShowPassword((previous) => !previous)} disabled={loading} className="absolute inset-y-0 right-3 text-sm font-medium text-slate-500 hover:text-indigo-600 disabled:opacity-50">
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>

          {message && (
            <p role="status" aria-live="polite" className={`break-words rounded-lg p-3 text-center text-sm ${messageType === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </p>
          )}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
