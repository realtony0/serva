"use client";

import { AuthProvider } from "@/lib/auth-context";

/**
 * Wrapper client pour AuthProvider
 * Nécessaire car le layout est un Server Component
 */
export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}


