import React from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  id: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({ id, onConfirm, onCancel }: ModalProps) {
  return (
    <ReactModal
      isOpen={true}
      onRequestClose={onCancel}
      contentLabel="Confirm Deletion"
      className="
        bg-white dark:bg-[#1E2139]
        rounded-2xl p-10 md:p-14
        w-[calc(100%-32px)] max-w-[560px]
        outline-none mx-auto shadow-[0_30px_60px_rgba(12,14,22,0.25)]
      "
      overlayClassName="fixed inset-0 z-[200] flex items-center justify-center px-4 sm:px-6 bg-[rgba(0,0,0,0.5)]"
    >
      <h2 className="font-bold text-[24px] tracking-[-0.5px] text-[#0C0E16] dark:text-white mb-5">
        Confirm Deletion
      </h2>
      <p className="text-[#888EB0] font-medium text-[13px] leading-[22px] mb-12">
        Are you sure you want to delete invoice{' '}
        <strong className="text-[#0C0E16] dark:text-white">#{id}</strong>?{' '}
        This action cannot be undone.
      </p>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-full font-bold text-[13px] tracking-[-0.25px] px-8 py-[17px] bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] hover:bg-[#DFE3FA] dark:hover:bg-[#DFE3FA] dark:hover:text-[#0C0E16] transition-colors duration-200 border-0 cursor-pointer"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-full font-bold text-[13px] tracking-[-0.25px] px-8 py-[17px] bg-[#EC5757] text-white hover:bg-[#FF9797] transition-colors duration-200 border-0 cursor-pointer"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </ReactModal>
  );
}
