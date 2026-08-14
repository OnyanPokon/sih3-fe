/**
 * Formats a date string into a relative Indonesian label, e.g. "Hari ini",
 * "Kemarin" or "3 Hari yang lalu".
 *
 * @param {string} dateString - The date string to format (ISO or `Y-m-d H:i:s`).
 * @returns {string} The relative date label.
 * @throws {Error} If the provided dateString is invalid.
 */
export default function relativeDate(dateString) {
  if (!dateString) {
    throw new Error('Date string is required');
  }

  const date = new Date(dateString.includes(' ') ? dateString.replace(' ', 'T') : dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const days = Math.round((startOfToday - startOfDate) / 86400000);

  if (days <= 0) return 'Hari ini';
  if (days === 1) return 'Kemarin';
  return `${days} Hari yang lalu`;
}
