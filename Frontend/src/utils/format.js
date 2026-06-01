export function formatCurrency(value) {
  const amount = Number(value) || 0;
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
