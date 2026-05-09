import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabse";
import { LayoutGrid, LogOut } from "lucide-react";

export default function Navbar({ session }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const profile = session?.user;

  const displayName = () => {
    if (!profile) return "User";

    const first = profile.user_metadata?.first_name || "";
    const last = profile.user_metadata?.last_name || "";
    const full = `${first} ${last}`.trim();

    return full || profile.email || "User";
  };

  const initials = () => {
    const first = profile?.user_metadata?.first_name || "";
    const last = profile?.user_metadata?.last_name || "";

    if (first) {
      return (first[0] + (last[0] || "")).toUpperCase();
    }

    return (profile?.email?.[0] || "U").toUpperCase();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/home");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = session
    ? [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Workspace" },
      ]
    : [{ to: "/", label: "Home" }];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080A0F]/85 backdrop-blur-xl border-b border-white/[0.07]">
      <div className="flex items-center justify-between px-6 sm:px-8 h-[60px]">
        <Link
          to={session ? "/dashboard" : "/home"}
          className="flex items-center gap-2.5 no-underline group flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-[9px] bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.35)] relative overflow-hidden transition-shadow group-hover:shadow-[0_0_28px_rgba(99,102,241,0.5)]">
            <div className="w-[14px] h-[14px] bg-white rounded-[3px] rotate-12 opacity-90" />
          </div>
          <span className="font-display text-[17px] font-extrabold text-white tracking-tight">
            Sketchly
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="relative px-4 py-1.5 text-[13.5px] font-medium no-underline transition-all rounded-lg group"
              style={{
                color: isActive(to) ? "#fff" : "rgba(255,255,255,0.45)",
              }}
            >
              {label}
              {isActive(to) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-indigo-500" />
              )}
              <span className="absolute inset-0 rounded-lg transition-all group-hover:bg-white/[0.05]" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {!session ? (
            <>
              <Link
                to="/login"
                className={`px-4 py-1.5 rounded-lg text-[13.5px] font-medium transition-all no-underline ${
                  isActive("/login")
                    ? "text-white bg-white/[0.08]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                Login
              </Link>
              <Link
                to={session ? "/dashboard" : "/signup"}
                className="px-4 py-1.5 rounded-lg text-[13.5px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] transition-all no-underline"
              >
                {session ? "Dashboard" : "Get started"}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] transition-all no-underline"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shadow-[0_0_14px_rgba(99,102,241,0.35)]">
                  {initials()}
                </div>

                <div className="flex flex-col leading-none">
                  <span className="text-[12px] font-medium text-white">
                    {displayName()}
                  </span>

                  <span className="text-[10px] text-white/40 mt-1">
                    Active now
                  </span>
                </div>
              </Link>

              <button
                onClick={logout}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-red-400/15 bg-red-400/[0.05] text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 cursor-pointer"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-[1.5px] bg-white/70 rounded transition-all duration-300 origin-center"
            style={
              menuOpen ? { transform: "translateY(6.5px) rotate(45deg)" } : {}
            }
          />
          <span
            className="block w-5 h-[1.5px] bg-white/70 rounded transition-all duration-300"
            style={menuOpen ? { opacity: 0, transform: "scaleX(0)" } : {}}
          />
          <span
            className="block w-5 h-[1.5px] bg-white/70 rounded transition-all duration-300 origin-center"
            style={
              menuOpen ? { transform: "translateY(-6.5px) rotate(-45deg)" } : {}
            }
          />
        </button>
      </div>

      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? "400px" : "0px",
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div className="px-4 pb-4 pt-1 flex flex-col gap-1 border-t border-white/[0.06]">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-lg text-[14px] font-medium no-underline transition-all"
              style={{
                color: isActive(to) ? "#fff" : "rgba(255,255,255,0.45)",
                background: isActive(to)
                  ? "rgba(99,102,241,0.1)"
                  : "transparent",
              }}
            >
              {label}
              {isActive(to) && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
            </Link>
          ))}

          <div className="h-px bg-white/[0.06] my-1" />
          {session && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
                {initials()}
              </div>

              <div>
                <p className="text-[13px] font-medium text-white">
                  {initials()}
                </p>

                <p className="text-[11px] text-white/40 mt-0.5">
                  {displayName()}
                </p>
              </div>
            </div>
          )}

          {!session ? (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-[14px] font-medium text-white/50 hover:text-white hover:bg-white/[0.05] transition-all no-underline text-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all no-underline text-center"
              >
                Get started
              </Link>
            </div>
          ) : (
            <button
              onClick={logout}
              className="mt-1 px-4 py-2.5 rounded-lg text-[14px] font-medium text-red-400 border border-red-400/20 bg-red-400/[0.05] hover:bg-red-400/10 transition-all cursor-pointer text-left"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
