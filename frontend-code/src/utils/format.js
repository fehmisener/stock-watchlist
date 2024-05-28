/**
 * Function to format currency based on the provided currency code.
 * @param {string} currency - Currency code (e.g., "USD", "EUR").
 * @returns {Intl.NumberFormat} - Number formatter for currency.
 */
export const currencyFormatter = (currency) => {
  return Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: currency,
    useGrouping: true,
    currencyDisplay: 'code',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};
