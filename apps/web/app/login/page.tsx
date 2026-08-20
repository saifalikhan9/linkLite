"use client";

import { login } from "@/services/auth.service";
import { ApiErrorResponse } from "@/types/ApiErrorTypes";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@repo/ui/index";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const data = await login({ email, password });
      if (data.success === true) {
        useAuthStore.getState().setAccessToken(data.data.accessToken);

        toast.success("Logged in sccessfully");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const message = error.response?.data.message ?? "Something went wrong";

        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex min-w-md flex-col justify-start rounded-xl border border-neutral-400 px-6 py-8 shadow">
        <div className="text-center mb-8 border-b pb-2 w-full">
          <h1 className="font-handwriting text-6xl">Welcome Back</h1>
          <p>Please enter your Credentials</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>

              <Input
                id="email"
                type="email"
                value={email}
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>

              <Input
                id="password"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full ">
              <Button disabled={isLoading} type="submit">
                Login
              </Button>
              <p
                className="relative flex items-center justify-center gap-3 text-center
  before:h-px before:flex-1 before:bg-neutral-400 before:content-['']
  after:h-px after:flex-1 after:bg-neutral-400 after:content-[''] my-1"
              >
                or
              </p>
              <Link href={"/signup"}>
                <Button className="py-3" variant={"outline"}>
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
