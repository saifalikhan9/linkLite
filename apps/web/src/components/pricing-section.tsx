import React from "react";
import { IconCheck, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      badge: null,
      price: "$0",
      cadence: "forever free",
      description: "Perfect for personal sharing and quick daily links.",
      features: [
        "Up to 50 active links",
        "Permanent links with free account",
        "Standard click counter",
        "Instant web QR code preview",
        "Sub-10ms redirect speed",
      ],
      ctaText: "Start for Free",
      ctaHref: "/signup",
      highlighted: false,
    },
    {
      name: "Pro",
      badge: "Most Popular",
      price: "$9",
      cadence: "per month",
      description: "For creators, marketers, and teams who need custom branding.",
      features: [
        "Unlimited shortened links",
        "Custom branded domains",
        "Real-time geographic & device analytics",
        "High-resolution QR export (SVG & PNG)",
        "Passcode protection & custom expiration dates",
        "Priority customer support",
      ],
      ctaText: "Get Started with Pro",
      ctaHref: "/signup",
      highlighted: true,
    },
  ];

  return (
    <section id="pricing" className="scroll-mt-24 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60 text-xs font-semibold uppercase tracking-wider mb-3">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
            Simple plans with zero surprises
          </h2>
          <p className="mt-3 text-base text-neutral-600 leading-relaxed">
            Shorten your first link in seconds. Upgrade when you need custom
            domains and deep audience analytics.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col justify-between rounded-2xl p-7 sm:p-8 transition-all duration-200 ${
                plan.highlighted
                  ? "bg-white border-2 border-orange-500 shadow-xl shadow-orange-500/5 ring-1 ring-orange-500/20"
                  : "bg-white border border-neutral-200 shadow-sm hover:border-neutral-300"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold tracking-wide uppercase shadow-sm">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-neutral-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="mt-5 mb-6 flex items-baseline gap-1.5 pb-6 border-b border-neutral-100">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 font-sans">
                    {plan.price}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    /{plan.cadence}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                    Included with {plan.name}:
                  </p>
                  {plan.features.map((feature, fIndex) => (
                    <div
                      key={fIndex}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700"
                    >
                      <div
                        className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                          plan.highlighted
                            ? "bg-orange-100 text-orange-700"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        <IconCheck size={13} stroke={3} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={plan.ctaHref}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  plan.highlighted
                    ? "bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-sm hover:shadow-md"
                    : "bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <span>{plan.ctaText}</span>
                <IconArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
