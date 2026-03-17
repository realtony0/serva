"use client";

/**
 * Error Boundary global pour SERVA
 *
 * Capture les erreurs React non gérées et affiche une page de fallback.
 * En production, c'est ici qu'on intégrerait Sentry ou un service de monitoring.
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: Envoyer l'erreur à un service de monitoring (Sentry, LogRocket...)
    console.error("[SERVA Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">&#x26A0;&#xFE0F;</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Une erreur est survenue
        </h1>
        <p className="text-gray-600 mb-6">
          Nous sommes désolés, quelque chose s&apos;est mal passé.
          L&apos;erreur a été enregistrée et notre équipe en a été informée.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-4 font-mono">
            Réf: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Retour à l&apos;accueil
          </a>
        </div>
      </div>
    </div>
  );
}
