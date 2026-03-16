"use client";
import { useEffect, useState } from "react";
import type { Content } from "@/app/api/content/route";
import type { SocialProfile } from "@/app/api/social/route";

const insightColors: Record<string, { border: string; bg: string; icon: string }> = {
  tip:         { border: "#3b82f6", bg: "rgba(59,130,246,0.08)",  icon: "💡" },
  warning:     { border: "#f59e0b", bg: "rgba(245,158,11,0.08)",  icon: "⚠️" },
  opportunity: { border: "#22c55e", bg: "rgba(34,197,94,0.08)",   icon: "🚀" },
};

const platformColors: Record<string, { color: string; bg: string }> = {
  YouTube:   { color: "#f87171", bg: "rgba(239,68,68,0.1)" },
  Instagram: { color: "#f472b6", bg: "rgba(236,72,153,0.1)" },
  TikTok:    { color: "#22d3ee", bg: "rgba(6,182,212,0.1)" },
  Twitter:   { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  LinkedIn:  { color: "#818cf8", bg: "rgba(129,140,248,0.1)" },
};

export default function AnalyticsPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [insights, setInsights] = useState<{ title: string; detail: string; type: string }[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/content").then(r => r.json()),
      fetch("/api/social").then(r => r.json()),
    ]).then(([cd, sd]) => {
      setContent(cd.items || []);
      setProfiles((sd.profiles || []).filter((p: SocialProfile) => p.userId));
    }).finally(() => setLoading(false));
  }, []);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch("/api/analytics/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: { contentCount: content.length, profilesLinked: profiles.length } }),
      });
      const d = await res.json();
      setInsights(d.insights || []);
    } catch {
      // fallback shown in API
    }
    setLoadingInsights(false);
  };

  useEffect(() => {
    if (!loading) fetchInsights();
  }, [loading]);

  const published  = content.filter(c => c.status === "published").length;
  const scheduled  = content.filter(c => c.status === "scheduled").length;
  const totalViews = content.reduce((s, c) => s + (parseInt(c.views) || 0), 0);
  const totalEng   = content.reduce((s, c) => s + (parseInt(c.engagement) || 0), 0);
  const avgEng     = content.length > 0 ? (totalEng / content.length).toFixed(1) : "0";

  // Platform breakdown
  const platformCounts: Record<string, number> = {};
  content.forEach(c => { platformCounts[c.platform] = (platformCounts[c.platform] || 0) + 1; });
  const sortedPlatforms = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedPlatforms[0]?.[1] || 1;

  // Top content
  const topContent = [...content]
    .sort((a, b) => (parseInt(b.views) || 0) - (parseInt(a.views) || 0))
    .slice(0, 5);

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#f0f0f8', letterSpacing: '-0.03em', margin: 0 }}>Analytics</h1>
          <p style={{ fontSize: '14px', color: '#5a5a70', marginTop: '6px' }}>Your content performance at a glance</p>
        </div>
        <button onClick={fetchInsights} disabled={loadingInsights} style={{
          background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
          border: '1px solid rgba(139,92,246,0.3)', borderRadius: '10px',
          padding: '9px 18px', fontSize: '13px', fontWeight: '600',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          {loadingInsights ? "✦ Analyzing..." : "✦ Refresh AI Insights"}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: "Total Views",    value: loading ? "—" : totalViews.toLocaleString(), icon: "👁",  sub: "across all content" },
          { label: "Avg Engagement", value: loading ? "—" : avgEng,                      icon: "❤️", sub: "per piece of content" },
          { label: "Published",      value: loading ? "—" : String(published),            icon: "✅",  sub: "live pieces" },
          { label: "Scheduled",      value: loading ? "—" : String(scheduled),            icon: "📅",  sub: "upcoming posts" },
        ].map(s => (
          <div key={s.label} style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#4a4a5a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              <span style={{ fontSize: '18px' }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#f0f0f8', letterSpacing: '-0.03em' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#4a4a5a', marginTop: '4px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Platform Breakdown */}
        <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#e8e8f0', margin: '0 0 20px' }}>Platform Breakdown</h3>
          {sortedPlatforms.length === 0 ? (
            <div style={{ color: '#4a4a5a', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>No content yet — start scheduling!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {sortedPlatforms.map(([platform, count]) => {
                const pc = platformColors[platform] || { color: "#9898a8", bg: "rgba(255,255,255,0.05)" };
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={platform}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: pc.color }}>{platform}</span>
                      <span style={{ fontSize: '12px', color: '#5a5a70' }}>{count} posts</span>
                    </div>
                    <div style={{ height: '8px', background: '#1a1a26', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pc.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Connected Social Profiles */}
        <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#e8e8f0', margin: 0 }}>Social Profiles</h3>
            <a href="/social" style={{ fontSize: '12px', color: '#ff3366', textDecoration: 'none', fontWeight: '500' }}>Manage →</a>
          </div>
          {profiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '13px', color: '#4a4a5a', marginBottom: '14px' }}>No social profiles linked</div>
              <a href="/social" style={{ background: 'rgba(255,51,102,0.1)', color: '#ff3366', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>+ Link Profile</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profiles.slice(0, 5).map(p => {
                const pc = platformColors[p.platform] || { color: "#9898a8", bg: "rgba(255,255,255,0.05)" };
                return (
                  <div key={p.handle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#0d0d16', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: pc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: pc.color }}>
                        {p.platform[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#d8d8e8' }}>{p.handle}</div>
                        <div style={{ fontSize: '11px', color: pc.color }}>{p.platform}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#e8e8f0' }}>{p.followers || "—"}</div>
                      <div style={{ fontSize: '11px', color: '#4a4a5a' }}>followers</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* AI Insights */}
        <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#e8e8f0', margin: 0 }}>AI Insights</h3>
            <span style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>Powered by Claude</span>
          </div>
          {loadingInsights ? (
            <div style={{ color: '#5a5a70', fontSize: '13px', padding: '20px 0' }}>✦ Analyzing your content...</div>
          ) : insights.length === 0 ? (
            <div style={{ color: '#4a4a5a', fontSize: '13px' }}>No insights yet. Create some content first!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {insights.map((ins, i) => {
                const style = insightColors[ins.type] || insightColors.tip;
                return (
                  <div key={i} style={{ background: style.bg, borderLeft: `3px solid ${style.border}`, borderRadius: '0 10px 10px 0', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{style.icon}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#e8e8f0', marginBottom: '4px' }}>{ins.title}</div>
                        <div style={{ fontSize: '12px', color: '#7878a0', lineHeight: '1.5' }}>{ins.detail}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Content */}
        <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#e8e8f0', margin: '0 0 20px' }}>Top Performing Content</h3>
          {topContent.length === 0 ? (
            <div style={{ color: '#4a4a5a', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
              No published content yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topContent.map((c, i) => {
                const pc = platformColors[c.platform] || { color: "#9898a8", bg: "rgba(255,255,255,0.05)" };
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: '#0d0d16', borderRadius: '10px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: i < 3 ? '#f59e0b' : '#3a3a4a', width: '24px', textAlign: 'center' }}>#{i+1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#d8d8e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                      <span style={{ background: pc.bg, color: pc.color, padding: '1px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' }}>{c.platform}</span>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#e8e8f0' }}>{c.views || "0"}</div>
                      <div style={{ fontSize: '11px', color: '#4a4a5a' }}>views</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
