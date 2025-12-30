"use client";

/**
 * GymMemberCard
 * -----------------------------------
 * - Scales up on mobile
 * - Real size when printing
 * - Front card only
 */

interface GymMemberCardProps {
  member: {
    firstName: string;
    lastName: string;
    status?: string;
    duration?: string;
    price?: string | number;
    profileImageUrl?: string;
  };
  remainingDays: number | null;
  qrUrl: string;
}

export default function GymMemberCard({
  member,
  remainingDays,
  qrUrl,
}: GymMemberCardProps) {
  const isActive = remainingDays === null || remainingDays > 0;

  const remainingText =
    remainingDays === null
      ? "N/A"
      : remainingDays > 0
      ? `${remainingDays} DAYS LEFT`
      : "EXPIRED";

  const photoUrl =
    member.profileImageUrl || "https://via.placeholder.com/120x120?text=Photo";

  return (
    <>
      {/* ===== SCREEN WRAPPER (centers & scales card) ===== */}
      <div className="card-screen-wrapper">
        <div className="gym-card">
          {/* Header */}
          <div className="card-header">
            <h1>GYM FITNESS CLUB</h1>
          </div>

          {/* Body */}
          <div className="card-body">
            <img className="member-photo" src={photoUrl} alt="Member" />    

            <div className="member-info">
              <div className="name">
                {member.firstName} {member.lastName}
              </div>

              <div className="row">
                <span>Status</span>
                <strong>{member.status || "ACTIVE"}</strong>
              </div>

              <div className="row">
                <span>Plan</span>
                <strong>{member.duration || "N/A"}</strong>
              </div>

              <div className="row">
                <span>Price</span>
                <strong>{member.price ?? "N/A"}</strong>
              </div>
            </div>

            {/* Bigger QR */}
            <div className="qr-box">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  qrUrl
                )}`}
                alt="QR Code"
              />
            </div>
          </div>

          {/* Footer */}
          <div className={`card-footer ${isActive ? "active" : "expired"}`}>
            {remainingText}
          </div>
        </div>
      </div>

      {/* ===== STYLES ===== */}
      <style jsx>{`
        /* ---------- Screen Wrapper ---------- */
        .card-screen-wrapper {
          display: flex;
          justify-content: center;
          padding: 32px 16px;
        }

        /* ---------- Card ---------- */
        .gym-card {
          width: 3.375in;
          height: 2.125in;
          background: #fff;
          border: 2px solid #000;
          border-radius: 10px;
          padding: 10px;
          font-family: Arial, Helvetica, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          /* 🔥 SCALE UP FOR MOBILE */
          transform: scale(1.2);
          transform-origin: top center;
        }

        /* ---------- Header ---------- */
        .card-header {
          text-align: center;
          border-bottom: 1px solid #000;
          padding-bottom: 4px;
        }

        .card-header h1 {
          font-size: 14px;
          margin: 0;
          letter-spacing: 1px;
        }

        /* ---------- Body ---------- */
        .card-body {
          display: grid;
          grid-template-columns: 60px 1fr 100px;
          gap: 6px;
          align-items: center;
          flex: 1;
          margin-top: 6px;
        }

        .member-photo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #000;
        }

        .member-info {
          font-size: 13px;
        }

        .member-info .name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .row {
          display: grid;
          grid-template-columns: 36px auto;
          gap: 8px;
          line-height: 1.4;
        }

        /* ---------- QR ---------- */
        .qr-box {
          border: 1px solid #000;
          padding: 2px;
        }

        .qr-box img {
          width: 120px;
          height: 110px;
        }

        /* ---------- Footer ---------- */
        .card-footer {
          text-align: center;
          font-size: 11px;
          font-weight: bold;
          padding: 4px;
          border-top: 1px solid #000;
        }

        .active {
          background: #c8f7c5;
        }

        .expired {
          background: #f7c5c5;
        }

       /* ---------- PRINT (A4 SAFE, NO SPLIT) ---------- */
@media print {
  /* Hide everything except the card */
  body * {
    visibility: hidden !important;
  }

  .gym-card,
  .gym-card * {
    visibility: visible !important;
  }

  /* Center card on A4 and prevent splitting */
  .gym-card {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(1);

    /* CRITICAL: prevent page breaking */
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Force exactly ONE card per page */
  .gym-card::after {
    content: "";
    display: block;
    page-break-after: always;
  }

  /* A4 page, printer-friendly */
  @page {
    size: A4;
    margin: 0;
  }
}

      `}</style>
    </>
  );
}
