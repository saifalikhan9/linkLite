"use client";

import React, { useState } from "react";
import {
  IconLink,
  IconClipboard,
  IconCopy,
  IconCheck,
  IconQrcode,
  IconArrowRight,
  IconLoader2,
  IconInfoCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { useToast } from "@repo/ui/index";
import { QrModal } from "./qr-modal";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { createGuestUrl, createUrl } from "@/services/url.service";

export const ShortenerBox = () => {
  const [longUrl, setLongUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedResult, setShortenedResult] = useState<{
    shortUrl: string;
    originalUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const toast = useToast();

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setLongUrl(text.trim());
          setError(null);
          toast.info("Pasted link from clipboard");
          return;
        }
      }
      // Fallback
      document.getElementById("url-input")?.focus();
    } catch {
      document.getElementById("url-input")?.focus();
    }
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = longUrl.trim();

    if (!trimmed) {
      setError("Please enter a valid URL to shorten.");
      return;
    }

    // Format url
    let formatted = trimmed;
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = `https://${formatted}`;
    }

    try {
      new URL(formatted);
    } catch {
      setError("Please enter a valid web address (e.g. example.com/page).");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      let shortCode: string | undefined;

      if (isAuthenticated) {
        // Authenticated user: calls POST /api/v1/urls with Bearer token
        const res = await createUrl({ originalUrl: formatted });
        shortCode = res?.data?.shortCode || res?.shortCode;
      } else {
        // Guest user: calls POST /api/v1/urls/guest with cookies
        const res = await createGuestUrl({ originalUrl: formatted });
        shortCode = res?.data?.shortCode || res?.shortCode;
      }

      if (!shortCode) {
        throw new Error("Unable to retrieve shortened code from server.");
      }

      const redirectBase =
        process.env.NEXT_PUBLIC_REDIRECT_URL ||
        (process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "/r")
          : "http://localhost:4000/r");

      setShortenedResult({
        shortUrl: `${redirectBase}/${shortCode}`,
        originalUrl: formatted,
      });

      toast.success(
        isAuthenticated
          ? "Link shortened and saved to your account!"
          : "Link shortened successfully!"
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to shorten URL. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortenedResult) return;
    try {
      const urlToCopy = shortenedResult.shortUrl.startsWith("http")
        ? shortenedResult.shortUrl
        : `https://${shortenedResult.shortUrl}`;
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleReset = () => {
    setLongUrl("");
    setShortenedResult(null);
    setError(null);
    setCopied(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Shortener Container */}
      <div className="relative rounded-2xl bg-white p-3 sm:p-4 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/90 transition-all">
        {/* Glow ambient background element */}
        <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 blur-xl opacity-60 -z-10" />

        {!shortenedResult ? (
          /* Input Form */
          <form onSubmit={handleShorten} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                {/* Prefix Icon */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                  <IconLink size={20} stroke={1.8} />
                </div>

                {/* Main Input */}
                <input
                  id="url-input"
                  type="text"
                  value={longUrl}
                  onChange={(e) => {
                    setLongUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Paste a long URL here (e.g. https://very-long-link.com/path)..."
                  className="w-full h-12 sm:h-14 pl-11 pr-24 rounded-xl border border-neutral-200 bg-neutral-50/60 text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  aria-label="URL to shorten"
                />

                {/* Paste Button inside Input */}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:text-orange-600 hover:bg-neutral-100/90 transition-colors border border-transparent hover:border-neutral-200"
                  title="Paste from clipboard"
                >
                  <IconClipboard size={14} />
                  <span className="hidden sm:inline">Paste</span>
                </button>
              </div>

              {/* Shorten Now Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto h-12 sm:h-14 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <IconLoader2 size={18} className="animate-spin" />
                    <span>Shortening...</span>
                  </>
                ) : (
                  <>
                    <span>Shorten Now</span>
                    <IconArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-600 pl-1 font-medium animate-in fade-in">
                {error}
              </p>
            )}
          </form>
        ) : (
          /* Success Result Card */
          <div className="flex flex-col gap-4 py-2 px-1 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-orange-50/50 border border-orange-200/70">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-medium text-orange-950/70 uppercase tracking-wider">
                  Your Clean Link
                </span>
                <span className="text-lg sm:text-xl font-bold text-orange-600 font-mono tracking-tight truncate mt-0.5">
                  {shortenedResult.shortUrl}
                </span>
                <span className="text-xs text-neutral-500 truncate max-w-sm sm:max-w-md mt-0.5">
                  Points to: {shortenedResult.originalUrl}
                </span>
              </div>

              {/* Actions Button Group */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                {/* Copy Link Button with instant feedback */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer ${
                    copied
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-white text-neutral-800 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
                  }`}
                >
                  {copied ? (
                    <>
                      <IconCheck size={16} stroke={2.5} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <IconCopy size={16} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                {/* Show QR Code Button */}
                <button
                  type="button"
                  onClick={() => setIsQrOpen(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/50 transition-all shadow-sm cursor-pointer"
                >
                  <IconQrcode size={16} />
                  <span>Show QR Code</span>
                </button>
              </div>
            </div>

            {/* Reset / Shorten Another */}
            <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
              <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Ready to share anywhere
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-neutral-600 hover:text-orange-600 font-medium transition-colors"
              >
                <IconRefresh size={13} />
                Shorten another URL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth state dynamic notice */}
      <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs text-neutral-500 text-center px-4">
        <IconInfoCircle size={15} className="shrink-0 text-orange-600/80" />
        {isAuthenticated ? (
          <p>
            Logged in. Links are saved directly to your account and tracked in your{" "}
            <Link
              href="/dashboard"
              className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors"
            >
              Dashboard
            </Link>
            .
          </p>
        ) : (
          <p>
            Guest links expire in 24 hours.{" "}
            <Link
              href="/signup"
              className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors"
            >
              Sign up for free
            </Link>{" "}
            to keep them forever and view detailed click analytics.
          </p>
        )}
      </div>

      {/* QR Code Modal */}
      {shortenedResult && (
        <QrModal
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          shortUrl={shortenedResult.shortUrl}
          originalUrl={shortenedResult.originalUrl}
        />
      )}
    </div>
  );
};
