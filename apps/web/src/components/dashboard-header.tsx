"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconLink,
  IconPlus,
  IconChevronDown,
  IconLogout,
  IconUser,
  IconSettings,
  IconChartBar,
} from "@tabler/icons-react";
import { logout } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@repo/ui/index";

interface DashboardHeaderProps {
  onOpenCreate: () => void;
  activeTab?: "links" | "analytics";
  userName?: string;
  userEmail?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenCreate,
  activeTab = "links",
  userName = "Saif Ali Khan",
  userEmail = "saif@example.com",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const router = useRouter();
  const toast = useToast();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      clearAccessToken();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      clearAccessToken();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get Initials
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SK";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200/90 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity & Active Navigation Indicators */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200/60 shadow-2xs group-hover:bg-orange-600 group-hover:text-white transition-colors duration-150">
              <IconLink size={20} stroke={2.2} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-neutral-950 font-sans">
              ShortenIt
            </span>
          </Link>

          {/* Active Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === "links"
                  ? "bg-orange-50 text-orange-700 border border-orange-200/60"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              Links
            </Link>
            <Link
              href="/analytics"
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "analytics"
                  ? "bg-orange-50 text-orange-700 border border-orange-200/60"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              <IconChartBar size={15} />
              <span>Analytics</span>
            </Link>
          </nav>
        </div>

        {/* Right: Quick Action & Profile Dropdown */}
        <div className="flex items-center gap-3">
          {/* Quick Create Link Action Button */}
          <button
            type="button"
            onClick={onOpenCreate}
            className="px-3 sm:px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <IconPlus size={16} stroke={2.5} />
            <span className="hidden sm:inline">Create Short Link</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* User Profile Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 rounded-xl p-1.5 sm:px-2.5 sm:py-1.5 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors cursor-pointer"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-800 text-xs font-bold font-mono">
                {initials}
              </div>
              <span className="hidden md:inline text-xs font-semibold text-neutral-800 max-w-[120px] truncate">
                {userName}
              </span>
              <IconChevronDown
                size={15}
                className={`text-neutral-400 transition-transform duration-150 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-xl border border-neutral-200 text-neutral-800 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                {/* User Info Header */}
                <div className="px-3 py-2.5 border-b border-neutral-100">
                  <p className="text-xs font-bold text-neutral-900 truncate">
                    {userName}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono truncate mt-0.5">
                    {userEmail}
                  </p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                  >
                    <IconLink size={15} className="text-neutral-500" />
                    <span>My Links</span>
                  </Link>
                  <Link
                    href="/analytics"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                  >
                    <IconChartBar size={15} className="text-neutral-500" />
                    <span>Global Analytics</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      toast.info("Account settings page");
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors text-left"
                  >
                    <IconSettings size={15} className="text-neutral-500" />
                    <span>Account Settings</span>
                  </button>
                </div>

                {/* Logout action */}
                <div className="pt-1 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <IconLogout size={15} />
                    <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
