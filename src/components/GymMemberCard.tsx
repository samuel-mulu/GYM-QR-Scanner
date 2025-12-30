"use client";

/**
 * GymMemberCard
 * ----------------------------
 * - Front-side ID card only
 * - Exact PVC card print size (3.375in x 2.125in)
 * - Print button shown on screen, hidden during print
 * - Tight label/value spacing for readability
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
      {/* ===== SCREEN-ONLY PRINT BUTTON ===== */}
      <div className="print-actions">
        <button onClick={() => window.print()}>Print Member Card</button>
      </div>

      {/* ===== FRONT CARD ONLY ===== */}
      <div className="gym-card">
        {/* Header */}
        <div className="card-header">
          <h1>GYM FITNESS CLUB</h1>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Member Photo */}
          <img className="member-photo" src={photoUrl} alt="Member Photo" />

          {/* Member Details */}
          <div className="member-info">
            <div className="name">
              {member.firstName} {member.lastName}
            </div>

            {/* Tight label/value layout */}
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

          {/* Large QR Code for scanning */}
          <div className="qr-box">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                qrUrl
              )}`}
              alt="QR Code"
            />
          </div>
        </div>

        {/* Footer / Membership Status */}
        <div className={`card-footer ${isActive ? "active" : "expired"}`}>
          {remainingText}
        </div>
      </div>

      {/* ===== STYLES ===== */}
      <style jsx>{`
        /* ---------- Screen Button ---------- */
        .print-actions {
          margin-bottom: 16px;
          text-align: center;
        }

        .print-actions button {
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
        }

        /* ---------- Card Base ---------- */
        .gym-card {
          width: 3.375in;
          height: 2.125in;
          border: 2px solid #000;
          border-radius: 10px;
          padding: 10px;
          font-family: Arial, Helvetica, sans-serif;
          background: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
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
          font-weight: bold;
          letter-spacing: 1px;
        }

        /* ---------- Body Layout ---------- */
        .card-body {
          display: grid;
          grid-template-columns: 60px 1fr 90px;
          gap: 6px;
          align-items: center;
          flex: 1;
          margin-top: 6px;
        }

        /* ---------- Photo ---------- */
        .member-photo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #000;
        }

        /* ---------- Member Info ---------- */
        .member-info {
          font-size: 10px;
        }

        .member-info .name {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        /* Tight label/value spacing */
        .row {
          display: grid;
          grid-template-columns: 40px auto;
          gap: 4px;
          line-height: 1.3;
        }

        .row span {
          font-weight: normal;
        }

        .row strong {
          font-weight: bold;
        }

        /* ---------- QR ---------- */
        .qr-box {
          border: 1px solid #000;
          padding: 2px;
        }

        .qr-box img {
          width: 80px;
          height: 80px;
          display: block;
        }

        /* ---------- Footer ---------- */
        .card-footer {
          text-align: center;
          font-size: 11px;
          font-weight: bold;
          padding: 4px;
          border-top: 1px solid #000;
        }

        .card-footer.active {
          background: #c8f7c5;
        }

        .card-footer.expired {
          background: #f7c5c5;
        }

        /* ---------- PRINT RULES ---------- */
        @media print {
          /* Hide everything except card */
          body * {
            visibility: hidden;
          }

          .gym-card,
          .gym-card * {
            visibility: visible;
          }

          /* Hide print button */
          .print-actions {
            display: none;
          }

          /* Lock card position */
          .gym-card {
            position: absolute;
            left: 0;
            top: 0;
          }

          @page {
            size: 3.375in 2.125in;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
}
