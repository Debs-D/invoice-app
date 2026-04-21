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
    <span className={`inline-flex items-center gap-2 min-w-[104px] justify-center px-4 py-[10px] rounded-md font-bold ${s.bg} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} aria-hidden="true" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const btnBase = 'inline-flex items-center justify-center rounded-3xl font-bold text-[12px] tracking-[-0.25px] px-6 py-[17px] transition-colors duration-200 whitespace-nowrap border-0 cursor-pointer';

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
    <div className="pb-28 md:pb-4">
      {/* Back button */}
      <button
        className="flex items-center gap-6 font-bold text-[12px] tracking-[-0.25px] text-[#0C0E16] dark:text-white hover:text-[#888EB0] dark:hover:text-[#888EB0] transition-colors duration-200 mb-8"
        onClick={() => navigate('/')}
      >
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
          <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Go back
      </button>

      {/* Status bar */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1E2139] rounded-lg px-8 py-5 mb-4 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)] dark:shadow-none">
        <div className="flex items-center gap-4 md:gap-5">
          <span className="text-[#888EB0] font-medium text-[12px]">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="hidden md:flex items-center gap-2">
          {invoice.status !== 'paid' && (
            <button
              className={`${btnBase} bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] hover:bg-[#DFE3FA] dark:hover:bg-[#DFE3FA] dark:hover:text-[#0C0E16]`}
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
      </div>

      {/* Invoice body */}
      <div className="bg-white dark:bg-[#1E2139] rounded-lg p-6 md:p-12 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)] dark:shadow-none">

        {/* Top row: ID + description / sender address */}
        <div className="flex flex-col md:flex-row md:justify-between mb-[31px] md:mb-[21px]">
          <div className="mb-8 md:mb-0">
            <p className="font-bold text-[12px] tracking-[-0.25px] text-[#0C0E16] dark:text-white">
              <span className="text-[#888EB0]">#</span>{invoice.id}
            </p>
            <p className="text-[#888EB0] font-medium text-[12px] mt-1">{invoice.description}</p>
          </div>
          <address className="not-italic flex flex-col text-[#888EB0] font-medium text-[12px] leading-[18px] md:text-right">
            <span>{invoice.senderAddress?.street}</span>
            <span>{invoice.senderAddress?.city}</span>
            <span>{invoice.senderAddress?.postCode}</span>
            <span>{invoice.senderAddress?.country}</span>
          </address>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 mb-[38px] md:mb-[48px]">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-[#888EB0] font-medium text-[12px] mb-[13px]">Invoice Date</p>
              <p className="font-bold text-[15px] tracking-[-0.31px] text-[#0C0E16] dark:text-white">
                {formatDate(invoice.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-[#888EB0] font-medium text-[12px] mb-[13px]">Payment Due</p>
              <p className="font-bold text-[15px] tracking-[-0.31px] text-[#0C0E16] dark:text-white">
                {formatDate(invoice.paymentDue)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[#888EB0] font-medium text-[12px] mb-[13px]">Bill To</p>
            <p className="font-bold text-[15px] tracking-[-0.31px] text-[#0C0E16] dark:text-white mb-2">
              {invoice.clientName}
            </p>
            <address className="not-italic flex flex-col text-[#888EB0] font-medium text-[12px] leading-[18px]">
              <span>{invoice.clientAddress?.street}</span>
              <span>{invoice.clientAddress?.city}</span>
              <span>{invoice.clientAddress?.postCode}</span>
              <span>{invoice.clientAddress?.country}</span>
            </address>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-[#888EB0] font-medium text-[12px] mb-[13px]">Sent To</p>
            <p className="font-bold text-[15px] tracking-[-0.31px] text-[#0C0E16] dark:text-white break-all">
              {invoice.clientEmail}
            </p>
          </div>
        </div>

        {/* Items table */}
        <div className="rounded-lg overflow-hidden">
          <div className="bg-[#F9FAFE] dark:bg-[#252945] px-6 md:px-8 pt-6 md:pt-8 pb-8">
            <div className="hidden md:grid md:grid-cols-[1fr_64px_128px_128px] md:mb-[31px]">
              <span className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[12px]">Item Name</span>
              <span className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[12px] text-center">QTY.</span>
              <span className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[12px] text-right">Price</span>
              <span className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[12px] text-right">Total</span>
            </div>

            <div className="flex flex-col gap-6">
              {invoice.items.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center md:hidden">
                    <div>
                      <p className="font-bold text-[12px] tracking-[-0.25px] text-[#0C0E16] dark:text-white mb-2">
                        {item.name}
                      </p>
                      <p className="text-[#888EB0] font-bold text-[12px]">
                        {item.quantity} &times; {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-bold text-[12px] tracking-[-0.25px] text-[#0C0E16] dark:text-white">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                  <div className="hidden md:grid md:grid-cols-[1fr_64px_128px_128px] md:items-center">
                    <span className="font-bold text-[12px] tracking-[-0.25px] text-[#0C0E16] dark:text-white">{item.name}</span>
                    <span className="text-[#888EB0] font-bold text-[12px] text-center">{item.quantity}</span>
                    <span className="text-[#888EB0] font-bold text-[12px] text-right">{formatCurrency(item.price)}</span>
                    <span className="font-bold text-[12px] tracking-[-0.25px] text-[#0C0E16] dark:text-white text-right">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#373B53] dark:bg-[#0C0E16] rounded-b-lg px-6 md:px-8 py-[27px] flex items-center justify-between">
            <span className="text-white font-medium text-[12px]">Amount Due</span>
            <span className="text-white font-bold text-[24px] md:text-[28px] tracking-[-0.63px]">
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile action bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-[#1E2139] flex items-center justify-end gap-2 px-6 py-5 shadow-[0_-8px_24px_rgba(72,84,159,0.08)]">
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
