import Link from "next/link";

const CATEGORIES = [
  {
    title: "Content Strategy",
    icon: "🎯",
    color: "#ff3366",
    bg: "rgba(255,51,102,0.08)",
    lessons: ["Finding Your Niche", "Building a Content Pillars Framework", "The 80/20 Content Rule", "Repurposing Like a Pro"],
  },
  {
    title: "Growing on YouTube",
    icon: "▶️",
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    lessons: ["YouTube SEO Basics", "Thumbnail Psychology", "The Perfect Hook Formula", "Watch Time Optimization"],
  },
  {
    title: "Instagram Mastery",
    icon: "📷",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.08)",
    lessons: ["Reel Strategy 2025", "Carousel Content That Converts", "Stories That Build Community", "Hashtag Strategy Guide"],
  },
  {
    title: "TikTok Growth",
    icon: "🎵",
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.08)",
    lessons: ["The TikTok Algorithm Explained", "Hook Writing for Short Video", "Trending Sounds Strategy", "From 0 to 10K Followers"],
  },
  {
    title: "Monetization",
    icon: "💰",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    lessons: ["Brand Deal Negotiation", "Building Digital Products", "Membership Community Setup", "Course Launch Blueprint"],
  },
  {
    title: "AI for Creators",
    icon: "✦",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    lessons: ["Using AI to 10x Your Output", "Prompt Engineering for Content", "AI Tools Every Creator Needs", "Automating Your Workflow"],
  },
];

const FEATURED = [
  { title: "The Creator's Growth Playbook", desc: "A step-by-step framework for growing from 0 to 100K followers across any platform.", tag: "FREE GUIDE", color: "#ff3366" },
  { title: "Land Your First $1,000 Brand Deal", desc: "The exact email templates, rate cards, and negotiation scripts to close paid partnerships.", tag: "COMING SOON", color: "#f59e0b" },
  { title: "AI Content Machine", desc: "Build a content system using AI tools that produces 30 days of content in a single afternoon.", tag: "COMING SOON", color: "#8b5cf6" },
];

export default function LearnPage() {
  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '20px', padding: '4px 12px', marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Creator Academy</span>
          <span style={{ background: '#8b5cf6', color: 'white', fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '10px' }}>COMING SOON</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#f0f0f8', letterSpacing: '-0.03em', margin: '0 0 10px' }}>
          Learn to Grow, Create &amp; Earn
        </h1>
        <p style={{ fontSize: '15px', color: '#5a5a70', margin: 0, maxWidth: '560px' }}>
          In-depth courses, guides, and playbooks from creators who&apos;ve built audiences from zero. New content every week.
        </p>
      </div>

      {/* Featured */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {FEATURED.map(f => (
          <div key={f.title} style={{
            background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px',
            padding: '24px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: f.color }} />
            <span style={{ display: 'inline-block', background: `rgba(${f.color === '#ff3366' ? '255,51,102' : f.color === '#f59e0b' ? '245,158,11' : '139,92,246'},0.1)`, color: f.color, fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.08em', marginBottom: '12px' }}>{f.tag}</span>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#e8e8f0', marginBottom: '8px', lineHeight: '1.4' }}>{f.title}</div>
            <div style={{ fontSize: '13px', color: '#6a6a80', lineHeight: '1.6' }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#e8e8f0', margin: '0 0 20px' }}>Browse by Topic</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {CATEGORIES.map(cat => (
            <div key={cat.title} style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '20px', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{cat.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#e8e8f0' }}>{cat.title}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cat.lessons.map(lesson => (
                  <div key={lesson} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: '#0d0d16', borderRadius: '8px', cursor: 'not-allowed', opacity: 0.7 }}>
                    <span style={{ fontSize: '12px', color: '#3a3a4a' }}>🔒</span>
                    <span style={{ fontSize: '13px', color: '#7878a0' }}>{lesson}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #1a1a26', fontSize: '12px', color: cat.color, fontWeight: '600' }}>
                {cat.lessons.length} lessons • Coming Soon
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: '40px', background: 'linear-gradient(135deg, rgba(255,51,102,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '20px', padding: '36px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0f8', letterSpacing: '-0.02em', marginBottom: '10px' }}>
          Get notified when courses launch
        </div>
        <div style={{ fontSize: '14px', color: '#6a6a80', marginBottom: '24px' }}>
          We&apos;re building the best creator education platform on the internet. Be first to know.
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
          <input className="input" placeholder="your@email.com" style={{ flex: 1 }} />
          <button style={{ background: 'linear-gradient(135deg, #ff3366, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
}
