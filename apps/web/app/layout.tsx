import "@repo/ui/styles.css";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Lovers_Quarrel } from "next/font/google";
import { Toaster } from "@repo/ui/index";
import { AuthProvider } from "@/providers/auth-provider";

const loversQuarrel = Lovers_Quarrel({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lovers",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${loversQuarrel.variable} bg-background text-foreground antialiased`}
      >
        <AuthProvider>
          <Toaster>{children}</Toaster>
        </AuthProvider>
      </body>
    </html>
  );
}
