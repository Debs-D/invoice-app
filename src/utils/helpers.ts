import type { InvoiceFormData } from '../types/invoice';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'GBP', minimumFractionDigits: 2,
  }).format(amount || 0);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function validateInvoice(data: InvoiceFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.senderAddress?.street?.trim()) errors['senderAddress.street'] = "can't be empty";
  if (!data.senderAddress?.city?.trim()) errors['senderAddress.city'] = "can't be empty";
  if (!data.senderAddress?.postCode?.trim()) errors['senderAddress.postCode'] = "can't be empty";
  if (!data.senderAddress?.country?.trim()) errors['senderAddress.country'] = "can't be empty";
  if (!data.clientName?.trim()) errors.clientName = "can't be empty";
  if (!data.clientEmail?.trim()) errors.clientEmail = "can't be empty";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) errors.clientEmail = 'invalid email';
  if (!data.clientAddress?.street?.trim()) errors['clientAddress.street'] = "can't be empty";
  if (!data.clientAddress?.city?.trim()) errors['clientAddress.city'] = "can't be empty";
  if (!data.clientAddress?.postCode?.trim()) errors['clientAddress.postCode'] = "can't be empty";
  if (!data.clientAddress?.country?.trim()) errors['clientAddress.country'] = "can't be empty";
  if (!data.createdAt) errors.createdAt = "can't be empty";
  if (!data.description?.trim()) errors.description = "can't be empty";
  if (!data.items || data.items.length === 0) errors.items = 'An item must be added';
  else {
    data.items.forEach((item, i) => {
      if (!item.name?.trim()) errors[`items.${i}.name`] = "can't be empty";
      if (!item.quantity || Number(item.quantity) <= 0) errors[`items.${i}.quantity`] = 'must be > 0';
      if (!item.price || Number(item.price) <= 0) errors[`items.${i}.price`] = 'must be > 0';
    });
  }
  return errors;
}
