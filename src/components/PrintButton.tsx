// src/components/PrintButton.tsx
"use client";

export default function PrintButton() {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <button
        onClick={() => window.print()}
        style={{
          padding: "14px 32px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "#00ff99",
          color: "#000",
          boxShadow: "0 4px 15px rgba(0, 255, 153, 0.4)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        🖨️ Print Member Card
      </button>
    </div>
  );
}