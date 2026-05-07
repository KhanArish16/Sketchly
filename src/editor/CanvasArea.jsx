export default function CanvasArea() {
  return (
    <div className="flex-1 relative overflow-auto bg-[#0F1117]">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-[3000px] h-[2000px] relative">
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-center">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mx-auto flex items-center justify-center mb-6">
            <div className="w-8 h-8 rounded-xl bg-indigo-500" />
          </div>

          <h1 className="text-2xl font-semibold text-white">
            Collaborative Canvas
          </h1>

          <p className="text-sm text-white/30 mt-3">
            Realtime canvas engine coming next
          </p>
        </div>
      </div>
    </div>
  );
}
