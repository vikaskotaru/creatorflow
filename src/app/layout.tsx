import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatorFlow",
  description: "Automated SaaS for content creators",
};

const navItems = [
  { href: "/", label: "Dashboard", icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
  { href: "/calendar", label: "Calendar", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { href: "/analytics", label: "Analytics", icon: "M18 20V10M12 20V4M6 20v-6" },
  { href: "/ai-studio", label: "AI Studio", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01z" },
  { href: "/monetize", label: "Monetize", icon: "M12 2a10 10 0 110 20 10 10 0 010-20zM16 8h-6a2 2 0 100 4h4a2 2 0 010 4H8M12 6v12" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0f] text-[#f0f0f5]">
        <div className="flex h-screen">
          <aside className="w-56 bg-[#111118] border-r border-[#1e1e2a] flex flex-col">
            <div className="p-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff3366] rounded-lg flex items-center justify-center font-bold text-sm">C</div>
              <span className="font-bold text-lg tracking-tight">CreatorFlow</span>
            </div>
            <nav className="flex-1 px-3 py-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#9898a8] hover:text-white hover:bg-[#2a2a38] transition-colors mb-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-[#1e1e2a]">
              <div className="text-xs text-[#5e5e70]">AI Credits</div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-[#9898a8]">342 / 500</span>
                <span className="text-[#5e5e70]">68%</span>
              </div>
              <div className="h-1.5 bg-[#1a1a24] rounded-full mt-2">
                <div className="h-full w-[68%] bg-gradient-to-r from-[#ff3366] to-[#8b5cf6] rounded-full" />
              </div>
            </div>
          </aside>
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
