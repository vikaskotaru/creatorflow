const stats = [
  { label: "Total Followers", value: "127.4K", change: "+3.2%", up: true },
  { label: "Engagement Rate", value: "4.8%", change: "+0.6%", up: true },
  { label: "Content Published", value: "24", change: "+8 this week", up: true },
  { label: "Revenue (MTD)", value: "$2,847", change: "+18%", up: true },
];

const recentContent = [
  { title: "10 Tips for Better Lighting", platform: "YouTube", status: "published", engagement: "12.4K", time: "2h ago" },
  { title: "Behind the scenes studio tour", platform: "Instagram", status: "published", engagement: "3.2K", time: "5h ago" },
  { title: "Quick edit hack #47", platform: "TikTok", status: "scheduled", engagement: "—", time: "Tomorrow 9am" },
  { title: "Camera settings explained", platform: "Twitter", status: "draft", engagement: "—", time: "—" },
];

const platformColors: Record<string, string> = {
  YouTube: "bg-red-500/10 text-red-400",
  Instagram: "bg-pink-500/10 text-pink-400",
  TikTok: "bg-cyan-400/10 text-cyan-400",
  Twitter: "bg-blue-500/10 text-blue-400",
};

const statusColors: Record<string, string> = {
  published: "bg-green-500",
  scheduled: "bg-blue-500",
  draft: "bg-yellow-500",
};

export default function Dashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, Maya</h1>
          <p className="text-sm text-[#9898a8] mt-1">Here is how your content performed this week</p>
        </div>
        <button className="bg-[#ff3366] hover:bg-[#ff4d7a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + New Content
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-5">
            <div className="text-xs font-medium text-[#5e5e70] uppercase tracking-wider">{s.label}</div>
            <div className="text-3xl font-bold mt-1 tracking-tight">{s.value}</div>
            <div className="text-xs text-green-400 mt-1">{s.up ? "↑" : "↓"} {s.change}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Content</h3>
          <button className="text-sm text-[#9898a8] hover:text-white transition-colors">View All</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-[#5e5e70] uppercase tracking-wider border-b border-[#1e1e2a]">
              <th className="pb-3">Content</th><th className="pb-3">Platform</th><th className="pb-3">Status</th>
              <th className="pb-3">Engagement</th><th className="pb-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {recentContent.map((c) => (
              <tr key={c.title} className="border-b border-[#1e1e2a] hover:bg-[#1a1a24] transition-colors">
                <td className="py-3 font-medium">{c.title}</td>
                <td className="py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${platformColors[c.platform]}`}>{c.platform}</span></td>
                <td className="py-3"><span className="flex items-center gap-2 text-sm text-[#9898a8]"><span className={`w-2 h-2 rounded-full ${statusColors[c.status]}`} />{c.status}</span></td>
                <td className="py-3 text-sm text-[#9898a8]">{c.engagement}</td>
                <td className="py-3 text-sm text-[#5e5e70]">{c.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
