"use client";

/**
 * Modal de confirmation accessible
 *
 * Remplace les confirm() du navigateur par un dialog accessible
 * avec gestion du focus et fermeture au clavier (Escape).
 *
 * Usage :
 *   import { useConfirm, ConfirmProvider } from "@/components/ui/ConfirmModal";
 *   const { confirm } = useConfirm();
 *   const ok = await confirm("Supprimer ce restaurant ?");
 *   if (ok) { ... }
 *
 *   // Avec options :
 *   const ok = await confirm("Vider le panier ?", {
 *     confirmText: "Vider",
 *     cancelText: "Annuler",
 *     variant: "danger",
 *   });
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// ── Types ──────────────────────────────────────────────────

interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

interface ConfirmState {
  message: string;
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

interface ConfirmContextType {
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
}

// ── Contexte ───────────────────────────────────────────────

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback(
    (message: string, options: ConfirmOptions = {}) => {
      return new Promise<boolean>((resolve) => {
        setState({ message, options, resolve });
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    state?.resolve(true);
    setState(null);
  }, [state]);

  const handleCancel = useCallback(() => {
    state?.resolve(false);
    setState(null);
  }, [state]);

  // Focus le bouton d'annulation à l'ouverture (plus sûr par défaut)
  useEffect(() => {
    if (state) {
      cancelButtonRef.current?.focus();
    }
  }, [state]);

  // Fermeture avec Escape
  useEffect(() => {
    if (!state) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state, handleCancel]);

  const variant = state?.options.variant ?? "default";
  const confirmBtnClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white";

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {state && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCancel}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
            {state.options.title && (
              <h2
                id="confirm-title"
                className="text-lg font-bold text-gray-900 mb-2"
              >
                {state.options.title}
              </h2>
            )}

            <p id="confirm-message" className="text-gray-700 mb-6">
              {state.message}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                ref={cancelButtonRef}
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
              >
                {state.options.cancelText ?? "Annuler"}
              </button>
              <button
                ref={confirmButtonRef}
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${confirmBtnClass}`}
              >
                {state.options.confirmText ?? "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────

export function useConfirm(): ConfirmContextType {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm doit être utilisé dans un ConfirmProvider");
  }
  return context;
}
