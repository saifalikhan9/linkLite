import React from "react";
import {
  IconLink,
  IconBrandGithub,
  IconBrandX,
  IconBrandDiscord,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="mt-16 sm:mt-24 border-t border-neutral-200/80 bg-neutral-50/50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-neutral-200">
          {/* Brand Column (2 cols wide) */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-neutral-900 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200/60 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <IconLink size={20} stroke={2.2} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-neutral-950 font-sans">
                ShortenIt
              </span>
            </Link>

            <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm">
              Turn long, complex URLs into clean, high-converting links. Real-time
              analytics, custom domains, and vector QR codes in one place.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-3 text-neutral-500">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center hover:text-neutral-900 hover:border-neutral-300 transition-colors"
                aria-label="GitHub"
              >
                <IconBrandGithub size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center hover:text-neutral-900 hover:border-neutral-300 transition-colors"
                aria-label="Twitter / X"
              >
                <IconBrandX size={16} />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center hover:text-neutral-900 hover:border-neutral-300 transition-colors"
                aria-label="Discord"
              >
                <IconBrandDiscord size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center hover:text-neutral-900 hover:border-neutral-300 transition-colors"
                aria-label="LinkedIn"
              >
                <IconBrandLinkedin size={16} />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
              <li>
                <a href="#features" className="hover:text-orange-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-orange-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-orange-600 transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-orange-600 transition-colors">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
              <li>
                <span className="text-neutral-500 cursor-default">REST API</span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">QR Code Studio</span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">System Status</span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">Changelog</span>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
              <li>
                <span className="text-neutral-500 cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">Terms of Service</span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">Security Policy</span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">Cookie Preferences</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 ShortenIt, Inc. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-neutral-700">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
