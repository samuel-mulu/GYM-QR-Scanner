// Simple Ethiopian-to-Gregorian conversion helper
// Assumes input Ethiopian date string in `YYYY-MM-DD` format.
// Conversion rules (per user specification):
// GY = EY + 7 (or 8 depending on month/year adjustments)
// GM = EM - 1 (if result <= 0, wrap to previous year)
// GD = ED (+1 if Ethiopian year is leap)

export function isEthiopianLeapYear(ey: number) {
  // Simple rule: leap when divisible by 4 (assumption for this project)
  return ey % 4 === 0;
}

export function ethiopianToGregorian(ethiopianDate: string): Date {
  if (!ethiopianDate) throw new Error("Missing Ethiopian date");
  const parts = ethiopianDate.split("-");
  if (parts.length < 3) throw new Error("Invalid date format, expected YYYY-MM-DD");
  const ey = parseInt(parts[0], 10);
  const em = parseInt(parts[1], 10);
  const ed = parseInt(parts[2], 10);

  // Base conversion
  let gy = ey + 7;
  let gm = em - 1;
  let gd = ed;

  // If month wrapped to zero or negative, borrow a year
  if (gm <= 0) {
    gm += 12;
    gy -= 1;
  }

  // Add one day if Ethiopian year is leap (per user's rule)
  if (isEthiopianLeapYear(ey)) gd += 1;

  // Use JS Date to normalize overflow days/months
  // Note: month index in Date is 0-based
  return new Date(gy, gm - 1, gd);
}

export function parseEthiopianDateToIso(ethiopianDate: string): string {
  const d = ethiopianToGregorian(ethiopianDate);
  return d.toISOString();
}

// Ethiopian month names
const ETHIOPIAN_MONTHS = [
  "መስከረም", // 1 - Meskerem
  "ጥቅምት", // 2 - Tikimt
  "ህዳር", // 3 - Hidar
  "ታህሳስ", // 4 - Tahsas
  "ጥር", // 5 - Tir
  "የካቲት", // 6 - Yekatit
  "መጋቢት", // 7 - Megabit
  "ሚያዝያ", // 8 - Miyazya
  "ግንቦት", // 9 - Ginbot
  "ሰኔ", // 10 - Sene
  "ሐምሌ", // 11 - Hamle
  "ነሐሴ", // 12 - Nehase
];

/**
 * Formats Ethiopian date string (YYYY-MM-DD) to YYYY-{EthiopianMonth}-DD
 * @param ethiopianDate - Ethiopian date string in YYYY-MM-DD format (or ISO string)
 * @returns Formatted date string with Ethiopian month name
 */
export function formatEthiopianDate(ethiopianDate: string | null): string {
  if (!ethiopianDate) return "N/A";
  
  // Remove time portion if it exists (handles ISO format like "2018-03-10T00:00:00.000")
  const dateOnly = ethiopianDate.split("T")[0];
  
  const parts = dateOnly.split("-");
  if (parts.length < 3) return ethiopianDate;
  
  const year = parts[0];
  const monthNum = parseInt(parts[1], 10);
  const day = parts[2];
  
  if (monthNum < 1 || monthNum > 12) return ethiopianDate;
  
  const monthName = ETHIOPIAN_MONTHS[monthNum - 1];
  return `${year}-${monthName}-${day}`;
}