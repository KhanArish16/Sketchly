import { useState } from "react";
import { supabase } from "../lib/supabse";

export default function JoinRoom({ roomId }) {
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestAccess = async () => {
    setLoading(true);
    setError("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { data: existing } = await supabase
      .from("room_requests")
      .select("*")
      .eq("room_id", roomId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      setRequested(true);
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("room_requests")
      .insert([{ room_id: roomId, user_id: user.id }]);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setRequested(true);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "#080A0F" }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 300,
          height: 300,
          bottom: -80,
          right: -80,
          background:
            "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative w-full max-w-sm text-white text-center"
        style={{
          background: "#0D1018",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 20,
          padding: "44px 36px",
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)",
          animation: "slideUp 0.4s ease",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            top: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
          }}
        />

        {!requested ? (
          <>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.22)",
                boxShadow: "0 0 32px rgba(99,102,241,0.15)",
              }}
            >
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
              </svg>

              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  border: "1px solid rgba(99,102,241,0.3)",
                  animation: "ringPulse 2.5s ease-out infinite",
                }}
              />
            </div>

            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-4"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.22)",
                color: "#a78bfa",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Private Room
            </div>

            <h2 className="text-2xl font-extrabold mb-2 tracking-tight">
              Access Required
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}
            >
              This room is private. Request access and the owner will be
              notified to let you in.
            </p>

            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-5 text-left"
                style={{
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  color: "#f87171",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {error}
              </div>
            )}

            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl mb-6 text-left"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Room ID
                </p>
                <p
                  className="text-[13px] font-mono font-medium"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {roomId}
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={requestAccess}
              disabled={loading}
              className="relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all"
              style={{
                background: loading ? "rgba(99,102,241,0.5)" : "#6366f1",
                border: "1px solid rgba(99,102,241,0.4)",
                boxShadow: loading ? "none" : "0 4px 24px rgba(99,102,241,0.4)",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) =>
                !loading &&
                (e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(99,102,241,0.55)")
              }
              onMouseLeave={(e) =>
                !loading &&
                (e.currentTarget.style.boxShadow =
                  "0 4px 24px rgba(99,102,241,0.4)")
              }
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.1), transparent)",
                }}
              />
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4 relative z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  <span className="relative z-10">Sending Request...</span>
                </>
              ) : (
                <>
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="relative z-10"
                  >
                    <path
                      d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="relative z-10">Request Access</span>
                </>
              )}
            </button>

            <p
              className="text-[12px] mt-4"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              The room owner will be notified of your request.
            </p>
          </>
        ) : (
          <>
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.25)",
                  boxShadow: "0 0 32px rgba(52,211,153,0.12)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 6v6l4 2" strokeLinecap="round" />
                </svg>
              </div>

              <div
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  background: "#34d399",
                  boxShadow: "0 0 8px rgba(52,211,153,0.8)",
                  top: -4,
                  right: -4,
                  animation: "pulse 1.8s ease-in-out infinite",
                }}
              />
            </div>

            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-4"
              style={{
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.22)",
                color: "#34d399",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Request Sent
            </div>

            <h2
              className="text-2xl font-extrabold mb-2 tracking-tight"
              style={{
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.6px",
              }}
            >
              Awaiting Approval
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}
            >
              Your request has been sent to the room owner. You'll get access as
              soon as they approve it.
            </p>

            <div
              className="text-left rounded-xl p-4 space-y-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {[
                { label: "Request submitted", done: true },
                {
                  label: "Waiting for owner approval",
                  done: false,
                  active: true,
                },
                { label: "Access granted", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]"
                    style={{
                      background: step.done
                        ? "rgba(52,211,153,0.2)"
                        : step.active
                          ? "rgba(99,102,241,0.2)"
                          : "rgba(255,255,255,0.05)",
                      border: `1px solid ${
                        step.done
                          ? "rgba(52,211,153,0.4)"
                          : step.active
                            ? "rgba(99,102,241,0.4)"
                            : "rgba(255,255,255,0.08)"
                      }`,
                    }}
                  >
                    {step.done ? (
                      <svg
                        width="9"
                        height="9"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : step.active ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    ) : (
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-[13px]"
                    style={{
                      color: step.done
                        ? "rgba(52,211,153,0.8)"
                        : step.active
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(255,255,255,0.2)",
                      fontWeight: step.active ? 500 : 400,
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <p
              className="text-[12px] mt-5"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              You can close this page — we'll notify you when access is granted.
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ringPulse {
          0%   { transform: scale(1); opacity: 0.6; }
          70%  { transform: scale(1.18); opacity: 0; }
          100% { transform: scale(1.18); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
