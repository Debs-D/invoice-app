import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../../context/InvoiceContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Modal from '../Modal/modal';
import type { Invoice, InvoiceStatus } from '../../types/invoice';

const statusMap: Record<InvoiceStatus, { bg: string; text: string; dot: string }> = {
  paid:    { bg: 'bg-[rgba(51,214,159,0.1)]',  text: 'text-[#33D69F]', dot: 'bg-[#33D69F]' },
  pending: { bg: 'bg-[rgba(255,143,0,0.1)]',   text: 'text-[#FF8F00]', dot: 'bg-[#FF8F00]' },
  draft:   {
    bg:   'bg-[rgba(55,59,83,0.1)] dark:bg-[rgba(223,227,250,0.1)]',
    text: 'text-[#373B53] dark:text-[#DFE3FA]',
    dot:  'bg-[#373B53] dark:bg-[#DFE3FA]',
  },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const s = statusMap[status] ?? statusMap.draft;
  return (
    <span className={`inline-flex min-h-[48px] items-center gap-2 min-w-[128px] justify-center px-5 py-3 rounded-xl font-bold leading-none ${s.bg} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} aria-hidden="true" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const btnBase = 'inline-flex min-h-[48px] items-center justify-center rounded-full font-bold text-[13px] tracking-[-0.25px] px-6 py-4 transition-colors duration-200 whitespace-nowrap border-0 cursor-pointer';

interface InvoiceDetailProps {
  onEdit: (invoice: Invoice) => void;
}

export default function InvoiceDetail({ onEdit }: InvoiceDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, deleteInvoice, markAsPaid } = useInvoices();
  const [showModal, setShowModal] = useState(false);

  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex flex-col items-center gap-4 pt-16">
        <p className="text-[#888EB0] font-medium">Invoice not found.</p>
        <button className={`${btnBase} bg-[#7C5DFA] text-white hover:bg-[#9277FF]`} onClick={() => navigate('/')}>
          Go back
        </button>
      </div>
    );
  }

  function handleDelete() {
    deleteInvoice(id!);
    navigate('/');
  }

  return (
    <div className="w-full max-w-[920px] mx-auto">
      {/* Back button */}
      <button
        className="flex items-center gap-6 font-bold text-[13px] tracking-[-0.25px] text-[#0C0E16] dark:text-white hover:text-[#888EB0] dark:hover:text-[#888EB0] transition-colors duration-200 mb-8 px-1 sm:px-0"
        onClick={() => navigate('/')}
      >
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
          <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Go back
      </button>

      {/* Status bar */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white dark:bg-[#1E2139] rounded-2xl px-7 py-6 md:px-10 lg:px-12 mb-8 shadow-[0_10px_24px_rgba(72,84,159,0.10)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.28)]">
        <div className="flex items-center justify-between md:justify-start gap-4 md:gap-5">
          <span className="text-[#888EB0] font-medium text-[13px]">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="hidden md:flex shrink-0 items-center justify-end gap-3 rounded-full bg-[#F9FAFE] dark:bg-[#141625] px-2 py-2">
          {invoice.status !== 'paid' && (
            <button
              className={`${btnBase} bg-transparent text-[#7E88C3] dark:text-[#DFE3FA] hover:bg-[#DFE3FA] dark:hover:bg-[#252945] dark:hover:text-white`}
              onClick={() => onEdit(invoice)}
            >
              Edit
            </button>
          )}
          <button
            className={`${btnBase} px-5 bg-[#EC5757] text-white hover:bg-[#FF9797] shadow-[0_10px_20px_rgba(236,87,87,0.22)]`}
            onClick={() => setShowModal(true)}
          >
            Delete
          </button>
          {invoice.status === 'pending' && (
            <button
              className={`${btnBase} px-6 bg-[#7C5DFA] text-white hover:bg-[#9277FF] shadow-[0_12px_24px_rgba(124,93,250,0.22)]`}
              onClick={() => markAsPaid(id!)}
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice body */}
      <div className="bg-white dark:bg-[#1E2139] rounded-2xl p-8 md:p-10 lg:p-12 shadow-[0_10px_24px_rgba(72,84,159,0.10)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.28)]">
        <div className="w-full max-w-[820px] mx-auto">

          {/* Top row: ID + description / sender address */}
          <div className="flex flex-col gap-8 md:flex-row md:justify-between mb-10 md:mb-12">
            <div className="mb-8 md:mb-0">
              <p className="font-bold text-[13px] tracking-[-0.25px] text-[#0C0E16] dark:text-white">
                <span className="text-[#888EB0]">#</span>{invoice.id}
              </p>
              <p className="text-[#888EB0] font-medium text-[13px] mt-1">{invoice.description}</p>
            </div>
            <address className="not-italic flex flex-col text-[#888EB0] font-medium text-[13px] leading-7 md:text-right md:max-w-[220px] md:shrink-0">
              <span>{invoice.senderAddress?.street}</span>
              <span>{invoice.senderAddress?.city}</span>
              <span>{invoice.senderAddress?.postCode}</span>
              <span>{invoice.senderAddress?.country}</span>
            </address>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 gap-y-10 md:grid-cols-[180px_minmax(240px,1fr)_190px] md:gap-x-10 mb-12 md:mb-16">
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[#888EB0] font-medium text-[13px] mb-[13px]">Invoice Date</p>
                <p className="font-bold text-[15px] tracking-[-0.31px] text-[#0C0E16] dark:text-white">
                  {formatDate(invoice.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-[#888EB0] font-medium text-[13px] mb-[13px]">Payment Due</p>
                <p className="font-bold text-[15px] tracking-[-0.31px] text-[#0C0E16] dark:text-white">
                  {formatDate(invoice.paymentDue)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[#888EB0] font-medium text-[13px] mb-[13px]">Bill To</p>
              <p className="font-bold text-[15px] tracking-[-0.31px] text-[#0C0E16] dark:text-white mb-2">
                {invoice.clientName}
              </p>
              <address className="not-italic flex flex-col text-[#888EB0] font-medium text-[13px] leading-7">
                <span>{invoice.clientAddress?.street}</span>
                <span>{invoice.clientAddress?.city}</span>
                <span>{invoice.clientAddress?.postCode}</span>
                <span>{invoice.clientAddress?.country}</span>
              </address>
            </div>

            <div>
              <p className="text-[#888EB0] font-medium text-[13px] mb-[13px]">Sent To</p>
              <p className="font-bold text-[15px] tracking-[-0.31px] text-[#0C0E16] dark:text-white break-all">
                {invoice.clientEmail}
              </p>
            </div>
          </div>

          {/* Items table */}
          <div className="rounded-xl overflow-hidden">
            <div className="bg-[#F9FAFE] dark:bg-[#252945] px-7 md:px-8 lg:px-10 pt-7 md:pt-8 pb-8">
              <div className="hidden md:grid md:grid-cols-[minmax(220px,1fr)_64px_128px_128px] md:gap-x-6 md:mb-8">
                <span className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[13px]">Item Name</span>
                <span className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[13px] text-center">QTY.</span>
                <span className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[13px] text-right">Price</span>
                <span className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[13px] text-right">Total</span>
              </div>

              <div className="flex flex-col gap-7">
                {invoice.items.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center md:hidden">
                      <div>
                        <p className="font-bold text-[13px] tracking-[-0.25px] text-[#0C0E16] dark:text-white mb-2">
                          {item.name}
                        </p>
                        <p className="text-[#888EB0] font-bold text-[13px]">
                          {item.quantity} &times; {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-bold text-[13px] tracking-[-0.25px] text-[#0C0E16] dark:text-white">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                    <div className="hidden md:grid md:grid-cols-[minmax(220px,1fr)_64px_128px_128px] md:items-center md:gap-x-6">
                      <span className="font-bold text-[13px] tracking-[-0.25px] text-[#0C0E16] dark:text-white">{item.name}</span>
                      <span className="text-[#888EB0] font-bold text-[13px] text-center">{item.quantity}</span>
                      <span className="text-[#888EB0] font-bold text-[13px] text-right">{formatCurrency(item.price)}</span>
                      <span className="font-bold text-[13px] tracking-[-0.25px] text-[#0C0E16] dark:text-white text-right">{formatCurrency(item.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#373B53] dark:bg-[#0C0E16] rounded-b-xl px-7 md:px-8 lg:px-10 py-8 flex items-center justify-between">
              <span className="text-white font-medium text-[13px]">Amount Due</span>
              <span className="text-white font-bold text-[24px] md:text-[28px] tracking-[-0.63px]">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile action bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-[#1E2139] flex flex-wrap items-center justify-end gap-2 px-6 py-5 shadow-[0_-8px_24px_rgba(72,84,159,0.08)]">
        {invoice.status !== 'paid' && (
          <button
            className={`${btnBase} bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] hover:bg-[#DFE3FA]`}
            onClick={() => onEdit(invoice)}
          >
            Edit
          </button>
        )}
        <button
          className={`${btnBase} bg-[#EC5757] text-white hover:bg-[#FF9797]`}
          onClick={() => setShowModal(true)}
        >
          Delete
        </button>
        {invoice.status === 'pending' && (
          <button
            className={`${btnBase} bg-[#7C5DFA] text-white hover:bg-[#9277FF]`}
            onClick={() => markAsPaid(id!)}
          >
            Mark as Paid
          </button>
        )}
      </div>

      {showModal && (
        <Modal id={invoice.id} onConfirm={handleDelete} onCancel={() => setShowModal(false)} />
      )}
    </div>
  );
}
