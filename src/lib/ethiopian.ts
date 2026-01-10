// Ethiopian calendar conversion using kenat package
// Assumes input Ethiopian date string in `YYYY-MM-DD` format.
import { toEC, toGC } from 'kenat';

export function isEthiopianLeapYear(ey: number) {
  // Simple rule: leap when divisible by 4 (assumption for this project)
  return ey % 4 === 0;
}

/**
 * Converts Ethiopian date string to Gregorian Date object using kenat
 * @param ethiopianDate - Ethiopian date string in YYYY-MM-DD format
 * @returns Gregorian Date object
 */
export function ethiopianToGregorian(ethiopianDate: string): Date {
  if (!ethiopianDate) throw new Error("Missing Ethiopian date");
  const parts = ethiopianDate.split("-");
  if (parts.length < 3) throw new Error("Invalid date format, expected YYYY-MM-DD");
  const ey = parseInt(parts[0], 10);
  const em = parseInt(parts[1], 10);
  const ed = parseInt(parts[2], 10);

  // Use kenat's toGC function to convert Ethiopian to Gregorian
  const gregorian = toGC(ey, em, ed);
  
  // Convert to JavaScript Date (month is 0-based in Date constructor)
  return new Date(gregorian.year, gregorian.month - 1, gregorian.day);
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

/**
 * Adds months to an Ethiopian date and returns the expiry date in Ethiopian format
 * Ethiopian months have 30 days each (except Pagume which is month 13 with 5-6 days)
 * @param ethiopianDate - Ethiopian date string in YYYY-MM-DD format
 * @param months - Number of months to add
 * @returns Ethiopian date string of the expiry date
 */
export function addMonthsToEthiopianDate(ethiopianDate: string, months: number): string {
  if (!ethiopianDate) throw new Error("Missing Ethiopian date");
  
  const parts = ethiopianDate.split("-");
  if (parts.length < 3) throw new Error("Invalid date format");
  
  let ey = parseInt(parts[0], 10);
  let em = parseInt(parts[1], 10);
  let ed = parseInt(parts[2], 10);
  
  // Add months
  em += months;
  
  // Handle year overflow (each year has 13 months, but we only use 1-12 for regular months)
  // If month > 12, we need to handle Pagume (month 13) and roll to next year
  while (em > 12) {
    em -= 12;
    ey += 1;
  }
  
  // Ensure month is valid
  if (em < 1) {
    em = 1;
  }
  
  // Format back to YYYY-MM-DD
  return `${ey}-${String(em).padStart(2, "0")}-${String(ed).padStart(2, "0")}`;
}

/**
 * Calculates remaining days between two Ethiopian dates
 * @param startDate - Start Ethiopian date string (YYYY-MM-DD)
 * @param endDate - End Ethiopian date string (YYYY-MM-DD)
 * @returns Number of days difference
 */
export function daysBetweenEthiopianDates(startDate: string, endDate: string): number {
  // Convert both to Gregorian for easier calculation
  const startGreg = ethiopianToGregorian(startDate);
  const endGreg = ethiopianToGregorian(endDate);
  
  const diffTime = endGreg.getTime() - startGreg.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Converts Gregorian date to Ethiopian date using kenat
 * @param date - Gregorian Date object
 * @returns Ethiopian date string (YYYY-MM-DD)
 */
export function gregorianToEthiopian(date: Date): string {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1; // Convert from 0-based to 1-based month
  const gd = date.getDate();
  
  // Use kenat's toEC function to convert Gregorian to Ethiopian
  const ethiopian = toEC(gy, gm, gd);
  
  // Handle Pagume (month 13) - map to month 12 for display purposes in our system
  // Since our system uses 1-12, we'll map Pagume to month 12
  let em = ethiopian.month;
  if (em === 13) {
    em = 12;
  }
  
  // Format to YYYY-MM-DD string
  return `${ethiopian.year}-${String(em).padStart(2, "0")}-${String(ethiopian.day).padStart(2, "0")}`;
}

/**
 * Gets today's date in Ethiopian calendar format
 * @returns Ethiopian date string (YYYY-MM-DD)
 */
export function getTodayEthiopianDate(): string {
  const today = new Date();
  return gregorianToEthiopian(today);
}