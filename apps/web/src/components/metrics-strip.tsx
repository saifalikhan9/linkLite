import React from "react";
import { IconLink, IconShieldCheck, IconUsers } from "@tabler/icons-react";

export const MetricsStrip = () => {
  const metrics = [
    {
      value: "10M+",
      label: "Links Shortened",
      description: "Redirected with sub-10ms latency worldwide",
      icon: IconLink,
    },
    {
      value: "99.9%",
      label: "Uptime SLA",
      description: "Global edge network with zero scheduled downtime",
      icon: IconShieldCheck,
    },
    {
      value: "250K+",
      label: "Active Users",
      description: "Creators, growth teams, and enterprise brands",
      icon: IconUsers,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto py-10 sm:py-14 border-y border-neutral-200/70">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200/80">
        {metrics.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex flex-col items-center text-center ${
                index !== 0 ? "pt-6 sm:pt-0" : ""
              }`}
            >
              <div className="inline-flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded-md bg-orange-50 text-orange-600">
                  <Icon size={18} stroke={2} />
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">
                  {item.value}
                </span>
              </div>
              <p className="text-sm font-semibold text-neutral-800">
                {item.label}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5 max-w-[220px]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
