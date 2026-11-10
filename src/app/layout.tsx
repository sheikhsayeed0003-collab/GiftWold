import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Dancing_Script,
  Noto_Sans_Bengali,
} from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteHeaderShell } from "@/components/layout/SiteHeaderShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: "Gift World — 3D ডিজিটাল গিফট",
  description:
    "৩D গিফট বক্স, ছবি, গান, ভিডিও ও সারপ্রাইজ — তৈরি করুন, পাবলিশ করুন, QR ও লিংক শেয়ার করুন।",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dancing.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Suspense fallback={<SiteHeaderShell />}>
          <SiteHeader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
