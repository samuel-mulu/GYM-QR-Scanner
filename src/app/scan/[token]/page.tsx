// src/app/scan/[token]/page.tsx
import GymMemberCard from "@/components/GymMemberCard";
import PrintButton from "@/components/PrintButton";
import { db } from "@/lib/firebase";
import { ethiopianToGregorian, parseDurationToDays } from "@/lib/ethiopian";
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

  // Calculate remaining days using the formula:
  // Remaining Days = (Register Date + Duration Days) - Today
  let remainingDays: number | null = null;
  if (member.registerDate && member.duration) {
    try {
      // Step 1: Convert Ethiopian registerDate to Gregorian
      const registerDateGregorian = ethiopianToGregorian(member.registerDate);

      // Step 2: Parse duration string to days
      // Examples: "1 Month" → 30, "2 Weeks" → 14, "30 Days" → 30, "1 Year" → 365
      const durationDays = parseDurationToDays(member.duration);

      // Step 3: Calculate expiry date (Register Date + Duration Days)
      const expiryDate = new Date(registerDateGregorian);
      expiryDate.setDate(expiryDate.getDate() + durationDays);

      // Step 4: Calculate remaining days (Expiry Date - Today)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset to start of day
      expiryDate.setHours(0, 0, 0, 0); // Reset to start of day

      const diffTime = expiryDate.getTime() - today.getTime();
      remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // If negative or zero, it's expired
      if (remainingDays < 0) {
        remainingDays = 0; // Expired
      }
    } catch (error) {
      console.error("Error calculating remaining days:", error);
      remainingDays = null;
    }
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://gym-qr-scanner.vercel.app";
  // QR URL should point to the scanned version (with ?scanned=1)
  const qrUrl = `${baseUrl.replace(/\/$/, "")}/scan/${memberId}?scanned=1`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: isScanned ? "#f9fafb" : "#0f0f0f",
        padding: "40px 20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: isScanned ? "#1f2937" : "#00ff99",
          fontSize: "32px",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        {isScanned ? "Member Details" : "Member Card Preview"}
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
        registerDate={member.registerDate ?? null}
        qrUrl={qrUrl}
        isScanned={isScanned}
      />

      {/* Print Button Only for Normal Endpoint */}
      {!isScanned && <PrintButton />}
    </main>
  );
}
