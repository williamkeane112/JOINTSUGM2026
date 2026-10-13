
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loading) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Ini Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Selamat datang di SkillPath AI!</p>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        <button type="button" onClick={handleLogout} disabled={loading} className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Sedang logout..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
