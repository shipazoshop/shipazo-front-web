export interface FormatPriceOptions {
  currency?: string;
  decimals?: number;
  locale?: string;
  showCurrency?: boolean;
}

/**
 * Formats a number as a price with proper decimal places and thousands separators
 * @param value - The numeric value to format
 * @param options - Formatting options
 * @returns Formatted price string
 *
 * @example
 * formatPrice(1234.56) // "Q 1,234.56"
 * formatPrice(1234.56, { showCurrency: false }) // "1,234.56"
 * formatPrice(1234.5) // "Q 1,234.50"
 * formatPrice(1234, { decimals: 0 }) // "Q 1,234"
 */
export const formatPrice = (
  value: number,
  options: FormatPriceOptions = {}
): string => {
  const {
    currency = 'Q',
    decimals = 2,
    locale = 'en-US',
    showCurrency = true,
  } = options;

  // Handle invalid values
  if (typeof value !== 'number' || isNaN(value)) {
    return showCurrency ? `${currency} 0.${'0'.repeat(decimals)}` : `0.${'0'.repeat(decimals)}`;
  }

  // Format the number with locale-specific formatting
  const formattedNumber = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // Return with or without currency symbol
  return showCurrency ? `${currency} ${formattedNumber}` : formattedNumber;
};

/**
 * Formats a number as GTQ (Quetzales) currency - shorthand for formatPrice with GTQ defaults
 * @param value - The numeric value to format
 * @returns Formatted GTQ price string
 *
 * @example
 * formatGTQ(1234.56) // "Q 1,234.56"
 * formatGTQ(1234.5) // "Q 1,234.50"
 */
export const formatGTQ = (value: number): string => {
  return formatPrice(value, { currency: 'Q' });
};

/**
 * Formats a number without currency symbol
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234.56) // "1,234.56"
 * formatNumber(1234.567, 3) // "1,234.567"
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return formatPrice(value, { showCurrency: false, decimals });
};
