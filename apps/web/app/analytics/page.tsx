"use client";

import React from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconChartBar,
  IconMouse,
  IconFlame,
  IconWorld,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceTablet,
} from "@tabler/icons-react";

export default function GlobalAnalyticsPage() {
  const topLinks = [
    { code: "summer-launch", original: "https://shop.example.com/summer-sale", clicks: 542 },
    { code: "portfolio-alex", original: "https://alexmorgan.dev", clicks: 388 },
    { code: "pricing2026", original: "https://product.com/plans", clicks: 275 },
    { code: "newsletter-oct", original: "https://substack.com/linklite", clicks: 194 },
    { code: "docs-api-v2", original: "https://api.linklite.dev/v2/docs", clicks: 83 },
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

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60">
            Global Analytics
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 font-sans">
            Account Analytics Overview
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Aggregated traffic statistics across all your active and historic short links.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="rounded-2xl bg-white border border-neutral-200/90 p-5 shadow-2xs">
            <span className="text-xs font-semibold text-neutral-500">Total Redirects</span>
            <p className="text-3xl font-extrabold text-neutral-950 tracking-tight mt-1 font-mono">
              1,482
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">+18.4% this month</p>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200/90 p-5 shadow-2xs">
            <span className="text-xs font-semibold text-neutral-500">Total Active Links</span>
            <p className="text-3xl font-extrabold text-neutral-950 tracking-tight mt-1 font-mono">
              24
            </p>
            <p className="text-xs text-neutral-400 mt-1">96% active ratio</p>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200/90 p-5 shadow-2xs">
            <span className="text-xs font-semibold text-neutral-500">Average Click / Link</span>
            <p className="text-3xl font-extrabold text-neutral-950 tracking-tight mt-1 font-mono">
              61.7
            </p>
            <p className="text-xs text-neutral-400 mt-1">High conversion</p>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200/90 p-5 shadow-2xs">
            <span className="text-xs font-semibold text-neutral-500">Global Response Time</span>
            <p className="text-3xl font-extrabold text-neutral-950 tracking-tight mt-1 font-mono">
              8.4 ms
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Edge accelerated</p>
          </div>
        </div>

        {/* Top Performing Links Table */}
        <div className="rounded-2xl bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <IconFlame size={20} className="text-orange-600" />
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                Top Performing Links
              </h2>
            </div>
            <span className="text-xs text-neutral-400">Ranked by clicks</span>
          </div>

          <div className="divide-y divide-neutral-200/70">
            {topLinks.map((link, idx) => (
              <div
                key={idx}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-orange-600">
                    short.en/{link.code}
                  </span>
                  <p className="text-xs text-neutral-500 truncate max-w-md font-mono mt-0.5">
                    {link.original}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-lg">
                    {link.clicks} clicks
                  </span>
                  <Link
                    href={`/analytics/${link.code}`}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
