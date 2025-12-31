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
 * Checks if a Gregorian year is a leap year
 */
function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Converts Gregorian date to Ethiopian date using accurate algorithm
 * Ethiopian New Year is on September 11 (or 12 in leap years)
 * @param date - Gregorian Date object
 * @returns Ethiopian date string (YYYY-MM-DD)
 */
export function gregorianToEthiopian(date: Date): string {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1; // JS months are 1-based
  const gd = date.getDate();
  
  // Ethiopian year offset: Ethiopian year = Gregorian year - 7 (or 8 before New Year)
  let ey = gy - 7;
  
  // Determine if we're before or after Ethiopian New Year
  // Ethiopian New Year is September 11 (or 12 in leap years)
  const isLeap = isGregorianLeapYear(gy);
  const newYearDay = isLeap ? 12 : 11;
  
  // If before September 11/12, we're in the previous Ethiopian year
  if (gm < 9 || (gm === 9 && gd < newYearDay)) {
    ey -= 1;
  }
  
  // Calculate Ethiopian month and day
  let em: number;
  let ed: number;
  
  // Days in each Gregorian month up to August
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeap) daysInMonths[1] = 29; // February in leap year
  
  if (gm >= 9) {
    // From September onwards
    // Calculate days from September 11/12
    let daysFromNewYear = 0;
    
    if (gm === 9) {
      // September: days from new year day (including the new year day itself)
      daysFromNewYear = gd - newYearDay + 1;
    } else {
      // October onwards: days in September after new year + days in subsequent months
      daysFromNewYear = daysInMonths[8] - newYearDay + 1; // Days left in September
      for (let m = 10; m < gm; m++) {
        daysFromNewYear += daysInMonths[m - 1];
      }
      daysFromNewYear += gd;
    }
    
    // Convert to Ethiopian month and day
    // Each Ethiopian month has 30 days
    // Adjust: if daysFromNewYear is 0, it's day 1 of month 1
    if (daysFromNewYear <= 0) {
      em = 1;
      ed = 1;
    } else {
      em = Math.floor((daysFromNewYear - 1) / 30) + 1;
      ed = ((daysFromNewYear - 1) % 30) + 1;
    }
    
    // Handle Pagume (month 13) - has 5 or 6 days
    if (em > 13) {
      em = 13;
      ed = Math.min(ed, isLeap ? 6 : 5);
    }
  } else {
    // January to August (before Ethiopian New Year)
    // Calculate days from previous Ethiopian New Year
    const prevYearIsLeap = isGregorianLeapYear(gy - 1);
    const prevNewYearDay = prevYearIsLeap ? 12 : 11;
    
    let daysFromNewYear = daysInMonths[8] - prevNewYearDay + 1; // Days left in previous September
    for (let m = 10; m <= 12; m++) {
      daysFromNewYear += daysInMonths[m - 1]; // October, November, December
    }
    for (let m = 1; m < gm; m++) {
      daysFromNewYear += daysInMonths[m - 1]; // January to current month
    }
    daysFromNewYear += gd;
    
    // Convert to Ethiopian month and day
    if (daysFromNewYear <= 0) {
      em = 1;
      ed = 1;
    } else {
      em = Math.floor((daysFromNewYear - 1) / 30) + 1;
      ed = ((daysFromNewYear - 1) % 30) + 1;
    }
    
    // Handle Pagume
    if (em > 13) {
      em = 13;
      ed = Math.min(ed, prevYearIsLeap ? 6 : 5);
    }
  }
  
  // Ensure valid ranges
  if (em < 1) em = 1;
  if (em > 13) em = 13;
  
  // Day validation
  if (em === 13) {
    // Pagume has 5 or 6 days
    const yearIsLeap = isEthiopianLeapYear(ey);
    const maxDays = yearIsLeap ? 6 : 5;
    if (ed > maxDays) ed = maxDays;
  } else {
    // Regular months have 30 days
    if (ed > 30) ed = 30;
  }
  if (ed < 1) ed = 1;
  
  // Format month (13 for Pagume, but we'll use 12 for display purposes in our system)
  // Since our system uses 1-12, we'll map Pagume to month 12
  if (em === 13) {
    em = 12;
  }
  
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