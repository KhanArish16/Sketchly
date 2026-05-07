import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabse";

export default function Navbar({ session }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = session
    ? [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "My Designs" },
        { to: "/room", label: "My Room" },
        { to: "/templates", label: "Templates" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/templates", label: "Templates" },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080A0F]/85 backdrop-blur-xl border-b border-white/[0.07]">
      <div className="flex items-center justify-between px-6 sm:px-8 h-[60px]">
        <Link
          to="/"
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
                to="/signup"
                className="px-4 py-1.5 rounded-lg text-[13.5px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] transition-all no-underline"
              >
                Get started
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-lg text-[13.5px] font-medium text-red-400 border border-red-400/20 bg-red-400/[0.05] hover:bg-red-400/10 transition-all cursor-pointer"
            >
              Logout
            </button>
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
