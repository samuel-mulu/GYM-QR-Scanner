// src/app/scan/[token]/page.tsx
import GymMemberCard from "@/components/GymMemberCard";
import PrintButton from "@/components/PrintButton";
import { db } from "@/lib/firebase";
import { get, ref } from "firebase/database";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ScanPage({ params }: PageProps) {
  const { token: memberId } = await params;

  const memberRef = ref(db, `members/${memberId}`);
  const memberSnap = await get(memberRef);

  if (!memberSnap.exists()) {
    return (
      <main style={{ padding: 40, textAlign: "center", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <h1 style={{ fontSize: "32px", color: "#ff4444" }}>Member Not Found</h1>
        <p>No member found with this ID.</p>
      </main>
    );
  }

  const member = memberSnap.val();

  // Calculate remaining days
  let remainingDays: number | null = null;
  if (member.reRegisterDate && member.duration) {
    const months = parseInt(member.duration, 10);
    const expiryDate = new Date(member.reRegisterDate);
    expiryDate.setMonth(expiryDate.getMonth() + months);

    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gym-qr-scanner.vercel.app";
  const qrUrl = `${baseUrl.replace(/\/$/, "")}/scan/${memberId}`;

  return (
    <main style={{ minHeight: "100vh", background: "#0f0f0f", padding: "40px 20px" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#00ff99",
          fontSize: "32px",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Member Card Preview
      </h1>

      {/* Card */}
      <GymMemberCard
        member={{
          firstName: member.firstName || "N/A",
          lastName: member.lastName || "",
          status: member.status,
          duration: member.duration,
          price: member.price,
          profileImageUrl: member.profileImageUrl,
        }}
        remainingDays={remainingDays}
        qrUrl={qrUrl}
      />

      {/* Print Button Below Card */}
      <PrintButton />
    </main>
  );
}