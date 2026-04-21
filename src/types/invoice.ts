export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export type InvoiceStatus = 'draft' | 'pending' | 'paid';

export interface Invoice {
  id: string;
  status: InvoiceStatus;
  description: string;
  createdAt: string;
  paymentDue: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
}

export interface InvoiceFormData {
  senderAddress: Address;
  clientName: string;
  clientEmail: string;
  clientAddress: Address;
  createdAt: string;
  paymentTerms: string;
  description: string;
  items: Array<{ name: string; quantity: string | number; price: string | number }>;
}
