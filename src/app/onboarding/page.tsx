"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const PLATFORMS = [
  { id: "YouTube",   label: "YouTube",   icon: "▶", color: "#f87171", bg: "rgba(248,113,113,0.1)" },
  { id: "Instagram", label: "Instagram", icon: "📷", color: "#f472b6", bg: "rgba(244,114,182,0.1)" },
  { id: "TikTok",    label: "TikTok",    icon: "🎵", color: "#22d3ee", bg: "rgba(34,211,238,0.1)" },
  { id: "Twitter",   label: "X/Twitter", icon: "𝕏",  color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  { id: "LinkedIn",  label: "LinkedIn",  icon: "in", color: "#818cf8", bg: "rgba(129,140,248,0.1)" },
];

const NICHES = ["Tech & Gaming", "Beauty & Fashion", "Fitness & Health", "Food & Travel", "Finance & Business", "Education", "Entertainment", "Music & Art", "Parenting & Lifestyle", "Sports", "Other"];
const GOALS  = ["Grow my audience", "Monetize my content", "Save time creating content", "Improve engagement", "Cross-platform growth", "Build a brand"];

const STEPS = ["Welcome", "Your Platforms", "Your Niche", "Your Goals", "All Set!"];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [niche, setNiche] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const togglePlatform = (id: string) =>
    setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const toggleGoal = (g: string) =>
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const finish = async () => {
    setSaving(true);
    // Save linked platforms
    for (const platform of platforms) {
      await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, handle: `@${user?.username || user?.firstName || "you"}`, followers: "0", posts: "0", engagementRate: "0" }),
      });
    }
    router.push("/");
  };

  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#07070e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Progress */}
      <div style={{ width: '100%', maxWidth: '520px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ fontSize: '11px', fontWeight: i <= step ? '700' : '500', color: i <= step ? '#ff3366' : '#3a3a4a', transition: 'color 0.3s' }}>{s}</div>
          ))}
        </div>
        <div style={{ height: '3px', background: '#1a1a26', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #ff3366, #8b5cf6)', borderRadius: '2px', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '520px', background: '#111118', border: '1px solid #1e1e2a', borderRadius: '24px', padding: '40px' }}>

        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #ff3366, #8b5cf6)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '800', color: 'white', margin: '0 auto 24px' }}>CF</div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0f8', letterSpacing: '-0.03em', margin: '0 0 12px' }}>
              Welcome to CreatorFlow{user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p style={{ fontSize: '15px', color: '#6a6a80', lineHeight: '1.7', margin: '0 0 32px' }}>
              Let&apos;s set you up in 60 seconds. We&apos;ll personalize your experience based on your platforms, niche, and goals.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
              {["🤖 AI Content", "📅 Scheduling", "📊 Analytics", "💰 Monetize"].map(f => (
                <span key={f} style={{ background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.15)', color: '#ff3366', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{f}</span>
              ))}
            </div>
            <button onClick={() => setStep(1)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #ff3366, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              Let&apos;s Get Started →
            </button>
          </div>
        )}

        {/* Step 1 — Platforms */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#f0f0f8', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Where do you create?</h2>
            <p style={{ fontSize: '14px', color: '#5a5a70', margin: '0 0 24px' }}>Select all the platforms you're active on</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
              {PLATFORMS.map(p => {
                const selected = platforms.includes(p.id);
                return (
                  <button key={p.id} onClick={() => togglePlatform(p.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                    background: selected ? p.bg : '#0d0d16',
                    border: `1px solid ${selected ? p.color : '#2a2a38'}`,
                    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                  }}>
                    <span style={{ fontSize: '20px', width: '28px', textAlign: 'center', color: p.color }}>{p.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: selected ? p.color : '#9898a8', flex: 1 }}>{p.label}</span>
                    {selected && <span style={{ color: p.color, fontWeight: '700' }}>✓</span>}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #2a2a38', borderRadius: '12px', color: '#6a6a80', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
              <button onClick={() => setStep(2)} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #ff3366, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Niche */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#f0f0f8', margin: '0 0 8px', letterSpacing: '-0.02em' }}>What&apos;s your niche?</h2>
            <p style={{ fontSize: '14px', color: '#5a5a70', margin: '0 0 24px' }}>This helps us give you better AI content suggestions</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
              {NICHES.map(n => (
                <button key={n} onClick={() => setNiche(n)} style={{
                  padding: '9px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                  border: `1px solid ${niche === n ? '#ff3366' : '#2a2a38'}`,
                  background: niche === n ? 'rgba(255,51,102,0.12)' : 'transparent',
                  color: niche === n ? '#ff3366' : '#6a6a80',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>{n}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #2a2a38', borderRadius: '12px', color: '#6a6a80', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
              <button onClick={() => setStep(3)} disabled={!niche} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #ff3366, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: niche ? 'pointer' : 'not-allowed', opacity: niche ? 1 : 0.5 }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Goals */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#f0f0f8', margin: '0 0 8px', letterSpacing: '-0.02em' }}>What are your goals?</h2>
            <p style={{ fontSize: '14px', color: '#5a5a70', margin: '0 0 24px' }}>Pick everything that applies</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
              {GOALS.map(g => {
                const sel = goals.includes(g);
                return (
                  <button key={g} onClick={() => toggleGoal(g)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
                    background: sel ? 'rgba(139,92,246,0.1)' : '#0d0d16',
                    border: `1px solid ${sel ? '#8b5cf6' : '#2a2a38'}`,
                    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: sel ? '#a78bfa' : '#9898a8' }}>{g}</span>
                    {sel && <span style={{ color: '#8b5cf6', fontWeight: '700' }}>✓</span>}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #2a2a38', borderRadius: '12px', color: '#6a6a80', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
              <button onClick={() => setStep(4)} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #ff3366, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                Almost Done →
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#f0f0f8', margin: '0 0 10px', letterSpacing: '-0.02em' }}>You&apos;re all set!</h2>
            <p style={{ fontSize: '14px', color: '#6a6a80', margin: '0 0 8px', lineHeight: '1.7' }}>
              CreatorFlow is ready to help you grow on <strong style={{ color: '#e8e8f0' }}>{platforms.join(", ") || "all platforms"}</strong>.
            </p>
            <p style={{ fontSize: '14px', color: '#6a6a80', margin: '0 0 32px', lineHeight: '1.7' }}>
              You have <strong style={{ color: '#ff3366' }}>10 free AI credits</strong> to get started. Upgrade anytime for unlimited generations.
            </p>
            <div style={{ background: '#0d0d16', border: '1px solid #1e1e2a', borderRadius: '14px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#5a5a70', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Your setup</div>
              {[
                { label: "Platforms", value: platforms.length > 0 ? platforms.join(", ") : "None selected" },
                { label: "Niche", value: niche || "Not selected" },
                { label: "Goals", value: goals.length > 0 ? goals.join(", ") : "None selected" },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#5a5a70', minWidth: '70px' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', color: '#d8d8e8', fontWeight: '500' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <button onClick={finish} disabled={saving} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #ff3366, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? "Setting up..." : "Go to Dashboard →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
