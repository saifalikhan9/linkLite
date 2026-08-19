import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import Link from "next/link";
import { Navbar } from "./components/navbar";

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto ">
      <header className="sticky top-3 z-50  ">
        <Navbar />
      </header>
      <main className="flex flex-col items-center min-h-screen p-24 justify-start  ">
        <p className="">Fast. Clean. Reliable.</p>
        <h1 className="leading-tight text-6xl font-extrabold">
          Turn Long Links <br />
          Into Clean URLs.
        </h1>
        <h2 className="py-4 ">
          Paste any URL below and get a clean, shareable link instantly.
        </h2>
        <Input
          className="my-6"
          placeholder="example.com/your-very-long-url"

          endAdornment={
            <Button size={"sm"} className="ml-4">
              Shorten
            </Button>
          }
        />
        <p className="py-8 ">
          No sign up required for basic shortening. Create an account to manage
          your links.
        </p>
      </main>
    </div>
  );
}
