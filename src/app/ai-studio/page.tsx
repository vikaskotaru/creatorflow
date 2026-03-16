"use client";
import { useState } from "react";

const platformOptions = [
  { id: "youtube", label: "YouTube", color: "border-red-500/40 text-red-400 bg-red-500/10" },
  { id: "instagram", label: "Instagram", color: "border-pink-500/40 text-pink-400 bg-pink-500/10" },
  { id: "tiktok", label: "TikTok", color: "border-cyan-400/30 text-cyan-400 bg-cyan-400/10" },
  { id: "twitter", label: "X/Twitter", color: "border-blue-500/40 text-blue-400 bg-blue-500/10" },
  { id: "linkedin", label: "LinkedIn", color: "border-blue-700/40 text-blue-300 bg-blue-700/10" },
];

const contentTypes = ["Caption", "Script Outline", "Blog Post", "Tweet Thread", "Newsletter"];

export default function AIStudioPage() {
  const [topic, setTopic] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["youtube", "instagram"]);
  const [selectedType, setSelectedType] = useState("Caption");
  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs] = useState<{ platform: string; text: string }[]>([]);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platforms: selectedPlatforms, contentType: selectedType }),
      });
      const data = await res.json();
      setOutputs(data.outputs || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">AI Studio</h1>
        <p className="text-sm text-[#9898a8] mt-1">Generate, repurpose, and optimize your content with AI</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Input */}
        <div className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-6">
          <h3 className="font-semibold mb-4">What do you want to create?</h3>
          <textarea
            className="w-full bg-[#1a1a24] border border-[#2a2a38] rounded-lg p-3.5 text-sm text-[#f0f0f5] placeholder-[#5e5e70] outline-none focus:border-[#ff3366] focus:ring-1 focus:ring-[#ff3366]/30 transition-colors resize-none min-h-[120px]"
            placeholder="Describe your content idea. Example: 'A tutorial about 3-point lighting for beginners...'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="mt-4">
            <div className="text-xs font-medium text-[#5e5e70] mb-2">Content Type</div>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((t) => (
                <button key={t} onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedType === t ? "bg-[#ff3366]/15 border-[#ff3366] text-[#ff3366]" : "bg-[#1a1a24] border-[#2a2a38] text-[#9898a8] hover:border-[#ff3366] hover:text-[#ff3366]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-medium text-[#5e5e70] mb-2">Platforms</div>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((p) => (
                <button key={p.id} onClick={() => togglePlatform(p.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedPlatforms.includes(p.id) ? p.color : "bg-[#1a1a24] border-[#2a2a38] text-[#9898a8]"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button onClick={generate} disabled={loading || !topic}
              className="flex-1 bg-[#ff3366] hover:bg-[#ff4d7a] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              {loading ? "Generating..." : "✦ Generate with AI"}
            </button>
            <button className="px-4 py-2.5 text-sm text-[#9898a8] border border-[#2a2a38] rounded-lg">3 credits</button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-[#ff3366]">✦</span> Generated Content
          </h3>

          {outputs.length === 0 ? (
            <div className="text-center py-16 text-[#5e5e70]">
              <div className="text-4xl mb-3">✦</div>
              <div className="text-sm">Enter a topic and click Generate to see AI-created content for each platform</div>
            </div>
          ) : (
            <div className="space-y-3">
              {outputs.map((o, i) => (
                <div key={i} className="bg-[#1a1a24] border border-[#2a2a38] rounded-lg p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#9898a8] mb-2">{o.platform}</div>
                  <div className="text-sm text-[#c8c8d0] leading-relaxed whitespace-pre-wrap">{o.text}</div>
                  <div className="text-[10px] text-[#5e5e70] mt-2 font-mono">{o.text.length} chars</div>
                </div>
              ))}
              <div className="flex gap-2 mt-3">
                <button className="flex-1 px-3 py-2 text-sm text-[#9898a8] border border-[#2a2a38] rounded-lg hover:bg-[#2a2a38] text-center">🔄 Regenerate</button>
                <button className="flex-1 px-3 py-2 text-sm text-[#9898a8] border border-[#2a2a38] rounded-lg hover:bg-[#2a2a38] text-center">📋 Copy All</button>
                <button className="flex-1 px-3 py-2 text-sm bg-[#ff3366] text-white rounded-lg hover:bg-[#ff4d7a] text-center">📅 Schedule</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
