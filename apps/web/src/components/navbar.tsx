"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconLink,
  IconMenu2,
  IconX,
  IconArrowRight,
  IconLayoutDashboard,
  IconLogout,
} from "@tabler/icons-react";
import { useAuthStore } from "@/store/auth.store";
import { logout } from "@/services/auth.service";
import { useToast } from "@repo/ui/index";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const toast = useToast();

  const isAuthenticated = !!accessToken;

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const data = await logout();
      if (data?.success) {
        toast.success(data.message ?? "Logged out successfully");
      }
      clearAccessToken();
      setMobileMenuOpen(false);
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="w-full relative z-40">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 rounded-2xl bg-white/85 backdrop-blur-md border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200/60 shadow-xs group-hover:bg-orange-600 group-hover:text-white transition-colors duration-150">
            <IconLink size={20} stroke={2.2} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-neutral-950 font-sans">
            ShortenIt
          </span>
        </Link>

        {/* Center (Desktop): Smooth anchor links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            Pricing
          </a>
        </div>

        {/* Right (Desktop): Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isInitializing ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 animate-pulse rounded-lg bg-neutral-200" />
              <div className="h-9 w-24 animate-pulse rounded-lg bg-neutral-200" />
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-xs"
              >
                <IconLayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <IconLogout size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Log In (Ghost / Outline variant) */}
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-xs cursor-pointer"
              >
                Log In
              </Link>

              {/* Sign Up (Solid warm accent fill) */}
              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-sm hover:shadow transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Sign Up</span>
                <IconArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 border border-neutral-200 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 p-5 rounded-2xl bg-white border border-neutral-200 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 pb-4 border-b border-neutral-100">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                Pricing
              </a>
            </div>

            {/* Mobile Auth Actions */}
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold text-neutral-800 border border-neutral-300 hover:bg-neutral-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
