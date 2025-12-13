export const formatCurrency = (value, locale = 'en-IN', currency = 'INR') => {
  if (value === null || value === undefined) return '-';
  const num = Number(value) || 0;
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(num);
};

export const formatDate = (value, options = {}) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', ...options });
};

export default { formatCurrency, formatDate };
