import { useState, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ngfbtwhndjvmlsiqmtci.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZmJ0d2huZGp2bWxzaXFtdGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3ODU1MjMsImV4cCI6MjA4OTM2MTUyM30.pjIuVfpaUAqUBubs9jc9YYmYEu-xixAMa9pGGU_eT7I";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tier thresholds
const TIER_THRESHOLDS = { Silver: 0, Gold: 5, Platinum: 10 };
const getTier = (visits) => {
  if (visits >= TIER_THRESHOLDS.Platinum) return "Platinum";
  if (visits >= TIER_THRESHOLDS.Gold) return "Gold";
  return "Silver";
};

const TIER_COLORS = {
  Silver: { bg: "#f0f0f0", text: "#555", border: "#bbb" },
  Gold: { bg: "#fff7e0", text: "#9a6d00", border: "#f0c040" },
  Platinum: { bg: "#eef3ff", text: "#2a4db5", border: "#7a9cf0" },
};

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-AU") : "—";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#f4f6fa",
    minHeight: "100vh",
    color: "#1a1a2e",
  },
  header: {
    background: "linear-gradient(135deg, #0f4c81 0%, #1a7fc1 100%)",
    color: "#fff",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
  },
  headerTitle: { fontSize: 20, fontWeight: 700, letterSpacing: 0.5 },
  headerSub: { fontSize: 12, opacity: 0.75, marginTop: 2 },
  nav: {
    background: "#fff",
    borderBottom: "1px solid #e0e6f0",
    display: "flex",
    padding: "0 32px",
    gap: 4,
  },
  navBtn: (active) => ({
    padding: "14px 18px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: active ? 700 : 400,
    color: active ? "#0f4c81" : "#666",
    borderBottom: active ? "3px solid #0f4c81" : "3px solid transparent",
    transition: "all 0.15s",
  }),
  main: { padding: "28px 32px", maxWidth: 1200, margin: "0 auto" },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    marginBottom: 20,
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 },
  statCard: (color) => ({
    background: color || "#f8faff",
    borderRadius: 10,
    padding: "18px 20px",
    border: "1px solid #e8eef8",
  }),
  statVal: { fontSize: 28, fontWeight: 800, color: "#0f4c81", lineHeight: 1.1 },
  statLabel: { fontSize: 12, color: "#888", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  btn: (variant = "primary") => ({
    padding: "9px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    background: variant === "primary" ? "#0f4c81" : variant === "danger" ? "#dc3545" : variant === "success" ? "#198754" : "#e8eef8",
    color: variant === "ghost" ? "#0f4c81" : "#fff",
    transition: "opacity 0.15s",
  }),
  input: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: "1px solid #d0d8e8",
    fontSize: 14,
    background: "#f8faff",
    boxSizing: "border-box",
    outline: "none",
  },
  label: { fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: 0.4 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { textAlign: "left", padding: "10px 12px", background: "#f0f4fb", color: "#555", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "2px solid #e0e6f0" },
  td: { padding: "11px 12px", borderBottom: "1px solid #f0f0f0", verticalAlign: "middle" },
  tier: (tier) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    background: TIER_COLORS[tier]?.bg,
    color: TIER_COLORS[tier]?.text,
    border: `1px solid ${TIER_COLORS[tier]?.border}`,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  }),
  status: (s) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    background: s === "Active" ? "#e6f9f0" : "#fce8e8",
    color: s === "Active" ? "#1a7a4a" : "#c0392b",
  }),
  modal: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  modalBox: {
    background: "#fff", borderRadius: 14, padding: 28,
    width: "min(600px, 95vw)", maxHeight: "90vh", overflowY: "auto",
    boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
  },
  sectionTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#0f4c81", borderBottom: "2px solid #e8eef8", paddingBottom: 8 },
  alert: (type) => ({
    padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13,
    background: type === "error" ? "#fce8e8" : type === "success" ? "#e6f9f0" : "#fff7e0",
    color: type === "error" ? "#c0392b" : type === "success" ? "#1a7a4a" : "#9a6d00",
    border: `1px solid ${type === "error" ? "#f5c6cb" : type === "success" ? "#a8e6c8" : "#f0d080"}`,
  }),
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function getNextMembershipNo() {
  const { data, error } = await supabase
    .from("vip_sequence")
    .select("last_no")
    .eq("id", 1)
    .single();
  if (error) return null;
  const next = data.last_no + 1;
  await supabase.from("vip_sequence").update({ last_no: next }).eq("id", 1);
  return `WSLR-${String(next).padStart(4, "0")}`;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function TierBadge({ tier }) {
  return <span style={S.tier(tier)}>{tier}</span>;
}

function StatusBadge({ status }) {
  return <span style={S.status(status)}>{status}</span>;
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ members, redemptions, onNavigate }) {
  const active = members.filter((m) => m.status === "Active");
  const byTier = { Silver: 0, Gold: 0, Platinum: 0 };
  active.forEach((m) => { byTier[m.tier] = (byTier[m.tier] || 0) + 1; });

  const totalDiscounts = redemptions.reduce((s, r) => s + Number(r.discount_amount || 0), 0);

  // Birthdays this month
  const thisMonth = new Date().getMonth() + 1;
  const bdays = active.filter((m) => {
    if (!m.dob) return false;
    return new Date(m.dob).getMonth() + 1 === thisMonth;
  });

  // Recent redemptions (last 5)
  const recent = [...redemptions]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Dashboard</h2>
        <button style={S.btn("primary")} onClick={() => onNavigate("add")}>+ Add Member</button>
      </div>

      <div style={S.grid4}>
        {[
          { label: "Active Members", val: active.length },
          { label: "Silver", val: byTier.Silver },
          { label: "Gold", val: byTier.Gold },
          { label: "Platinum", val: byTier.Platinum },
        ].map((s) => (
          <div key={s.label} style={S.statCard()}>
            <div style={S.statVal}>{s.val}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        {/* Birthdays this month */}
        <div style={S.card}>
          <div style={S.sectionTitle}>🎂 Birthdays This Month</div>
          {bdays.length === 0 ? (
            <p style={{ color: "#999", fontSize: 14 }}>No birthdays this month.</p>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Member</th>
                  <th style={S.th}>DOB</th>
                  <th style={S.th}>Tier</th>
                </tr>
              </thead>
              <tbody>
                {bdays.map((m) => (
                  <tr key={m.id}>
                    <td style={S.td}><strong>{m.first_name} {m.last_name}</strong><br /><span style={{ fontSize: 12, color: "#888" }}>{m.membership_no}</span></td>
                    <td style={S.td}>{fmtDate(m.dob)}</td>
                    <td style={S.td}><TierBadge tier={m.tier} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent redemptions */}
        <div style={S.card}>
          <div style={S.sectionTitle}>💳 Recent Redemptions</div>
          {recent.length === 0 ? (
            <p style={{ color: "#999", fontSize: 14 }}>No redemptions yet.</p>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Member</th>
                  <th style={S.th}>Type</th>
                  <th style={S.th}>Amount</th>
                  <th style={S.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => {
                  const m = members.find((x) => x.id === r.member_id);
                  return (
                    <tr key={r.id}>
                      <td style={S.td}>{m ? `${m.first_name} ${m.last_name}` : "—"}</td>
                      <td style={S.td}>{r.type}</td>
                      <td style={S.td}>{r.type === "Discount" ? fmt(r.discount_amount) : "—"}</td>
                      <td style={S.td}>{fmtDate(r.redemption_date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: 12, fontSize: 13, color: "#888" }}>
            Total discounts given: <strong style={{ color: "#0f4c81" }}>{fmt(totalDiscounts)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MEMBER LIST ─────────────────────────────────────────────────────────────
function MemberList({ members, onSelect, onNavigate }) {
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [filterStatus, setFilterStatus] = useState("Active");

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchQ = !q || m.first_name?.toLowerCase().includes(q) || m.last_name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) || m.membership_no?.toLowerCase().includes(q) || m.mobile?.includes(q);
    const matchTier = filterTier === "All" || m.tier === filterTier;
    const matchStatus = filterStatus === "All" || m.status === filterStatus;
    return matchQ && matchTier && matchStatus;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Members</h2>
        <button style={S.btn("primary")} onClick={() => onNavigate("add")}>+ Add Member</button>
      </div>

      <div style={{ ...S.card, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={S.label}>Search</label>
            <input style={S.input} placeholder="Name, email, membership no, mobile…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Tier</label>
            <select style={{ ...S.input, width: "auto" }} value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
              {["All", "Silver", "Gold", "Platinum"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>Status</label>
            <select style={{ ...S.input, width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {["All", "Active", "Inactive"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ color: "#888", fontSize: 13, paddingBottom: 8 }}>{filtered.length} member{filtered.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Member</th>
              <th style={S.th}>Membership No</th>
              <th style={S.th}>Tier</th>
              <th style={S.th}>Visits</th>
              <th style={S.th}>Total Spend</th>
              <th style={S.th}>Last Visit</th>
              <th style={S.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "#aaa", padding: 32 }}>No members found.</td></tr>
            )}
            {filtered.map((m) => (
              <tr key={m.id} style={{ cursor: "pointer" }} onClick={() => onSelect(m)}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f8faff"}
                onMouseLeave={(e) => e.currentTarget.style.background = ""}>
                <td style={S.td}>
                  <strong>{m.first_name} {m.last_name}</strong>
                  <br /><span style={{ fontSize: 12, color: "#888" }}>{m.email}</span>
                </td>
                <td style={S.td}><code style={{ fontSize: 13 }}>{m.membership_no || "—"}</code></td>
                <td style={S.td}><TierBadge tier={m.tier} /></td>
                <td style={S.td}>{m.no_of_visits || 0}</td>
                <td style={S.td}>{fmt(m.total_income)}</td>
                <td style={S.td}>{fmtDate(m.last_visit)}</td>
                <td style={S.td}><StatusBadge status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MEMBER FORM ─────────────────────────────────────────────────────────────
function MemberForm({ existing, onSave, onCancel }) {
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", email2: "", mobile: "",
    town: "", postcode: "", dob: "", client_id: "", membership_no: "",
    status: "Active", notes: "", marketing_opt_in: true,
    ...(existing || {}),
    dob: existing?.dob ? existing.dob.slice(0, 10) : "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("First and last name are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let memberNo = form.membership_no;
      if (!memberNo && !existing) {
        memberNo = await getNextMembershipNo();
      }
      const payload = {
        ...form,
        membership_no: memberNo,
        tier: getTier(form.no_of_visits || 0),
        dob: form.dob || null,
      };
      let result;
      if (existing) {
        result = await supabase.from("vip_members").update(payload).eq("id", existing.id).select().single();
      } else {
        result = await supabase.from("vip_members").insert(payload).select().single();
      }
      if (result.error) throw result.error;
      onSave(result.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, field, type = "text", half }) => (
    <div style={half ? {} : { gridColumn: "span 1" }}>
      <label style={S.label}>{label}</label>
      <input style={S.input} type={type} value={form[field] || ""} onChange={(e) => set(field, e.target.value)} />
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{existing ? "Edit Member" : "Add New Member"}</h2>
        <button style={S.btn("ghost")} onClick={onCancel}>← Back</button>
      </div>

      {error && <div style={S.alert("error")}>{error}</div>}

      <div style={S.card}>
        <div style={S.sectionTitle}>Personal Details</div>
        <div style={{ ...S.grid2, marginBottom: 14 }}>
          <Field label="First Name *" field="first_name" />
          <Field label="Last Name *" field="last_name" />
          <Field label="Email" field="email" type="email" />
          <Field label="Email 2" field="email2" type="email" />
          <Field label="Mobile" field="mobile" />
          <Field label="Date of Birth (optional)" field="dob" type="date" />
          <Field label="Town / Suburb" field="town" />
          <Field label="Postcode" field="postcode" />
        </div>

        <div style={S.sectionTitle}>Membership Details</div>
        <div style={{ ...S.grid2, marginBottom: 14 }}>
          <div>
            <label style={S.label}>Membership No</label>
            <input style={{ ...S.input, background: existing ? "#f8faff" : "#fff7e0" }}
              value={form.membership_no || (existing ? "" : "(auto-generated)")}
              onChange={(e) => set("membership_no", e.target.value)}
              placeholder="Leave blank to auto-generate" />
          </div>
          <div>
            <label style={S.label}>RMS Client ID</label>
            <input style={S.input} value={form.client_id || ""} onChange={(e) => set("client_id", e.target.value)} placeholder="From RMS Client No field" />
          </div>
          <div>
            <label style={S.label}>Status</label>
            <select style={S.input} value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div>
            <label style={S.label}>Marketing Opt-In</label>
            <select style={S.input} value={form.marketing_opt_in ? "Yes" : "No"} onChange={(e) => set("marketing_opt_in", e.target.value === "Yes")}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>

        <div style={S.sectionTitle}>Notes</div>
        <textarea style={{ ...S.input, height: 80, resize: "vertical" }}
          value={form.notes || ""} onChange={(e) => set("notes", e.target.value)}
          placeholder="e.g. Prefers beachfront cabin, referred by owner…" />

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button style={S.btn("ghost")} onClick={onCancel}>Cancel</button>
          <button style={S.btn("primary")} onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : existing ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REDEMPTION MODAL ────────────────────────────────────────────────────────
function RedemptionModal({ member, onClose, onSaved }) {
  const [form, setForm] = useState({
    type: "Discount", discount_amount: "", booking_ref: "", notes: "",
    redemption_date: new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const { error: err } = await supabase.from("vip_redemptions").insert({
        member_id: member.id,
        ...form,
        discount_amount: form.type === "Birthday Upgrade" ? 0 : Number(form.discount_amount),
      });
      if (err) throw err;
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.modal} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <h3 style={{ margin: "0 0 16px" }}>Log Redemption — {member.first_name} {member.last_name}</h3>
        {error && <div style={S.alert("error")}>{error}</div>}

        <label style={S.label}>Type</label>
        <select style={{ ...S.input, marginBottom: 12 }} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
          <option>Discount</option>
          <option>Birthday Upgrade</option>
        </select>

        <label style={S.label}>Date</label>
        <input style={{ ...S.input, marginBottom: 12 }} type="date" value={form.redemption_date} onChange={(e) => setForm((f) => ({ ...f, redemption_date: e.target.value }))} />

        {form.type === "Discount" && <>
          <label style={S.label}>Discount Amount ($)</label>
          <input style={{ ...S.input, marginBottom: 12 }} type="number" step="0.01" placeholder="e.g. 75.00"
            value={form.discount_amount} onChange={(e) => setForm((f) => ({ ...f, discount_amount: e.target.value }))} />
        </>}

        <label style={S.label}>RMS Booking Reference</label>
        <input style={{ ...S.input, marginBottom: 12 }} placeholder="e.g. R-12345"
          value={form.booking_ref} onChange={(e) => setForm((f) => ({ ...f, booking_ref: e.target.value }))} />

        <label style={S.label}>Notes (optional)</label>
        <textarea style={{ ...S.input, height: 60, marginBottom: 16 }}
          value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button style={S.btn("ghost")} onClick={onClose}>Cancel</button>
          <button style={S.btn("success")} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Log Redemption"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── MEMBER PROFILE ──────────────────────────────────────────────────────────
function MemberProfile({ member, redemptions, onEdit, onBack, onRedemptionAdded }) {
  const [showRedemption, setShowRedemption] = useState(false);
  const memberRedemptions = redemptions.filter((r) => r.member_id === member.id)
    .sort((a, b) => new Date(b.redemption_date) - new Date(a.redemption_date));
  const totalSaved = memberRedemptions.reduce((s, r) => s + Number(r.discount_amount || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button style={S.btn("ghost")} onClick={onBack}>← Back to Members</button>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={S.btn("ghost")} onClick={onEdit}>Edit Profile</button>
          <button style={S.btn("success")} onClick={() => setShowRedemption(true)}>+ Log Redemption</button>
        </div>
      </div>

      {/* Profile Header */}
      <div style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>{member.first_name} {member.last_name}</h2>
            <TierBadge tier={member.tier} />
            <StatusBadge status={member.status} />
          </div>
          <div style={{ fontSize: 14, color: "#666", display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span>📋 {member.membership_no || "No membership no."}</span>
            {member.email && <span>✉️ {member.email}</span>}
            {member.mobile && <span>📱 {member.mobile}</span>}
            {member.town && <span>📍 {member.town} {member.postcode}</span>}
            {member.dob && <span>🎂 {fmtDate(member.dob)}</span>}
          </div>
          {member.client_id && <div style={{ marginTop: 6, fontSize: 12, color: "#aaa" }}>RMS Client ID: {member.client_id}</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#aaa" }}>Member since</div>
          <div style={{ fontWeight: 700 }}>{fmtDate(member.date_joined)}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={S.grid4}>
        {[
          { label: "Total Visits", val: member.no_of_visits || 0 },
          { label: "Total Spend", val: fmt(member.total_income) },
          { label: "Avg Per Stay", val: fmt(member.avg_income) },
          { label: "Last Visit", val: fmtDate(member.last_visit) },
        ].map((s) => (
          <div key={s.label} style={S.statCard()}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0f4c81" }}>{s.val}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        {/* Notes */}
        <div style={S.card}>
          <div style={S.sectionTitle}>Notes</div>
          <p style={{ fontSize: 14, color: member.notes ? "#333" : "#aaa", margin: 0, lineHeight: 1.6 }}>
            {member.notes || "No notes recorded."}
          </p>
          {member.marketing_opt_in !== undefined && (
            <div style={{ marginTop: 12, fontSize: 12, color: "#888" }}>
              Marketing opt-in: <strong>{member.marketing_opt_in ? "Yes ✓" : "No"}</strong>
            </div>
          )}
        </div>

        {/* Tier Progress */}
        <div style={S.card}>
          <div style={S.sectionTitle}>Tier Progress</div>
          {[
            { tier: "Silver", min: 0, max: 4, label: "1–4 stays" },
            { tier: "Gold", min: 5, max: 9, label: "5–9 stays" },
            { tier: "Platinum", min: 10, max: null, label: "10+ stays" },
          ].map((t) => {
            const visits = member.no_of_visits || 0;
            const isCurrent = member.tier === t.tier;
            const isPast = (t.tier === "Silver" && visits >= 5) || (t.tier === "Gold" && visits >= 10);
            return (
              <div key={t.tier} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 80 }}><TierBadge tier={t.tier} /></div>
                <div style={{ flex: 1, height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    background: isCurrent ? TIER_COLORS[t.tier].border : isPast ? "#ccc" : "#f0f0f0",
                    width: isCurrent ? `${Math.min(100, ((visits - t.min) / ((t.max || visits + 1) - t.min)) * 100)}%` : isPast ? "100%" : "0%",
                    transition: "width 0.4s",
                  }} />
                </div>
                <div style={{ fontSize: 12, color: "#888", width: 60 }}>{t.label}</div>
                {isCurrent && <span style={{ fontSize: 12, color: "#0f4c81", fontWeight: 700 }}>← current</span>}
              </div>
            );
          })}
          {member.tier !== "Platinum" && (
            <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
              {member.tier === "Silver" && `${5 - (member.no_of_visits || 0)} more stay${5 - (member.no_of_visits || 0) !== 1 ? "s" : ""} to Gold`}
              {member.tier === "Gold" && `${10 - (member.no_of_visits || 0)} more stay${10 - (member.no_of_visits || 0) !== 1 ? "s" : ""} to Platinum`}
            </div>
          )}
        </div>
      </div>

      {/* Redemptions */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ ...S.sectionTitle, marginBottom: 0 }}>Redemption History</div>
          <span style={{ fontSize: 13, color: "#888" }}>Total saved: <strong style={{ color: "#0f4c81" }}>{fmt(totalSaved)}</strong></span>
        </div>
        {memberRedemptions.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: 14 }}>No redemptions recorded.</p>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Date</th>
                <th style={S.th}>Type</th>
                <th style={S.th}>Amount Saved</th>
                <th style={S.th}>Booking Ref</th>
                <th style={S.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {memberRedemptions.map((r) => (
                <tr key={r.id}>
                  <td style={S.td}>{fmtDate(r.redemption_date)}</td>
                  <td style={S.td}>{r.type}</td>
                  <td style={S.td}>{r.type === "Discount" ? fmt(r.discount_amount) : "—"}</td>
                  <td style={S.td}>{r.booking_ref || "—"}</td>
                  <td style={S.td} style={{ color: "#888", fontSize: 13 }}>{r.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showRedemption && (
        <RedemptionModal
          member={member}
          onClose={() => setShowRedemption(false)}
          onSaved={() => { setShowRedemption(false); onRedemptionAdded(); }}
        />
      )}
    </div>
  );
}

// ─── CSV IMPORT ──────────────────────────────────────────────────────────────
function CsvImport({ onDone }) {
  const [status, setStatus] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].replace(/^\uFEFF/, "").split(",").map((h) => h.trim().replace(/"/g, ""));
    return lines.slice(1).map((line) => {
      const vals = [];
      let cur = "", inQ = false;
      for (const ch of line) {
        if (ch === '"') inQ = !inQ;
        else if (ch === "," && !inQ) { vals.push(cur.trim()); cur = ""; }
        else cur += ch;
      }
      vals.push(cur.trim());
      const row = {};
      headers.forEach((h, i) => { row[h] = vals[i] || ""; });
      return row;
    });
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setStatus("Reading file…");
    setResults(null);

    const text = await file.text();
    const rows = parseCSV(text);

    let skipped = 0, updated = 0, newMembers = 0, errors = 0;

    for (const row of rows) {
      // Skip group/event bookings (no proper surname with letters only, no email)
      const surname = row["Surname"] || "";
      const given = row["Given"] || "";
      const email = row["Email"] || "";
      const clientId = row["Client_Id"] || "";

      if (!clientId) { skipped++; continue; }
      if (surname.includes("/") || !given) { skipped++; continue; }

      const visits = parseInt(row["No_Of_Visits"] || "0", 10);
      const avgIncome = parseFloat(row["Avg_Income"] || "0");
      const totalIncome = parseFloat(row["Total_Income"] || "0");
      const lastVisit = row["LastVisit"] ? new Date(row["LastVisit"]) : null;
      const membershipNo = row["Membership_No"]?.trim() || null;

      const updatePayload = {
        no_of_visits: visits,
        avg_income: avgIncome,
        total_income: totalIncome,
        last_visit: lastVisit && !isNaN(lastVisit) ? lastVisit.toISOString().slice(0, 10) : null,
        tier: getTier(visits),
        ...(membershipNo ? { membership_no: membershipNo } : {}),
      };

      // Check if member exists by client_id
      const { data: existing } = await supabase
        .from("vip_members")
        .select("id, membership_no")
        .eq("client_id", clientId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase.from("vip_members").update(updatePayload).eq("id", existing.id);
        if (error) { errors++; } else { updated++; }
      } else if (membershipNo) {
        // New member from RMS who has a membership number — add them
        let newMemberNo = membershipNo;
        if (!newMemberNo) newMemberNo = await getNextMembershipNo();
        const { error } = await supabase.from("vip_members").insert({
          client_id: clientId,
          last_name: surname,
          first_name: given,
          email: email || null,
          email2: row["Email2"]?.includes("booking.com") || row["Email2"]?.includes("expedia") ? null : (row["Email2"] || null),
          mobile: row["Mobile"] || null,
          town: row["Town"] || null,
          postcode: row["Post Code"] || null,
          membership_no: newMemberNo,
          ...updatePayload,
        });
        if (error) { errors++; } else { newMembers++; }
      } else {
        skipped++;
      }
    }

    setResults({ total: rows.length, updated, newMembers, skipped, errors });
    setStatus("");
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Weekly RMS Import</h2>
      </div>

      <div style={S.card}>
        <div style={S.sectionTitle}>Upload RMS Report Writer Export</div>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 16, lineHeight: 1.6 }}>
          Run your saved <strong>Report Writer</strong> template in RMS, export as CSV, then upload here.
          The system will match records on <strong>Client ID</strong> and refresh visit stats and tiers automatically.
          Only members with a Membership No will be updated or added.
        </p>

        <div style={{ border: "2px dashed #c0d0e8", borderRadius: 10, padding: 32, textAlign: "center", background: "#f8faff" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>Select your RMS CSV export</div>
          <input type="file" accept=".csv" onChange={handleFile} style={{ display: "none" }} id="csv-upload" />
          <label htmlFor="csv-upload" style={{ ...S.btn("primary"), cursor: "pointer", display: "inline-block" }}>
            Choose CSV File
          </label>
        </div>

        {loading && <div style={{ ...S.alert("info"), marginTop: 16 }}>⏳ {status || "Processing…"}</div>}

        {results && (
          <div style={{ marginTop: 20 }}>
            <div style={S.alert(results.errors > 0 ? "error" : "success")}>
              ✅ Import complete
            </div>
            <div style={S.grid4}>
              {[
                { label: "Records in file", val: results.total },
                { label: "Members updated", val: results.updated },
                { label: "New members added", val: results.newMembers },
                { label: "Skipped / errors", val: results.skipped + results.errors },
              ].map((s) => (
                <div key={s.label} style={S.statCard()}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#0f4c81" }}>{s.val}</div>
                  <div style={S.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
            <button style={{ ...S.btn("primary"), marginTop: 16 }} onClick={onDone}>View Members →</button>
          </div>
        )}
      </div>

      <div style={S.card}>
        <div style={S.sectionTitle}>Expected CSV Columns</div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Your Report Writer export should include these columns:</p>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Column Name</th>
              <th style={S.th}>Used For</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Client_Id", "Matching to existing member records"],
              ["Surname", "Last name (skips group bookings with /)"],
              ["Given", "First name"],
              ["Mobile", "Phone number"],
              ["Email", "Primary email"],
              ["Email2", "Secondary email (Booking.com addresses ignored)"],
              ["Town", "Town / suburb"],
              ["Post Code", "Postcode"],
              ["Membership_No", "WSLR loyalty number"],
              ["Avg_Income", "Average spend per stay"],
              ["LastVisit", "Date of last stay"],
              ["No_Of_Visits", "Total visits → calculates tier"],
              ["Total_Income", "Lifetime spend"],
            ].map(([col, use]) => (
              <tr key={col}>
                <td style={S.td}><code>{col}</code></td>
                <td style={S.td} style={{ color: "#666", fontSize: 13 }}>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [members, setMembers] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [{ data: m }, { data: r }] = await Promise.all([
      supabase.from("vip_members").select("*").order("last_name"),
      supabase.from("vip_redemptions").select("*").order("redemption_date", { ascending: false }),
    ]);
    setMembers(m || []);
    setRedemptions(r || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveMember = (saved) => {
    setMembers((prev) => {
      const exists = prev.find((m) => m.id === saved.id);
      return exists ? prev.map((m) => m.id === saved.id ? saved : m) : [...prev, saved];
    });
    setSelectedMember(saved);
    setPage("profile");
  };

  const nav = [
    { id: "dashboard", label: "Dashboard" },
    { id: "members", label: "Members" },
    { id: "import", label: "Weekly Import" },
  ];

  if (loading) {
    return (
      <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏖️</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#0f4c81", fontSize: 16 }}>Loading loyalty program…</div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (page === "dashboard") return <Dashboard members={members} redemptions={redemptions} onNavigate={(p) => setPage(p)} />;
    if (page === "members") return <MemberList members={members} onSelect={(m) => { setSelectedMember(m); setPage("profile"); }} onNavigate={(p) => setPage(p)} />;
    if (page === "add") return <MemberForm onSave={handleSaveMember} onCancel={() => setPage("members")} />;
    if (page === "edit") return <MemberForm existing={selectedMember} onSave={handleSaveMember} onCancel={() => setPage("profile")} />;
    if (page === "profile" && selectedMember) {
      const current = members.find((m) => m.id === selectedMember.id) || selectedMember;
      return <MemberProfile member={current} redemptions={redemptions} onEdit={() => setPage("edit")} onBack={() => setPage("members")}
        onRedemptionAdded={() => loadData()} />;
    }
    if (page === "import") return <CsvImport onDone={() => { loadData(); setPage("members"); }} />;
  };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <header style={S.header}>
        <div>
          <div style={S.headerTitle}>🏖️ WSLR Loyalty Program</div>
          <div style={S.headerSub}>Wollongong Surf Leisure Resort — Staff Portal</div>
        </div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>{members.filter((m) => m.status === "Active").length} active members</div>
      </header>
      <nav style={S.nav}>
        {nav.map((n) => (
          <button key={n.id} style={S.navBtn(page === n.id || (page === "add" && n.id === "members") || (page === "profile" && n.id === "members") || (page === "edit" && n.id === "members"))}
            onClick={() => setPage(n.id)}>{n.label}</button>
        ))}
      </nav>
      <main style={S.main}>{renderPage()}</main>
    </div>
  );
}
