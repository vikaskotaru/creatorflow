"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const navItems = [
  {
    href: "/", label: "Dashboard",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  },
  {
    href: "/analytics", label: "Analytics",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  },
  {
    href: "/calendar", label: "Calendar",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  },
  {
    href: "/ai-studio", label: "AI Studio",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01z"/></svg>
  },
  {
    href: "/social", label: "Social Profiles",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  },
  {
    href: "/monetize", label: "Monetize",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 100 4h4a2 2 0 010 4H8M12 6v12"/></svg>
  },
  {
    href: "/learn", label: "Learn",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    fetch("/api/credits").then(r => r.json()).then(d => {
      setCredits(d.credits ?? null);
      setPlan(d.plan ?? "free");
    }).catch(() => {});
  }, [pathname]); // refresh on every page change

  return (
    <aside style={{
      width: '220px', minWidth: '220px',
      background: '#0d0d16',
      borderRight: '1px solid #1a1a26',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1a1a26' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #ff3366, #8b5cf6)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '800', color: 'white', flexShrink: 0,
          }}>CF</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#f0f0f8', letterSpacing: '-0.02em' }}>CreatorFlow</div>
            <div style={{ fontSize: '10px', color: '#4a4a5a', fontWeight: '500' }}>Creator Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#3a3a4a', letterSpacing: '0.08em', padding: '4px 10px 6px', textTransform: 'uppercase' }}>Main</div>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '10px',
              fontSize: '13.5px', fontWeight: isActive ? '600' : '500',
              color: isActive ? '#f0f0f8' : '#6a6a80',
              textDecoration: 'none', marginBottom: '1px',
              background: isActive ? '#1e1e2e' : 'transparent',
              transition: 'all 0.15s',
            }}>
              <span style={{ color: isActive ? '#ff3366' : '#5a5a70', transition: 'color 0.15s', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {item.href === "/ai-studio" && (
                <span style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #ff3366, #8b5cf6)', color: 'white', fontSize: '9px', fontWeight: '800', padding: '1px 6px', borderRadius: '8px' }}>AI</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #1a1a26' }}>
        {/* Credits */}
        {plan === "free" && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', color: '#5a5a70', fontWeight: '600' }}>AI Credits</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: credits !== null && credits <= 2 ? '#f87171' : '#9898a8' }}>
                {credits !== null ? `${credits} / 10` : '—'}
              </span>
            </div>
            <div style={{ height: '4px', background: '#1a1a26', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: credits !== null ? `${(credits / 10) * 100}%` : '0%',
                background: credits !== null && credits <= 2 ? '#f87171' : 'linear-gradient(90deg, #ff3366, #8b5cf6)',
                borderRadius: '2px', transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )}
        {plan !== "free" && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: '600' }}>✓ {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan — Unlimited</div>
          </div>
        )}

        <Link href="/monetize" style={{
          display: 'block', background: 'linear-gradient(135deg, rgba(255,51,102,0.12), rgba(139,92,246,0.12))',
          border: '1px solid rgba(255,51,102,0.2)', borderRadius: '10px', padding: '10px 12px',
          textDecoration: 'none', marginBottom: '12px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#ff3366', marginBottom: '2px' }}>⚡ Upgrade to Pro</div>
          <div style={{ fontSize: '11px', color: '#5a5a70' }}>Unlimited AI generations</div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserButton />
          <div>
            <div style={{ fontSize: '12px', color: '#9898a8', fontWeight: '500' }}>Account</div>
            <div style={{ fontSize: '11px', color: '#4a4a5a' }}>Free Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
