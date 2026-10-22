import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "Nabd | نبض - نظام إدارة المبيعات والمخازن",
  description: "نظام متكامل لإدارة المبيعات والمخازن",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}