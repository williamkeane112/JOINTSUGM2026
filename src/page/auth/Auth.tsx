import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          setMessageType("success");
          setMessage("Berhasil masuk. Selamat belajar.");
          setTimeout(() => navigate("/dashboard", { replace: true }), 500);
        }
      } else {
        // Register mode
        if (password.length < 6) {
          throw new Error("Kata sandi minimal 6 karakter.");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) {
          if (error.message.toLowerCase().includes("rate limit")) {
            throw new Error(
              "Terlalu banyak percobaan registrasi. Silakan tunggu sebelum mencoba lagi.",
            );
          }
          throw error;
        }

        if (data.session) {
          setMessageType("success");
          setMessage("Akun dibuat. Selamat datang!");
          setTimeout(() => navigate("/dashboard", { replace: true }), 500);
        } else {
          setMessageType("success");
          setMessage("Akun dibuat. Cek email untuk konfirmasi.");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Periksa kembali data yang kamu masukkan.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#160820] isolate">
      {/* Decorative background blobs */}
      <div
        className="absolute -top-[43vw] -left-[11vw] w-[58vw] h-[58vw] rounded-full bg-[#c51f72] opacity-90 blur-sm pointer-events-none z-0"
        style={{
          boxShadow: "190px 60px 0 #7f166c, 390px 12px 0 #461247",
          transform: "rotate(-14deg)",
          animation: "drift 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-[28vw] -bottom-[32vw] w-[44vw] h-[44vw] rounded-full bg-[#bf175f] opacity-70 pointer-events-none z-0"
        style={{
          boxShadow: "-180px 80px 0 #57105e",
        }}
      />

      {/* Left Story Section - Desktop Only */}
      <section
        className="hidden lg:flex relative w-[52%] min-h-screen flex-col justify-between overflow-hidden px-[clamp(34px,6vw,92px)] py-[34px] text-white z-10"
        style={{
          background:
            "linear-gradient(135deg, #280b39 0%, #170821 55%, #210828 100%)",
        }}
        aria-label="Tentang SkillPath AI"
      >
        {/* Decorative rings */}
        <div
          className="absolute -right-[220px] -bottom-[260px] w-[560px] h-[560px] rounded-full border border-[#ff75a833] pointer-events-none"
          style={{
            boxShadow: "0 0 0 42px #ff75a814, 0 0 0 84px #ff75a80d",
          }}
        />

        {/* Top Brand */}
        <div className="relative z-10 flex items-center gap-3 text-lg font-extrabold tracking-tight">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff9ab8] to-[#ff3f7e] shadow-[0_8px_20px_rgba(255,79,135,0.44)]">
            <Sparkles className="w-5 h-5 fill-[#fff8df] text-[#fff8df]" />
          </span>
          <span>SkillPath AI</span>
        </div>

        {/* Story Content */}
        <div className="relative z-10 max-w-[530px] my-auto py-[70px]">
          {/* Spark Orbit */}
          <div className="relative grid place-items-center w-[126px] h-[126px] mb-10 rounded-full border border-[#ff90b855] bg-[#ffffff0c]">
            <div className="absolute inset-[14px] rounded-full border border-dashed border-[#ffb1c675]" />
            <div
              className="grid place-items-center w-[67px] h-[67px] rounded-[22px] bg-gradient-to-br from-[#ff97b8] to-[#ef3677] shadow-[0_14px_30px_rgba(255,64,117,0.5)]"
              style={{ transform: "rotate(12deg)" }}
            >
              <Sparkles
                className="w-[34px] h-[34px] fill-[#fff9db] text-[#fff9db]"
                style={{ transform: "rotate(-12deg)" }}
              />
            </div>
            <span className="absolute right-1 top-7 w-2 h-2 rounded-full bg-[#a88af9]" />
            <span className="absolute bottom-2 left-[22px] w-2 h-2 rounded-full bg-[#ffdc7c]" />
          </div>

          <p className="mb-4 text-[#ff9ab8] text-[11px] font-extrabold tracking-[0.13em] uppercase">
            Rute belajar yang terasa milikmu
          </p>
          <h1 className="max-w-[560px] m-0 text-[#fff8fb] text-[clamp(42px,5.2vw,72px)] font-extrabold tracking-[-0.07em] leading-[0.94]">
            Belajar lebih cerdas,{" "}
            <em className="text-[#ff719e] not-italic">bukan</em> lebih keras.
          </h1>
          <p className="max-w-[440px] mt-7 text-[#e6cfe1] text-base leading-relaxed">
            Temukan konsep yang perlu kamu kuasai, rayakan progres kecil, dan
            tumbuh dengan ritme yang paling cocok untukmu.
          </p>
          <div className="flex items-center gap-4 mt-11 text-[#e6cfe1] text-sm italic">
            <span className="w-[30px] h-px bg-[#ff7da7]" />
            <p className="m-0">
              Setiap langkah kecil tetap membawamu lebih dekat.
            </p>
          </div>
        </div>

        {/* Decorative constellation dots */}
        <div
          className="absolute right-[14%] top-[24%] w-1 h-1 rounded-full bg-[#ffb9ce] opacity-75 pointer-events-none"
          style={{
            boxShadow:
              "42px 60px 0 #c09cfa, 100px 18px 0 #ffcf77, -55px 126px 0 #ff90b3, 166px 112px 0 #a985ed",
          }}
        />
      </section>

      {/* Right Auth Panel */}
      <section className="relative flex w-full lg:w-[48%] min-h-screen flex-col items-stretch lg:items-center justify-start lg:justify-center px-0 lg:px-[clamp(24px,6vw,92px)] py-0 lg:py-10 bg-transparent lg:bg-[#fff7f2] lg:rounded-l-[34px] lg:my-[18px] lg:mr-[18px] lg:min-h-[calc(100vh-36px)] z-10">
        {/* Decorative ring - desktop */}
        <div
          className="hidden lg:block absolute -top-20 -left-20 w-[170px] h-[170px] rounded-full border border-[#ff84aa66] pointer-events-none"
          style={{
            boxShadow: "0 0 0 22px #ff84aa1c, 0 0 0 44px #ff84aa0f",
          }}
        />

        {/* Decorative ring - mobile top right */}
        <div
          className="lg:hidden absolute top-10 -right-20 w-[150px] h-[150px] rounded-full border border-[#ff9fc477] opacity-75 pointer-events-none"
          style={{
            boxShadow: "0 0 0 22px #ff84aa1c, 0 0 0 44px #ff84aa0f",
          }}
        />

        {/* Mobile Brand */}
        <div className="lg:hidden flex items-center gap-3 self-start px-6 pt-6 mb-5 text-white text-lg font-extrabold tracking-tight">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff9ab8] to-[#ff3f7e] shadow-[0_8px_20px_rgba(255,79,135,0.44)]">
            <Sparkles className="w-5 h-5 fill-[#fff8df] text-[#fff8df]" />
          </span>
          <span>SkillPath AI</span>
        </div>

        {/* Auth Card - full-width cream surface on mobile (no card), plain on desktop */}
        <div className="relative w-full flex-1 lg:flex-none max-w-none lg:max-w-[410px] bg-[#fff7f2] lg:bg-transparent border-0 rounded-t-[34px] lg:rounded-none px-6 pt-8 pb-8 lg:p-0 shadow-[0_-8px_30px_rgba(12,3,29,0.12)] lg:shadow-none">
          {/* Heading */}
          <div className="mb-8">
            <p className="mb-4 text-[#e62f72] text-[11px] font-extrabold tracking-[0.11em] uppercase">
              Selamat datang kembali
            </p>
            <h2 className="m-0 text-[var(--color-ink)] text-[clamp(30px,3vw,42px)] font-extrabold tracking-[-0.065em] leading-none">
              {mode === "login"
                ? "Lanjutkan perjalananmu."
                : "Mulai perjalananmu."}
            </h2>
            <p className="max-w-[350px] mt-4 text-[var(--color-muted)] text-[13px] leading-relaxed">
              {mode === "login"
                ? "Masuk untuk melihat progres belajar hari ini."
                : "Buat akun gratis dan temukan cara belajar yang lebih personal."}
            </p>
          </div>

          {/* Tabs */}
          <div
            className="flex gap-7 mb-6 border-b border-[var(--color-line)]"
            role="tablist"
            aria-label="Pilih jenis akses"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={`relative pb-3 border-0 bg-transparent text-[13px] font-extrabold transition-colors ${
                mode === "login" ? "text-[#e62f72]" : "text-[#aaa0a9]"
              }`}
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Masuk
              {mode === "login" && (
                <span className="absolute right-0 bottom-[-1px] left-0 h-[3px] rounded-[3px] bg-[var(--color-pink)]" />
              )}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={`relative pb-3 border-0 bg-transparent text-[13px] font-extrabold transition-colors ${
                mode === "register" ? "text-[#e62f72]" : "text-[#aaa0a9]"
              }`}
              onClick={() => {
                setMode("register");
                setMessage("");
              }}
            >
              Daftar
              {mode === "register" && (
                <span className="absolute right-0 bottom-[-1px] left-0 h-[3px] rounded-[3px] bg-[var(--color-pink)]" />
              )}
            </button>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label className="block">
                <span className="text-[#4e4452] text-xs font-bold">
                  Nama lengkap
                </span>
                <div className="relative flex items-center mt-2">
                  <UserRound className="absolute left-4 w-4 h-4 text-[#b0a3ac] pointer-events-none" />
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Contoh: Dimas Pratama"
                    required
                    disabled={isLoading}
                    className="w-full border border-[#e5d9df] rounded-[13px] px-11 py-3 outline-none text-[var(--color-ink)] bg-[#fffdfc] text-[13px] transition-all focus:border-[#ff79a0] focus:shadow-[0_0_0_4px_rgba(255,189,208,0.2)] disabled:opacity-60"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-[#4e4452] text-xs font-bold">Email</span>
              <div className="relative flex items-center mt-2">
                <Mail className="absolute left-4 w-4 h-4 text-[#b0a3ac] pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="namamu@email.com"
                  required
                  disabled={isLoading}
                  className="w-full border border-[#e5d9df] rounded-[13px] px-11 py-3 outline-none text-[var(--color-ink)] bg-[#fffdfc] text-[13px] transition-all focus:border-[#ff79a0] focus:shadow-[0_0_0_4px_rgba(255,189,208,0.2)] disabled:opacity-60"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[#4e4452] text-xs font-bold">
                Kata sandi
              </span>
              <div className="relative flex items-center mt-2">
                <LockKeyhole className="absolute left-4 w-4 h-4 text-[#b0a3ac] pointer-events-none" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                  required
                  disabled={isLoading}
                  className="w-full border border-[#e5d9df] rounded-[13px] px-11 py-3 pr-12 outline-none text-[var(--color-ink)] bg-[#fffdfc] text-[13px] transition-all focus:border-[#ff79a0] focus:shadow-[0_0_0_4px_rgba(255,189,208,0.2)] disabled:opacity-60"
                />
                <button
                  type="button"
                  className="absolute right-3 grid place-items-center border-0 p-1.5 text-[#a89ca5] bg-transparent cursor-pointer"
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </label>

            {mode === "login" && (
              <div className="flex items-center justify-between -mt-1">
                <label className="flex items-center gap-2 text-[#4e4452] text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 m-0 accent-[var(--color-pink)]"
                  />
                  <span>Ingat saya</span>
                </label>
                <a
                  href="/auth/reset-password"
                  className="text-[#e62f72] text-[11px] font-extrabold no-underline hover:underline"
                >
                  Lupa kata sandi?
                </a>
              </div>
            )}

            {mode === "register" && (
              <label className="flex items-start gap-2 text-[#4e4452] text-xs cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="w-3.5 h-3.5 mt-0.5 accent-[var(--color-pink)]"
                />
                <span>
                  Saya setuju dengan{" "}
                  <a
                    href="/terms"
                    className="text-[#e62f72] no-underline hover:underline"
                  >
                    ketentuan penggunaan
                  </a>{" "}
                  SkillPath AI.
                </span>
              </label>
            )}

            <button
              className="flex items-center justify-center gap-3 mt-1 border-0 rounded-[13px] px-5 py-3.5 min-h-[44px] text-white bg-[#17131a] shadow-[0_10px_20px_rgba(33,21,38,0.15)] text-[13px] font-extrabold tracking-[-0.01em] transition-all hover:bg-[#e62f72] hover:shadow-[0_12px_24px_rgba(230,47,114,0.25)] hover:-translate-y-0.5 disabled:opacity-65 disabled:cursor-wait disabled:translate-y-0"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Memproses..."
                : mode === "login"
                  ? "Masuk ke SkillPath"
                  : "Buat akun gratis"}
              <ArrowRight className="w-[17px] h-[17px]" />
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 border rounded-[10px] px-3 py-2.5 text-xs leading-relaxed ${
                messageType === "success"
                  ? "bg-[#eaf8ef] text-[#226348] border-[#cbeed8]"
                  : "bg-[#fce8ec] text-[#c42752] border-[#f5c6d0]"
              }`}
              role="status"
            >
              {message}
            </p>
          )}

          {/* Note */}
          <div className="flex items-center gap-3 mt-6 text-[#a69ca6] text-[11px] text-center">
            <span className="h-px flex-1 bg-[var(--color-line)]" />
            <p className="flex-none m-0">
              {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                type="button"
                className="border-0 p-0 text-[#e62f72] bg-transparent font-extrabold cursor-pointer hover:underline"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setMessage("");
                }}
              >
                {mode === "login" ? "Daftar sekarang" : "Masuk di sini"}
              </button>
            </p>
            <span className="h-px flex-1 bg-[var(--color-line)]" />
          </div>

          {/* Decorative ring after card */}
          <div className="hidden lg:block absolute -right-[94px] -bottom-[54px] w-[120px] h-[120px] rounded-full border border-[#ffb6c766] opacity-65 pointer-events-none" />
        </div>

        {/* Mobile decorative ring bottom left */}
        <div
          className="lg:hidden absolute -left-11 bottom-4 w-[115px] h-[115px] rounded-full border border-[#ff7ca766] pointer-events-none"
          style={{
            boxShadow: "0 0 0 18px #ff7ca51a",
          }}
        />
      </section>

      <style>{`
        @keyframes drift {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-14deg);
          }
          50% {
            transform: translate3d(0, 8px, 0) rotate(-14deg);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
