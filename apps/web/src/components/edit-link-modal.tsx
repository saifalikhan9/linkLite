"use client";

import React, { useState, useEffect } from "react";
import { IconEdit, IconX, IconLoader2, IconCalendar, IconWorld, IconTag } from "@tabler/icons-react";
import { LinkItem } from "@/types/link";

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: {
    id: string;
    title: string;
    originalUrl: string;
    expiresAt?: string | null;
  }) => Promise<void>;
  link: LinkItem | null;
}

export const EditLinkModal: React.FC<EditLinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  link,
}) => {
  const [title, setTitle] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (link) {
      setTitle(link.title || "");
      setOriginalUrl(link.originalUrl || "");
      setExpiresAt(link.expiresAt ? link.expiresAt.split("T")[0] || "" : "");
      setError(null);
    }
  }, [link]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isSaving]);

  if (!isOpen || !link) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      setError("Destination URL cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        id: link.id,
        title: title.trim() || originalUrl.replace(/^https?:\/\//, ""),
        originalUrl: originalUrl.trim(),
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
      onClose();
    } catch {
      setError("Failed to update link. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-dialog-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <IconEdit size={19} stroke={2} />
            </div>
            <div>
              <h3
                id="edit-dialog-title"
                className="text-base font-bold text-neutral-900 tracking-tight"
              >
                Edit Link Details
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                short.en/{link.shortCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title input */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 mb-1.5">
              <IconTag size={14} className="text-neutral-500" />
              <span>Link Title / Label</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Product Launch Post"
              className="w-full h-10 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Original URL input */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 mb-1.5">
              <IconWorld size={14} className="text-neutral-500" />
              <span>Destination URL (Required)</span>
            </label>
            <input
              type="text"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/long-page"
              required
              className="w-full h-10 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Expiration Date input */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 mb-1.5">
              <IconCalendar size={14} className="text-neutral-500" />
              <span>Expiration Date (Optional)</span>
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
            <p className="mt-1 text-[11px] text-neutral-400">
              Leave blank if the link should never expire.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              {isSaving ? (
                <>
                  <IconLoader2 size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
