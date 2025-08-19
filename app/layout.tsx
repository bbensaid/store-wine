import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/navbar/Navbar";
import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wine Store",
  description: "BabyFox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Suspense>
                <Navbar />
              </Suspense>
              <main className="flex-1 pt-0">
                <div className="max-w-[2400px] w-full mx-auto p-4 sm:p-6 lg:p-8">
                  {children}
                </div>
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
