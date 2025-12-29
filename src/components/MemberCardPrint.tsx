"use client";

import React from "react";

export interface Member {
  firstName?: string;
  lastName?: string;
  photoUrl?: string | null;
  status?: string;
  duration?: string;
  price?: string | number;
  reRegisterDate?: string | null;
}

function cardHtml(member: Member | null, token: string) {
  const fullName = member ? `${member.firstName || ""} ${member.lastName || ""}`.trim() : "Member Name";
  const photoUrl = member?.photoUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='400'><rect width='100%' height='100%' fill='%23ddd'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='24'>Photo</text></svg>";
  const base = (typeof window !== "undefined" && window.location?.origin) || process.env.NEXT_PUBLIC_BASE_URL || "https://gym-qr-scanner.vercel.app";
  const qrUrl = `${base.replace(/\/$/, "")}/scan/${token}`;
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qrUrl)}`;

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Print Member Card</title>
    <style>
      @page { size: 85.6mm 53.98mm; margin: 0; }
      html,body { margin:0; padding:0; }
      .sheet { width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; background: #f0f0f0; }
      .card {
        width:85.6mm;
        height:53.98mm;
        box-sizing: border-box;
        border-radius:3mm;
        background: #0b0b0b;
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
        position: relative;
        overflow: hidden;
        padding:6mm;
        display:flex;
        align-items: center;
        justify-content: space-between;
      }

      /* Glossy centered logo */
      .logo-wrap { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); pointer-events:none; }
      .logo {
        width:36mm; height:36mm; border-radius:50%; background: linear-gradient(135deg,#111 0%, #333 60%, #fff 100%);
        opacity:0.08; box-shadow: 0 6px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
      }

      .left { display:flex; gap:6mm; align-items:center; }
      .photo {
        width:24mm; height:32mm; background:#fff; border-radius:2mm; overflow:hidden; flex-shrink:0; box-shadow:0 4px 12px rgba(0,0,0,0.6);
      }
      .photo img { width:100%; height:100%; object-fit:cover; display:block; }

      .info { color:#fff; max-width:34mm; }
      .name { font-size:9pt; font-weight:700; letter-spacing:0.5px; }
      .meta { font-size:6.5pt; opacity:0.85; margin-top:2mm; }

      .right { display:flex; flex-direction:column; align-items:flex-end; gap:4mm; }
      .qr { width:18mm; height:18mm; background:#fff; padding:1mm; box-sizing:border-box; border-radius:1mm; }
      .qr img { width:100%; height:100%; display:block; }

      .terms { position:absolute; bottom:4mm; left:6mm; right:6mm; font-size:4.5pt; color:#ddd; opacity:0.9; }

      /* Print-only adjustments */
      @media print {
        body { background: #fff; }
        .sheet { background: transparent; }
      }
    </style>
  </head>
  <body>
    <div class="sheet">
      <div class="card">
        <div class="logo-wrap"><div class="logo"></div></div>

        <div class="left">
          <div class="photo"><img src="${photoUrl}" alt="member photo"/></div>
          <div class="info">
            <div class="name">${fullName}</div>
            <div class="meta">${member?.status || "Active"} — ${member?.duration || "N/A"}</div>
            <div class="meta">Expires: ${member?.reRegisterDate || "N/A"}</div>
          </div>
        </div>

        <div class="right">
          <div style="color:#fff;font-weight:700;font-size:10pt">${fullName ? fullName.split(" ")[0] : "Member"}</div>
          <div class="qr"><img src="${qrApi}" alt="QR code"/></div>
        </div>

        <div class="terms">By using this card you agree to the gym's terms of use. Card is property of the gym. Report lost cards immediately.</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

export function printMemberCard(member: Member | null, token: string) {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;
  const html = cardHtml(member, token);
  w.document.open();
  w.document.write(html);
  w.document.close();

  // Wait for images to load, then print
  const tryPrint = () => {
    try {
      w.focus();
      w.print();
      // Optionally close after printing
      // w.close();
    } catch (e) {
      setTimeout(tryPrint, 250);
    }
  };
  w.onload = () => setTimeout(tryPrint, 250);
}

export const MemberCardPreview: React.FC<{ member?: Member | null; token?: string }> = ({ member = null, token = "demo" }) => {
  const fullName = member ? `${member.firstName || ""} ${member.lastName || ""}`.trim() : "Member Name";
  const photoUrl = member?.photoUrl || null;

  return (
    <div style={{ padding: 12 }}>
      <div style={{ width: "85.6mm", height: "53.98mm", borderRadius: 8, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
        <div style={{ width: "100%", height: "100%", background: "#0b0b0b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6mm", boxSizing: "border-box", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.06 }}>
            <div style={{ width: 140, height: 140, borderRadius: "50%", background: "linear-gradient(135deg,#111 0%, #333 60%, #fff 100%)" }} />
          </div>

          <div style={{ display: "flex", gap: "6mm", alignItems: "center" }}>
            <div style={{ width: "24mm", height: "32mm", background: "#fff", borderRadius: 4, overflow: "hidden" }}>
              {photoUrl ? <img src={photoUrl} alt="photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#ddd" }} />}
            </div>
            <div style={{ color: "#fff", maxWidth: "34mm" }}>
              <div style={{ fontWeight: 700 }}>{fullName}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{member?.status || "Active"} — {member?.duration || "N/A"}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ fontWeight: 700 }}>{fullName.split(" ")[0] || "Member"}</div>
            <div style={{ width: "18mm", height: "18mm", background: "#fff", padding: 4 }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(((typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_BASE_URL) || 'https://gym-qr-scanner.vercel.app').replace(/\/$/, '') + '/scan/' + token)}`} alt="qr" style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCardPreview;
