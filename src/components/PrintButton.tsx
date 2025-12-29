"use client";

import { printMemberCard } from "./MemberCardPrint";

export default function PrintButton({ member, token }: { member?: any; token?: string }) {
  const handlePrint = () => {
    if (member && token) {
      printMemberCard(member, token);
    } else {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      style={{
        marginTop: 30,
        padding: "10px 20px",
        fontSize: 16,
        cursor: "pointer",
        borderRadius: 5,
        border: "none",
        backgroundColor: "#0070f3",
        color: "white",
      }}
    >
      Print Card
    </button>
  );
}
