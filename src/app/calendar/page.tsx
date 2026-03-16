"use client";
import { useEffect, useState } from "react";
import type { Content } from "@/app/api/content/route";

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const PLATFORMS = ["YouTube","Instagram","TikTok","Twitter","LinkedIn"];
const STATUSES  = ["draft","scheduled","published"];

const platformColors: Record<string, { color: string; bg: string; border: string }> = {
  YouTube:   { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "#f87171" },
  Instagram: { color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "#f472b6" },
  TikTok:    { color: "#22d3ee", bg: "rgba(34,211,238,0.12)",  border: "#22d3ee" },
  Twitter:   { color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  border: "#60a5fa" },
  LinkedIn:  { color: "#818cf8", bg: "rgba(129,140,248,0.12)", border: "#818cf8" },
};

const now = new Date();

export default function CalendarPage() {
  const [year, setYear]         = useState(now.getFullYear());
  const [month, setMonth]       = useState(now.getMonth());
  const [content, setContent]   = useState<Content[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setDay]   = useState(now.getDate());
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<Content | null>(null);
  const [form, setForm] = useState({ title: "", platform: "YouTube", status: "scheduled", scheduledAt: "", body: "" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();
  const today       = now.getDate();

  const load = () => fetch("/api/content").then(r => r.json()).then(d => setContent(d.items || []));
  useEffect(() => { load(); }, []);

  const eventsByDay: Record<number, Content[]> = {};
  content.forEach(c => {
    if (!c.scheduledAt) return;
    const d = new Date(c.scheduledAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(c);
    }
  });

  const openModal = (day: number) => {
    setDay(day);
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}T09:00`;
    setForm(f => ({ ...f, scheduledAt: dateStr }));
    setShowModal(true);
  };

  const prevMonth = () => month === 0 ? (setMonth(11), setYear(y => y-1)) : setMonth(m => m-1);
  const nextMonth = () => month === 11 ? (setMonth(0), setYear(y => y+1)) : setMonth(m => m+1);

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    await load();
    setShowModal(false);
    setForm({ title: "", platform: "YouTube", status: "scheduled", scheduledAt: "", body: "" });
    setSaving(false);
  };

  const del = async (id: string) => {
    setDeleting(id);
    await fetch("/api/content", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
    setViewItem(null);
    setDeleting(null);
  };

  const upcoming = [...content]
    .filter(c => c.status === "scheduled" && c.scheduledAt)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5);

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#f0f0f8', letterSpacing: '-0.03em', margin: 0 }}>Content Calendar</h1>
          <p style={{ fontSize: '14px', color: '#5a5a70', marginTop: '6px' }}>{MONTHS[month]} {year}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={prevMonth} style={{ background: '#111118', border: '1px solid #2a2a38', borderRadius: '8px', padding: '8px 14px', color: '#9898a8', cursor: 'pointer', fontSize: '14px' }}>←</button>
          <button onClick={() => { setMonth(now.getMonth()); setYear(now.getFullYear()); }} style={{ background: '#111118', border: '1px solid #2a2a38', borderRadius: '8px', padding: '8px 14px', color: '#9898a8', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>Today</button>
          <button onClick={nextMonth} style={{ background: '#111118', border: '1px solid #2a2a38', borderRadius: '8px', padding: '8px 14px', color: '#9898a8', cursor: 'pointer', fontSize: '14px' }}>→</button>
          <button onClick={() => openModal(today)} style={{ background: 'linear-gradient(135deg, #ff3366, #e0265a)', border: 'none', borderRadius: '10px', padding: '9px 18px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            + Schedule
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '20px' }}>
        {/* Calendar Grid */}
        <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #1e1e2a' }}>
            {DAYS.map(d => (
              <div key={d} style={{ padding: '12px 8px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#4a4a5a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} style={{ minHeight: '90px', borderRight: '1px solid #1a1a26', borderBottom: '1px solid #1a1a26', background: '#0a0a12' }} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i+1).map(day => {
              const isToday = day === today && month === now.getMonth() && year === now.getFullYear();
              const events  = eventsByDay[day] || [];
              return (
                <div key={day} onClick={() => openModal(day)} style={{
                  minHeight: '90px', borderRight: '1px solid #1a1a26', borderBottom: '1px solid #1a1a26',
                  padding: '8px 6px', cursor: 'pointer', transition: 'background 0.15s',
                  background: isToday ? 'rgba(255,51,102,0.04)' : 'transparent',
                }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: isToday ? '800' : '500',
                    background: isToday ? '#ff3366' : 'transparent',
                    color: isToday ? 'white' : '#5a5a70',
                    marginBottom: '4px',
                  }}>{day}</div>
                  {events.slice(0, 2).map((e, j) => {
                    const pc = platformColors[e.platform] || { color: "#9898a8", bg: "rgba(255,255,255,0.05)", border: "#666" };
                    return (
                      <div key={j} onClick={ev => { ev.stopPropagation(); setViewItem(e); }} style={{
                        background: pc.bg, borderLeft: `2px solid ${pc.border}`,
                        borderRadius: '0 4px 4px 0', padding: '2px 5px',
                        fontSize: '10px', fontWeight: '500', color: pc.color,
                        marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}>{e.title}</div>
                    );
                  })}
                  {events.length > 2 && (
                    <div style={{ fontSize: '10px', color: '#4a4a5a', marginTop: '2px' }}>+{events.length - 2} more</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar — Upcoming */}
        <div>
          <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#e8e8f0', margin: '0 0 16px' }}>Upcoming Posts</h3>
            {upcoming.length === 0 ? (
              <div style={{ color: '#4a4a5a', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>Nothing scheduled yet</div>
            ) : upcoming.map(c => {
              const pc = platformColors[c.platform] || { color: "#9898a8", bg: "rgba(255,255,255,0.05)", border: "#666" };
              const d  = new Date(c.scheduledAt);
              return (
                <div key={c.id} onClick={() => setViewItem(c)} style={{ cursor: 'pointer', padding: '10px', background: '#0d0d16', borderRadius: '10px', marginBottom: '8px', borderLeft: `3px solid ${pc.border}` }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#d8d8e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>{c.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: pc.color, fontWeight: '600' }}>{c.platform}</span>
                    <span style={{ fontSize: '11px', color: '#4a4a5a' }}>{d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#111118', border: '1px solid #2a2a38', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0f8', margin: '0 0 20px' }}>
              Schedule Content — {MONTHS[month]} {selectedDay}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: "Title", key: "title", type: "text", placeholder: "Content title..." },
                { label: "Date & Time", key: "scheduledAt", type: "datetime-local", placeholder: "" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '12px', color: '#5a5a70', fontWeight: '600', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input className="input" type={f.type} placeholder={f.placeholder} value={(form as Record<string,string>)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '12px', color: '#5a5a70', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Platform</label>
                <select className="input" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#5a5a70', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#5a5a70', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Content (optional)</label>
                <textarea className="input" style={{ minHeight: '80px', resize: 'none' }} placeholder="Paste your caption, script, or notes..." value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={save} disabled={saving || !form.title} className="btn-primary" style={{ flex: 1 }}>{saving ? "Saving..." : "Schedule"}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {viewItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setViewItem(null)}>
          <div style={{ background: '#111118', border: '1px solid #2a2a38', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f0f0f8', margin: 0, flex: 1, paddingRight: '16px' }}>{viewItem.title}</h3>
              <button onClick={() => del(viewItem.id)} disabled={deleting === viewItem.id} style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                {deleting === viewItem.id ? "..." : "Delete"}
              </button>
            </div>
            {[
              { label: "Platform", value: viewItem.platform },
              { label: "Status", value: viewItem.status },
              { label: "Scheduled", value: viewItem.scheduledAt ? new Date(viewItem.scheduledAt).toLocaleString() : "—" },
              { label: "Views", value: viewItem.views || "0" },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1a1a26' }}>
                <span style={{ fontSize: '13px', color: '#5a5a70' }}>{f.label}</span>
                <span style={{ fontSize: '13px', color: '#d8d8e8', fontWeight: '500' }}>{f.value}</span>
              </div>
            ))}
            <button onClick={() => setViewItem(null)} className="btn-ghost" style={{ width: '100%', marginTop: '20px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
