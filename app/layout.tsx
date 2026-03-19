import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/app/components/navbar";
import { Providers } from "@/app/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURA Vehicles",
  description: "Vehicle marketplace built with Next.js, Prisma, PostgreSQL, and NextAuth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="bubble-background" aria-hidden="true">
          <span className="bubble bubble-1" />
          <span className="bubble bubble-2" />
          <span className="bubble bubble-3" />
          <span className="bubble bubble-4" />
          <span className="bubble bubble-5" />
          <span className="bubble bubble-6" />
          <span className="bubble bubble-7" />
          <span className="bubble bubble-8" />
          <span className="bubble bubble-9" />
          <span className="bubble bubble-10" />
        </div>

        <div className="relative z-10 flex min-h-full flex-col">
          <Providers>
            <Navbar />
            <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
