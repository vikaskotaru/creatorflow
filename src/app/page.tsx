"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { Content } from "@/app/api/content/route";

const platformColors: Record<string, { bg: string; text: string; dot: string }> = {
  YouTube:   { bg: "rgba(239,68,68,0.1)",   text: "#f87171", dot: "#ef4444" },
  Instagram: { bg: "rgba(236,72,153,0.1)",  text: "#f472b6", dot: "#ec4899" },
  TikTok:    { bg: "rgba(34,211,238,0.1)",  text: "#22d3ee", dot: "#06b6d4" },
  Twitter:   { bg: "rgba(59,130,246,0.1)",  text: "#60a5fa", dot: "#3b82f6" },
  LinkedIn:  { bg: "rgba(99,102,241,0.1)",  text: "#818cf8", dot: "#6366f1" },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  published: { color: "#22c55e", label: "Published" },
  scheduled: { color: "#3b82f6", label: "Scheduled" },
  draft:     { color: "#f59e0b", label: "Draft" },
};

export default function Dashboard() {
  const { user } = useUser();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then(r => r.json())
      .then(d => setContent(d.items || []))
      .finally(() => setLoading(false));
  }, []);

  const published   = content.filter(c => c.status === "published").length;
  const scheduled   = content.filter(c => c.status === "scheduled").length;
  const drafts      = content.filter(c => c.status === "draft").length;
  const totalViews  = content.reduce((s, c) => s + (parseInt(c.views) || 0), 0);
  const recent      = [...content].reverse().slice(0, 6);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#f0f0f8', letterSpacing: '-0.03em', margin: 0 }}>
              {greeting()}, {user?.firstName || "Creator"} 👋
            </h1>
            <p style={{ fontSize: '14px', color: '#5a5a70', marginTop: '6px' }}>
              Here&apos;s how your content is performing today
            </p>
          </div>
          <Link href="/calendar" style={{
            background: 'linear-gradient(135deg, #ff3366, #e0265a)',
            color: 'white', padding: '10px 20px', borderRadius: '10px',
            fontSize: '14px', fontWeight: '600', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ fontSize: '16px' }}>+</span> New Content
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: "Total Views", value: loading ? "—" : totalViews.toLocaleString(), icon: "👁", color: "#8b5cf6", change: null },
          { label: "Published", value: loading ? "—" : String(published), icon: "✅", color: "#22c55e", change: null },
          { label: "Scheduled", value: loading ? "—" : String(scheduled), icon: "🕐", color: "#3b82f6", change: null },
          { label: "Drafts", value: loading ? "—" : String(drafts), icon: "✏️", color: "#f59e0b", change: null },
        ].map(s => (
          <div key={s.label} style={{
            background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px',
            padding: '20px 22px', transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#4a4a5a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              <span style={{ fontSize: '18px' }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#f0f0f8', letterSpacing: '-0.03em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { href: "/ai-studio", label: "Generate with AI", desc: "Create content instantly", emoji: "✦", gradient: "linear-gradient(135deg, #ff3366 0%, #8b5cf6 100%)" },
          { href: "/analytics", label: "View Analytics", desc: "See your top performers", emoji: "📊", gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" },
          { href: "/social", label: "Link Social Profiles", desc: "Connect your accounts", emoji: "🔗", gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)" },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{
            background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px',
            padding: '18px 20px', textDecoration: 'none', display: 'block',
            transition: 'all 0.2s',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: a.gradient, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', marginBottom: '12px',
            }}>{a.emoji}</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#e8e8f0', marginBottom: '4px' }}>{a.label}</div>
            <div style={{ fontSize: '12px', color: '#5a5a70' }}>{a.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent Content */}
      <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e1e2a' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#e8e8f0', margin: 0 }}>Recent Content</h3>
          <Link href="/calendar" style={{ fontSize: '13px', color: '#ff3366', textDecoration: 'none', fontWeight: '500' }}>View all →</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#4a4a5a', fontSize: '14px' }}>
            Loading your content...
          </div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
            <div style={{ fontSize: '15px', color: '#6a6a80', marginBottom: '8px', fontWeight: '500' }}>No content yet</div>
            <div style={{ fontSize: '13px', color: '#4a4a5a', marginBottom: '20px' }}>Start creating and scheduling your first piece of content</div>
            <Link href="/ai-studio" style={{
              background: 'linear-gradient(135deg, #ff3366, #e0265a)', color: 'white',
              padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
              fontWeight: '600', textDecoration: 'none',
            }}>✦ Generate with AI</Link>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '10px 24px', borderBottom: '1px solid #1a1a26' }}>
              {["Content", "Platform", "Status", "Views", "Engagement"].map(h => (
                <div key={h} style={{ fontSize: '11px', fontWeight: '600', color: '#4a4a5a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
              ))}
            </div>
            {recent.map(c => {
              const pc = platformColors[c.platform] || { bg: "rgba(255,255,255,0.05)", text: "#9898a8", dot: "#666" };
              const sc = statusConfig[c.status] || { color: "#666", label: c.status };
              return (
                <div key={c.id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  padding: '14px 24px', borderBottom: '1px solid #1a1a26',
                  transition: 'background 0.15s',
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#d8d8e8', paddingRight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div>
                    <span style={{ background: pc.bg, color: pc.text, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      {c.platform}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#8888a0' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: sc.color, display: 'inline-block', flexShrink: 0 }} />
                    {sc.label}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6a6a80' }}>{c.views || "—"}</div>
                  <div style={{ fontSize: '13px', color: '#6a6a80' }}>{c.engagement || "—"}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
