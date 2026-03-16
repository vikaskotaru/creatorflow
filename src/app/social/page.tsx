"use client";
import { useEffect, useState } from "react";
import type { SocialProfile } from "@/app/api/social/route";

const PLATFORMS = [
  { id: "YouTube",   label: "YouTube",   color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: "▶", placeholder: "@yourchannel", hint: "Paste your channel URL or handle" },
  { id: "Instagram", label: "Instagram", color: "#ec4899", bg: "rgba(236,72,153,0.1)",  icon: "📷", placeholder: "@yourhandle",  hint: "Paste your Instagram profile URL" },
  { id: "TikTok",    label: "TikTok",    color: "#06b6d4", bg: "rgba(6,182,212,0.1)",   icon: "🎵", placeholder: "@yourhandle",  hint: "Paste your TikTok profile URL" },
  { id: "Twitter",   label: "X/Twitter", color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  icon: "𝕏", placeholder: "@yourhandle",  hint: "Paste your X/Twitter profile URL" },
  { id: "LinkedIn",  label: "LinkedIn",  color: "#818cf8", bg: "rgba(129,140,248,0.1)", icon: "in", placeholder: "yourprofile", hint: "Paste your LinkedIn profile URL" },
];

const TOP_CREATORS: Record<string, { name: string; handle: string; followers: string; engagement: string; niche: string; avatar: string }[]> = {
  YouTube: [
    { name: "MrBeast",       handle: "@MrBeast",       followers: "280M",  engagement: "8.2%", niche: "Entertainment", avatar: "M" },
    { name: "PewDiePie",     handle: "@PewDiePie",     followers: "111M",  engagement: "5.1%", niche: "Gaming",        avatar: "P" },
    { name: "Marques Brown", handle: "@MKBHD",         followers: "18M",   engagement: "6.4%", niche: "Tech",          avatar: "M" },
    { name: "Veritasium",    handle: "@veritasium",    followers: "16M",   engagement: "9.1%", niche: "Science",       avatar: "V" },
    { name: "Kurzgesagt",    handle: "@kurzgesagt",    followers: "22M",   engagement: "11.3%",niche: "Education",     avatar: "K" },
    { name: "Linus Tech",    handle: "@LinusTechTips", followers: "15M",   engagement: "4.8%", niche: "Tech",          avatar: "L" },
    { name: "MKBHD",         handle: "@mkbhd",         followers: "18M",   engagement: "6.4%", niche: "Tech Reviews",  avatar: "M" },
    { name: "CGP Grey",      handle: "@CGPGrey",       followers: "5.8M",  engagement: "12.1%",niche: "Education",     avatar: "C" },
    { name: "Vsauce",        handle: "@Vsauce",        followers: "19M",   engagement: "7.3%", niche: "Science",       avatar: "V" },
    { name: "3Blue1Brown",   handle: "@3blue1brown",   followers: "5.9M",  engagement: "13.4%",niche: "Math/Education",avatar: "3" },
  ],
  Instagram: [
    { name: "Cristiano Ronaldo", handle: "@cristiano",     followers: "635M", engagement: "2.1%", niche: "Sports/Lifestyle", avatar: "C" },
    { name: "Kylie Jenner",      handle: "@kyliejenner",   followers: "399M", engagement: "1.8%", niche: "Beauty/Fashion",   avatar: "K" },
    { name: "Selena Gomez",      handle: "@selenagomez",   followers: "423M", engagement: "1.4%", niche: "Entertainment",    avatar: "S" },
    { name: "Dwayne Johnson",    handle: "@therock",       followers: "396M", engagement: "2.3%", niche: "Fitness/Film",     avatar: "D" },
    { name: "Ariana Grande",     handle: "@arianagrande",  followers: "381M", engagement: "1.6%", niche: "Music",            avatar: "A" },
    { name: "Kim Kardashian",    handle: "@kimkardashian", followers: "364M", engagement: "1.2%", niche: "Fashion/Lifestyle",avatar: "K" },
    { name: "Beyoncé",           handle: "@beyonce",       followers: "318M", engagement: "3.4%", niche: "Music",            avatar: "B" },
    { name: "Taylor Swift",      handle: "@taylorswift",   followers: "283M", engagement: "4.1%", niche: "Music",            avatar: "T" },
    { name: "Zendaya",           handle: "@zendaya",       followers: "183M", engagement: "5.2%", niche: "Fashion/Acting",   avatar: "Z" },
    { name: "Billie Eilish",     handle: "@billieeilish",  followers: "113M", engagement: "4.8%", niche: "Music",            avatar: "B" },
  ],
  TikTok: [
    { name: "Khaby Lame",     handle: "@khaby.lame",   followers: "162M", engagement: "5.4%", niche: "Comedy",       avatar: "K" },
    { name: "Charli D'Amelio",handle: "@charlidamelio",followers: "155M", engagement: "4.1%", niche: "Dance",        avatar: "C" },
    { name: "Bella Poarch",   handle: "@bellapoarch",  followers: "93M",  engagement: "6.2%", niche: "Entertainment",avatar: "B" },
    { name: "Addison Rae",    handle: "@addisonre",    followers: "88M",  engagement: "3.8%", niche: "Lifestyle",    avatar: "A" },
    { name: "MrBeast",        handle: "@mrbeast",      followers: "87M",  engagement: "7.1%", niche: "Entertainment",avatar: "M" },
    { name: "Zach King",      handle: "@zachking",     followers: "80M",  engagement: "8.4%", niche: "Magic/Tricks", avatar: "Z" },
    { name: "Spencer X",      handle: "@spencerx",     followers: "55M",  engagement: "5.9%", niche: "Beatbox",      avatar: "S" },
    { name: "Michael Le",     handle: "@justmaiko",    followers: "51M",  engagement: "4.5%", niche: "Dance",        avatar: "M" },
    { name: "Riyaz Aly",      handle: "@riyazaly",     followers: "47M",  engagement: "3.2%", niche: "Entertainment",avatar: "R" },
    { name: "Dixie D'Amelio", handle: "@dixiedamelio", followers: "57M",  engagement: "3.7%", niche: "Entertainment",avatar: "D" },
  ],
  Twitter: [
    { name: "Elon Musk",    handle: "@elonmusk",    followers: "200M", engagement: "2.1%", niche: "Tech/Business",  avatar: "E" },
    { name: "Barack Obama", handle: "@BarackObama", followers: "133M", engagement: "1.8%", niche: "Politics",       avatar: "B" },
    { name: "Justin B",    handle: "@justinbieber", followers: "113M", engagement: "0.9%", niche: "Music",          avatar: "J" },
    { name: "Katy Perry",   handle: "@katyperry",   followers: "108M", engagement: "0.8%", niche: "Music",          avatar: "K" },
    { name: "Rihanna",      handle: "@rihanna",     followers: "107M", engagement: "1.2%", niche: "Music/Fashion",  avatar: "R" },
    { name: "Taylor Swift", handle: "@taylorswift13",followers: "95M", engagement: "2.4%", niche: "Music",          avatar: "T" },
    { name: "Cristiano",    handle: "@Cristiano",   followers: "111M", engagement: "1.5%", niche: "Sports",         avatar: "C" },
    { name: "Narendra Modi",handle: "@narendramodi", followers: "103M", engagement: "1.1%", niche: "Politics",      avatar: "N" },
    { name: "Ariana Grande",handle: "@ArianaGrande", followers: "80M", engagement: "0.7%", niche: "Music",          avatar: "A" },
    { name: "Bill Gates",   handle: "@BillGates",   followers: "64M",  engagement: "1.9%", niche: "Tech/Philanthropy",avatar: "B"},
  ],
  LinkedIn: [
    { name: "Bill Gates",       handle: "bill-gates",         followers: "35M",  engagement: "3.2%", niche: "Tech/Philanthropy", avatar: "B" },
    { name: "Richard Branson",  handle: "richard-branson",    followers: "19M",  engagement: "2.8%", niche: "Entrepreneurship",  avatar: "R" },
    { name: "Satya Nadella",    handle: "satyanadella",        followers: "11M",  engagement: "4.1%", niche: "Tech Leadership",   avatar: "S" },
    { name: "Arianna Huffington",handle:"arianna-huffington", followers: "9.8M", engagement: "3.5%", niche: "Leadership",        avatar: "A" },
    { name: "Gary Vaynerchuk",  handle: "garyvaynerchuk",     followers: "4.6M", engagement: "5.2%", niche: "Marketing",         avatar: "G" },
    { name: "Simon Sinek",      handle: "simonsinek",         followers: "3.9M", engagement: "6.4%", niche: "Leadership",        avatar: "S" },
    { name: "Melinda Gates",    handle: "melindafrenchgates", followers: "3.7M", engagement: "3.1%", niche: "Philanthropy",      avatar: "M" },
    { name: "Brené Brown",      handle: "brenebrown",         followers: "3.2M", engagement: "7.8%", niche: "Research/Speaking", avatar: "B" },
    { name: "Adam Grant",       handle: "adammgrant",         followers: "5.1M", engagement: "8.2%", niche: "Organizational Psy",avatar: "A" },
    { name: "Sheryl Sandberg",  handle: "sheryl-sandberg",    followers: "2.9M", engagement: "2.9%", niche: "Business",          avatar: "S" },
  ],
};

export default function SocialPage() {
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState("YouTube");
  const [form, setForm] = useState({ platform: "YouTube", handle: "", profileUrl: "", followers: "", following: "", posts: "", engagementRate: "" });

  useEffect(() => {
    fetch("/api/social")
      .then(r => r.json())
      .then(d => setProfiles((d.profiles || []).filter((p: SocialProfile) => p.userId)))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!form.handle) return;
    setSaving(true);
    await fetch("/api/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const res = await fetch("/api/social");
    const d = await res.json();
    setProfiles((d.profiles || []).filter((p: SocialProfile) => p.userId));
    setShowModal(false);
    setForm({ platform: "YouTube", handle: "", profileUrl: "", followers: "", following: "", posts: "", engagementRate: "" });
    setSaving(false);
  };

  const remove = async (handle: string) => {
    setDeleting(handle);
    await fetch("/api/social", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ handle }) });
    setProfiles(prev => prev.filter(p => p.handle !== handle));
    setDeleting(null);
  };

  const topCreators = TOP_CREATORS[activePlatform] || [];
  const activePlatformConfig = PLATFORMS.find(p => p.id === activePlatform)!;

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#f0f0f8', letterSpacing: '-0.03em', margin: 0 }}>Social Profiles</h1>
          <p style={{ fontSize: '14px', color: '#5a5a70', marginTop: '6px' }}>Link your social accounts to track performance</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          background: 'linear-gradient(135deg, #ff3366, #e0265a)',
          color: 'white', padding: '10px 20px', borderRadius: '10px',
          fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer',
        }}>+ Link Profile</button>
      </div>

      {/* Connected Profiles */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontWeight: '600', color: '#9898a8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '11px' }}>Your Connected Profiles</h2>
        {loading ? (
          <div style={{ color: '#4a4a5a', fontSize: '14px' }}>Loading...</div>
        ) : profiles.length === 0 ? (
          <div style={{ background: '#111118', border: '1px dashed #2a2a38', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔗</div>
            <div style={{ fontSize: '15px', color: '#6a6a80', fontWeight: '500', marginBottom: '8px' }}>No profiles linked yet</div>
            <div style={{ fontSize: '13px', color: '#4a4a5a', marginBottom: '20px' }}>Connect your social accounts to track your performance</div>
            <button onClick={() => setShowModal(true)} style={{
              background: 'linear-gradient(135deg, #ff3366, #e0265a)',
              color: 'white', padding: '10px 20px', borderRadius: '10px',
              fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer',
            }}>+ Link Your First Profile</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {profiles.map(p => {
              const pc = PLATFORMS.find(pl => pl.id === p.platform) || PLATFORMS[0];
              return (
                <div key={p.handle} style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: pc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: pc.color, fontSize: '18px', fontWeight: '700' }}>{pc.icon}</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#e8e8f0' }}>{p.handle}</div>
                        <div style={{ fontSize: '12px', color: pc.color, fontWeight: '500' }}>{pc.label}</div>
                      </div>
                    </div>
                    <button onClick={() => remove(p.handle)} disabled={deleting === p.handle} style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>
                      {deleting === p.handle ? "..." : "Remove"}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { label: "Followers", value: p.followers || "—" },
                      { label: "Posts", value: p.posts || "—" },
                      { label: "Engagement", value: p.engagementRate ? `${p.engagementRate}%` : "—" },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#e8e8f0' }}>{s.value}</div>
                        <div style={{ fontSize: '11px', color: '#4a4a5a', marginTop: '2px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Creators Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#e8e8f0', margin: 0 }}>Top Creators to Learn From</h2>
            <p style={{ fontSize: '13px', color: '#5a5a70', marginTop: '4px' }}>Study the best in the game — free insights on top 10 creators per platform</p>
          </div>
        </div>

        {/* Platform Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setActivePlatform(p.id)} style={{
              padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
              border: `1px solid ${activePlatform === p.id ? p.color : '#2a2a38'}`,
              background: activePlatform === p.id ? p.bg : 'transparent',
              color: activePlatform === p.id ? p.color : '#6a6a80',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{p.label}</button>
          ))}
        </div>

        {/* Top 10 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {topCreators.map((c, i) => (
            <div key={c.handle} style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '14px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: activePlatformConfig.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: activePlatformConfig.color }}>
                  {c.avatar}
                </div>
                <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: i < 3 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : '#1e1e2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: i < 3 ? 'white' : '#6a6a80' }}>
                  {i + 1}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#e8e8f0', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: activePlatformConfig.color, marginBottom: '8px' }}>{c.handle}</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#d8d8e8' }}>{c.followers}</div>
                    <div style={{ fontSize: '10px', color: '#4a4a5a' }}>followers</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e' }}>{c.engagement}</div>
                    <div style={{ fontSize: '10px', color: '#4a4a5a' }}>engagement</div>
                  </div>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span style={{ background: activePlatformConfig.bg, color: activePlatformConfig.color, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' }}>{c.niche}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#111118', border: '1px solid #2a2a38', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0f8', margin: '0 0 20px' }}>Link Social Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#5a5a70', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Platform</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PLATFORMS.map(p => (
                    <button key={p.id} onClick={() => setForm(f => ({ ...f, platform: p.id }))} style={{
                      padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                      border: `1px solid ${form.platform === p.id ? p.color : '#2a2a38'}`,
                      background: form.platform === p.id ? p.bg : 'transparent',
                      color: form.platform === p.id ? p.color : '#6a6a80',
                      cursor: 'pointer',
                    }}>{p.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#5a5a70', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Handle / Username</label>
                <input className="input" placeholder={PLATFORMS.find(p => p.id === form.platform)?.placeholder || "@handle"} value={form.handle} onChange={e => setForm(f => ({ ...f, handle: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#5a5a70', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Profile URL (optional)</label>
                <input className="input" placeholder="https://..." value={form.profileUrl} onChange={e => setForm(f => ({ ...f, profileUrl: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { key: "followers", label: "Followers" },
                  { key: "posts", label: "Posts" },
                  { key: "engagementRate", label: "Engagement %" },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: '12px', color: '#5a5a70', fontWeight: '600', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                    <input className="input" placeholder="0" value={(form as Record<string,string>)[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={save} disabled={saving || !form.handle} className="btn-primary" style={{ flex: 1 }}>
                {saving ? "Saving..." : "Link Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
