"use client";

import html2canvas from "html2canvas";
import { useState } from "react";

export default function CardActions() {
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  const getCurrentUrl = () => {
    return `${window.location.origin}${window.location.pathname}${window.location.search}`;
  };

  const handleShareClick = async () => {
    const url = getCurrentUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch (e) {
        // fallthrough to menu
      }
    }

    // Toggle fallback share menu (WhatsApp / Telegram / Copy)
    setShowShareMenu((v) => !v);
  };

  const openWhatsApp = () => {
    const url = encodeURIComponent(getCurrentUrl());
    window.open(`https://wa.me/?text=${url}`, "_blank");
  };

  const openTelegram = () => {
    const url = encodeURIComponent(getCurrentUrl());
    window.open(`https://t.me/share/url?url=${url}`, "_blank");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentUrl());
      alert("Link copied to clipboard");
      setShowShareMenu(false);
    } catch (e) {
      alert("Unable to copy link");
    }
  };

  return (
    <div className="card-actions">
      <button className="print" onClick={() => window.print()}>
        🖨️ Print
      </button>

      <button className="download" onClick={downloadImage}>
        📥 Download
      </button>

      <div className="share-wrapper">
        <button className="share" onClick={handleShareClick} aria-haspopup="true">
          📤 Send
        </button>

        {showShareMenu && (
          <div className="share-menu">
            <button onClick={openWhatsApp}>WhatsApp</button>
            <button onClick={openTelegram}>Telegram</button>
            <button onClick={copyLink}>Copy link</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .card-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin: 40px 0;
          flex-wrap: wrap;
          position: relative;
        }

        button {
          padding: 14px 20px;
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

        .share {
          background: #ffb020;
          color: #000;
          box-shadow: 0 4px 12px rgba(255, 176, 32, 0.28);
        }

        .share-wrapper {
          position: relative;
        }

        .share-menu {
          position: absolute;
          right: 0;
          top: 56px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px;
          z-index: 50;
        }

        .share-menu button {
          padding: 8px 12px;
          font-size: 14px;
          border-radius: 8px;
          background: transparent;
          text-align: left;
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
          .share-menu {
            right: 50%;
            transform: translateX(50%);
            top: 64px;
          }
        }
      `}</style>
    </div>
  );
}
