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

    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F8FB] dark:bg-[#141625] transition-colors duration-300">
      <Sidebar />
      <main className="min-w-0 flex-1 flex flex-col items-center px-6 sm:px-10 md:px-16 lg:px-20">
        <div className="w-full min-w-0 max-w-[960px] flex flex-col pt-14 md:pt-[104px] pb-14 md:pb-24">
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
