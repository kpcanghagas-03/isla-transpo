"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ── icons (inline SVG to avoid extra deps) ──────────────────
const IconMenu    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconClose   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconHome    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>;
const IconRequest = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>;
const IconBarge   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l2-7h14l2 7"/><path d="M5 10V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><line x1="12" y1="3" x2="12" y2="6"/><path d="M2 20h20"/></svg>;
const IconTrack   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>;
const IconContact = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconAdmin   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l4 4h4v6c0 6-4 10-8 10s-8-4-8-10V6h4l4-4z"/><path d="M8 14h8"/><path d="M12 10v4"/></svg>;
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconBus     = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="7" cy="19" r="1"/><circle cx="17" cy="19" r="1"/><line x1="12" y1="5" x2="12" y2="10"/></svg>;

export default function HomePage() {
  const router = useRouter();
  const [showModal, setShowModal]   = useState(false);
  const [agreed, setAgreed]         = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const accepted = sessionStorage.getItem("privacyAccepted");
    if (!accepted) setShowModal(true);
  }, []);

  const navItems = [
    { label: "Home",                    icon: <IconHome />,    action: () => router.push("/") },
    { label: "Request Transportation",  icon: <IconRequest />, action: () => router.push("/request") },
    { label: "Barge Schedule & Trips",  icon: <IconBarge />,   action: () => router.push("/attendee") },
    { label: "Track My Request",        icon: <IconTrack />,   action: () => window.open("https://isla-transpo.vercel.app/track", "_blank") },
    { label: "Contact Support",         icon: <IconContact />, action: () => window.open("https://isla-transpo.vercel.app/contact", "_blank") },
    { label: "Admin",                   icon: <IconAdmin/>,    action: () => window.open("https://isla-transpo.vercel.app/admin", "_blank")},
  ];

  return (
    <>
      {/* ── PRIVACY MODAL ─────────────────────────────────── */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.55)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 1100, padding: 20, backdropFilter: "blur(6px)",
        }}>
          <div style={{
            background: "#fff", maxWidth: 560, width: "100%",
            borderRadius: 24, padding: "32px 28px",
            boxShadow: "0 30px 70px rgba(0,0,0,.28)",
          }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
              <div style={{
                width: 54, height: 54, borderRadius: 16,
                background: "linear-gradient(135deg,#F27A35,#A61E22)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
            </div>

            <h1 style={{ color:"#A61E22", textAlign:"center", marginBottom:12, fontSize:22, fontWeight:800 }}>
              Data Privacy Notice
            </h1>

            <p style={{ color:"#475569", lineHeight:1.75, fontSize:14, textAlign:"justify" }}>
              Welcome to the official transportation management system of the Regional Science, Technology and Innovation Week (RSTW) 2026. This platform manages transportation requests, mobility services, attendee transportation schedules, and event-related travel coordination.
            </p>

            <div style={{
              marginTop:18, padding:"14px 16px", borderRadius:14,
              background:"#FFF7ED", border:"1px solid #FDBA74",
            }}>
              <strong style={{ color:"#EA580C", fontSize:13 }}>⚠️ Important Notice</strong>
              <p style={{ marginTop:8, fontSize:13, color:"#475569", lineHeight:1.65 }}>
                Personal information collected through this system shall only be used for transportation coordination and official event purposes in accordance with the <strong>Data Privacy Act of 2012</strong>.
              </p>
            </div>

            <label style={{
              display:"flex", gap:10, marginTop:20,
              alignItems:"flex-start", cursor:"pointer",
              fontSize:13, color:"#475569",
            }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop:2, width:16, height:16, accentColor:"#A61E22", flexShrink:0 }}
              />
              I agree to the Data Privacy Notice and consent to data processing.
            </label>

            <button
              disabled={!agreed}
              onClick={() => { sessionStorage.setItem("privacyAccepted","true"); setShowModal(false); }}
              style={{
                width:"100%", marginTop:18, padding:"13px 0",
                border:"none", borderRadius:14, color:"#fff",
                fontWeight:700, fontSize:15,
                cursor: agreed ? "pointer" : "not-allowed",
                background: agreed ? "linear-gradient(135deg,#F27A35,#A61E22)" : "#CBD5E1",
                transition: "background 0.2s",
              }}
            >
              Continue to ISLA-TRANSPO
            </button>
          </div>
        </div>
      )}

      {/* ── SIDEBAR OVERLAY ───────────────────────────────── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,.45)",
            zIndex:900, backdropFilter:"blur(2px)",
          }}
        />
      )}

      {/* ── SIDEBAR ───────────────────────────────────────── */}
      <aside style={{
        position:"fixed", left:0, top:0, height:"100%",
        width:270, background:"white",
        boxShadow:"4px 0 30px rgba(0,0,0,.15)",
        zIndex:1000, display:"flex", flexDirection:"column",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition:"transform 0.27s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* sidebar header */}
        <div style={{
          padding:"20px 18px 16px",
          background:"linear-gradient(135deg,#0B3D91,#1F5AA6)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{
                width:34, height:34, borderRadius:10,
                background:"rgba(255,255,255,0.18)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <IconBus />
              </div>
              <span style={{
                fontSize:18, fontWeight:900, color:"white", letterSpacing:0.5,
              }}>ISLA-TRANSPO</span>
            </div>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.65)", marginTop:4, paddingLeft:42 }}>
              RSTW 2026 Transport
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background:"rgba(255,255,255,0.15)", border:"none",
              borderRadius:8, padding:6, cursor:"pointer", color:"white",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
          >
            <IconClose />
          </button>
        </div>

        {/* nav items */}
        <nav style={{ flex:1, padding:"14px 10px", overflowY:"auto", display:"flex", flexDirection:"column", gap:3 }}>
          <p style={{
            fontSize:10, fontWeight:700, textTransform:"uppercase",
            letterSpacing:1, color:"#94a3b8", padding:"4px 8px 6px",
          }}>Navigation</p>

          {navItems.map(({ label, icon, action }) => {
            const isExternal = label === "Track My Request" || label === "Contact / Concerns";
            const accent =
              label === "Contact / Concerns" ? "#A61E22" :
              label === "Track My Request"   ? "#F27A35" :
              label === "Request Transportation" ? "#F27A35" : "#1F5AA6";

            return (
              <button
                key={label}
                onClick={() => { action(); setSidebarOpen(false); }}
                style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"11px 12px", borderRadius:12, border:"none",
                  background:"transparent", cursor:"pointer", width:"100%",
                  textAlign:"left", transition:"background 0.15s",
                  color:"#1e293b", fontSize:14, fontWeight:500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{
                  width:34, height:34, borderRadius:10, flexShrink:0,
                  background: `${accent}18`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: accent,
                }}>
                  {icon}
                </span>
                <span style={{ flex:1 }}>{label}</span>
                {isExternal
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  : <span style={{ color:"#cbd5e1" }}><IconChevron /></span>
                }
              </button>
            );
          })}

          {/* quick links section */}
          <p style={{
            fontSize:10, fontWeight:700, textTransform:"uppercase",
            letterSpacing:1, color:"#94a3b8", padding:"14px 8px 6px",
          }}>Quick Links</p>

          {[
            { label:"Contact Support", href:"https://isla-transpo.vercel.app/contact", color:"#A61E22" },
            { label:"Track My Request",         href:"https://isla-transpo.vercel.app/track",   color:"#F27A35" },
          ].map(({ label, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"10px 12px", borderRadius:12,
                background:`${color}0f`, border:`1px solid ${color}25`,
                textDecoration:"none", color, fontSize:13, fontWeight:600,
                transition:"background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${color}1a`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = `${color}0f`)}
            >
              <span style={{ flex:1 }}>{label}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          ))}
        </nav>

        {/* sidebar footer */}
        <div style={{
          padding:"14px 16px", borderTop:"1px solid #f1f5f9",
          fontSize:11, color:"#94a3b8", textAlign:"center",
          background:"#fafafa",
        }}>
          © 2026 ISLA-TRANSPO · RSTW Official System
        </div>
      </aside>

      {/* ── PAGE ──────────────────────────────────────────── */}
      <main style={{
        minHeight:"100vh",
        background:"linear-gradient(180deg,#ffffff 0%,#f8fafc 50%,#ffffff 100%)",
        fontFamily:"Segoe UI, system-ui, sans-serif",
        position:"relative", overflow:"hidden",
      }}>

        {/* ── NAV BAR ── */}
        <nav style={{
          position:"sticky", top:0, zIndex:800,
          background:"rgba(255,255,255,0.92)",
          backdropFilter:"blur(12px)",
          borderBottom:"1px solid #e2e8f0",
          padding:"10px 16px",
          display:"flex", alignItems:"center", gap:10,
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background:"none", border:"none", cursor:"pointer",
              color:"#334155", padding:"6px", borderRadius:10,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>

          <span style={{
            flex:1, fontWeight:900, fontSize:17, letterSpacing:0.4,
            background:"linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>
            ISLA-TRANSPO
          </span>

          {/* quick nav buttons (desktop) */}
          <div style={{ display:"flex", gap:6, alignItems:"center" }} className="desktop-nav">
            <a
              href="https://isla-transpo.vercel.app/track"
              target="_blank" rel="noopener noreferrer"
              style={{
                padding:"7px 14px", borderRadius:999,
                background:"#FFF7ED", border:"1px solid #FDBA74",
                color:"#EA580C", fontSize:13, fontWeight:600,
                textDecoration:"none", display:"flex", alignItems:"center", gap:5,
                transition:"background 0.15s",
              }}
            >
              <IconTrack /> Track
            </a>
            <a
              href="https://isla-transpo.vercel.app/contact"
              target="_blank" rel="noopener noreferrer"
              style={{
                padding:"7px 14px", borderRadius:999,
                background:"#FEF2F2", border:"1px solid #FCA5A5",
                color:"#DC2626", fontSize:13, fontWeight:600,
                textDecoration:"none", display:"flex", alignItems:"center", gap:5,
                transition:"background 0.15s",
              }}
            >
              <IconContact /> Contact
            </a>
          </div>
        </nav>

        {/* ── LEFT DECORATION ── */}
        <div style={{
          position:"fixed", left:0, top:0, width:120, height:"100%",
          background:"linear-gradient(180deg,#F27A35,#A61E22,#1F5AA6)",
          opacity:0.07,
          clipPath:"polygon(0 0,100% 0,70% 50%,100% 100%,0 100%)",
          pointerEvents:"none",
        }} className="hide-on-mobile" />

        {/* ── RIGHT DECORATION ── */}
        <div style={{
          position:"fixed", right:0, top:0, width:120, height:"100%",
          background:"linear-gradient(180deg,#1F5AA6,#F27A35,#A61E22)",
          opacity:0.07,
          clipPath:"polygon(30% 0,100% 0,100% 100%,0 100%,30% 50%)",
          pointerEvents:"none",
        }} className="hide-on-mobile" />

        {/* geometric decorations */}
        <div style={{ position:"absolute", top:-80, right:-80, width:320, height:320, borderRadius:"50%", background:"conic-gradient(#F27A35,#A61E22,#1F5AA6,#F27A35)", opacity:0.07, pointerEvents:"none" }} className="hide-on-mobile" />
        <div style={{ position:"absolute", bottom:-120, left:-120, width:350, height:350, borderRadius:"50%", background:"conic-gradient(#1F5AA6,#F27A35,#A61E22,#1F5AA6)", opacity:0.07, pointerEvents:"none" }} className="hide-on-mobile" />
        <div style={{ position:"absolute", top:220, left:80, width:120, height:120, borderRadius:"0 100% 0 0", background:"#F27A35", opacity:0.1, pointerEvents:"none" }} className="hide-on-mobile" />
        <div style={{ position:"absolute", top:380, right:120, width:140, height:140, borderRadius:"100% 0 0 0", background:"#1F5AA6", opacity:0.1, pointerEvents:"none" }} className="hide-on-mobile" />
        <div style={{ position:"absolute", top:150, right:250, width:90, height:90, border:"8px solid #A61E22", transform:"rotate(45deg)", opacity:0.09, pointerEvents:"none" }} className="hide-on-mobile" />
        <div style={{ position:"absolute", bottom:180, left:220, width:70, height:70, border:"6px solid #1F5AA6", transform:"rotate(45deg)", opacity:0.09, pointerEvents:"none" }} className="hide-on-mobile" />
        {[...Array(12)].map((_,i) => (
          <div key={i} style={{
            position:"absolute", width:10, height:10, borderRadius:"50%",
            background: i%3===0?"#F27A35": i%3===1?"#A61E22":"#1F5AA6",
            top:`${120+i*60}px`, right:`${40+(i%4)*25}px`, opacity:0.17,
            pointerEvents:"none",
          }} />
        ))}

        {/* ── LOGOS ── */}
        <div style={{
          position:"absolute", top:70, left:16, zIndex:20,
          display:"flex", alignItems:"center", gap:12, flexWrap:"wrap",
        }}>
          <img src="/dost-normin.png" alt="DOST Logo" style={{ width:"clamp(80px,18vw,140px)", height:"auto", objectFit:"contain" }} />
          <img src="/bp_logo.png"     alt="BP Logo"   style={{ width:"clamp(28px,5vw,48px)",   height:"auto", objectFit:"contain" }} />
        </div>

        {/* ── HERO ── */}
        <section style={{
          textAlign:"center", padding:"80px 20px 16px",
          position:"relative", zIndex:2,
        }}>
          <h1 style={{
            fontSize:"clamp(36px,10vw,86px)", lineHeight:1.05,
            fontWeight:900, marginBottom:12, wordBreak:"break-word",
            background:"linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>
            ISLA-TRANSPO
          </h1>

          <p style={{ maxWidth:680, margin:"0 auto 22px", color:"#64748B", fontSize:"clamp(14px,2.5vw,17px)", lineHeight:1.65 }}>
            Transportation Management System for the Regional Science, Technology and Innovation Week 2026
          </p>

          {/* CTA quick buttons */}
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:8 }}>
            <a
              href="https://isla-transpo.vercel.app/track"
              target="_blank" rel="noopener noreferrer"
              style={{
                padding:"11px 22px", borderRadius:999,
                background:"linear-gradient(135deg,#F27A35,#EA580C)",
                color:"white", fontWeight:700, fontSize:14,
                textDecoration:"none", display:"flex", alignItems:"center", gap:7,
                boxShadow:"0 4px 14px rgba(242,122,53,0.35)",
                transition:"transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 7px 20px rgba(242,122,53,0.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 14px rgba(242,122,53,0.35)"; }}
            >
              <IconTrack /> Track My Request
            </a>
            <a
              href="https://isla-transpo.vercel.app/contact"
              target="_blank" rel="noopener noreferrer"
              style={{
                padding:"11px 22px", borderRadius:999,
                background:"white", border:"2px solid #A61E22",
                color:"#A61E22", fontWeight:700, fontSize:14,
                textDecoration:"none", display:"flex", alignItems:"center", gap:7,
                boxShadow:"0 4px 14px rgba(166,30,34,0.12)",
                transition:"transform 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.background="#FEF2F2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.background="white"; }}
            >
              <IconContact /> Contact / Concerns
            </a>
          </div>
        </section>

        {/* ── WELCOME BANNER ── */}
        <div style={{
          maxWidth:1100, width:"92%", margin:"0 auto 24px",
          padding:"11px 18px",
          background:"linear-gradient(90deg,#1F5AA6,#4C9FD6)",
          color:"#fff", borderRadius:14,
          textAlign:"center", fontSize:"clamp(13px,2.5vw,15px)",
          lineHeight:1.45, position:"relative", zIndex:2,
          boxShadow:"0 4px 16px rgba(31,90,166,0.22)",
        }}>
          Welcome to the official transportation system of RSTW 2026 — Camiguin Island · July 22–24, 2026
        </div>

        {/* ── MAIN CARDS ── */}
        <section style={{
          maxWidth:1100, margin:"0 auto", padding:"0 16px 8px",
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
          gap:16, position:"relative", zIndex:2,
        }}>
          <Card
            title="Transportation Request"
            text="Submit transportation requests and coordinate travel requirements for RSTW 2026."
            buttonText="Request Transportation"
            onClick={() => router.push("/request")}
            color="#F27A35"
            icon={<IconRequest />}
          />
          <Card
            title="Barge Schedule & Trips"
            text="Check transportation schedules, arrivals, departures and live updates."
            buttonText="View Schedule"
            onClick={() => router.push("/attendee")}
            color="#1F5AA6"
            icon={<IconBarge />}
          />
          <Card
            title="Accommodation & Venues"
            text="Accommodation details will be available soon. Check back closer to the event."
            buttonText="Coming Soon"
            onClick={() => {}}
            color="#A61E22"
            icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
            disabled
          />
        </section>

        {/* ── QUICK LINKS ROW ── */}
        <section style={{
          maxWidth:1100, margin:"20px auto", padding:"0 16px",
          display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
          gap:14, position:"relative", zIndex:2,
        }}>
          <QuickLink
            href="https://isla-transpo.vercel.app/track"
            icon={<IconTrack />}
            title="Track My Request"
            desc="Check the real-time status of your transport request using your request code."
            color="#F27A35"
          />
          <QuickLink
            href="https://isla-transpo.vercel.app/contact"
            icon={<IconContact />}
            title="Contact Support"
            desc="Have a concern or need to cancel your request? Reach our admin team directly."
            color="#A61E22"
          />
        </section>

        {/* ── EVENT INFO ── */}
        <section style={{
          maxWidth:1100, margin:"24px auto", padding:"0 16px",
          position:"relative", zIndex:2,
        }}>
          <div style={{
            background:"#fff", borderRadius:24, padding:"24px 28px",
            boxShadow:"0 8px 24px rgba(0,0,0,.07)",
            display:"flex", gap:24, flexWrap:"wrap", alignItems:"flex-start",
          }}>
            <div style={{ flex:"1 1 260px" }}>
              <h2 style={{ color:"#1F2937", marginBottom:14, fontSize:20, fontWeight:700 }}>
                RSTW 2026 Information
              </h2>
              <p style={{ color:"#475569", lineHeight:1.8, marginBottom:10, fontSize:14 }}>
                <strong>Theme:</strong> Science, Technology and Digital Innovation: Driving Food Security, Sustainable Energy, and National Resilience.
              </p>
              <p style={{ color:"#475569", fontSize:14, marginBottom:6 }}>📍 Camiguin Island</p>
              <p style={{ color:"#475569", fontSize:14, marginBottom:6 }}>📅 July 22–24, 2026</p>
              <p style={{ color:"#475569", fontSize:14 }}>🏛 DOST-NORMIN</p>
            </div>
            <img
              src="/rstw_2026.jpg"
              alt="RSTW 2026 Banner"
              style={{
                flex:"1 1 280px", maxWidth:460, width:"100%",
                height:"auto", objectFit:"cover", borderRadius:18,
                boxShadow:"0 6px 18px rgba(0,0,0,0.12)",
              }}
            />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          marginTop:50, padding:"24px 20px",
          background:"linear-gradient(180deg,#ffffff,#f8fafc)",
          borderTop:"4px solid #F27A35",
          position:"relative", zIndex:2,
        }}>
          <div style={{ textAlign:"center", marginBottom:14 }}>
            <h2 style={{ color:"#1F5AA6", marginBottom:4, fontSize:17, fontWeight:700 }}>
              RSTW 2026 Transportation System
            </h2>
            <p style={{ color:"#64748B", fontSize:12 }}>Official ISLA-TRANSPO Platform</p>
          </div>

          <div style={{
            maxWidth:860, margin:"0 auto", display:"flex", gap:16,
            justifyContent:"center", flexWrap:"wrap",
          }}>
            {[
              { label:"Track Request", href:"https://isla-transpo.vercel.app/track",   color:"#F27A35" },
              { label:"Contact / Concerns", href:"https://isla-transpo.vercel.app/contact", color:"#A61E22" },
            ].map(({ label, href, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{
                  padding:"8px 20px", borderRadius:999,
                  border:`1.5px solid ${color}`, color,
                  fontSize:13, fontWeight:600, textDecoration:"none",
                  transition:"background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${color}12`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {label}
              </a>
            ))}
          </div>

          <p style={{ color:"#475569", fontSize:13, textAlign:"center", marginTop:14, lineHeight:1.5 }}>
            Manages transportation requests, scheduling, and coordination for RSTW 2026.
          </p>
          <p style={{ color:"#64748B", fontSize:12, textAlign:"center", marginTop:6 }}>
            📍 Camiguin Island · 📅 July 22–24, 2026
          </p>
          <div style={{ marginTop:16, textAlign:"center", fontSize:11, color:"#94A3B8" }}>
            © 2026 ISLA-TRANSPO | RSTW Official System
          </div>
        </footer>
      </main>

      {/* ── GLOBAL CSS ── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        @media (max-width: 640px) {
          .hide-on-mobile { display: none !important; }
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 641px) {
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// ── Card component ────────────────────────────────────────────
function Card({
  title, text, buttonText, onClick, color, icon, disabled = false,
}: {
  title: string; text: string; buttonText: string;
  onClick: () => void; color: string;
  icon: React.ReactNode; disabled?: boolean;
}) {
  return (
    <div style={{
      background:"#fff", padding:"22px 20px", borderRadius:24,
      boxShadow:"0 10px 28px rgba(0,0,0,.08)",
      borderTop:`6px solid ${color}`,
      display:"flex", flexDirection:"column", gap:0,
      transition:"transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={(e) => { if (!disabled) { (e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 18px 40px rgba(0,0,0,0.13)"; }}}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform="translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 10px 28px rgba(0,0,0,.08)"; }}
    >
      <div style={{
        width:42, height:42, borderRadius:12, marginBottom:12,
        background:`${color}18`, display:"flex", alignItems:"center",
        justifyContent:"center", color,
      }}>
        {icon}
      </div>
      <h2 style={{ marginBottom:8, color:"#0F172A", fontSize:17, fontWeight:700 }}>{title}</h2>
      <p style={{ color:"#64748B", lineHeight:1.65, marginBottom:22, fontSize:14, flex:1 }}>{text}</p>
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        style={{
          width:"100%", padding:"13px 0", border:"none", borderRadius:14,
          color:"#fff", fontWeight:700, fontSize:14,
          cursor: disabled ? "not-allowed" : "pointer",
          background: disabled ? "#CBD5E1" : color,
          opacity: disabled ? 0.8 : 1,
          transition:"opacity 0.15s, transform 0.15s",
        }}
        onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.opacity="0.9"; }}
        onMouseLeave={(e) => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.opacity="1"; }}
      >
        {buttonText}
      </button>
    </div>
  );
}

// ── QuickLink component ───────────────────────────────────────
function QuickLink({
  href, icon, title, desc, color,
}: {
  href: string; icon: React.ReactNode;
  title: string; desc: string; color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display:"flex", gap:14, alignItems:"flex-start",
        padding:"18px 20px", borderRadius:18, textDecoration:"none",
        background:"white",
        border:`1.5px solid ${color}30`,
        boxShadow:"0 4px 16px rgba(0,0,0,0.06)",
        transition:"transform 0.18s, box-shadow 0.18s, border-color 0.18s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform="translateY(-2px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow="0 10px 28px rgba(0,0,0,0.11)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor=`${color}70`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform="translateY(0)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow="0 4px 16px rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor=`${color}30`;
      }}
    >
      <div style={{
        width:42, height:42, borderRadius:12, flexShrink:0,
        background:`${color}15`, display:"flex",
        alignItems:"center", justifyContent:"center", color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#0F172A" }}>{title}</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </div>
        <p style={{ fontSize:13, color:"#64748B", lineHeight:1.55, margin:0 }}>{desc}</p>
      </div>
    </a>
  );
}
