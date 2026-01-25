import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProviderWrapper } from "@/components/providers/AuthProviderWrapper";
import PWARegister from "@/components/pwa/PWARegister";
import InstallPrompt from "@/components/pwa/InstallPrompt";

export const metadata: Metadata = {
  title: "SERVA - Plateforme SaaS Restaurant",
  description: "Application de gestion de restaurant avec commandes en temps réel",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SERVA",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SERVA" />
      </head>
      <body className="antialiased">
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
        <PWARegister />
        <InstallPrompt />
      </body>
    </html>
  );
}

