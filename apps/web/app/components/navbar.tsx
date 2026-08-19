import { Button } from "@repo/ui/button";
import Link from "next/link";
import React from "react";

export const Navbar = () => {
  const loggedIn = false;
  return (
    <nav className="flex items-center-safe justify-between px-5 py-2 rounded  backdrop-blur-md">
      <Link
        href={"/"}
        className="rounded-full p-2 text-4xl font-handwriting tracking-widest"
      >
        LinkLite
      </Link>

      {loggedIn ? (
        <div className="inline-flex gap-4">
          <Link href={"/dashboard"}>
            <Button variant={"secondary"}>Dashboard</Button>
          </Link>

          <Button variant={"destructive"}>Logout</Button>
        </div>
      ) : (
        <div className="inline-flex gap-4">
          <Link href={"/login"}>
            <Button>Login</Button>
          </Link>
          <Link href={"/signup"}>
            <Button variant={"secondary"}>Signup</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
