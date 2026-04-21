import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext';
import Sidebar from './components/Sidebar/sidebar';
import InvoiceList from './components/InvoiceList/invoiceList';
import InvoiceDetail from './components/InvoiceDetail/invoiceDetail';
import InvoiceForm from './components/InvoiceForm/invoiceForm';
import type { Invoice } from './types/invoice';

function AppInner() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  function openNew() { setEditingInvoice(null); setFormOpen(true); }
  function openEdit(invoice: Invoice) { setEditingInvoice(invoice); setFormOpen(true); }
  function closeForm() { setFormOpen(false); setEditingInvoice(null); }

  return (
    <div className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] transition-colors duration-300">
      <Sidebar />
      <main className="ml-0 md:ml-[103px] pt-[104px] md:pt-[72px] pb-20 md:pb-16 px-6 md:px-10 lg:px-[72px]">
        <div className="max-w-[780px] mx-auto">
          <Routes>
            <Route path="/" element={<InvoiceList onNewInvoice={openNew} />} />
            <Route path="/invoice/:id" element={<InvoiceDetail onEdit={openEdit} />} />
          </Routes>
        </div>
      </main>
      {formOpen && <InvoiceForm invoice={editingInvoice} onClose={closeForm} />}
    </div>
  );
}

export default function App() {
  return (
    <InvoiceProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </InvoiceProvider>
  );
}
