"use client";

import html2canvas from "html2canvas";

/**
 * Print + Download buttons
 * -------------------------
 * Visible ONLY before scan
 */

export default function CardActions() {
  const downloadImage = async () => {
    const card = document.querySelector(".gym-card") as HTMLElement;
    if (!card) return;

    const canvas = await html2canvas(card, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = "gym-member-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="card-actions">
      <button className="print" onClick={() => window.print()}>
        🖨️ Print
      </button>

      <button className="download" onClick={downloadImage}>
        📥 Download
      </button>

      <style jsx>{`
        .card-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin: 32px 0;
          flex-wrap: wrap;
        }

        button {
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
        }

        .print {
          background: #0070f3;
          color: #fff;
        }

        .download {
          background: #00ff99;
          color: #000;
        }

        @media print {
          .card-actions {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
