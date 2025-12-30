"use client";

import html2canvas from "html2canvas";

export default function CardActions() {
 const downloadImage = async () => {
  const card = document.querySelector(".gym-card") as HTMLElement;

  if (!card) {
    alert("Card not found");
    return;
  }

  // 🔥 wait for images to load
  const images = Array.from(card.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );

  const canvas = await html2canvas(card, {
    scale: 3,
    backgroundColor: "#ffffff",
    useCORS: true,
    allowTaint: true,
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
          margin: 40px 0;
          flex-wrap: wrap;
        }

        button {
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        button:active {
          transform: scale(0.97);
        }

        .print {
          background: #0070f3;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 112, 243, 0.4);
        }

        .download {
          background: #00ff99;
          color: #000;
          box-shadow: 0 4px 12px rgba(0, 255, 153, 0.4);
        }

        /* 🔥 Hide buttons while printing */
        @media print {
          .card-actions {
            display: none !important;
          }
        }

        /* 📱 Mobile friendly */
        @media (max-width: 480px) {
          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
