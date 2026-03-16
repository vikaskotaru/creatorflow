const stats = [
  { label: "Total Revenue", value: "$12,847", change: "+23%", color: "text-green-400" },
  { label: "Active Subscribers", value: "342", change: "+18 this week" },
  { label: "Products Sold", value: "1,247", change: "+89 this month" },
  { label: "Avg. Order Value", value: "$37.20", change: "+$4.10" },
];

const products = [
  { name: "Cinematic Filmmaking 101", type: "Course", typeBg: "bg-purple-500/15 text-purple-400", price: "$97", sales: "847 sales", revenue: "$82,159", pct: 85, barColor: "bg-purple-500" },
  { name: "The Creator's Lighting Guide", type: "E-Book", typeBg: "bg-blue-500/15 text-blue-400", price: "$19", sales: "312 sales", revenue: "$5,928", pct: 45, barColor: "bg-blue-500" },
  { name: "Creator Inner Circle", type: "Membership", typeBg: "bg-green-500/15 text-green-400", price: "$12/mo", sales: "342 active", revenue: "$4,104/mo MRR", pct: 65, barColor: "bg-green-500" },
];

export default function MonetizePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monetization</h1>
          <p className="text-sm text-[#9898a8] mt-1">Track revenue, manage products, and grow your income</p>
        </div>
        <button className="bg-[#ff3366] hover:bg-[#ff4d7a] text-white px-4 py-2 rounded-lg text-sm font-medium">+ New Product</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-5">
            <div className="text-xs font-medium text-[#5e5e70] uppercase tracking-wider">{s.label}</div>
            <div className={`text-3xl font-bold mt-1 tracking-tight ${s.color || ""}`}>{s.value}</div>
            <div className="text-xs text-green-400 mt-1">↑ {s.change}</div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold mb-4">Your Products</h3>
      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.name} className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${p.typeBg}`}>{p.type}</span>
            <div className="text-2xl font-bold mt-2">{p.price}</div>
            <div className="font-medium mt-1">{p.name}</div>
            <div className="text-xs text-[#5e5e70] mt-1">{p.sales} • {p.revenue}</div>
            <div className="h-2 bg-[#1a1a24] rounded-full mt-3 overflow-hidden">
              <div className={`h-full rounded-full ${p.barColor}`} style={{ width: `${p.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
