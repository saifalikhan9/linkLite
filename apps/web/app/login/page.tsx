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
  IconSparkles,
} from "@tabler/icons-react";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@repo/ui/index";
import { ApiErrorResponse } from "@/types/ApiErrorTypes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toast = useToast();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await login({ email: trimmedEmail, password });

      if (res?.success && res?.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        toast.success("Welcome back! Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        toast.error("Unable to sign in. Please verify your credentials.");
      }
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const msg = error.response?.data?.message || "Invalid email or password.";
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
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl border border-neutral-200/90 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: Proof & Brand Panel (Desktop only) */}
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

          {/* Proof Asset */}
          <div className="relative z-10 my-8">
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="inline-flex items-center gap-1 text-orange-400 font-semibold">
                  <IconSparkles size={14} />
                  Live Performance
                </span>
                <span className="text-emerald-400 font-mono">99.9% Uptime</span>
              </div>
              <p className="text-2xl font-extrabold text-white tracking-tight font-sans">
                10,000,000+
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Links shortened with sub-10ms global redirection latency.
              </p>

              <div className="mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-300 italic">
                &ldquo;ShortenIt helped us simplify campaign tracking and boost our link click-through rate by 34%.&rdquo;
              </div>
            </div>
          </div>

          {/* Trust footer */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-neutral-400 pt-4 border-t border-neutral-800">
            <IconShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>End-to-end encrypted • Enterprise ready</span>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Sign in to manage your shortened links, custom domains, and view live click analytics.
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
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Email Address
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
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-neutral-800"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info("Password reset link will be sent to your email.")}
                    className="text-xs font-medium text-neutral-500 hover:text-orange-600 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="••••••••"
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
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <IconArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Sibling Flow Link */}
            <div className="mt-8 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-500">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/signup"
                className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors"
              >
                Create an account for free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
