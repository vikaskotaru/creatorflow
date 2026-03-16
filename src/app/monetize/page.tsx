"use client";
import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "Perfect for getting started",
    color: "#5a5a70",
    bg: "rgba(90,90,112,0.08)",
    border: "#2a2a38",
    features: [
      "10 AI content generations",
      "1 social profile",
      "Basic analytics",
      "Content calendar",
      "Community access",
    ],
    cta: "Current Plan",
    ctaStyle: { background: '#1e1e2a', color: '#5a5a70', cursor: 'default' },
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    desc: "For serious content creators",
    color: "#ff3366",
    bg: "rgba(255,51,102,0.08)",
    border: "#ff3366",
    features: [
      "Unlimited AI generations",
      "5 social profiles",
      "Advanced analytics + AI insights",
      "Content scheduling",
      "Priority support",
      "Tone & style presets",
      "Content repurposing wizard",
    ],
    cta: "Upgrade to Pro",
    ctaStyle: { background: 'linear-gradient(135deg, #ff3366, #e0265a)', color: 'white', cursor: 'pointer' },
    popular: true,
  },
  {
    name: "Agency",
    price: "$49",
    period: "/month",
    desc: "For agencies & power users",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "#8b5cf6",
    features: [
      "Everything in Pro",
      "Unlimited social profiles",
      "Team collaboration (5 seats)",
      "White-label reports",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Upgrade to Agency",
    ctaStyle: { background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', cursor: 'pointer' },
    popular: false,
  },
];

const REVENUE_IDEAS = [
  { icon: "🎓", title: "Online Courses", desc: "Package your expertise into structured courses. Creators earn $500–$50,000/mo from courses.", revenue: "$500–$50K/mo", difficulty: "Medium" },
  { icon: "📱", title: "Sponsored Content", desc: "Partner with brands aligned to your niche. Rates scale with your audience size.", revenue: "$50–$10K/post", difficulty: "Low" },
  { icon: "👥", title: "Membership Community", desc: "Build a paid community on Discord or Circle. Recurring revenue from your most loyal fans.", revenue: "$5–$50/member/mo", difficulty: "Low" },
  { icon: "📚", title: "Digital Products", desc: "eBooks, templates, presets, swipe files. Low effort, high margin, evergreen income.", revenue: "$9–$299/product", difficulty: "Low" },
  { icon: "🎤", title: "Speaking & Workshops", desc: "Leverage your expertise for paid speaking, workshops, and corporate training.", revenue: "$500–$10K/event", difficulty: "High" },
  { icon: "🤝", title: "Consulting / 1:1 Coaching", desc: "Offer direct access to your brain. High-value, low-volume income stream.", revenue: "$100–$500/hr", difficulty: "Low" },
];

export default function MonetizePage() {
  const [billingAnnual, setBillingAnnual] = useState(false);

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#f0f0f8', letterSpacing: '-0.03em', margin: '0 0 10px' }}>
          Monetize Your Creativity
        </h1>
        <p style={{ fontSize: '15px', color: '#5a5a70', margin: '0 0 24px' }}>
          Choose the plan that fits your growth stage
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#111118', border: '1px solid #1e1e2a', borderRadius: '20px', padding: '6px 8px' }}>
          <button onClick={() => setBillingAnnual(false)} style={{ padding: '6px 16px', borderRadius: '16px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', background: !billingAnnual ? '#ff3366' : 'transparent', color: !billingAnnual ? 'white' : '#5a5a70' }}>Monthly</button>
          <button onClick={() => setBillingAnnual(true)} style={{ padding: '6px 16px', borderRadius: '16px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', background: billingAnnual ? '#ff3366' : 'transparent', color: billingAnnual ? 'white' : '#5a5a70', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Annual <span style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '1px 6px', borderRadius: '10px', fontSize: '11px' }}>Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '52px' }}>
        {PLANS.map(plan => {
          const price = billingAnnual && plan.price !== "$0"
            ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
            : plan.price;
          return (
            <div key={plan.name} style={{
              background: plan.popular ? plan.bg : '#111118',
              border: `1px solid ${plan.popular ? plan.border : '#1e1e2a'}`,
              borderRadius: '20px', padding: '28px',
              position: 'relative',
              boxShadow: plan.popular ? `0 0 40px rgba(255,51,102,0.1)` : 'none',
            }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #ff3366, #e0265a)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: plan.color, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '800', color: '#f0f0f8', letterSpacing: '-0.03em' }}>{price}</span>
                  <span style={{ fontSize: '14px', color: '#5a5a70' }}>{plan.period}</span>
                  {billingAnnual && plan.price !== "$0" && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>(billed annually)</span>}
                </div>
                <div style={{ fontSize: '13px', color: '#6a6a80' }}>{plan.desc}</div>
              </div>
              <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: plan.color, fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: '#9898a8' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', border: 'none', ...plan.ctaStyle }}>
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Revenue Ideas */}
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#f0f0f8', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Revenue Streams for Creators</h2>
          <p style={{ fontSize: '14px', color: '#5a5a70', margin: 0 }}>Explore proven ways to monetize your audience beyond brand deals</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {REVENUE_IDEAS.map(idea => (
            <div key={idea.title} style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '20px', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{idea.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#e8e8f0', marginBottom: '6px' }}>{idea.title}</div>
              <div style={{ fontSize: '13px', color: '#6a6a80', lineHeight: '1.6', marginBottom: '14px' }}>{idea.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#22c55e' }}>{idea.revenue}</span>
                <span style={{
                  fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px',
                  background: idea.difficulty === 'Low' ? 'rgba(34,197,94,0.1)' : idea.difficulty === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                  color: idea.difficulty === 'Low' ? '#22c55e' : idea.difficulty === 'Medium' ? '#f59e0b' : '#f87171',
                }}>{idea.difficulty} effort</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
