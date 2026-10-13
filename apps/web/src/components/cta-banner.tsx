import React from "react";
import { IconArrowRight, IconShieldCheck, IconBolt, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";

export const CtaBanner = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 px-6 py-12 sm:px-12 sm:py-16 text-center text-white border border-neutral-800/80 shadow-2xl">
        {/* Warm Ambient Radial Glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-orange-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-4">
            <IconSparkles size={14} />
            <span>Instant Setup • No Credit Card Required</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Shorten, share, and track your links with ease today.
          </h2>

          {/* Subtext */}
          <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
            Start with our free plan in 30 seconds. Build clean links, access
            instant QR codes, and see real-time audience engagement.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get Started for Free</span>
              <IconArrowRight
                size={18}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 font-semibold text-sm sm:text-base transition-colors flex items-center justify-center cursor-pointer"
            >
              <span>Log In</span>
            </Link>
          </div>

          {/* Micro-trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-400 pt-6 border-t border-neutral-800/60 w-full max-w-lg">
            <span className="inline-flex items-center gap-1.5">
              <IconBolt size={14} className="text-orange-400" />
              Sub-10ms redirects
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconShieldCheck size={14} className="text-emerald-400" />
              Enterprise SSL encryption
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Free tier forever
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
