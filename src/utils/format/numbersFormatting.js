/**
 * Formats a number with thousand separators
 * @param {number} value - The number to format
 * @returns {string} - The formatted number with dots as thousand separators
 */
export const formatNumber = (value) => {
  if (value === undefined || value === null) return "0";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
