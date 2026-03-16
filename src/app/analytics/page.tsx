const stats = [
  { label: "Total Impressions", value: "1.24M", change: "+14.2%" },
  { label: "Avg. Engagement", value: "4.8%", change: "+0.6%" },
  { label: "New Followers", value: "+4,218", change: "+22%" },
  { label: "Revenue per Post", value: "$118", change: "+$23" },
];

const platforms = [
  { name: "YouTube", pct: 42, color: "bg-red-500" },
  { name: "Instagram", pct: 28, color: "bg-pink-500" },
  { name: "TikTok", pct: 18, color: "bg-cyan-400" },
  { name: "X/Twitter", pct: 8, color: "bg-blue-500" },
  { name: "LinkedIn", pct: 4, color: "bg-blue-700" },
];

const insights = [
  { text: "Best posting time: Tuesday & Thursday at 11am", detail: "Based on your audience engagement over the last 90 days", color: "border-green-500" },
  { text: "Carousel posts get 2.3x more saves than single images", detail: "Consider converting your top tutorials into carousel format", color: "border-blue-500" },
  { text: "Your lighting content outperforms by 47%", detail: "Doubling down on this niche could accelerate growth", color: "border-purple-500" },
];

export default function AnalyticsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-[#9898a8] mt-1">Cross-platform performance insights</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm text-[#9898a8] border border-[#2a2a38] rounded-lg hover:bg-[#2a2a38]">Export PDF</button>
          <button className="px-3 py-1.5 text-sm text-[#9898a8] border border-[#2a2a38] rounded-lg hover:bg-[#2a2a38]">Last 30 Days</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-5">
            <div className="text-xs font-medium text-[#5e5e70] uppercase tracking-wider">{s.label}</div>
            <div className="text-3xl font-bold mt-1 tracking-tight">{s.value}</div>
            <div className="text-xs text-green-400 mt-1">↑ {s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-6">
          <h3 className="font-semibold mb-5">Platform Breakdown</h3>
          <div className="space-y-4">
            {platforms.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ color: p.name === "YouTube" ? "#f87171" : p.name === "Instagram" ? "#ec4899" : p.name === "TikTok" ? "#22d3ee" : p.name === "LinkedIn" ? "#60a5fa" : "#3b82f6" }}>{p.name}</span>
                  <span className="text-[#5e5e70]">{p.pct}% of traffic</span>
                </div>
                <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">AI Insights</h3>
            <span className="bg-[#ff3366]/15 text-[#ff3366] px-2.5 py-0.5 rounded-full text-xs font-semibold">AI-Powered</span>
          </div>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className={`bg-[#1a1a24] border border-[#2a2a38] rounded-lg p-3.5 border-l-[3px] ${ins.color}`}>
                <div className="text-sm font-medium">{ins.text}</div>
                <div className="text-xs text-[#5e5e70] mt-1">{ins.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
