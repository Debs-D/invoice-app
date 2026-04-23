import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '../../context/InvoiceContext';
import Filter from '../Filter/filter';
import { formatCurrency, formatDate } from '../../utils/helpers';
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-[72px]">
      <svg width="242" height="200" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-[66px]">
        <path opacity="0.2" d="M121 182c66.837 0 121-9.178 121-20.5S187.837 141 121 141 0 150.178 0 161.5 54.163 182 121 182Z" fill="#DFE3FA"/>
        <circle cx="121" cy="89" r="79" stroke="#DFE3FA" strokeWidth="2" opacity="0.3"/>
        <circle cx="121" cy="89" r="63" stroke="#DFE3FA" strokeWidth="2" opacity="0.3"/>
        <circle cx="121" cy="89" r="47" stroke="#DFE3FA" strokeWidth="2" opacity="0.3"/>
        <rect x="55" y="104" width="132" height="85" rx="6" fill="#F9FAFE" stroke="#DFE3FA" strokeWidth="1.5"/>
        <path d="M55 110l66 42 66-42" stroke="#DFE3FA" strokeWidth="1.5" fill="none"/>
        <ellipse cx="121" cy="95" rx="20" ry="22" fill="#9277FF"/>
        <circle cx="121" cy="62" r="16" fill="#9277FF"/>
        <path d="M107 58c0-7.732 6.268-14 14-14h0c7.732 0 14 6.268 14 14v4c0 0-4-3-14-3s-14 3-14 3v-4Z" fill="#7C5DFA"/>
        <path d="M101 85L87 65" stroke="#9277FF" strokeWidth="8" strokeLinecap="round"/>
        <path d="M141 85L155 65" stroke="#9277FF" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="84" cy="62" r="5" fill="#7C5DFA"/>
        <path d="M84 56v-6M84 74v-6M78 62H72M96 62h-6M79.5 57.5l-4.25-4.25M92.75 70.75l-4.25-4.25M79.5 66.5l-4.25 4.25M92.75 53.25l-4.25 4.25" stroke="#7C5DFA" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="158" cy="62" r="5" fill="#7C5DFA"/>
        <path d="M158 56v-6M158 74v-6M152 62h-6M170 62h-6M153.5 57.5l-4.25-4.25M166.75 70.75l-4.25-4.25M153.5 66.5l-4.25 4.25M166.75 53.25l-4.25 4.25" stroke="#7C5DFA" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M63 38l18 8-5 4 2 8-6-5-9 3V38Z" fill="#7C5DFA" opacity="0.6"/>
        <path d="M63 38l9 10" stroke="#7C5DFA" strokeWidth="1" opacity="0.6"/>
      </svg>

      <h2 className="text-[20px] font-bold tracking-[-0.63px] text-[#0C0E16] dark:text-white mb-[23px]">
        There is nothing here
      </h2>
      <p className="text-[#888EB0] font-medium leading-[15px] max-w-[220px]">
        Create an invoice by clicking the{' '}
        <strong className="text-[#0C0E16] dark:text-white">New Invoice</strong>{' '}
        button and get started
      </p>
    </div>
  );
}

interface InvoiceListProps {
  onNewInvoice: () => void;
}

export default function InvoiceList({ onNewInvoice }: InvoiceListProps) {
  const { filteredInvoices, filterStatus } = useInvoices();
  const navigate = useNavigate();

  const count = filteredInvoices.length;
  const subtitle = filterStatus.length > 0
    ? `${count} invoice${count !== 1 ? 's' : ''}`
    : `There are ${count} total invoice${count !== 1 ? 's' : ''}`;

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[820px] flex-col px-4  sm:px-6 md:px-0" >
      {/* Header */}
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:mb-12">
        <div className="space-y-3">
          <h1 className="text-[32px] md:text-[36px] font-bold tracking-[-1px] text-[#0C0E16] dark:text-white leading-[1.05]">
            Invoices
          </h1>
          <p className="text-[#888EB0] font-medium text-[13px] leading-[1.4]">
            {count === 0 ? 'No invoices' : subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end md:gap-6">
          <Filter />

          <button
            onClick={onNewInvoice}
            aria-label="Create new invoice"
            className="
              flex min-w-[140px] items-center justify-center gap-3 shadow-[0_10px_20px_rgba(124,93,250,0.18)]
              bg-[#7C5DFA] hover:bg-[#9277FF]
              text-white font-bold text-[13px] md:text-[13px] tracking-[-0.25px]
              rounded-full pl-2 pr-4 md:pr-5 py-2
              transition-all duration-200
            "
          >
            <span className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-white rounded-full shrink-0">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path d="M6.313 0v4.688H11v1.624H6.313V11H4.687V6.312H0V4.688h4.688V0z" fill="#7C5DFA"/>
              </svg>
            </span>
            <span className="hidden md:inline">New Invoice</span>
            <span className="md:hidden">New</span>
          </button>
        </div>
      </header>

      {/* Invoice list or empty state */}
      {filteredInvoices.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <EmptyState />
        </div>
      ) : (
        <ul className="flex flex-col gap-4 " aria-label="Invoice list">
          {filteredInvoices.map((inv: Invoice) => (
            <li key={inv.id}>
              <button
                className="
                  w-full min-h-[96px] text-left
                  bg-white dark:bg-[#1E2139]
                  rounded-xl border border-transparent
                  hover:border-[#7C5DFA] dark:hover:border-[#7C5DFA]
                  px-6 py-6 sm:px-7 sm:py-7 md:px-8 md:py-7
                  transition-all duration-200
                  shadow-[0_10px_24px_rgba(72,84,159,0.10)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.28)]
                "
                onClick={() => navigate(`/invoice/${inv.id}`)}
                aria-label={`Invoice ${inv.id}, due ${formatDate(inv.paymentDue)}, ${formatCurrency(inv.total)}, ${inv.status}`}
              >
                {/* Mobile layout */}
                <div className="lg:hidden">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <span className="font-bold text-[15px] tracking-[-0.25px] leading-none text-[#0C0E16] dark:text-white">
                      <span className="text-[#7E88C3]">#</span>{inv.id}
                    </span>
                    <span className="text-right text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[13px] leading-none">{inv.clientName}</span>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[13px] leading-none">
                        Due {formatDate(inv.paymentDue)}
                      </p>
                      <p className="font-bold text-[16px] tracking-[-0.5px] leading-none text-[#0C0E16] dark:text-white">
                        {formatCurrency(inv.total)}
                      </p>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:grid lg:grid-cols-[88px_128px_1fr_112px_128px_14px] lg:min-h-[48px] lg:items-center lg:gap-x-4">
                  <span className="font-bold text-[15px] tracking-[-0.25px] leading-none text-[#0C0E16] dark:text-white">
                    <span className="text-[#7E88C3]">#</span>{inv.id}
                  </span>
                  <span className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[13px] leading-none">Due {formatDate(inv.paymentDue)}</span>
                  <span className="text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[13px] leading-none">{inv.clientName}</span>
                  <span className="font-bold text-[15px] tracking-[-0.3px] leading-none text-[#0C0E16] dark:text-white text-right">
                    {formatCurrency(inv.total)}
                  </span>
                  <StatusBadge status={inv.status} />
                  <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true" className="justify-self-end">
                    <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
