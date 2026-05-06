import { useState } from "react";
import { supabase } from "../lib/supabse";
import { useNavigate, Link } from "react-router-dom";
import { div } from "framer-motion/client";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/home");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-[60px] relative overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full bg-violet-500/8 blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-[400px] bg-[#0D1018] border border-white/[0.09] rounded-2xl p-9 shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)] animate-[slideUp_0.4s_ease]">
          <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent rounded-full" />

          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold tracking-widest uppercase mb-5 ">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Welcome back
            </div>
            <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight leading-tight mb-2">
              Sign in to
              <br />
              Sketchly
            </h1>
            <p className="text-[14px] text-white/40 font-light">
              Design, collaborate, and ship — all in one place.
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-[0.6px] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.09] rounded-xl text-white text-[14px] placeholder-white/20 outline-none transition-all focus:border-indigo-500/60 focus:bg-indigo-500/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-[0.6px] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.09] rounded-xl text-white text-[14px] placeholder-white/20 outline-none transition-all focus:border-indigo-500/60 focus:bg-indigo-500/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
              />
            </div>
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="relative mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-[14px] font-semibold rounded-xl transition-all shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_28px_rgba(99,102,241,0.5)] hover:-translate-y-[1px] active:translate-y-0 overflow-hidden cursor-pointer"
          >
            <span className="relative z-10">
              {loading ? "Signing in..." : "Continue →"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </button>

          <p className="text-center text-[13px] text-white/30 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors no-underline"
            >
              Sign up free
            </Link>
          </p>
        </div>

        <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
    </div>
  );
}
