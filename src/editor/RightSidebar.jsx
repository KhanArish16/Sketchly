export default function RightSidebar() {
  return (
    <div className="w-[300px] border-l border-gray-800 bg-[#0b0d12] p-4 text-white">
      <h2 className="text-xl mb-6">Tools</h2>

      <div className="space-y-3">
        <button className="w-full bg-[#11131a] p-3 rounded-lg text-left">
          Rectangle
        </button>

        <button className="w-full bg-[#11131a] p-3 rounded-lg text-left">
          Circle
        </button>

        <button className="w-full bg-[#11131a] p-3 rounded-lg text-left">
          Text
        </button>

        <button className="w-full bg-[#11131a] p-3 rounded-lg text-left">
          Layers
        </button>
      </div>
    </div>
  );
}
