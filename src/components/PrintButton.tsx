"use client";

export default function PrintButton() {
  return (
    <div className="print-actions">
      <button onClick={() => window.print()}>
        🖨️ Print Member Card
      </button>

      <style jsx>{`
        .print-actions {
          display: flex;
          justify-content: center;
          margin: 79px 0;
        }

        button {
          padding: 14px 32px;
          font-size: 18px;
          font-weight: bold;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          background: #00ff99;
          color: #000;
          box-shadow: 0 4px 15px rgba(0, 255, 153, 0.4);
        }

        @media print {
          .print-actions {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
