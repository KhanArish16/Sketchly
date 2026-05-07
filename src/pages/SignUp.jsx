import { useState } from "react";
import { supabase } from "../lib/supabse";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const signup = async (e) => {
    e.preventDefault();

    setError("");

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,

        options: {
          emailRedirectTo: "http://localhost:5173/login",
        },
      });

      if (signupError) {
        if (signupError.message.includes("429")) {
          setError(
            "Too many signup attempts. Please wait a minute and try again.",
          );
        } else {
          setError(signupError.message);
        }

        return;
      }

      if (data?.user?.id) {
        const { error: profileError } = await supabase.from("profiles").upsert([
          {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email,
          },
        ]);

        if (profileError) {
          setError(profileError.message);
          return;
        }
      }

      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-indigo-500 transition";

  if (success) {
    return (
      <div className="min-h-screen bg-[#080A0F] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] bg-green-500/10 blur-[120px] rounded-full" />

        <div className="w-full max-w-[430px] bg-[#0D1018] border border-white/[0.06] rounded-2xl p-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <div className="w-7 h-7 rounded-full bg-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-white text-center">
            Verify your email
          </h1>

          <p className="text-sm text-white/40 mt-4 text-center leading-relaxed">
            We sent a confirmation link to:
          </p>

          <p className="text-indigo-400 mt-2 text-sm text-center break-all">
            {email}
          </p>

          <div className="mt-8 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="text-sm text-white/70">Next steps:</p>

            <ul className="mt-3 space-y-2 text-sm text-white/40">
              <li>• Open your inbox</li>

              <li>• Click the verification link</li>

              <li>• Return to login page</li>

              <li>• Start collaborating in Sketchly</li>
            </ul>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080A0F] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] bg-indigo-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-120px] left-[-120px] w-[420px] h-[420px] bg-violet-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-[420px] bg-[#0D1018] border border-white/[0.06] rounded-2xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] uppercase tracking-widest font-semibold mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Create account
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight">
            Join Sketchly
          </h1>

          <p className="text-sm text-white/40 mt-2">
            Create collaborative design rooms with realtime editing.
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-white/40 mb-2">
                First Name
              </label>

              <input
                type="text"
                placeholder="Arish"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wide text-white/40 mb-2">
                Last Name
              </label>

              <input
                type="text"
                placeholder="Khan"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-white/40 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-white/40 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <button
          onClick={signup}
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition-all shadow-[0_8px_30px_rgba(99,102,241,0.35)]"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-white/30 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
