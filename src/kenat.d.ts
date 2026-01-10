/**
 * TypeScript declarations for the kenat package
 * Ethiopian calendar conversion library
 */

declare module 'kenat' {
  export interface DateObject {
    year: number;
    month: number;
    day: number;
  }

  /**
   * Converts Gregorian date to Ethiopian date
   * @param year - Gregorian year
   * @param month - Gregorian month (1-12)
   * @param day - Gregorian day
   * @returns Ethiopian date object
   */
  export function toEC(year: number, month: number, day: number): DateObject;

  /**
   * Converts Ethiopian date to Gregorian date
   * @param year - Ethiopian year
   * @param month - Ethiopian month (1-13, where 13 is Pagume)
   * @param day - Ethiopian day
   * @returns Gregorian date object
   */
  export function toGC(year: number, month: number, day: number): DateObject;
}
