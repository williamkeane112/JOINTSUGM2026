"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "");
    const supabase = createClient();

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo:
                process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
                `${window.location.origin}/auth/callback`,
              data: { full_name: name },
            },
          });

    setIsLoading(false);
    if (result.error) {
      setMessage("Periksa kembali data yang kamu masukkan.");
      return;
    }
    setMessage(
      mode === "login"
        ? "Berhasil masuk. Selamat belajar."
        : "Akun dibuat. Cek email untuk konfirmasi.",
    );
  }

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-label="Tentang SkillPath AI">
        <div className="story-topline">
          <span className="brand-mark">
            <Sparkles />
          </span>
          <span>SkillPath AI</span>
        </div>
        <div className="story-content">
          <div className="spark-orbit">
            <div className="spark-core">
              <Sparkles />
            </div>
            <span className="orbit-dot orbit-dot-one" />
            <span className="orbit-dot orbit-dot-two" />
          </div>
          <p className="eyebrow">Rute belajar yang terasa milikmu</p>
          <h1>
            Belajar lebih cerdas, <em>bukan</em> lebih keras.
          </h1>
          <p className="story-copy">
            Temukan konsep yang perlu kamu kuasai, rayakan progres kecil, dan
            tumbuh dengan ritme yang paling cocok untukmu.
          </p>
          <div className="story-quote">
            <span className="quote-line" />
            <p>Setiap langkah kecil tetap membawamu lebih dekat.</p>
          </div>
        </div>
        <p className="story-footer">Jalurmu. Kecepatanmu. Pemahamanmu.</p>
      </section>

      <section className="auth-panel">
        <div className="mobile-brand">
          <span className="brand-mark">
            <Sparkles />
          </span>
          <span>SkillPath AI</span>
        </div>
        <div className="auth-card">
          <div className="auth-heading">
            <p className="eyebrow">Selamat datang kembali</p>
            <h2>
              {mode === "login"
                ? "Lanjutkan perjalananmu."
                : "Mulai perjalananmu."}
            </h2>
            <p>
              {mode === "login"
                ? "Masuk untuk melihat progres belajar hari ini."
                : "Buat akun gratis dan temukan cara belajar yang lebih personal."}
            </p>
          </div>
          <div
            className="auth-tabs"
            role="tablist"
            aria-label="Pilih jenis akses"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={mode === "register" ? "active" : ""}
              onClick={() => {
                setMode("register");
                setMessage("");
              }}
            >
              Daftar
            </button>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label>
                <span>Nama lengkap</span>
                <div className="input-wrap">
                  <UserRound />
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Contoh: Dimas Pratama"
                    required
                  />
                </div>
              </label>
            )}
            <label>
              <span>Email</span>
              <div className="input-wrap">
                <Mail />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="namamu@email.com"
                  required
                />
              </div>
            </label>
            <label>
              <span>Kata sandi</span>
              <div className="input-wrap">
                <LockKeyhole />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </label>
            {mode === "login" && (
              <div className="form-meta">
                <label className="remember">
                  <input type="checkbox" /> <span>Ingat saya</span>
                </label>
                <Link href="/auth/reset-password">Lupa kata sandi?</Link>
              </div>
            )}
            {mode === "register" && (
              <label className="terms">
                <input type="checkbox" required />
                <span>
                  Saya setuju dengan{" "}
                  <Link href="/terms">ketentuan penggunaan</Link> SkillPath AI.
                </span>
              </label>
            )}
            <button
              className="submit-button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Memproses..."
                : mode === "login"
                  ? "Masuk ke SkillPath"
                  : "Buat akun gratis"}
              <ArrowRight />
            </button>
          </form>
          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
          <div className="auth-note">
            <span />{" "}
            <p>
              {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setMessage("");
                }}
              >
                {mode === "login" ? "Daftar sekarang" : "Masuk di sini"}
              </button>
            </p>{" "}
            <span />
          </div>
        </div>
        <p className="panel-footer">
          Dengan melanjutkan, kamu ikut membangun kebiasaan belajar yang lebih
          baik.
        </p>
      </section>
    </main>
  );
}
