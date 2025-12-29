import PrintButton from "@/components/PrintButton"; // adjust path if needed
import { db } from "@/lib/firebase";
import { get, ref } from "firebase/database";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ScanPage({ params }: PageProps) {
  const awaitedParams = await params;
  const memberId = awaitedParams.token;

  const memberRef = ref(db, `members/${memberId}`);
  const memberSnap = await get(memberRef);

  if (!memberSnap.exists()) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Member Not Found</h1>
        <p>No member found with this ID.</p>
      </main>
    );
  }

  const member = memberSnap.val();

  const reRegisterDate = member.reRegisterDate ? new Date(member.reRegisterDate) : null;
  let remainingDays = null;

  if (reRegisterDate && member.duration) {
    const months = parseInt(member.duration);
    const expiryDate = new Date(reRegisterDate);
    expiryDate.setMonth(expiryDate.getMonth() + months);

    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gym-qr-scanner.vercel.app";
  const qrUrl = `${baseUrl.replace(/\/$/, "")}/scan/${memberId}`;

  return (
    <main style={{ padding: 20, maxWidth: 400, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Member Status</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2>
          {member.firstName} {member.lastName}
        </h2>
        <p><strong>Status:</strong> {member.status || "N/A"}</p>
        <p><strong>Duration:</strong> {member.duration || "N/A"}</p>
        <p><strong>Price:</strong> {member.price ? `$${member.price}` : "N/A"}</p>

        <p style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
          {remainingDays === null
            ? "Remaining days: N/A"
            : remainingDays > 0
            ? `Remaining days: ${remainingDays}`
            : "Membership expired"}
        </p>

        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
          alt="QR Code"
          style={{ marginTop: 20 }}
        />

        <PrintButton />
      </div>
    </main>
  );
}
