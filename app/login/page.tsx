"use client";

/**
 * Page de connexion admin
 * 
 * Permet aux administrateurs de se connecter avec email/password
 * Redirige vers /dashboard après connexion réussie
 */

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { getRestaurantByOwnerId } from "@/services/restaurant-auth-service";

// Désactiver le prérendu statique pour cette page
export const dynamic = 'force-dynamic';

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirige si déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        // Vérifier si c'est un restaurant
        try {
          const restaurant = await getRestaurantByOwnerId(user.uid);
          if (restaurant) {
            // C'est un restaurant, rediriger vers son dashboard
            router.push(`/restaurant/dashboard/${restaurant.id}`);
            return;
          }
        } catch (error) {
          // Erreur silencieuse, continue comme admin
        }
        
        // C'est un admin, rediriger vers le dashboard admin
        const redirect = searchParams.get("redirect") || "/dashboard";
        router.push(redirect);
      }
    };
    checkUser();
  }, [user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Vérifier que Firebase est initialisé
    const { isFirebaseInitialized } = await import("@/lib/firebase");
    if (!isFirebaseInitialized()) {
      setError("Firebase n'est pas initialisé. Vérifiez la configuration.");
      setLoading(false);
      return;
    }

    try {
      await signIn(email, password);
      // La redirection se fera automatiquement via le useEffect ci-dessus
    } catch (err: any) {
      // Gestion des erreurs Firebase Auth
      let errorMessage = "Erreur de connexion";
      
      console.error("Erreur de connexion:", err);
      console.error("Code d'erreur:", err.code);
      
      if (err.code === "auth/invalid-email") {
        errorMessage = "Email invalide";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "Utilisateur non trouvé";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Mot de passe incorrect";
      } else if (err.code === "auth/invalid-credential") {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Trop de tentatives. Réessayez plus tard";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Erreur de connexion réseau. Vérifiez votre internet.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Affiche un loader si déjà connecté (redirection en cours)
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Connexion Admin
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous à votre compte administrateur
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-lg hover:shadow-xl transition-shadow"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Accès réservé aux administrateurs autorisés
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

