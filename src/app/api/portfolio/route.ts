import { NextResponse } from "next/server";

const RH = "https://api.robinhood.com";

async function rhGet(path: string, token: string) {
  const url = path.startsWith("http") ? path : `${RH}${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Robinhood ${path}: ${res.status}`);
  return res.json();
}

export async function GET() {
  const token = process.env.ROBINHOOD_TOKEN;

  if (!token) {
    return NextResponse.json(DEMO_DATA);
  }

  try {
    const [portfolioData, positionsData, watchlistData] = await Promise.all([
      rhGet("/portfolios/", token),
      rhGet("/positions/?nonzero=true", token),
      rhGet("/watchlists/", token),
    ]);

    const portfolio = portfolioData.results?.[0] ?? {};
    const rawPositions: RhPosition[] = positionsData.results ?? [];
    const rawWatchlists: RhWatchlist[] = watchlistData.results ?? [];

    const instruments: RhInstrument[] = await Promise.all(
      rawPositions.map((p) => rhGet(p.instrument, token))
    );

    const symbols = instruments.map((i) => i.symbol).filter(Boolean);
    const quotesData = symbols.length
      ? await rhGet(`/quotes/?symbols=${symbols.join(",")}`, token)
      : { results: [] };

    const quoteMap: Record<string, RhQuote> = {};
    ((quotesData.results ?? []) as RhQuote[]).forEach((q) => {
      quoteMap[q.symbol] = q;
    });

    const positions = rawPositions.map((p, i) => {
      const inst = instruments[i];
      const q = quoteMap[inst.symbol] ?? {};
      const qty = parseFloat(p.quantity);
      const avgCost = parseFloat(p.average_buy_price ?? "0");
      const last = parseFloat(q.last_extended_hours_trade_price || q.last_trade_price || "0");
      const prev = parseFloat(q.adjusted_previous_close || "0");
      return buildPosition(inst.symbol, inst.simple_name || inst.name, qty, avgCost, last, prev);
    });

    const equity = parseFloat(portfolio.extended_hours_equity || portfolio.equity || "0");
    const cash = parseFloat(portfolio.withdrawable_amount || "0");

    return NextResponse.json({
      portfolio: {
        totalValue: (equity + cash).toFixed(2),
        equity: equity.toFixed(2),
        cash: cash.toFixed(2),
        eventContracts: "0",
        lastUpdated: new Date().toISOString(),
        demo: false,
      },
      positions,
      watchlists: rawWatchlists.slice(0, 9).map((w) => ({
        id: w.id,
        name: w.display_name,
        count: w.num_items,
        ownerType: w.owner_type,
      })),
    });
  } catch (err) {
    console.error("Portfolio fetch error:", err);
    return NextResponse.json(DEMO_DATA);
  }
}

function buildPosition(
  symbol: string,
  name: string,
  qty: number,
  avgCost: number,
  currentPrice: number,
  prevClose: number
) {
  const marketValue = qty * currentPrice;
  const costBasis = qty * avgCost;
  const totalPnl = marketValue - costBasis;
  const totalPnlPct = avgCost > 0 ? ((currentPrice - avgCost) / avgCost) * 100 : 0;
  const dayPnl = qty * (currentPrice - prevClose);
  const dayPnlPct = prevClose > 0 ? ((currentPrice - prevClose) / prevClose) * 100 : 0;
  return { symbol, name, quantity: qty, avgCost, currentPrice, prevClose, marketValue, costBasis, totalPnl, totalPnlPct, dayPnl, dayPnlPct };
}

// Types for raw Robinhood responses
interface RhPosition { instrument: string; quantity: string; average_buy_price?: string; }
interface RhInstrument { symbol: string; name: string; simple_name?: string; }
interface RhQuote { symbol: string; last_trade_price?: string; last_extended_hours_trade_price?: string; adjusted_previous_close?: string; }
interface RhWatchlist { id: string; display_name: string; num_items: number; owner_type: string; }

const DEMO_DATA = {
  portfolio: {
    totalValue: "30960.81",
    equity: "6269.50",
    cash: "24670.52",
    eventContracts: "20.79",
    lastUpdated: new Date().toISOString(),
    demo: true,
  },
  positions: [
    buildPosition("INTC", "Intel Corporation", 50, 107.20, 125.39, 116.96),
  ],
  watchlists: [
    { id: "1", name: "banks",      count: 4,  ownerType: "custom" },
    { id: "2", name: "Tech",       count: 15, ownerType: "custom" },
    { id: "3", name: "Blue chip",  count: 18, ownerType: "custom" },
    { id: "4", name: "penny",      count: 28, ownerType: "custom" },
    { id: "5", name: "Subba rao",  count: 27, ownerType: "custom" },
    { id: "6", name: "AI",         count: 2,  ownerType: "custom" },
    { id: "7", name: "Software",   count: 627, ownerType: "robinhood" },
    { id: "8", name: "IPO Access", count: 45, ownerType: "robinhood" },
  ],
};
