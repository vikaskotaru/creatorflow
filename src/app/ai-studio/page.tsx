"use client";
import { useState, useEffect } from "react";

const PLATFORMS = [
  { id: "youtube",   label: "YouTube",   color: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.3)" },
  { id: "instagram", label: "Instagram", color: "#f472b6", bg: "rgba(244,114,182,0.1)",  border: "rgba(244,114,182,0.3)" },
  { id: "tiktok",    label: "TikTok",    color: "#22d3ee", bg: "rgba(34,211,238,0.1)",   border: "rgba(34,211,238,0.3)" },
  { id: "twitter",   label: "X/Twitter", color: "#60a5fa", bg: "rgba(96,165,250,0.1)",   border: "rgba(96,165,250,0.3)" },
  { id: "linkedin",  label: "LinkedIn",  color: "#818cf8", bg: "rgba(129,140,248,0.1)",  border: "rgba(129,140,248,0.3)" },
];

const CONTENT_TYPES = ["Caption", "Script Outline", "Blog Post", "Tweet Thread", "Newsletter", "Video Title + Description"];
const TONES = ["Professional", "Casual & Fun", "Inspirational", "Educational", "Humorous", "Bold & Direct"];

const platformDisplayNames: Record<string, string> = {
  youtube: "YouTube", instagram: "Instagram", tiktok: "TikTok", twitter: "Twitter", linkedin: "LinkedIn",
};

export default function AIStudioPage() {
  const [topic, setTopic]           = useState("");
  const [platforms, setPlatforms]   = useState<string[]>(["youtube", "instagram"]);
  const [contentType, setType]      = useState("Caption");
  const [tone, setTone]             = useState("Casual & Fun");
  const [loading, setLoading]       = useState(false);
  const [outputs, setOutputs]       = useState<{ platform: string; text: string }[]>([]);
  const [credits, setCredits]       = useState<number | null>(null);
  const [plan, setPlan]             = useState("free");
  const [copied, setCopied]         = useState<number | null>(null);
  const [saved, setSaved]           = useState<Set<number>>(new Set());
  const [saving, setSaving]         = useState<number | null>(null);
  const [error, setError]           = useState("");

  useEffect(() => {
    fetch("/api/credits").then(r => r.json()).then(d => {
      setCredits(d.credits);
      setPlan(d.plan);
    });
  }, []);

  const toggle = (id: string) =>
    setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  const generate = async () => {
    if (!topic || platforms.length === 0) return;
    setLoading(true);
    setOutputs([]);
    setError("");
    setSaved(new Set());
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platforms, contentType, tone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        if (data.credits !== undefined) setCredits(data.credits);
      } else {
        setOutputs(data.outputs || []);
        if (data.creditsRemaining !== undefined) setCredits(data.creditsRemaining);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const copyOne = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  const saveAsDraft = async (output: { platform: string; text: string }, i: number) => {
    setSaving(i);
    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: topic.slice(0, 80),
        platform: platformDisplayNames[output.platform.toLowerCase()] || output.platform,
        status: "draft",
        body: output.text,
      }),
    });
    setSaved(prev => new Set(prev).add(i));
    setSaving(null);
  };

  const saveAll = async () => {
    for (let i = 0; i < outputs.length; i++) {
      if (!saved.has(i)) await saveAsDraft(outputs[i], i);
    }
  };

  const creditsDisplay = plan !== "free" ? "∞" : credits !== null ? String(credits) : "—";
  const creditsColor   = credits !== null && credits <= 2 ? "#f87171" : "#22c55e";

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#f0f0f8', letterSpacing: '-0.03em', margin: 0 }}>AI Studio</h1>
          <p style={{ fontSize: '14px', color: '#5a5a70', marginTop: '6px' }}>Generate platform-optimized content in seconds</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '10px', padding: '8px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#5a5a70', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Credits</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: creditsColor }}>{creditsDisplay}</div>
          </div>
          {plan === "free" && credits !== null && credits <= 3 && (
            <a href="/monetize" style={{ background: 'linear-gradient(135deg, #ff3366, #e0265a)', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
              Upgrade for ∞
            </a>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left — Input */}
        <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#5a5a70', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>Topic / Idea</label>
            <textarea
              className="input"
              style={{ minHeight: '110px', resize: 'none', lineHeight: '1.6' }}
              placeholder="E.g. 5 productivity hacks for content creators working from home..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#5a5a70', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>Content Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {CONTENT_TYPES.map(t => (
                <button key={t} onClick={() => setType(t)} style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  border: `1px solid ${contentType === t ? '#ff3366' : '#2a2a38'}`,
                  background: contentType === t ? 'rgba(255,51,102,0.12)' : 'transparent',
                  color: contentType === t ? '#ff3366' : '#6a6a80',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#5a5a70', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>Tone</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)} style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  border: `1px solid ${tone === t ? '#8b5cf6' : '#2a2a38'}`,
                  background: tone === t ? 'rgba(139,92,246,0.12)' : 'transparent',
                  color: tone === t ? '#a78bfa' : '#6a6a80',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#5a5a70', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>Platforms</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => toggle(p.id)} style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  border: `1px solid ${platforms.includes(p.id) ? p.border : '#2a2a38'}`,
                  background: platforms.includes(p.id) ? p.bg : 'transparent',
                  color: platforms.includes(p.id) ? p.color : '#6a6a80',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>{p.label}</button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#f87171' }}>
              {error}
              {error.includes("credits") && <a href="/monetize" style={{ color: '#ff3366', fontWeight: '600', marginLeft: '6px' }}>Upgrade →</a>}
            </div>
          )}

          <button onClick={generate} disabled={loading || !topic || platforms.length === 0} style={{
            background: 'linear-gradient(135deg, #ff3366, #8b5cf6)',
            color: 'white', padding: '13px', borderRadius: '12px',
            fontSize: '14px', fontWeight: '700', border: 'none',
            cursor: loading || !topic ? 'not-allowed' : 'pointer',
            opacity: loading || !topic || platforms.length === 0 ? 0.5 : 1,
            transition: 'all 0.2s', letterSpacing: '0.01em',
          }}>
            {loading ? "✦ Generating..." : "✦ Generate Content"}
          </button>
        </div>

        {/* Right — Output */}
        <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#e8e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ff3366' }}>✦</span> Generated Content
            </h3>
            {outputs.length > 0 && (
              <button onClick={saveAll} style={{ background: 'rgba(255,51,102,0.1)', color: '#ff3366', border: '1px solid rgba(255,51,102,0.2)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Save All Drafts
              </button>
            )}
          </div>

          {outputs.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#3a3a4a', padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>✦</div>
              <div style={{ fontSize: '15px', color: '#5a5a70', fontWeight: '500', marginBottom: '8px' }}>Ready to create</div>
              <div style={{ fontSize: '13px', color: '#3a3a4a', lineHeight: '1.6' }}>Describe your content idea, pick your platforms, and hit Generate</div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {outputs.map((o, i) => {
                const pc = PLATFORMS.find(p => p.label.toLowerCase() === o.platform.toLowerCase() || p.id === o.platform.toLowerCase());
                return (
                  <div key={i} style={{ background: '#0d0d16', border: '1px solid #1e1e2a', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{
                        background: pc?.bg || 'rgba(255,255,255,0.05)',
                        color: pc?.color || '#9898a8',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                      }}>{o.platform}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => copyOne(o.text, i)} style={{ fontSize: '12px', color: copied === i ? '#22c55e' : '#5a5a70', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                          {copied === i ? "✓ Copied" : "Copy"}
                        </button>
                        <button onClick={() => saveAsDraft(o, i)} disabled={saved.has(i) || saving === i} style={{ fontSize: '12px', color: saved.has(i) ? '#22c55e' : '#ff3366', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                          {saved.has(i) ? "✓ Saved" : saving === i ? "Saving..." : "Save Draft"}
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#c8c8d8', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{o.text}</div>
                    <div style={{ fontSize: '11px', color: '#3a3a4a', marginTop: '8px', fontFamily: 'monospace' }}>{o.text.length} chars</div>
                  </div>
                );
              })}
              <button onClick={generate} disabled={loading} style={{
                background: 'transparent', border: '1px dashed #2a2a38', borderRadius: '10px',
                padding: '10px', fontSize: '13px', color: '#5a5a70', cursor: 'pointer', fontWeight: '500',
              }}>↺ Regenerate</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
