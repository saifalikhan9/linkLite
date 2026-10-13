"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  IconLink,
  IconArrowLeft,
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconShieldCheck,
  IconCheck,
} from "@tabler/icons-react";
import { signup } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@repo/ui/index";
import { ApiErrorResponse } from "@/types/ApiErrorTypes";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toast = useToast();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // Live password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "bg-neutral-200" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (score <= 3) return { score: 2, label: "Good", color: "bg-amber-500" };
    return { score: 3, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await signup({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (res?.success) {
        toast.success("Account created successfully!");
        if (res?.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } else {
        toast.error("Account creation failed. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const msg =
          error.response?.data?.message ||
          "Registration failed. Email might already be in use.";
        setErrorMessage(msg);
        toast.error(msg);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        toast.error("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar Navigation */}
      <div className="w-full max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-orange-600 transition-colors"
        >
          <IconArrowLeft size={16} />
          <span>Back to ShortenIt</span>
        </Link>

        <div className="text-xs text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl border border-neutral-200/90 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Side: Proof & Benefits Panel (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 bg-neutral-950 text-white p-10 flex-col justify-between relative overflow-hidden">
          {/* Subtle warm glow background */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-orange-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />

          {/* Brand header */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <IconLink size={20} stroke={2.2} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                ShortenIt
              </span>
            </Link>
          </div>

          {/* What you get list */}
          <div className="relative z-10 my-8 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Free plan includes:
            </p>

            <div className="space-y-3">
              {[
                "Permanent links that never expire",
                "Real-time geographic & device click metrics",
                "Instant scannable vector QR codes",
                "Clean custom vanity aliases",
                "Fast, global sub-10ms edge redirects",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <div className="mt-0.5 rounded-full p-0.5 bg-orange-950 text-orange-400 border border-orange-500/30 shrink-0">
                    <IconCheck size={12} stroke={3} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust footer */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-neutral-400 pt-4 border-t border-neutral-800">
            <IconShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>Zero credit card required • Free forever</span>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Get started for free. Manage your links and track analytics in one place.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium animate-in fade-in">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Alex Morgan"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Work or Personal Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="alex@company.com"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Create a password"
                    required
                    className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-neutral-200 rounded-full overflow-hidden flex gap-0.5">
                      <div
                        className={`h-full flex-1 transition-all ${
                          strength.score >= 1 ? strength.color : "bg-neutral-200"
                        }`}
                      />
                      <div
                        className={`h-full flex-1 transition-all ${
                          strength.score >= 2 ? strength.color : "bg-neutral-200"
                        }`}
                      />
                      <div
                        className={`h-full flex-1 transition-all ${
                          strength.score >= 3 ? strength.color : "bg-neutral-200"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-500 w-10 text-right">
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <IconLoader2 size={16} className="animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <IconArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Terms disclaimer */}
              <p className="text-[11px] text-neutral-400 text-center leading-normal">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>

            {/* Sibling Flow Link */}
            <div className="mt-6 pt-5 border-t border-neutral-100 text-center text-xs text-neutral-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
