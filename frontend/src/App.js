import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://future-fs-02-wt3r.onrender.com/api";

const STATUS_NEXT = { new: "contacted", contacted: "converted" };
const STATUS_BTN = { new: "Mark Contacted", contacted: "Mark Converted", converted: "Converted" };
const STATUS_BADGE = {
  new:       { bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" },
  contacted: { bg: "#FFFBEB", color: "#B45309", dot: "#F59E0B" },
  converted: { bg: "#ECFDF5", color: "#065F46", dot: "#10B981" },
};

function Avatar({ name }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = [
    { bg: "#EDE9FE", text: "#5B21B6" },
    { bg: "#FCE7F3", text: "#9D174D" },
    { bg: "#DBEAFE", text: "#1E40AF" },
    { bg: "#D1FAE5", text: "#065F46" },
    { bg: "#FEF3C7", text: "#92400E" },
  ];
  const c = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.bg, color: c.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn]     = useState(false);
  const [username, setUsername]     = useState("");
  const [password, setPassword]     = useState("");
  const [loginErr, setLoginErr]     = useState("");
  const [leads, setLeads]           = useState([]);
  const [selected, setSelected]     = useState(null);
  const [noteInput, setNoteInput]   = useState("");
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all");
  const [showAdd, setShowAdd]       = useState(false);
  const [noteSaved, setNoteSaved]   = useState(false);
  const [form, setForm]             = useState({ name: "", email: "", phone: "", source: "Contact Form" });
  const [formErr, setFormErr]       = useState("");

  const stats = {
    total:     leads.length,
    new:       leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    converted: leads.filter(l => l.status === "converted").length,
  };

  const filtered = leads.filter(l =>
    (l.name + l.email + l.source).toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || l.status === filter)
  );

  // Fetch all leads from backend
  const fetchLeads = async () => {
    const res = await axios.get(`${API}/leads`);
    setLeads(res.data);
  };

  useEffect(() => { if (loggedIn) fetchLeads(); }, [loggedIn]);

  // Login
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      if (res.data.success) { setLoggedIn(true); setLoginErr(""); }
    } catch {
      setLoginErr("❌ Wrong credentials — try admin / admin123");
    }
  };

  // Update lead status
  const advance = async (lead) => {
    const next = STATUS_NEXT[lead.status];
    if (!next) return;
    await axios.put(`${API}/leads/${lead._id}`, { status: next });
    fetchLeads();
    if (selected?._id === lead._id) setSelected(p => ({ ...p, status: next }));
  };

  // Save note
  const saveNote = async () => {
    if (!noteInput.trim()) return;
    await axios.put(`${API}/leads/${selected._id}`, { notes: noteInput });
    fetchLeads();
    setSelected(p => ({ ...p, notes: noteInput }));
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // Add new lead
  const addLead = async () => {
    if (!form.name.trim() || !form.email.trim()) { setFormErr("Name and Email are required."); return; }
    await axios.post(`${API}/leads`, form);
    fetchLeads();
    setForm({ name: "", email: "", phone: "", source: "Contact Form" });
    setShowAdd(false);
    setFormErr("");
  };

  const pick = (lead) => { setSelected(lead); setNoteInput(lead.notes || ""); };

  const S = {
    page:   { fontFamily: "'Outfit','Segoe UI',sans-serif", minHeight: "100vh", background: "#F8FAFC" },
    input:  { width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#F8FAFC" },
    btn:    { cursor: "pointer", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 600, fontSize: 14 },
    header: { background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  };

  // ── LOGIN SCREEN ──
  if (!loggedIn) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#1e1b4b,#312e81,#1e3a5f)", fontFamily: "'Outfit','Segoe UI',sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 380, boxShadow: "0 24px 60px rgba(0,0,0,.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 12px" }}>📊</div>
          <h2 style={{ fontWeight: 700, fontSize: 22, margin: "0 0 4px" }}>Mini CRM</h2>
          <p style={{ color: "#94A3B8", fontSize: 13, margin: 0 }}>Admin panel — sign in to continue</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>USERNAME</label>
            <input style={S.input} placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input style={S.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          {loginErr && <p style={{ color: "#EF4444", fontSize: 13, margin: 0 }}>{loginErr}</p>}
          <button style={{ ...S.btn, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", marginTop: 4 }} onClick={handleLogin}>Sign In →</button>
          <p style={{ textAlign: "center", fontSize: 12, color: "#94A3B8", margin: 0 }}>Demo: <b>admin</b> / <b>admin123</b></p>
        </div>
      </div>
    </div>
  );

  // ── DASHBOARD ──
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📊</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Mini CRM</span>
          <span style={{ color: "#94A3B8", fontSize: 13 }}>· Lead Dashboard</span>
        </div>
        <button style={{ ...S.btn, background: "#F1F5F9", color: "#475569", padding: "7px 14px", fontSize: 12 }} onClick={() => setLoggedIn(false)}>Logout</button>
      </div>

      <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        {/* Stats */}
        
<div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
  {[
    { l: "Total Leads", v: stats.total,    dot: "#6366F1", pct: 100 },
    { l: "New",         v: stats.new,       dot: "#378ADD", pct: stats.total ? Math.round((stats.new / stats.total) * 100) : 0 },
    { l: "Contacted",   v: stats.contacted, dot: "#EF9F27", pct: stats.total ? Math.round((stats.contacted / stats.total) * 100) : 0 },
    { l: "Converted",   v: stats.converted, dot: "#639922", pct: stats.total ? Math.round((stats.converted / stats.total) * 100) : 0 },
  ].map(s => (
    <div key={s.l} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "16px 20px", flex: 1, minWidth: 120 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{s.l}</span>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, display: "block" }} />
      </div>
      <span style={{ fontSize: 30, fontWeight: 700 }}>{s.v}</span>
      <div style={{ fontSize: 12, color: s.dot, marginTop: 4, fontWeight: 600 }}>
        {s.pct}% of total
      </div>
      <div style={{ marginTop: 8, background: "#F1F5F9", borderRadius: 4, height: 5 }}>
        <div style={{ width: `${s.pct}%`, height: 5, background: s.dot, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
    </div>
  ))}
</div>

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* Main Table */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
              <input style={{ ...S.input, flex: 1, minWidth: 200 }} placeholder="🔍 Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
              <select style={{ ...S.input, width: "auto" }} value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
              <button style={{ ...S.btn, background: "#6366F1", color: "#fff" }} onClick={() => setShowAdd(!showAdd)}>+ Add Lead</button>
            </div>

            {/* Add Form */}
            {showAdd && (
              <div style={{ background: "#EEF2FF", border: "1.5px solid #C7D2FE", borderRadius: 14, padding: 16, marginBottom: 14 }}>
                <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 12px", color: "#3730A3" }}>New Lead</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input style={S.input} placeholder="Full Name *"       value={form.name}   onChange={e => setForm({ ...form, name: e.target.value })} />
                  <input style={S.input} placeholder="Email *"           value={form.email}  onChange={e => setForm({ ...form, email: e.target.value })} />
                  <input style={S.input} placeholder="Phone (optional)"  value={form.phone}  onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <select style={S.input} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                    <option>Contact Form</option>
                    <option>LinkedIn</option>
                    <option>Referral</option>
                    <option>Cold Email</option>
                    <option>Instagram</option>
                    <option>Other</option>
                  </select>
                </div>
                {formErr && <p style={{ color: "#EF4444", fontSize: 12, margin: "8px 0 0" }}>{formErr}</p>}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button style={{ ...S.btn, background: "#10B981", color: "#fff" }} onClick={addLead}>Save Lead</button>
                  <button style={{ ...S.btn, background: "#E2E8F0", color: "#475569" }} onClick={() => { setShowAdd(false); setFormErr(""); }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1.5fr 1.5fr", padding: "10px 16px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                {["Lead","Source","Status","Action"].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".6px" }}>{h}</span>
                ))}
              </div>

              {filtered.length === 0 && (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#CBD5E1", fontSize: 14 }}>
                  {leads.length === 0 ? "No leads yet — add your first one!" : "No leads match your search"}
                </div>
              )}

              {filtered.map((lead, i) => (
                <div key={lead._id} onClick={() => pick(lead)}
                  style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1.5fr 1.5fr", padding: "12px 16px", cursor: "pointer", background: selected?._id === lead._id ? "#EEF2FF" : "transparent", borderTop: i > 0 ? "1px solid #F1F5F9" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Avatar name={lead.name} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.email}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", fontSize: 13, color: "#64748B" }}>{lead.source}</div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: STATUS_BADGE[lead.status].bg, color: STATUS_BADGE[lead.status].color }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_BADGE[lead.status].dot, display: "inline-block" }} />
                      {lead.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }} onClick={e => e.stopPropagation()}>
                    {lead.status !== "converted"
                      ? <button style={{ ...S.btn, background: "#F1F5F9", color: "#475569", fontSize: 12, padding: "7px 12px", border: "1px solid #E2E8F0" }} onClick={() => advance(lead)}>{STATUS_BTN[lead.status]} →</button>
                      : <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>✓ Converted</span>
                    }
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#CBD5E1", marginTop: 10, textAlign: "right" }}>Showing {filtered.length} of {leads.length} leads</p>
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{ width: 270, flexShrink: 0, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, alignSelf: "flex-start", position: "sticky", top: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Lead Detail</span>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", fontSize: 18 }} onClick={() => setSelected(null)}>✕</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
                <Avatar name={selected.name} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{selected.name}</div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: STATUS_BADGE[selected.status].bg, color: STATUS_BADGE[selected.status].color }}>
                    {selected.status}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {[["Email", selected.email, "#6366F1"], ["Phone", selected.phone || "—", null], ["Source", selected.source, null], ["Added", new Date(selected.createdAt).toLocaleDateString(), null]].map(([l, v, c]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94A3B8" }}>{l}</span>
                    <span style={{ fontWeight: 500, color: c || "#1E293B" }}>{v}</span>
                  </div>
                ))}
              </div>
              {selected.status !== "converted" && (
                <button style={{ ...S.btn, background: "#6366F1", color: "#fff", width: "100%", marginBottom: 16, fontSize: 13 }} onClick={() => advance(selected)}>
                  {STATUS_BTN[selected.status]} →
                </button>
              )}
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#475569", margin: "0 0 8px" }}>📝 Follow-up Notes</p>
                {selected.notes && (
                  <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#475569", marginBottom: 8, lineHeight: 1.6 }}>
                    {selected.notes}
                  </div>
                )}
                <textarea style={{ ...S.input, resize: "vertical", minHeight: 80, fontSize: 13 }}
                  placeholder="Write follow-up notes..." value={noteInput} onChange={e => setNoteInput(e.target.value)} />
                <button style={{ ...S.btn, width: "100%", marginTop: 8, fontSize: 13, background: noteSaved ? "#10B981" : "#F1F5F9", color: noteSaved ? "#fff" : "#475569" }} onClick={saveNote}>
                  {noteSaved ? "✓ Saved!" : "Save Note"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}