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
        rounded-lg p-[48px]
        w-[calc(100%-48px)] max-w-[480px]
        outline-none mx-auto
      "
      overlayClassName="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-[rgba(0,0,0,0.5)]"
    >
      <h2 className="font-bold text-[24px] tracking-[-0.5px] text-[#0C0E16] dark:text-white mb-[13px]">
        Confirm Deletion
      </h2>
      <p className="text-[#888EB0] font-medium text-[12px] leading-[22px] mb-8">
        Are you sure you want to delete invoice{' '}
        <strong className="text-[#0C0E16] dark:text-white">#{id}</strong>?{' '}
        This action cannot be undone.
      </p>
      <div className="flex items-center justify-end gap-2">
        <button
          className="inline-flex items-center justify-center rounded-3xl font-bold text-[12px] tracking-[-0.25px] px-6 py-[17px] bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] hover:bg-[#DFE3FA] dark:hover:bg-[#DFE3FA] dark:hover:text-[#0C0E16] transition-colors duration-200 border-0 cursor-pointer"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="inline-flex items-center justify-center rounded-3xl font-bold text-[12px] tracking-[-0.25px] px-6 py-[17px] bg-[#EC5757] text-white hover:bg-[#FF9797] transition-colors duration-200 border-0 cursor-pointer"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </ReactModal>
  );
}
