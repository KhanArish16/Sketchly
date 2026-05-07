import { useState } from "react";
import { supabase } from "../lib/supabse";

export default function CreateRoomModal({ onCreated, onClose }) {
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addMember();
    }
  };

  const addMember = () => {
    const email = emailInput.trim().replace(/,$/, "");
    if (!email) return;
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (members.includes(email)) {
      setError("This email is already added.");
      return;
    }
    setMembers((prev) => [...prev, email]);
    setEmailInput("");
    setError("");
  };

  const removeMember = (email) => {
    setMembers((prev) => prev.filter((e) => e !== email));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const createRoom = async () => {
    if (!name.trim()) {
      setError("Room name is required.");
      return;
    }
    setLoading(true);
    setError("");

    const allEmails = [...members];
    if (emailInput.trim() && isValidEmail(emailInput.trim())) {
      allEmails.push(emailInput.trim());
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { data, error } = await supabase
      .from("rooms")
      .insert([{ name: name.trim(), owner_id: user.id }])
      .select();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const room = data[0];

    await supabase
      .from("room_members")
      .insert([{ room_id: room.id, user_id: user.id }]);

    if (allEmails.length > 0) {
      const { data: users } = await supabase
        .from("profiles")
        .select("id, email")
        .in("email", allEmails);

      if (users && users.length > 0) {
        const memberRows = users.map((u) => ({
          room_id: room.id,
          user_id: u.id,
        }));
        await supabase.from("room_members").insert(memberRows);
      }
    }

    setLoading(false);
    onCreated(room);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl text-white"
        style={{
          background: "#0D1018",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
          animation: "slideUp 0.35s ease",
        }}
      >
        <div
          className="absolute top-0 rounded-full"
          style={{
            left: "15%",
            right: "15%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
          }}
        />

        <div
          className="flex items-center justify-between px-7 pt-7 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-3"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.22)",
                color: "#a78bfa",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              New Room
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Create a room
            </h2>
            <p
              className="text-[13px] mt-1"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Invite your team to collaborate in real time.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.09)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
            }
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-7 py-6 space-y-5">
          {error && (
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px]"
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

          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-[0.6px] mb-2"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Room Name
            </label>
            <input
              placeholder="e.g. Landing Page Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createRoom()}
              className="w-full px-4 py-3 rounded-xl text-white text-[14px] outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(99,102,241,0.6)";
                e.target.style.background = "rgba(99,102,241,0.06)";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.background = "rgba(255,255,255,0.04)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-[0.6px] mb-2"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Invite Members
            </label>

            <div className="flex gap-2">
              <input
                placeholder="member@email.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleEmailKeyDown}
                className="flex-1 px-4 py-3 rounded-xl text-white text-[14px] outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(99,102,241,0.6)";
                  e.target.style.background = "rgba(99,102,241,0.06)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.background = "rgba(255,255,255,0.04)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                onClick={addMember}
                className="px-4 py-3 rounded-xl text-[13px] font-semibold transition-all flex-shrink-0"
                style={{
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  color: "#a78bfa",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(99,102,241,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(99,102,241,0.12)")
                }
              >
                Add
              </button>
            </div>

            <p
              className="text-[11.5px] mt-2"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Press{" "}
              <kbd
                className="px-1 py-0.5 rounded text-[10px]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                Enter
              </kbd>{" "}
              or{" "}
              <kbd
                className="px-1 py-0.5 rounded text-[10px]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                ,
              </kbd>{" "}
              to add multiple members.
            </p>

            {members.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {members.map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px] font-medium"
                    style={{
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.22)",
                      color: "#c4b5fd",
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ background: "rgba(99,102,241,0.5)" }}
                    >
                      {email[0].toUpperCase()}
                    </span>
                    <span className="max-w-[160px] truncate">{email}</span>
                    <button
                      onClick={() => removeMember(email)}
                      className="w-4 h-4 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                      style={{ color: "rgba(196,181,253,0.5)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#f87171")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(196,181,253,0.5)")
                      }
                    >
                      <svg
                        width="10"
                        height="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {members.length > 0 && (
              <p
                className="text-[12px] mt-3 flex items-center gap-1.5"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: "rgba(52,211,153,0.3)" }}
                >
                  {members.length}
                </span>
                member{members.length !== 1 ? "s" : ""} will be invited
              </p>
            )}
          </div>
        </div>

        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.45)",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
            }
          >
            Cancel
          </button>

          <button
            onClick={createRoom}
            disabled={loading}
            className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13.5px] font-semibold text-white overflow-hidden transition-all"
            style={{
              background: loading ? "rgba(99,102,241,0.5)" : "#6366f1",
              border: "1px solid rgba(99,102,241,0.4)",
              boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.35)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) =>
              !loading &&
              (e.currentTarget.style.boxShadow =
                "0 8px 28px rgba(99,102,241,0.5)")
            }
            onMouseLeave={(e) =>
              !loading &&
              (e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(99,102,241,0.35)")
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
                <span className="relative z-10">Creating...</span>
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  className="relative z-10"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                <span className="relative z-10">Create Room</span>
              </>
            )}
          </button>
        </div>

        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          input::placeholder { color: rgba(255,255,255,0.18); }
        `}</style>
      </div>
    </div>
  );
}
