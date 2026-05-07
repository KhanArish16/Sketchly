import { useState } from "react";
import { supabase } from "../lib/supabse";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          first_name,
          last_name,
          email,
        },
      ]);
    }

    navigate("/login", {
      state: { message: "Check your email to confirm your account!" },
    });
  };

  const inputClass =
    "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.09] rounded-xl text-white text-[14px] placeholder-white/20 outline-none transition-all focus:border-indigo-500/60 focus:bg-indigo-500/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 pt-[80px] relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-violet-500/8 blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-[420px] bg-[#0D1018] border border-white/[0.09] rounded-2xl p-9 shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)] animate-[slideUp_0.4s_ease]">
        <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent rounded-full" />

        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Create account
          </div>
          <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight leading-tight mb-2">
            Start designing
            <br />
            with Sketchly
          </h1>
          <p className="text-[14px] text-white/40 font-light">
            Free forever. No credit card required.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-[0.6px] mb-2">
                First Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Alex"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-[0.6px] mb-2">
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Kim"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-[0.6px] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={inputClass}
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
              placeholder="Min. 8 characters"
              className={inputClass}
            />
          </div>
        </div>

        <button
          onClick={signup}
          disabled={loading}
          className="relative mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-[14px] font-semibold rounded-xl transition-all shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_28px_rgba(99,102,241,0.5)] hover:-translate-y-[1px] active:translate-y-0 overflow-hidden cursor-pointer"
        >
          <span className="relative z-10">
            {loading ? "Creating account..." : "Create Account →"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </button>

        <p className="text-center text-[12px] text-white/20 mt-4 leading-relaxed">
          By signing up, you agree to our{" "}
          <span className="text-white/40 hover:text-white/60 cursor-pointer transition-colors">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-white/40 hover:text-white/60 cursor-pointer transition-colors">
            Privacy Policy
          </span>
        </p>

        <p className="text-center text-[13px] text-white/30 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-violet-400 hover:text-violet-300 font-medium transition-colors no-underline"
          >
            Sign in
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
  );
}
