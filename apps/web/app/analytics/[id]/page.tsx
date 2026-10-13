"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconLink,
  IconExternalLink,
  IconChartBar,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconWorld,
  IconUsers,
  IconCalendar,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import { useToast } from "@repo/ui/index";

export default function LinkAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const linkId = resolvedParams.id;
  const [copied, setCopied] = React.useState(false);
  const toast = useToast();

  const shortCode = linkId.length <= 8 ? linkId : "promo2026";
  const shortUrl = `https://short.en/${shortCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Short link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const countries = [
    { country: "United States", flag: "🇺🇸", clicks: 382, pct: "45%" },
    { country: "United Kingdom", flag: "🇬🇧", clicks: 194, pct: "23%" },
    { country: "Germany", flag: "🇩🇪", clicks: 110, pct: "13%" },
    { country: "India", flag: "🇮🇳", clicks: 85, pct: "10%" },
    { country: "Others", flag: "🌐", clicks: 77, pct: "9%" },
  ];

  const referrers = [
    { name: "Direct / Email", clicks: 360, pct: "42%" },
    { name: "Twitter / X", clicks: 254, pct: "30%" },
    { name: "LinkedIn", clicks: 142, pct: "17%" },
    { name: "Google Search", clicks: 92, pct: "11%" },
  ];

  const timelineDays = [
    { day: "Mon", clicks: 85, height: "45%" },
    { day: "Tue", clicks: 120, height: "65%" },
    { day: "Wed", clicks: 145, height: "80%" },
    { day: "Thu", clicks: 190, height: "100%" },
    { day: "Fri", clicks: 160, height: "85%" },
    { day: "Sat", clicks: 75, height: "40%" },
    { day: "Sun", clicks: 95, height: "50%" },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 pb-16">
      {/* Top Bar */}
      <header className="border-b border-neutral-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-orange-600 transition-colors"
          >
            <IconArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-600">
              {shortUrl}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors"
              title="Copy Short URL"
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Link Header Banner */}
        <div className="rounded-2xl bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-2xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Link
                </span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs text-neutral-500 inline-flex items-center gap-1">
                  <IconCalendar size={13} />
                  Created Oct 10, 2026
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 font-sans">
                Detailed Click Analytics
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-neutral-700">Destination:</span>
                <a
                  href="https://example.com/marketing/campaign"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-neutral-500 hover:text-orange-600 truncate max-w-md inline-flex items-center gap-1"
                >
                  <span>https://example.com/marketing/campaign</span>
                  <IconExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                <span>{copied ? "Copied" : "Copy Short Link"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="rounded-2xl bg-white border border-neutral-200/90 p-5 shadow-2xs">
            <span className="text-xs font-semibold text-neutral-500">Total Clicks</span>
            <p className="text-3xl font-extrabold text-neutral-950 tracking-tight mt-1 font-mono">
              848
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              +14% from last week
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200/90 p-5 shadow-2xs">
            <span className="text-xs font-semibold text-neutral-500">Unique Visitors</span>
            <p className="text-3xl font-extrabold text-neutral-950 tracking-tight mt-1 font-mono">
              692
            </p>
            <p className="text-xs text-neutral-400 mt-1">81.6% unique ratio</p>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200/90 p-5 shadow-2xs">
            <span className="text-xs font-semibold text-neutral-500">Top Country</span>
            <p className="text-2xl font-extrabold text-neutral-950 tracking-tight mt-1">
              United States 🇺🇸
            </p>
            <p className="text-xs text-neutral-400 mt-1">45% of total traffic</p>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200/90 p-5 shadow-2xs">
            <span className="text-xs font-semibold text-neutral-500">Top Referrer</span>
            <p className="text-2xl font-extrabold text-neutral-950 tracking-tight mt-1">
              Direct / Email
            </p>
            <p className="text-xs text-neutral-400 mt-1">360 clicks</p>
          </div>
        </div>

        {/* Click Trend Visual */}
        <div className="rounded-2xl bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-2xs mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                Weekly Engagement Activity
              </h2>
              <p className="text-xs text-neutral-500">Clicks recorded over the past 7 days</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700">
              7-Day View
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-6 px-2 border-b border-neutral-200">
            {timelineDays.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-mono font-bold text-neutral-700">
                  {item.clicks}
                </span>
                <div
                  style={{ height: item.height }}
                  className="w-full max-w-[48px] rounded-t-lg bg-orange-500 hover:bg-orange-600 transition-colors"
                />
                <span className="text-xs font-medium text-neutral-500 mt-1">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column Breakdown: Countries & Devices/Referrers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Countries */}
          <div className="rounded-2xl bg-white border border-neutral-200/90 p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <IconWorld size={18} className="text-orange-600" />
              <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                Top Geographic Locations
              </h3>
            </div>

            <div className="space-y-3">
              {countries.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <span className="font-semibold text-neutral-800">{c.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-neutral-500">{c.clicks} clicks</span>
                    <span className="font-mono font-bold text-neutral-900 w-10 text-right">
                      {c.pct}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices & Referrers */}
          <div className="rounded-2xl bg-white border border-neutral-200/90 p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <IconDeviceLaptop size={18} className="text-orange-600" />
                <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                  Devices & Traffic Channels
                </h3>
              </div>

              {/* Devices pill */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-6">
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <IconDeviceLaptop size={16} className="mx-auto text-neutral-600 mb-1" />
                  <p className="font-bold text-neutral-900">58%</p>
                  <p className="text-[10px] text-neutral-500">Desktop</p>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <IconDeviceMobile size={16} className="mx-auto text-neutral-600 mb-1" />
                  <p className="font-bold text-neutral-900">38%</p>
                  <p className="text-[10px] text-neutral-500">Mobile</p>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <IconDeviceTablet size={16} className="mx-auto text-neutral-600 mb-1" />
                  <p className="font-bold text-neutral-900">4%</p>
                  <p className="text-[10px] text-neutral-500">Tablet</p>
                </div>
              </div>

              {/* Top Referrers list */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Top Referrers
                </p>
                {referrers.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800">{r.name}</span>
                    <span className="font-mono text-neutral-600 font-semibold">{r.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
