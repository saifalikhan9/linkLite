"use client";

import React, { useEffect, useRef } from "react";
import {
  IconX,
  IconDownload,
  IconCopy,
  IconCheck,
  IconExternalLink,
  IconQrcode,
} from "@tabler/icons-react";
import { useToast } from "@repo/ui/index";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortUrl: string;
  originalUrl?: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  shortUrl,
  originalUrl,
}) => {
  const [copied, setCopied] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const fullShortUrl = shortUrl.startsWith("http")
    ? shortUrl
    : `https://${shortUrl}`;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setCopied(true);
      toast.success("Shortened link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=15&format=svg&data=${encodeURIComponent(
    fullShortUrl
  )}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `shortenit-qr-${shortUrl.replace(/[^a-zA-Z0-9]/g, "-")}.svg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloading QR Code vector image!");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200/80 transition-all scale-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <IconQrcode size={20} stroke={2} />
            </div>
            <div>
              <h3
                id="qr-modal-title"
                className="text-base font-semibold tracking-tight text-neutral-900"
              >
                QR Code Preview
              </h3>
              <p className="text-xs text-neutral-500">Scan to visit destination</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Close modal"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="my-5 flex flex-col items-center">
          <div className="relative flex items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImageUrl}
              alt={`QR code for ${shortUrl}`}
              width={200}
              height={200}
              className="rounded-lg bg-white p-2 shadow-sm"
              loading="eager"
            />
          </div>

          {/* URL Pill */}
          <div className="mt-4 flex w-full items-center justify-between gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-700 border border-neutral-200/80">
            <span className="font-mono font-medium text-orange-700 truncate">
              {shortUrl}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 font-semibold text-neutral-600 hover:text-orange-600 transition-colors"
            >
              {copied ? (
                <>
                  <IconCheck size={14} className="text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <IconCopy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {originalUrl && (
            <p className="mt-2 text-center text-xs text-neutral-400 truncate max-w-full">
              Points to: {originalUrl}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
          >
            <IconDownload size={15} />
            Download SVG
          </button>

          <a
            href={fullShortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition-all shadow-sm"
          >
            <IconExternalLink size={15} />
            Visit Link
          </a>
        </div>
      </div>
    </div>
  );
};
