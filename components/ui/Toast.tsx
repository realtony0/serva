"use client";

/**
 * Système de notifications Toast accessible
 *
 * Remplace les alert() du navigateur par des notifications
 * accessibles avec aria-live et fermeture automatique.
 *
 * Usage :
 *   import { useToast, ToastProvider } from "@/components/ui/Toast";
 *   const { toast } = useToast();
 *   toast.success("Commande envoyée !");
 *   toast.error("Erreur lors de l'envoi");
 *   toast.info("Un serveur arrive bientôt");
 */

import React, { createContext, useCallback, useContext, useState } from "react";

// ── Types ──────────────────────────────────────────────────

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };
}

// ── Contexte ───────────────────────────────────────────────

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ── Styles par type ────────────────────────────────────────

const TOAST_STYLES: Record<ToastType, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
  warning: "bg-yellow-500 text-gray-900",
};

const TOAST_ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

// ── Provider ───────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 4000) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (message: string, duration?: number) =>
      addToast("success", message, duration),
    error: (message: string, duration?: number) =>
      addToast("error", message, duration ?? 6000),
    info: (message: string, duration?: number) =>
      addToast("info", message, duration),
    warning: (message: string, duration?: number) =>
      addToast("warning", message, duration ?? 5000),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Conteneur de toasts — aria-live pour l'accessibilité */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`${TOAST_STYLES[t.type]} rounded-lg px-4 py-3 shadow-lg flex items-start gap-3 pointer-events-auto animate-slide-in`}
          >
            <span className="font-bold text-lg leading-none mt-0.5" aria-hidden="true">
              {TOAST_ICONS[t.type]}
            </span>
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 opacity-70 hover:opacity-100 transition-opacity text-lg leading-none"
              aria-label="Fermer la notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast doit être utilisé dans un ToastProvider");
  }
  return context;
}
