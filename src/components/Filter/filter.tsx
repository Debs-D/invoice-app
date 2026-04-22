import React, { useState, useRef, useEffect } from 'react';
import { useInvoices } from '../../context/InvoiceContext';

const STATUSES = ['draft', 'pending', 'paid'] as const;

export default function Filter() {
  const { filterStatus, setFilterStatus } = useInvoices();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function toggle(status: string) {
    setFilterStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  }

  function showAll() {
    setFilterStatus([]);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-3 font-bold text-[13px] tracking-[-0.25px] text-[#0C0E16] dark:text-white hover:text-[#7C5DFA] dark:hover:text-[#7C5DFA] transition-colors duration-200"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="hidden md:inline">Filter by status</span>
        <span className="md:hidden">Filter</span>
        <svg
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          width="11" height="7" viewBox="0 0 11 7" fill="none"
        >
          <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="
            absolute top-[calc(100%+23px)] left-1/2 -translate-x-1/2 z-30
            w-[192px] p-6
            bg-white dark:bg-[#252945]
            rounded-lg
            shadow-[0_10px_20px_rgba(72,84,159,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.4)]
            flex flex-col gap-4
          "
          role="listbox"
          aria-label="Filter invoices by status"
        >
          <label className="flex items-center gap-[13px] cursor-pointer group">
            <input
              type="checkbox"
              className="sr-only"
              checked={filterStatus.length === 0}
              onChange={showAll}
            />
            <span
              className={`
                w-4 h-4 rounded-sm flex items-center justify-center shrink-0
                border-2 transition-all duration-150
                ${filterStatus.length === 0
                  ? 'bg-[#7C5DFA] border-[#7C5DFA]'
                  : 'border-[#DFE3FA] dark:border-[#4E527A] group-hover:border-[#7C5DFA]'
                }
              `}
              aria-hidden="true"
            >
              {filterStatus.length === 0 && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l2.667 2.667L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className="font-bold text-[13px] tracking-[-0.25px] text-[#0C0E16] dark:text-white">
              All
            </span>
          </label>

          {STATUSES.map(status => (
            <label
              key={status}
              className="flex items-center gap-[13px] cursor-pointer group"
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={filterStatus.includes(status)}
                onChange={() => toggle(status)}
              />
              <span
                className={`
                  w-4 h-4 rounded-sm flex items-center justify-center shrink-0
                  border-2 transition-all duration-150
                  ${filterStatus.includes(status)
                    ? 'bg-[#7C5DFA] border-[#7C5DFA]'
                    : 'border-[#DFE3FA] dark:border-[#4E527A] group-hover:border-[#7C5DFA]'
                  }
                `}
                aria-hidden="true"
              >
                {filterStatus.includes(status) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.667 2.667L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="font-bold text-[13px] tracking-[-0.25px] text-[#0C0E16] dark:text-white capitalize">
                {status}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
