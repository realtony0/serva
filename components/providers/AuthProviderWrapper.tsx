"use client";

import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmModal";

/**
 * Wrapper client pour tous les providers
 * Nécessaire car le layout est un Server Component
 */
export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          {children}
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}


