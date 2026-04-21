import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Invoice, InvoiceFormData } from '../types/invoice';
import { sampleInvoices } from '../data/sampleInvoices';

const STORAGE_KEY = 'inv-app-v1';
const THEME_KEY   = 'inv-theme';

function genId(): string {
  const l = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const n = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return l() + l() + n;
}

function addDays(dateStr: string, days: number | string): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().split('T')[0];
}

function processItems(items: InvoiceFormData['items']) {
  return items.map(it => ({
    name: it.name,
    quantity: Number(it.quantity),
    price: Number(it.price),
    total: Number(it.quantity) * Number(it.price),
  }));
}

function sumItems(items: Array<{ total: number }>): number {
  return items.reduce((s, it) => s + it.total, 0);
}

type Theme = 'light' | 'dark';

interface InvoiceContextValue {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  filterStatus: string[];
  setFilterStatus: React.Dispatch<React.SetStateAction<string[]>>;
  addInvoice: (data: InvoiceFormData, asDraft: boolean) => void;
  updateInvoice: (id: string, data: InvoiceFormData) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Ctx = createContext<InvoiceContextValue | null>(null);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      return Array.isArray(stored) && stored.length > 0 ? stored : sampleInvoices;
    } catch { return sampleInvoices; }
  });
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(THEME_KEY) as Theme) || 'light'
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.className = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const filteredInvoices = filterStatus.length === 0
    ? invoices
    : invoices.filter(inv => filterStatus.includes(inv.status));

  function addInvoice(data: InvoiceFormData, asDraft: boolean) {
    const items = processItems(data.items);
    setInvoices(prev => [...prev, {
      ...data,
      id: genId(),
      items,
      total: sumItems(items),
      paymentDue: addDays(data.createdAt, data.paymentTerms),
      paymentTerms: Number(data.paymentTerms),
      status: asDraft ? 'draft' : 'pending',
    }]);
  }

  function updateInvoice(id: string, data: InvoiceFormData) {
    const items = processItems(data.items);
    setInvoices(prev => prev.map(inv =>
      inv.id === id
        ? {
            ...inv, ...data, id, items,
            total: sumItems(items),
            paymentDue: addDays(data.createdAt, data.paymentTerms),
            paymentTerms: Number(data.paymentTerms),
          }
        : inv
    ));
  }

  function deleteInvoice(id: string) {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  }

  function markAsPaid(id: string) {
    setInvoices(prev => prev.map(inv =>
      inv.id === id ? { ...inv, status: 'paid' } : inv
    ));
  }

  return (
    <Ctx.Provider value={{
      invoices, filteredInvoices,
      filterStatus, setFilterStatus,
      addInvoice, updateInvoice, deleteInvoice, markAsPaid,
      theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useInvoices(): InvoiceContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useInvoices must be inside InvoiceProvider');
  return ctx;
}
