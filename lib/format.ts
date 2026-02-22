export function formatDate(date: Date | null) {
  if (!date) {
    return '-';
  }

  return date.toLocaleDateString('en-GB', { timeZone: 'UTC' });
}

export function formatMoney(value: number | null) {
  if (value === null || value === undefined) {
    return '-';
  }

  return value.toLocaleString();
}
