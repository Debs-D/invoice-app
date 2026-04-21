import React, { useState, useEffect, useRef } from 'react';
import { useInvoices } from '../../context/InvoiceContext';
import { validateInvoice } from '../../utils/helpers';
import type { Invoice, InvoiceFormData } from '../../types/invoice';

const EMPTY_ITEM = { name: '', quantity: '', price: '' };

const DEFAULT_FORM: InvoiceFormData = {
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientName: '', clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  createdAt: new Date().toISOString().split('T')[0],
  paymentTerms: '30',
  description: '',
  items: [{ ...EMPTY_ITEM }],
};

function get(obj: Record<string, unknown>, path: string): string {
  return (path.split('.').reduce((o: unknown, k: string) => {
    if (o && typeof o === 'object') return (o as Record<string, unknown>)[k];
    return undefined;
  }, obj) as string) ?? '';
}

const inputBase =
  'w-full bg-white dark:bg-[#252945] border border-[#DFE3FA] dark:border-[#252945] rounded px-5 py-4 font-bold text-[12px] tracking-[-0.25px] text-[#0C0E16] dark:text-white placeholder:text-[#888EB0]/50 focus:outline-none focus:border-[#7C5DFA] transition-colors duration-200';
const labelBase = 'text-[#7E88C3] dark:text-[#DFE3FA] font-medium text-[12px]';
const sectionTitle = 'text-[#7C5DFA] font-bold text-[12px] tracking-[-0.25px] mb-6 block';

interface InvoiceFormProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export default function InvoiceForm({ invoice, onClose }: InvoiceFormProps) {
  const { addInvoice, updateInvoice } = useInvoices();
  const isEdit = !!invoice;

  const [form, setForm] = useState<InvoiceFormData>(() => {
    if (isEdit && invoice) {
      return {
        ...invoice,
        senderAddress: { ...invoice.senderAddress },
        clientAddress: { ...invoice.clientAddress },
        items: invoice.items.map(i => ({ ...i, quantity: String(i.quantity), price: String(i.price) })),
        paymentTerms: String(invoice.paymentTerms),
      };
    }
    return {
      ...DEFAULT_FORM,
      senderAddress: { ...DEFAULT_FORM.senderAddress },
      clientAddress: { ...DEFAULT_FORM.clientAddress },
      items: [{ ...EMPTY_ITEM }],
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function setField(path: string, value: string) {
    setForm(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as InvoiceFormData;
      const keys = path.split('.');
      let cur: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]] as Record<string, unknown>;
      cur[keys[keys.length - 1]] = value;
      return next;
    });
    setErrors(prev => { const n = { ...prev }; delete n[path]; return n; });
  }

  function setItem(index: number, field: string, value: string) {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }));
    setErrors(prev => { const n = { ...prev }; delete n[`items.${index}.${field}`]; return n; });
  }

  function addItem() {
    setForm(prev => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM }] }));
  }

  function removeItem(index: number) {
    setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  }

  function handleSubmit(asDraft = false) {
    if (!asDraft) {
      const errs = validateInvoice(form);
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    }
    isEdit && invoice ? updateInvoice(invoice.id, form) : addInvoice(form, asDraft);
    onClose();
  }

  // Plain render helper (not a component) to avoid React state reset on re-render.
  function field({ label, path, type = 'text', placeholder = '' }: {
    label: string; path: string; type?: string; placeholder?: string;
  }) {
    const err = errors[path];
    return (
      <div key={path} className="flex flex-col gap-[10px]">
        <div className="flex justify-between items-center">
          <label htmlFor={path} className={`${labelBase} ${err ? '!text-[#EC5757]' : ''}`}>
            {label}
          </label>
          {err && <span className="text-[#EC5757] font-semibold text-[10px]">{err}</span>}
        </div>
        <input
          id={path}
          type={type}
          className={`${inputBase} ${err ? '!border-[#EC5757] focus:!border-[#EC5757]' : ''}`}
          placeholder={placeholder}
          value={get(form as unknown as Record<string, unknown>, path) || ''}
          onChange={e => setField(path, e.target.value)}
          ref={path === 'senderAddress.street' ? firstInputRef : undefined}
        />
      </div>
    );
  }

  return (
    <>
      {/* Full-screen overlay — above sidebar (z-40) */}
      <div
        className="fixed inset-0 z-[80] bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered modal container — on desktop offset by sidebar width so it centers in the content area */}
      <div
        className="fixed inset-0 md:left-[103px] z-[90] flex items-center justify-center p-0 md:p-8"
        aria-hidden="true"
      >
        {/* Panel — intercepts clicks so they don't close the modal */}
        <div
          className="
            relative flex flex-col
            w-full h-full
            md:w-[616px] md:h-auto md:max-h-[90vh]
            bg-[#F8F8FB] dark:bg-[#141625]
            md:rounded-2xl
            overflow-hidden
          "
          role="dialog"
          aria-modal="true"
          aria-label={isEdit ? `Edit Invoice #${invoice?.id}` : 'New Invoice'}
          onClick={e => e.stopPropagation()}
        >
          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 md:px-14 pt-[88px] md:pt-14 pb-8">
            <h2 className="text-[24px] font-bold tracking-[-0.5px] text-[#0C0E16] dark:text-white mb-[46px]">
              {isEdit ? (
                <>Edit <span className="text-[#888EB0]">#</span>{invoice?.id}</>
              ) : 'New Invoice'}
            </h2>

            <div className="flex flex-col gap-10">
              {/* Bill From */}
              <fieldset className="border-none p-0 m-0">
                <legend className={sectionTitle}>Bill From</legend>
                <div className="flex flex-col gap-6">
                  {field({ label: 'Street Address', path: 'senderAddress.street' })}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {field({ label: 'City', path: 'senderAddress.city' })}
                    {field({ label: 'Post Code', path: 'senderAddress.postCode' })}
                    <div className="col-span-2 md:col-span-1">
                      {field({ label: 'Country', path: 'senderAddress.country' })}
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Bill To */}
              <fieldset className="border-none p-0 m-0">
                <legend className={sectionTitle}>Bill To</legend>
                <div className="flex flex-col gap-6">
                  {field({ label: "Client's Name", path: 'clientName' })}
                  {field({ label: "Client's Email", path: 'clientEmail', type: 'email', placeholder: 'e.g. email@example.com' })}
                  {field({ label: 'Street Address', path: 'clientAddress.street' })}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {field({ label: 'City', path: 'clientAddress.city' })}
                    {field({ label: 'Post Code', path: 'clientAddress.postCode' })}
                    <div className="col-span-2 md:col-span-1">
                      {field({ label: 'Country', path: 'clientAddress.country' })}
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Dates & Terms */}
              <fieldset className="border-none p-0 m-0">
                <legend className="sr-only">Invoice Details</legend>
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-[10px]">
                      <div className="flex justify-between items-center">
                        <label htmlFor="createdAt" className={`${labelBase} ${errors.createdAt ? '!text-[#EC5757]' : ''}`}>
                          Invoice Date
                        </label>
                        {errors.createdAt && (
                          <span className="text-[#EC5757] font-semibold text-[10px]">{errors.createdAt}</span>
                        )}
                      </div>
                      <input
                        id="createdAt"
                        type="date"
                        className={`${inputBase} ${errors.createdAt ? '!border-[#EC5757] focus:!border-[#EC5757]' : ''}`}
                        value={form.createdAt}
                        onChange={e => setField('createdAt', e.target.value)}
                        disabled={isEdit}
                      />
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <label htmlFor="paymentTerms" className={labelBase}>Payment Terms</label>
                      <select
                        id="paymentTerms"
                        className={inputBase}
                        value={form.paymentTerms}
                        onChange={e => setField('paymentTerms', e.target.value)}
                      >
                        <option value="1">Net 1 Day</option>
                        <option value="7">Net 7 Days</option>
                        <option value="14">Net 14 Days</option>
                        <option value="30">Net 30 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <div className="flex justify-between items-center">
                      <label htmlFor="description" className={`${labelBase} ${errors.description ? '!text-[#EC5757]' : ''}`}>
                        Project Description
                      </label>
                      {errors.description && (
                        <span className="text-[#EC5757] font-semibold text-[10px]">{errors.description}</span>
                      )}
                    </div>
                    <input
                      id="description"
                      type="text"
                      className={`${inputBase} ${errors.description ? '!border-[#EC5757] focus:!border-[#EC5757]' : ''}`}
                      placeholder="e.g. Graphic Design Service"
                      value={form.description}
                      onChange={e => setField('description', e.target.value)}
                    />
                  </div>
                </div>
              </fieldset>

              {/* Item List */}
              <div>
                <h3 className="text-[18px] font-bold tracking-[-0.38px] text-[#777F98] mb-6">Item List</h3>

                {form.items.length > 0 && (
                  <div className="hidden md:grid md:grid-cols-[1fr_48px_100px_64px_18px] md:gap-x-4 md:mb-4">
                    <span className={labelBase}>Item Name</span>
                    <span className={`${labelBase} text-center`}>Qty.</span>
                    <span className={`${labelBase} text-right`}>Price</span>
                    <span className={`${labelBase} text-right`}>Total</span>
                    <span aria-hidden="true" />
                  </div>
                )}

                <div className="flex flex-col gap-12 md:gap-4">
                  {form.items.map((item, i) => {
                    const total = ((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2);
                    return (
                      <div key={i} className="flex flex-col md:grid md:grid-cols-[1fr_48px_100px_64px_18px] md:items-center md:gap-x-4 gap-6">
                        <div className="flex flex-col gap-[10px]">
                          <label htmlFor={`item-name-${i}`} className={`${labelBase} md:sr-only`}>Item Name</label>
                          <input
                            id={`item-name-${i}`}
                            type="text"
                            className={`${inputBase} ${errors[`items.${i}.name`] ? '!border-[#EC5757] focus:!border-[#EC5757]' : ''}`}
                            placeholder="Item name"
                            value={item.name}
                            onChange={e => setItem(i, 'name', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-[48px_1fr_64px_18px] md:contents items-center gap-x-4">
                          <div className="flex flex-col gap-[10px]">
                            <label htmlFor={`item-qty-${i}`} className={`${labelBase} md:sr-only`}>Qty.</label>
                            <input
                              id={`item-qty-${i}`}
                              type="number"
                              min="1"
                              className={`${inputBase} text-center ${errors[`items.${i}.quantity`] ? '!border-[#EC5757] focus:!border-[#EC5757]' : ''}`}
                              value={item.quantity}
                              onChange={e => setItem(i, 'quantity', e.target.value)}
                            />
                          </div>

                          <div className="flex flex-col gap-[10px]">
                            <label htmlFor={`item-price-${i}`} className={`${labelBase} md:sr-only`}>Price</label>
                            <input
                              id={`item-price-${i}`}
                              type="number"
                              min="0"
                              step="0.01"
                              className={`${inputBase} ${errors[`items.${i}.price`] ? '!border-[#EC5757] focus:!border-[#EC5757]' : ''}`}
                              value={item.price}
                              onChange={e => setItem(i, 'price', e.target.value)}
                            />
                          </div>

                          <div className="flex flex-col justify-end gap-[10px] h-full md:justify-center">
                            <span className={`${labelBase} md:sr-only`} aria-hidden="true">Total</span>
                            <span className="font-bold text-[#888EB0] text-[12px] tracking-[-0.25px] py-4 md:text-right">
                              {total}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="flex items-end justify-center pb-[18px] md:pb-0 md:items-center text-[#888EB0] hover:text-[#EC5757] transition-colors duration-200"
                            onClick={() => removeItem(i)}
                            aria-label={`Remove item ${item.name || i + 1}`}
                          >
                            <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                              <path fillRule="evenodd" clipRule="evenodd" d="M8.4 0l1 1H13v2H0V1h3.6L4.6 0h3.8zM1 14c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2V4H1v10z" fill="currentColor"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {errors.items && (
                  <p className="text-[#EC5757] font-semibold text-[10px] mt-3">{errors.items}</p>
                )}

                <button
                  type="button"
                  onClick={addItem}
                  className="mt-6 w-full py-[18px] rounded-full font-bold text-[12px] tracking-[-0.25px] bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] hover:bg-[#DFE3FA] dark:hover:bg-[#1E2139] transition-colors duration-200"
                >
                  + Add New Item
                </button>
              </div>

              {Object.keys(errors).length > 0 && (
                <p className="text-[#EC5757] font-semibold text-[10px]" role="alert">
                  — All fields must be added
                </p>
              )}
            </div>
          </div>

          {/* Sticky action bar */}
          <div className="shrink-0 px-6 md:px-14 py-6 bg-white dark:bg-[#1E2139] shadow-[0_-8px_24px_rgba(72,84,159,0.1)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.4)] flex items-center gap-3">
            {!isEdit ? (
              <>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full font-bold text-[12px] tracking-[-0.25px] px-7 py-[17px] bg-[#F9FAFE] text-[#7E88C3] hover:bg-[#DFE3FA] dark:bg-[#252945] dark:text-[#DFE3FA] dark:hover:bg-[#DFE3FA] dark:hover:text-[#0C0E16] transition-colors duration-200 border-0 cursor-pointer"
                  onClick={onClose}
                >
                  Discard
                </button>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full font-bold text-[12px] tracking-[-0.25px] px-7 py-[17px] bg-[#373B53] text-[#DFE3FA] hover:bg-[#0C0E16] transition-colors duration-200 border-0 cursor-pointer"
                    onClick={() => handleSubmit(true)}
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full font-bold text-[12px] tracking-[-0.25px] px-7 py-[17px] bg-[#7C5DFA] text-white hover:bg-[#9277FF] transition-colors duration-200 border-0 cursor-pointer"
                    onClick={() => handleSubmit(false)}
                  >
                    Save &amp; Send
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full font-bold text-[12px] tracking-[-0.25px] px-7 py-[17px] bg-[#F9FAFE] text-[#7E88C3] hover:bg-[#DFE3FA] dark:bg-[#252945] dark:text-[#DFE3FA] dark:hover:bg-[#DFE3FA] dark:hover:text-[#0C0E16] transition-colors duration-200 border-0 cursor-pointer"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full font-bold text-[12px] tracking-[-0.25px] px-7 py-[17px] bg-[#7C5DFA] text-white hover:bg-[#9277FF] transition-colors duration-200 ml-auto border-0 cursor-pointer"
                  onClick={() => handleSubmit(false)}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
