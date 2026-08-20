"use client";

import { logout } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@repo/ui/button";
import { useToast } from "@repo/ui/index";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Navbar = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const [isLoading, setIsloading] = useState(false);
  const toast = useToast();

  const isAuthenticated = !!accessToken;

  return (
    <nav className="flex items-center justify-between rounded px-5 py-2 backdrop-blur-md">
      <Link
        href="/"
        className="rounded-full p-2 text-4xl font-handwriting tracking-widest"
      >
        LinkLite
      </Link>

      {isInitializing ? (
        <div className="inline-flex gap-4">
          <div className="h-[33.6px] w-[102.71px] animate-pulse rounded-md bg-neutral-400" />
          <div className="h-[33.6px] w-[75.79px] animate-pulse rounded-md bg-neutral-400" />
        </div>
      ) : isAuthenticated ? (
        <div className="inline-flex gap-4">
          <Link href="/dashboard">
            <Button variant="secondary">Dashboard</Button>
          </Link>

          <Button
            disabled={isLoading}
            onClick={async () => {
              try {
                setIsloading(true);
                const data = await logout();
                if (data.success === true) {
                  toast.success(data.message ?? "Logged out");
                  clearAccessToken()
                }
              } catch (error) {
                toast.error("something went worng");
              } finally {
                setIsloading(false);
              }
            }}
            variant="destructive"
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="inline-flex gap-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>

          <Link href="/signup">
            <Button variant="secondary">Signup</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
