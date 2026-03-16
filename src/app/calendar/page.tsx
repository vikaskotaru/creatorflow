"use client";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const events: Record<number, { title: string; type: string }[]> = {
  2: [{ title: "YT: Lighting tips", type: "yt" }],
  3: [{ title: "IG: Reel — BTS", type: "ig" }],
  5: [{ title: "TK: Edit hack #46", type: "tk" }, { title: "X: Thread", type: "tw" }],
  7: [{ title: "LI: Newsletter", type: "li" }],
  9: [{ title: "YT: Gear review", type: "yt" }],
  10: [{ title: "IG: Carousel", type: "ig" }, { title: "TK: Quick tip", type: "tk" }],
  12: [{ title: "X: Poll", type: "tw" }],
  16: [{ title: "YT: Studio tour", type: "yt" }, { title: "IG: Story Q&A", type: "ig" }],
  17: [{ title: "YT: Tutorial", type: "yt" }],
  19: [{ title: "TK: Trend", type: "tk" }],
  21: [{ title: "LI: Article", type: "li" }],
};

const typeColors: Record<string, string> = {
  yt: "bg-red-500/15 text-red-400 border-l-2 border-red-400",
  ig: "bg-pink-500/15 text-pink-400 border-l-2 border-pink-400",
  tk: "bg-cyan-400/12 text-cyan-400 border-l-2 border-cyan-400",
  tw: "bg-blue-500/15 text-blue-400 border-l-2 border-blue-400",
  li: "bg-blue-700/15 text-blue-300 border-l-2 border-blue-300",
};

export default function CalendarPage() {
  const today = new Date().getDate();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-sm text-[#9898a8] mt-1">March 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm text-[#9898a8] border border-[#2a2a38] rounded-lg hover:bg-[#2a2a38]">← Feb</button>
          <button className="px-3 py-1.5 text-sm text-[#9898a8] border border-[#2a2a38] rounded-lg hover:bg-[#2a2a38]">Today</button>
          <button className="px-3 py-1.5 text-sm text-[#9898a8] border border-[#2a2a38] rounded-lg hover:bg-[#2a2a38]">Apr →</button>
          <button className="bg-[#ff3366] hover:bg-[#ff4d7a] text-white px-4 py-1.5 rounded-lg text-sm font-medium">+ Schedule</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-[#1e1e2a] rounded-xl overflow-hidden border border-[#1e1e2a]">
        {days.map((d) => (
          <div key={d} className="bg-[#1a1a24] p-2.5 text-center text-xs font-semibold text-[#5e5e70] uppercase tracking-wider">{d}</div>
        ))}
        {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => (
          <div key={day} className={`bg-[#111118] min-h-[100px] p-2 hover:bg-[#1a1a24] transition-colors cursor-pointer`}>
            <div className={`text-xs font-medium mb-1.5 ${day === today ? "text-[#ff3366] font-bold" : "text-[#5e5e70]"}`}>{day}</div>
            {events[day]?.map((e, j) => (
              <div key={j} className={`px-1.5 py-0.5 rounded text-[10px] font-medium mb-1 truncate ${typeColors[e.type]}`}>
                {e.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
