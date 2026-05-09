import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="6" cy="9" r="3" stroke="#a89ef7" strokeWidth="1.4" />
        <circle cx="12" cy="9" r="3" stroke="#a89ef7" strokeWidth="1.4" />
      </svg>
    ),
    bg: "rgba(91,80,232,0.18)",
    title: "Real-time collaboration",
    desc: "See every teammate's cursor, selection, and edit live on the canvas. No refresh, no merge conflicts — just flow.",
    tag: "Operational transform",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2"
          y="2"
          width="14"
          height="14"
          rx="2"
          stroke="#1eb478"
          strokeWidth="1.4"
        />
        <path d="M2 7h14M7 2v14" stroke="#1eb478" strokeWidth="1.4" />
      </svg>
    ),
    bg: "rgba(30,180,120,0.18)",
    title: "Infinite canvas",
    desc: "Pan and zoom freely across an unlimited workspace. Organize flows, screens, and components at any scale.",
    tag: "Vector-based engine",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2"
          y="5"
          width="6"
          height="8"
          rx="1"
          stroke="#f0a032"
          strokeWidth="1.4"
        />
        <rect
          x="10"
          y="3"
          width="6"
          height="5"
          rx="1"
          stroke="#f0a032"
          strokeWidth="1.4"
        />
        <rect
          x="10"
          y="10"
          width="6"
          height="5"
          rx="1"
          stroke="#f0a032"
          strokeWidth="1.4"
        />
      </svg>
    ),
    bg: "rgba(240,160,50,0.18)",
    title: "Component library",
    desc: "Build drag-and-drop component systems with custom properties, variants, and nested overrides at every level.",
    tag: "Design tokens",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M5 9l3 3 5-6"
          stroke="#d0507e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="9" r="7" stroke="#d0507e" strokeWidth="1.4" />
      </svg>
    ),
    bg: "rgba(210,80,130,0.18)",
    title: "Version history",
    desc: "Every change is tracked. Name snapshots, compare versions side-by-side, and roll back in a single click.",
    tag: "Branching support",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2"
          y="2"
          width="6"
          height="6"
          rx="1"
          stroke="#378add"
          strokeWidth="1.4"
        />
        <rect
          x="10"
          y="10"
          width="6"
          height="6"
          rx="1"
          stroke="#378add"
          strokeWidth="1.4"
        />
        <path
          d="M8 5h2a3 3 0 013 3v2"
          stroke="#378add"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    bg: "rgba(55,138,221,0.18)",
    title: "Prototype mode",
    desc: "Wire up flows with click triggers, hover states, and animated transitions. Preview interactive prototypes instantly.",
    tag: "CSS animations",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M5 14l-2 2V4a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H5z"
          stroke="#1eb478"
          strokeWidth="1.4"
        />
        <path
          d="M6 7h6M6 10h4"
          stroke="#1eb478"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    bg: "rgba(30,180,120,0.18)",
    title: "Comments & feedback",
    desc: "Pin contextual comments to any element. Tag teammates, resolve threads, and keep feedback tied to the design.",
    tag: "Async-friendly",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M4 9l-2-2 2-2M14 9l2-2-2-2"
          stroke="#a89ef7"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <rect
          x="5"
          y="5"
          width="8"
          height="8"
          rx="1"
          stroke="#a89ef7"
          strokeWidth="1.3"
        />
      </svg>
    ),
    bg: "rgba(91,80,232,0.18)",
    title: "Undo / redo system",
    desc: "Full command-pattern undo stack. Step back through any action, including collaborative edits from teammates.",
    tag: "Command pattern",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M5 9l-2-2 2-2M13 9l2-2-2-2"
          stroke="#dc4646"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="9" cy="9" r="3" stroke="#dc4646" strokeWidth="1.4" />
      </svg>
    ),
    bg: "rgba(220,70,70,0.18)",
    title: "Advanced selection tools",
    desc: "Lasso select, magic wand, multi-select groups, and deep-click through nested layers with full keyboard shortcuts.",
    tag: "Command palette",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2"
          y="10"
          width="4"
          height="6"
          rx="1"
          stroke="#f0a032"
          strokeWidth="1.4"
        />
        <rect
          x="7"
          y="6"
          width="4"
          height="10"
          rx="1"
          stroke="#f0a032"
          strokeWidth="1.4"
        />
        <rect
          x="12"
          y="2"
          width="4"
          height="14"
          rx="1"
          stroke="#f0a032"
          strokeWidth="1.4"
        />
      </svg>
    ),
    bg: "rgba(240,160,50,0.18)",
    title: "Design system manager",
    desc: "Manage typography, color tokens, spacing scales, and shared components across all projects from one hub.",
    tag: "Multi-project sync",
  },
];

const steps = [
  {
    num: "1",
    title: "Create a project",
    desc: "Start from a blank canvas or pick from 80+ templates — mobile, web, or whiteboard.",
  },
  {
    num: "2",
    title: "Invite your team",
    desc: "Share a link and collaborators join instantly. See everyone live — no plugins required.",
  },
  {
    num: "3",
    title: "Design & prototype",
    desc: "Build screens with the component library, wire flows with transitions and interactive states.",
  },
  {
    num: "4",
    title: "Share & present",
    desc: "Send a live view link. Anyone can view, comment, and follow along — no account needed.",
  },
];

const testimonials = [
  {
    quote:
      "Pixdraft replaced Figma and Miro for our team. The real-time canvas is buttery smooth and the component system is incredibly powerful.",
    name: "Aanya Kapoor",
    role: "Lead Designer, Zeta Pay",
    initials: "AK",
    color: "#5b50e8",
  },
  {
    quote:
      "Version history alone saved our project twice. Rolling back to a named snapshot takes one click. Our entire team adopted it in a week.",
    name: "Sam Rivera",
    role: "Product Manager, Loops",
    initials: "SR",
    color: "#1eb478",
  },
  {
    quote:
      "The prototype mode with transitions is a game-changer. We present interactive flows to clients directly from Pixdraft — no extra tools.",
    name: "Maya Johal",
    role: "UX Lead, Studio Craft",
    initials: "MJ",
    color: "#d05080",
  },
];

export default function Home() {
  const isLoggedIn = !!localStorage.getItem(
    "sb-cwzzssimqehmxyfpwyay-auth-token",
  );
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07090e] text-white font-sans overflow-x-hidden">
      <section className="text-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 bg-[#5b50e8]/10 border border-[#5b50e8]/30 text-[#a89ef7] rounded-full text-[11px] px-3.5 py-1 mb-6 uppercase tracking-wider"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#5b50e8]" />
          Now in open beta — free forever
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-[52px] font-medium leading-[1.15] max-w-[700px] mx-auto mb-5"
        >
          Design, prototype &{" "}
          <span className="text-[#a89ef7]">collaborate in real time</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/45 text-[17px] max-w-[500px] mx-auto mb-8 leading-relaxed"
        >
          The all-in-one design platform for modern teams. Build UI mockups,
          wireframes, and interactive prototypes — together, live.
        </motion.p>

        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="flex">
            {[
              { bg: "#5b50e8", label: "AK" },
              { bg: "#1eb478", label: "SR" },
              { bg: "#d05080", label: "MJ" },
              { bg: "#f0a032", label: "LP" },
            ].map((av, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-[#07090e] flex items-center justify-center text-[11px] font-medium -ml-1.5 first:ml-0"
                style={{ background: av.bg }}
              >
                {av.label}
              </div>
            ))}
          </div>
          <span className="text-white/30 text-sm">
            Trusted by 18,000+ designers
          </span>
        </div>

        <div className="flex gap-3 justify-center mb-4">
          <button
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
            className="bg-[#5b50e8] text-white px-7 py-3 rounded-[9px] text-[15px] font-medium hover:bg-[#4a40d0] transition"
          >
            Start designing free →
          </button>
          <button className="border border-white/15 text-white/70 px-7 py-3 rounded-[9px] text-[15px] hover:bg-white/5 transition">
            Watch demo
          </button>
        </div>
        <p className="text-white/25 text-xs">
          No credit card required. Free plan includes unlimited drafts.
        </p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-white/[0.07]">
        {[
          { num: "18K+", label: "Active designers" },
          { num: "340K", label: "Frames created" },
          { num: "99.9%", label: "Uptime SLA" },
          { num: "4.9★", label: "Average rating" },
        ].map((s, i) => (
          <div
            key={i}
            className="py-8 text-center border-r border-white/[0.07] last:border-r-0"
          >
            <div className="text-4xl font-medium mb-1">{s.num}</div>
            <div className="text-sm text-white/35">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="px-10 py-20">
        <p className="text-[11px] text-[#a89ef7] uppercase tracking-[.08em] mb-3">
          Platform features
        </p>
        <h2 className="text-[34px] font-medium mb-3 max-w-[480px] leading-snug">
          Everything your design team needs
        </h2>
        <p className="text-white/40 text-[15px] max-w-[440px] mb-10 leading-relaxed">
          From wireframes to production-ready prototypes — built for speed,
          scale, and seamless collaboration.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-6"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <h3 className="text-[15px] font-medium mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-white/40 leading-[1.55] mb-2.5">
                {f.desc}
              </p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5b50e8]/10 text-[#a89ef7] border border-[#5b50e8]/20">
                {f.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-10 pb-20">
        <p className="text-[11px] text-[#a89ef7] uppercase tracking-[.08em] mb-3">
          How it works
        </p>
        <h2 className="text-[34px] font-medium mb-10 leading-snug">
          From idea to shared in four steps
        </h2>
        <div className="grid md:grid-cols-4 gap-0">
          {steps.map((s, i) => (
            <div
              key={i}
              className="pr-6 border-r border-white/[0.07] last:border-r-0 last:pr-0"
            >
              <div className="w-8 h-8 rounded-full bg-[#5b50e8]/15 border border-[#5b50e8]/30 flex items-center justify-center text-[13px] text-[#a89ef7] font-medium mb-3.5">
                {s.num}
              </div>
              <h4 className="text-sm font-medium mb-1.5">{s.title}</h4>
              <p className="text-xs text-white/35 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-10 pb-20">
        <p className="text-[11px] text-[#a89ef7] uppercase tracking-[.08em] mb-3">
          Testimonials
        </p>
        <h2 className="text-[34px] font-medium mb-10 leading-snug">
          Loved by design teams worldwide
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="w-3 h-3 bg-[#f0a032]"
                    style={{
                      clipPath:
                        "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                    }}
                  />
                ))}
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed mb-3.5">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-[13px] font-medium">{t.name}</div>
                  <div className="text-[11px] text-white/30">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-10 mb-20 bg-[#0f1020] border border-[#5b50e8]/25 rounded-2xl px-10 py-16 text-center">
        <h2 className="text-[36px] font-medium mb-3">
          Ready to design better, together?
        </h2>
        <p className="text-white/40 text-[15px] mb-7">
          Join 18,000+ designers already building with Pixdraft. Free forever,
          no credit card needed.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
            className="bg-[#5b50e8] text-white px-7 py-3 rounded-[9px] text-[15px] font-medium hover:bg-[#4a40d0] transition"
          >
            Create free account →
          </button>
          <button className="border border-white/15 text-white/70 px-7 py-3 rounded-[9px] text-[15px] hover:bg-white/5 transition">
            Explore templates
          </button>
        </div>
      </section>

      <footer className="flex items-center justify-between px-10 py-8 border-t border-white/[0.07]">
        <div className="flex items-center gap-2 text-[15px] font-medium">
          <div className="w-6 h-6 bg-[#5b50e8] rounded-md flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect
                x="2"
                y="2"
                width="5"
                height="5"
                rx="1"
                fill="white"
                opacity="0.9"
              />
              <rect
                x="9"
                y="2"
                width="5"
                height="5"
                rx="1"
                fill="white"
                opacity="0.6"
              />
              <rect
                x="2"
                y="9"
                width="5"
                height="5"
                rx="1"
                fill="white"
                opacity="0.6"
              />
              <rect
                x="9"
                y="9"
                width="5"
                height="5"
                rx="1"
                fill="white"
                opacity="0.3"
              />
            </svg>
          </div>
          Sketchly
        </div>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Docs", "Status", "Twitter"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-[13px] text-white/30 hover:text-white/60 transition"
            >
              {l}
            </a>
          ))}
        </div>
        <p className="text-xs text-white/20">© 2026 Sketchly, Inc.</p>
      </footer>
    </div>
  );
}
