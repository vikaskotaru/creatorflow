"use client";
import { useEffect, useState } from "react";

interface Position {
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  totalPnl: number;
  totalPnlPct: number;
  dayPnl: number;
  dayPnlPct: number;
}

interface Watchlist {
  id: string;
  name: string;
  count: number;
  ownerType: string;
}

interface Portfolio {
  totalValue: string;
  equity: string;
  cash: string;
  eventContracts: string;
  lastUpdated: string;
  demo: boolean;
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function PnlBadge({ value, pct, size = "sm" }: { value: number; pct: number; size?: "sm" | "lg" }) {
  const pos = value >= 0;
  const color = pos ? "#22c55e" : "#f87171";
  const bg = pos ? "rgba(34,197,94,0.1)" : "rgba(248,113,113,0.1)";
  const fontSize = size === "lg" ? "18px" : "12px";
  return (
    <span style={{ background: bg, color, padding: size === "lg" ? "4px 12px" : "2px 8px", borderRadius: "20px", fontSize, fontWeight: 700, whiteSpace: "nowrap" }}>
      {pos ? "+" : ""}{fmt(value)} ({pos ? "+" : ""}{fmt(pct)}%)
    </span>
  );
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return; }
        setPortfolio(d.portfolio);
        setPositions(d.positions ?? []);
        setWatchlists(d.watchlists ?? []);
      })
      .catch(() => setError("Failed to load portfolio"))
      .finally(() => setLoading(false));
  }, []);

  const totalEquity = parseFloat(portfolio?.equity ?? "0");
  const totalValue = parseFloat(portfolio?.totalValue ?? "0");
  const dayPnl = positions.reduce((s, p) => s + p.dayPnl, 0);
  const dayPct = totalValue > 0 ? (dayPnl / totalValue) * 100 : 0;
  const totalPnl = positions.reduce((s, p) => s + p.totalPnl, 0);

  return (
    <div style={{ padding: "32px 36px", maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#f0f0f8", letterSpacing: "-0.03em", margin: 0 }}>
              Portfolio
            </h1>
            <span style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", border: "1px solid rgba(34,197,94,0.2)" }}>
              Robinhood
            </span>
            {portfolio?.demo && (
              <span style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", border: "1px solid rgba(245,158,11,0.2)" }}>
                Demo
              </span>
            )}
          </div>
          <p style={{ fontSize: "14px", color: "#5a5a70", margin: 0 }}>
            Your investment portfolio at a glance
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetch("/api/portfolio").then(r => r.json()).then(d => { setPortfolio(d.portfolio); setPositions(d.positions ?? []); setWatchlists(d.watchlists ?? []); }).finally(() => setLoading(false)); }}
          style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "9px 18px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
        >
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "12px", padding: "16px 20px", color: "#f87171", fontSize: "14px", marginBottom: "24px" }}>
          {error}
        </div>
      )}

      {/* Account Value Hero */}
      <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.04))", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "20px", padding: "32px 36px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#4a5a4a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Account Value</div>
            <div style={{ fontSize: "48px", fontWeight: "800", color: "#f0f0f8", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {loading ? "—" : `$${fmt(parseFloat(portfolio?.totalValue ?? "0"))}`}
            </div>
          </div>
          {!loading && (
            <div style={{ paddingBottom: "6px" }}>
              <div style={{ fontSize: "12px", color: "#5a5a70", marginBottom: "4px" }}>Today</div>
              <PnlBadge value={dayPnl} pct={dayPct} size="lg" />
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "28px" }}>
          {[
            { label: "Stocks & Equity", value: portfolio?.equity, icon: "📈" },
            { label: "Cash",            value: portfolio?.cash,   icon: "💵" },
            { label: "Event Contracts", value: portfolio?.eventContracts, icon: "📋" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "14px", padding: "16px 20px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px" }}>{s.icon}</span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#4a5a4a", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#e8e8f0" }}>
                {loading ? "—" : `$${fmt(parseFloat(s.value ?? "0"))}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        {/* Positions */}
        <div style={{ background: "#111118", border: "1px solid #1e1e2a", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#e8e8f0", margin: 0 }}>Open Positions</h3>
            <span style={{ fontSize: "12px", color: "#5a5a70" }}>{positions.length} holding{positions.length !== 1 ? "s" : ""}</span>
          </div>

          {loading ? (
            <div style={{ color: "#5a5a70", fontSize: "13px", padding: "20px 0" }}>Loading positions…</div>
          ) : positions.length === 0 ? (
            <div style={{ color: "#4a4a5a", fontSize: "13px", textAlign: "center", padding: "24px 0" }}>No open positions</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {positions.map((p) => (
                <div key={p.symbol} style={{ background: "#0d0d16", borderRadius: "14px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "800", color: "#f0f0f8", letterSpacing: "-0.02em" }}>{p.symbol}</div>
                      <div style={{ fontSize: "11px", color: "#5a5a70", marginTop: "2px" }}>{p.name}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: "#f0f0f8" }}>${fmt(p.currentPrice)}</div>
                      <div style={{ marginTop: "4px" }}>
                        <PnlBadge value={p.dayPnl / p.quantity} pct={p.dayPnlPct} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                    {[
                      { label: "Shares",     value: String(p.quantity) },
                      { label: "Avg Cost",   value: `$${fmt(p.avgCost)}` },
                      { label: "Mkt Value",  value: `$${fmt(p.marketValue)}` },
                    ].map(f => (
                      <div key={f.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "8px 10px" }}>
                        <div style={{ fontSize: "10px", color: "#4a4a5a", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{f.label}</div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#d8d8e8" }}>{f.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1a1a26" }}>
                    <span style={{ fontSize: "12px", color: "#5a5a70" }}>Total P&L</span>
                    <PnlBadge value={p.totalPnl} pct={p.totalPnlPct} />
                  </div>
                </div>
              ))}

              {positions.length > 0 && (
                <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: "12px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#9898a8" }}>Portfolio P&L</span>
                  <PnlBadge value={totalPnl} pct={totalEquity > 0 ? (totalPnl / (totalEquity - totalPnl)) * 100 : 0} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Watchlists */}
        <div style={{ background: "#111118", border: "1px solid #1e1e2a", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#e8e8f0", margin: 0 }}>Watchlists</h3>
            <span style={{ fontSize: "12px", color: "#5a5a70" }}>{watchlists.filter(w => w.ownerType === "custom").length} custom</span>
          </div>

          {loading ? (
            <div style={{ color: "#5a5a70", fontSize: "13px" }}>Loading…</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {watchlists.map((w) => (
                <div key={w.id} style={{
                  background: "#0d0d16", borderRadius: "12px", padding: "14px",
                  border: w.ownerType === "robinhood" ? "1px solid #1a1a26" : "1px solid #1e1e2a",
                  opacity: w.ownerType === "robinhood" ? 0.7 : 1,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#e8e8f0", marginBottom: "4px" }}>{w.name}</div>
                    {w.ownerType === "robinhood" && (
                      <span style={{ fontSize: "9px", color: "#4a4a5a", background: "#1a1a26", padding: "1px 5px", borderRadius: "4px", fontWeight: "600", textTransform: "uppercase" }}>RH</span>
                    )}
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "800", color: "#f0f0f8", letterSpacing: "-0.02em" }}>{w.count}</div>
                  <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "2px" }}>stocks</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info footer */}
      {portfolio?.demo && (
        <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "12px", padding: "14px 20px", display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "16px" }}>ℹ️</span>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#f59e0b", marginBottom: "2px" }}>Demo Mode</div>
            <div style={{ fontSize: "12px", color: "#6a6a80" }}>
              Set <code style={{ background: "#1a1a26", padding: "1px 6px", borderRadius: "4px", fontSize: "11px" }}>ROBINHOOD_TOKEN</code> in your environment to connect live account data.
            </div>
          </div>
        </div>
      )}

      {portfolio?.lastUpdated && (
        <div style={{ marginTop: "16px", fontSize: "11px", color: "#3a3a4a", textAlign: "right" }}>
          Last updated: {new Date(portfolio.lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
