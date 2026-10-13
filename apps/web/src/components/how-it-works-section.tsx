import React from "react";
import {
  IconClipboardCopy,
  IconAdjustmentsAlt,
  IconChartLine,
} from "@tabler/icons-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Paste your long link",
      description:
        "Drop any lengthy, UTM-heavy, or unwieldy destination URL directly into our quick shortener box.",
      icon: IconClipboardCopy,
    },
    {
      step: "02",
      title: "Customize alias & generate QR",
      description:
        "Assign a branded slug to make your link memorable, and get an instant scannable QR code ready for print or web.",
      icon: IconAdjustmentsAlt,
    },
    {
      step: "03",
      title: "Share & track performance",
      description:
        "Share across social, email, or billboards, and inspect live click counts, geographic devices, and referrers in real time.",
      icon: IconChartLine,
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24 bg-neutral-50/70 border-y border-neutral-200/80 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60 text-xs font-semibold uppercase tracking-wider mb-3">
            Simple Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
            How it works in three simple steps
          </h2>
          <p className="mt-3 text-base text-neutral-600 leading-relaxed">
            From a cluttered 200-character URL to a clean, measurable short link
            in seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle horizontal connector on desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 -z-0" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-md transition-shadow"
              >
                {/* Step badge & icon */}
                <div className="relative mb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/60 shadow-inner">
                    <Icon size={26} stroke={1.8} />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-white font-mono text-xs font-bold shadow-xs">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
