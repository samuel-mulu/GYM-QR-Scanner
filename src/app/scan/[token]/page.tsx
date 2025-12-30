// src/app/scan/[token]/page.tsx
import GymMemberCard from "@/components/GymMemberCard";
import PrintButton from "@/components/PrintButton";
import { db } from "@/lib/firebase";
import { ethiopianToGregorian } from "@/lib/ethiopian";
import { get, ref } from "firebase/database";

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ScanPage({ params, searchParams }: PageProps) {
  const { token: memberId } = await params;
  const searchParamsObj = await searchParams;
  const isScanned = searchParamsObj.scanned === "1";

  const memberRef = ref(db, `members/${memberId}`);
  const memberSnap = await get(memberRef);

  if (!memberSnap.exists()) {
    return (
      <main
        style={{
          padding: 40,
          textAlign: "center",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "32px", color: "#ff4444" }}>Member Not Found</h1>
        <p>No member found with this ID.</p>
      </main>
    );
  }

  const member = memberSnap.val();

  // Calculate remaining days (convert Ethiopian `registerDate` to Gregorian first)
  const registerDate = member.registerDate
    ? ethiopianToGregorian(member.registerDate)
    : null;
  let remainingDays: number | null = null;
  if (registerDate && member.duration) {
    const months = parseInt(member.duration, 10);
    const expiryDate = new Date(registerDate);
    expiryDate.setMonth(expiryDate.getMonth() + months);

    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://gym-qr-scanner.vercel.app";
  // QR URL should point to the scanned version (with ?scanned=1)
  const qrUrl = `${baseUrl.replace(/\/$/, "")}/scan/${memberId}?scanned=1`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        padding: "40px 20px",
      }}
    >
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
        remainingFromDb={member.remaining ?? null}
        showRegisterDate={false}
        registerDate={member.registerDate ?? null}
        qrUrl={qrUrl}
        isScanned={isScanned}
      />

      {/* Print Button Below Card */}
      <PrintButton />
    </main>
  );
}
