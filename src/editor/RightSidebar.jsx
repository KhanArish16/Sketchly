import {
  MousePointer2,
  PenTool,
  Square,
  Circle,
  Type,
  StickyNote,
  Image,
  Download,
} from "lucide-react";

const tools = [
  {
    icon: MousePointer2,
    label: "Select",
  },
  {
    icon: PenTool,
    label: "Pen",
  },
  {
    icon: Square,
    label: "Rectangle",
  },
  {
    icon: Circle,
    label: "Circle",
  },
  {
    icon: Type,
    label: "Text",
  },
  {
    icon: StickyNote,
    label: "Sticky",
  },
  {
    icon: Image,
    label: "Image",
  },
];

export default function RightSidebar() {
  return (
    <div className="w-[78px] border-l border-white/[0.06] bg-[#0B0D12] flex flex-col items-center py-4 gap-3 flex-shrink-0">
      {tools.map((tool, i) => {
        const Icon = tool.icon;

        return (
          <button
            key={i}
            className="w-12 h-12 rounded-xl bg-[#12151D] border border-white/[0.04] hover:bg-[#171B24] transition flex items-center justify-center group"
          >
            <Icon
              size={18}
              className="text-white/60 group-hover:text-white transition"
            />
          </button>
        );
      })}

      <div className="flex-1" />

      <button className="w-12 h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition flex items-center justify-center">
        <Download size={18} className="text-white" />
      </button>
    </div>
  );
}
