"use client";

import { useState } from "react";
import { formatEthiopianDate } from "@/lib/ethiopian";

/**
 * GymMemberCard
 * -----------------------------------
 * - Before scan: QR visible
 * - After scan: QR hidden, remaining shown
 * - Mobile scaled
 * - Print safe (A4, no split)
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
  remainingFromDb?: number | null;
  registerDate?: string | null;
  qrUrl: string;
  isScanned?: boolean;
}

export default function GymMemberCard({
  member,
  remainingDays,
  remainingFromDb = null,
  registerDate = null,
  qrUrl,
  isScanned = false,
}: GymMemberCardProps) {
  const usedRemaining =
    remainingFromDb !== null && remainingFromDb !== undefined
      ? remainingFromDb
      : remainingDays;

  const isActive = usedRemaining === null || usedRemaining > 0;

  const remainingText =
    usedRemaining === null
      ? "N/A"
      : usedRemaining > 0
      ? `${usedRemaining} DAYS LEFT`
      : "EXPIRED";

  const [imageError, setImageError] = useState(false);
  const hasImage = member.profileImageUrl && !imageError;

  return (
    <>
      <div className="card-screen-wrapper">
        <div className="gym-card">
          {/* Header */}
          <div className="card-header">
            <h1>GYM FITNESS CLUB</h1>
          </div>

          {/* Body */}
          <div className="card-body">
            {hasImage ? (
              <img
                className="member-photo"
                src={member.profileImageUrl}
                alt="Member"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="member-photo member-photo-placeholder">
                NO PHOTO
              </div>
            )}

            <div className="member-info">
              <div className="name">
                {member.firstName} {member.lastName}
              </div>

              <div className="row">
                <span>Plan</span>
                <strong>{member.duration || "N/A"}</strong>
              </div>

              {isScanned && (
                <>
                  <div className="row">
                    <span>Price</span>
                    <strong>{member.price ?? "N/A"}</strong>
                  </div>
                  <div className="row">
                    <span>Remaining</span>
                    <strong className="remaining-value">{remainingFromDb !== null && remainingFromDb !== undefined ? remainingFromDb : "N/A"}</strong>
                  </div>
                </>
              )}
            </div>

            {/* 🔥 QR ONLY BEFORE SCAN */}
            {!isScanned && (
              <div className="qr-box">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    qrUrl
                  )}`}
                  alt="QR Code"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`card-footer ${isScanned && !isActive ? "expired-red" : isActive ? "active" : "expired"}`}>
            {isScanned ? (
              <div className="remaining-display">
                {remainingDays === null ? (
                  <span className="remaining-text">N/A</span>
                ) : remainingDays > 0 ? (
                  <span className={`remaining-text ${remainingDays <= 5 ? "remaining-warning" : "remaining-active"}`}>
                    {remainingDays} {remainingDays === 1 ? "day" : "days"} left
                  </span>
                ) : (
                  <span className="remaining-text remaining-expired">EXPIRED</span>
                )}
              </div>
            ) : (
              `REGISTER: ${formatEthiopianDate(registerDate)}`
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-screen-wrapper {
          display: flex;
          justify-content: center;
          padding: 32px 16px;
        }

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

          transform: scale(1.2);
          transform-origin: top center;
        }

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

        .card-body {
          display: grid;
          grid-template-columns: 60px 1fr ${isScanned ? "0px" : "100px"};
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

        .member-photo-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          color: #666;
          font-size: 10px;
          font-weight: bold;
          text-align: center;
          line-height: 1.1;
        }

        .member-info {
          font-size: 13px;
        }

        .member-info .name {
          font-size: 18px;
          font-weight: bold;
        }

        .row {
          display: grid;
          grid-template-columns: 40px auto;
          gap: 6px;
          align-items: center;
        }

        .remaining-value {
          word-break: break-word;
          overflow-wrap: break-word;
        }

        .qr-box img {
          width: 110px;
          height: 110px;
        }

        .card-footer {
          text-align: center;
          font-size: 11px;
          font-weight: bold;
          padding: 4px;
          border-top: 1px solid #000;
        }

        .remaining-display {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remaining-text {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .remaining-active {
          color: #2d5016;
        }

        .remaining-warning {
          color: #ffffff;
          background: #dc2626;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: 700;
        }

        .remaining-expired {
          color: #ffffff;
          background: #dc2626;
          padding: 4px 12px;
          border-radius: 4px;
          text-transform: uppercase;
          font-size: 11px;
        }

        .active {
          background: #c8f7c5;
        }

        .expired {
          background: #f7c5c5;
        }

        .expired-red {
          background: #fee2e2;
        }

        .expired-red {
          background: #fee2e2;
        }

        /* ---------- PRINT (A4 SAFE) ---------- */
        @media print {
          body * {
            visibility: hidden !important;
          }

          .gym-card,
          .gym-card * {
            visibility: visible !important;
          }

          .gym-card {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1);
            page-break-inside: avoid;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
}
