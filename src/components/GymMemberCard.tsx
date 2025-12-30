"use client";

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
      <div className="gym-card">
        {/* Header */}
        <div className="card-header">
          <h1>GYM FITNESS CLUB</h1>
          <span>Member ID Card</span>
        </div>

        {/* Body */}
        <div className="card-body">
          <img className="member-photo" src={photoUrl} alt="Member" />

          <div className="member-info">
            <div className="name">
              {member.firstName} {member.lastName}
            </div>

            <div className="row">
              <span>Status:</span>
              <strong>{member.status || "ACTIVE"}</strong>
            </div>

            <div className="row">
              <span>Plan:</span>
              <strong>{member.duration || "N/A"}</strong>
            </div>

            <div className="row">
              <span>Price:</span>
              <strong>{member.price ?? "N/A"}</strong>
            </div>
          </div>

          <div className="qr-box">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                qrUrl
              )}`}
              alt="QR"
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`card-footer ${isActive ? "active" : "expired"}`}>
          {remainingText}
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
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

        .card-header span {
          font-size: 10px;
        }

        .card-body {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 8px;
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
          font-size: 10px;
        }

        .member-info .name {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .row {
          display: flex;
          justify-content: space-between;
        }

        .qr-box {
          background: #fff;
          border: 1px solid #000;
          padding: 2px;
        }

        .qr-box img {
          width: 60px;
          height: 60px;
        }

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

        @media print {
          body * {
            visibility: hidden;
          }
          .gym-card,
          .gym-card * {
            visibility: visible;
          }
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
