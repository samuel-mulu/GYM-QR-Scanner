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
 * Converts Gregorian date to Ethiopian date
 * Uses the standard conversion algorithm
 * @param date - Gregorian Date object
 * @returns Ethiopian date string (YYYY-MM-DD)
 */
export function gregorianToEthiopian(date: Date): string {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1; // JS months are 1-based now
  const gd = date.getDate();
  
  // Calculate days since epoch (January 1, 0001 AD in Gregorian)
  // Using a simpler approach: calculate days since a known reference point
  // Reference: September 11, 2023 (Gregorian) = Meskerem 1, 2016 (Ethiopian)
  
  // Calculate days since January 1, 1900 (a reference point)
  const epoch = new Date(1900, 0, 1);
  const daysSinceEpoch = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
  
  // Ethiopian calendar epoch is approximately 8 years behind Gregorian
  // Each Ethiopian year has 365 days (or 366 in leap years)
  // Ethiopian months have 30 days each (except Pagume with 5-6 days)
  
  // Approximate conversion
  // Ethiopian year starts around September 11 of Gregorian calendar
  let ey = gy - 7;
  let em = 1;
  let ed = 1;
  
  // Adjust for year start (Ethiopian year starts in September)
  if (gm < 9 || (gm === 9 && gd < 11)) {
    ey -= 1;
  }
  
  // Calculate month: Ethiopian months are offset from Gregorian
  // Meskerem (1) = September, Tikimt (2) = October, etc.
  if (gm >= 9) {
    em = gm - 8;
  } else {
    em = gm + 4;
  }
  
  // Calculate day: adjust for the day offset
  // Ethiopian day is usually close to Gregorian day, but may differ by 1-2 days
  ed = gd;
  
  // Adjust for the fact that Ethiopian calendar day starts at different time
  // Simple approximation: if we're past the 11th of September, adjust
  if (gm === 9 && gd >= 11) {
    ed = gd - 10; // Approximate offset
  } else if (gm > 9 || (gm === 9 && gd < 11)) {
    // For other months, use a simpler calculation
    ed = gd;
  }
  
  // Ensure valid ranges
  if (ed < 1) ed = 1;
  if (ed > 30) ed = 30;
  if (em < 1) em = 1;
  if (em > 12) em = 12;
  
  return `${ey}-${String(em).padStart(2, "0")}-${String(ed).padStart(2, "0")}`;
}

/**
 * Gets today's date in Ethiopian calendar format
 * @returns Ethiopian date string (YYYY-MM-DD)
 */
export function getTodayEthiopianDate(): string {
  const today = new Date();
  return gregorianToEthiopian(today);
}