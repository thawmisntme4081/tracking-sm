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

  if (value === 0) {
    return 'Free transfer';
  }

  return value.toLocaleString();
}

export function formatDateInput(rawValue: string) {
  const digits = rawValue.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}
