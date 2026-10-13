import React from "react";
import {
  IconSparkles,
  IconChartBar,
  IconQrcode,
  IconShieldLock,
  IconArrowUpRight,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconLock,
} from "@tabler/icons-react";

export const FeaturesSection = () => {
  const features = [
    {
      id: "branding",
      title: "Custom Aliases & Branding",
      description:
        "Create branded, memorable links that reinforce customer trust and boost click-through rates across campaigns.",
      icon: IconSparkles,
      tag: "Conversion",
      preview: (
        <div className="mt-4 flex flex-col gap-2 rounded-xl bg-neutral-50 p-3 border border-neutral-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-neutral-400 line-through truncate max-w-[140px]">
              link.to/d9x?ref=camp38...
            </span>
            <span className="text-orange-600 font-semibold">+34% CTR</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-neutral-900 bg-white px-2.5 py-1.5 rounded-lg border border-neutral-200 shadow-2xs">
            <span className="text-orange-600">short.en</span>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900">summer-launch</span>
          </div>
        </div>
      ),
    },
    {
      id: "analytics",
      title: "Live Click Analytics",
      description:
        "Track geography, device types, top referrers, and peak hours in real time with intuitive, privacy-friendly dashboards.",
      icon: IconChartBar,
      tag: "Real-time",
      preview: (
        <div className="mt-4 flex flex-col gap-2 rounded-xl bg-neutral-50 p-3 border border-neutral-200/80">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span className="font-semibold text-neutral-900">Traffic Breakdown</span>
            <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-neutral-200">
              <IconDeviceLaptop size={14} className="text-neutral-500" />
              <span className="text-neutral-700">Desktop: <strong>58%</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-neutral-200">
              <IconDeviceMobile size={14} className="text-neutral-500" />
              <span className="text-neutral-700">Mobile: <strong>42%</strong></span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "qr",
      title: "Instant QR Codes",
      description:
        "Download high-res vector QR codes ready for packaging, print menus, billboards, and cross-channel marketing.",
      icon: IconQrcode,
      tag: "High-Res SVG",
      preview: (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-neutral-50 p-3 border border-neutral-200/80">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center p-1.5 shadow-2xs">
              <IconQrcode size={26} className="text-orange-600" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-neutral-900">Vector SVG & PNG</p>
              <p className="text-neutral-500">Scan-tested across 20+ devices</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white border border-neutral-200 text-neutral-700">
            Ready
          </span>
        </div>
      ),
    },
    {
      id: "security",
      title: "Enterprise Security",
      description:
        "SSL encryption, intelligent rate limiting, phishing protection, and optional password defense for sensitive destinations.",
      icon: IconShieldLock,
      tag: "Protection",
      preview: (
        <div className="mt-4 flex flex-col gap-2 rounded-xl bg-neutral-50 p-3 border border-neutral-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <IconShieldLock size={14} />
              SSL 256-bit Encrypted
            </span>
            <span className="inline-flex items-center gap-1 text-neutral-600">
              <IconLock size={12} />
              Passcode Protected
            </span>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[100%]" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="scroll-mt-24 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60 text-xs font-semibold uppercase tracking-wider mb-3">
            Core Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
            Everything you need to manage modern links
          </h2>
          <p className="mt-3 text-base text-neutral-600 leading-relaxed">
            Built for speed, reliability, and clear audience visibility. From
            one-off shares to high-volume campaigns.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 sm:p-7 border border-neutral-200 shadow-sm hover:border-orange-500/40 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-200">
                      <Icon size={22} stroke={2} />
                    </div>
                    <span className="text-xs font-medium text-neutral-500 px-2.5 py-1 rounded-md bg-neutral-100 group-hover:text-orange-700 group-hover:bg-orange-50 transition-colors">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight group-hover:text-orange-950 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Feature preview widget */}
                {feature.preview}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
