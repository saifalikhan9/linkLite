"use client";

import React, { useEffect } from "react";
import { IconAlertTriangle, IconTrash, IconX } from "@tabler/icons-react";
import { LinkItem } from "@/types/link";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  link: LinkItem | null;
  isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  link,
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen || !link) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60">
            <IconAlertTriangle size={20} stroke={2} />
          </div>

          <div className="flex-1">
            <h3
              id="delete-dialog-title"
              className="text-base font-bold text-neutral-900 tracking-tight"
            >
              Delete shortened link?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-neutral-900 font-mono">
                short.en/{link.shortCode}
              </strong>
              ? Anyone attempting to use this link will receive a 404 error. This
              action cannot be undone.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <IconTrash size={15} />
            <span>{isLoading ? "Deleting..." : "Delete Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
