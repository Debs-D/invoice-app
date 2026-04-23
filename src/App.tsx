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

    <div className="app-root">
      <Sidebar />
      <main className="app-main">
        <div className="app-container">
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
