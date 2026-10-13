import { Navbar } from "@/components/navbar";
import { ShortenerBox } from "@/components/shortener-box";
import { MetricsStrip } from "@/components/metrics-strip";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { PricingSection } from "@/components/pricing-section";
import { CtaBanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";
import { IconSparkles } from "@tabler/icons-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 selection:bg-orange-100 selection:text-orange-900">
      {/* Sticky Header / Navigation Bar */}
      <header className="sticky top-3 z-40 max-w-6xl mx-auto px-4 sm:px-6">
        <Navbar />
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
        {/* Hero Section */}
        <section className="relative text-center pb-12 sm:pb-16">
          {/* Subtle warm ambient backdrop light */}
          <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-80 w-full max-w-3xl rounded-full bg-gradient-to-b from-orange-100/60 via-amber-50/40 to-transparent blur-3xl -z-10" />

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-2xs text-xs font-semibold text-neutral-800 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
            <span>Fast, clean & reliable link shortening</span>
            <IconSparkles size={14} className="text-orange-600" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 max-w-4xl mx-auto leading-[1.12]">
            Shorten, Share, and Track Your Links{" "}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              with Ease
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Create custom branded aliases, generate instant scannable QR codes,
            and monitor real-time audience click analytics—all with zero friction.
          </p>

          {/* Interactive Quick Shortener Box (The Core Demo) */}
          <div className="mt-10 sm:mt-12">
            <ShortenerBox />
          </div>
        </section>

        {/* Social Proof / Metric Strip */}
        <MetricsStrip />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Final CTA Banner */}
        <CtaBanner />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
