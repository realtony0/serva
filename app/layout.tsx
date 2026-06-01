import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Serva — The Smartest Way to Manage Your Restaurant",
  description:
    "Serva is a SaaS platform for restaurants. QR code ordering, real-time dashboards, multi-location support — everything your restaurant needs.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}
