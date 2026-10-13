"use client";

import React, { useState } from "react";
import {
  IconLink,
  IconSparkles,
  IconClipboard,
  IconCalendar,
  IconLock,
  IconTag,
  IconLoader2,
  IconX,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useToast } from "@repo/ui/index";
import { CreateUrlPayload } from "@/services/url.service";

interface LinkCreatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateUrlPayload) => Promise<void>;
}

export const LinkCreatorPanel: React.FC<LinkCreatorPanelProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [title, setTitle] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();

  if (!isOpen) return null;

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setOriginalUrl(text.trim());
          setError(null);
          toast.info("Pasted destination URL");
        }
      }
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = originalUrl.trim();

    if (!trimmed) {
      setError("Please provide a destination URL.");
      return;
    }

    let formattedUrl = trimmed;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError("Please enter a valid URL (e.g. https://example.com/page).");
      return;
    }

    if (isPasswordProtected && !password.trim()) {
      setError("Please specify a passcode for password protection.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onCreate({
        originalUrl: formattedUrl,
        customAlias: customAlias.trim() || undefined,
        title: title.trim() || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        password: isPasswordProtected ? password.trim() : undefined,
      });

      // Reset form
      setOriginalUrl("");
      setCustomAlias("");
      setTitle("");
      setExpiresAt("");
      setIsPasswordProtected(false);
      setPassword("");
      setShowAdvanced(false);
      onClose();
    } catch {
      setError("Failed to create link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl bg-white border border-neutral-200/90 p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <IconSparkles size={20} stroke={2} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight">
              Create New Short Link
            </h2>
            <p className="text-xs text-neutral-500">
              Shorten any destination link with optional custom branding.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          aria-label="Close panel"
        >
          <IconX size={18} />
        </button>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Destination URL (Required) */}
        <div>
          <label className="flex items-center justify-between text-xs font-semibold text-neutral-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <IconLink size={14} className="text-neutral-500" />
              <span>Destination URL (Required)</span>
            </span>
            <button
              type="button"
              onClick={handlePaste}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-orange-600 transition-colors"
            >
              <IconClipboard size={12} />
              <span>Paste</span>
            </button>
          </label>
          <input
            type="text"
            value={originalUrl}
            onChange={(e) => {
              setOriginalUrl(e.target.value);
              if (error) setError(null);
            }}
            placeholder="https://very-long-link.com/campaign/annual-review-2026..."
            required
            className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        {/* Custom Alias & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Custom Alias */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
              Custom Alias (Optional)
            </label>
            <div className="flex rounded-xl border border-neutral-200 bg-neutral-50/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all overflow-hidden">
              <span className="inline-flex items-center px-3 text-xs text-neutral-500 font-mono bg-neutral-100/70 border-r border-neutral-200 select-none">
                short.en/
              </span>
              <input
                type="text"
                value={customAlias}
                onChange={(e) =>
                  setCustomAlias(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "")
                  )
                }
                placeholder="my-portfolio"
                className="w-full h-10 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Title / Tags */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 mb-1.5">
              <IconTag size={14} className="text-neutral-500" />
              <span>Link Title / Label (Optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Portfolio Website"
              className="w-full h-10 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <span>Advanced Settings (Expiration, Passcode)</span>
            {showAdvanced ? (
              <IconChevronUp size={14} />
            ) : (
              <IconChevronDown size={14} />
            )}
          </button>
        </div>

        {/* Advanced Settings Drawer */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 animate-in fade-in duration-100">
            {/* Expiration Date Picker */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 mb-1.5">
                <IconCalendar size={14} className="text-neutral-500" />
                <span>Automatic Expiration Date</span>
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Password Protection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                  <IconLock size={14} className="text-neutral-500" />
                  <span>Password Protection</span>
                </label>
                <input
                  type="checkbox"
                  id="pwd-protect"
                  checked={isPasswordProtected}
                  onChange={(e) => setIsPasswordProtected(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
              </div>

              {isPasswordProtected ? (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set secret passcode"
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              ) : (
                <p className="text-[11px] text-neutral-400 pt-2">
                  Enable to require visitors to enter a passcode to proceed.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow transition-all inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <IconLoader2 size={16} className="animate-spin" />
                <span>Creating Short Link...</span>
              </>
            ) : (
              <span>Create Short Link</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
