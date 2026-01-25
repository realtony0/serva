"use client";

/**
 * Composant pour afficher le prompt d'installation PWA
 * Affiche un bouton pour installer l'application sur mobile/desktop
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Vérifier si l'app a été installée
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Afficher le prompt d'installation
    await deferredPrompt.prompt();

    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("[PWA] Installation acceptée");
    } else {
      console.log("[PWA] Installation refusée");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Ne plus afficher pendant cette session
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  // Ne pas afficher si déjà installée ou si l'utilisateur a refusé
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  // Vérifier si l'utilisateur a déjà refusé dans cette session
  if (sessionStorage.getItem("pwa-install-dismissed")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-slide-down">
      <div className="bg-blue-600 text-white rounded-lg shadow-2xl p-4 border-2 border-blue-700">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Installer SERVA</h3>
            <p className="text-sm text-blue-100 mb-3">
              Installez l&apos;application pour un accès rapide et une meilleure expérience.
            </p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleInstallClick}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Installer
              </Button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1 text-sm text-blue-100 hover:text-white"
              >
                Plus tard
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-blue-100 hover:text-white"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}


