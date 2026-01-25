"use client";

/**
 * Page de connexion pour les restaurants
 * 
 * Permet aux restaurants de se connecter pour voir leurs commandes
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { getRestaurantByOwnerId } from "@/services/restaurant-auth-service";

export default function RestaurantLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkingRestaurant, setCheckingRestaurant] = useState(false);
  const { user, loading: authLoading, signIn } = useAuth();
  const router = useRouter();

  // Redirige si déjà connecté et restaurant trouvé
  useEffect(() => {
    const checkRestaurant = async () => {
      if (user && !authLoading) {
        setCheckingRestaurant(true);
        try {
          const restaurant = await getRestaurantByOwnerId(user.uid);
          if (restaurant) {
            router.push(`/restaurant/dashboard/${restaurant.id}`);
          } else {
            setCheckingRestaurant(false);
          }
        } catch (err) {
          console.error("Erreur lors de la vérification du restaurant:", err);
          setCheckingRestaurant(false);
        }
      }
    };
    checkRestaurant();
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Se connecter avec Firebase Auth
      await signIn(email, password);
      // La redirection sera gérée par le useEffect quand user sera défini
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      let errorMessage = "Erreur de connexion";

      if (err.code === "auth/invalid-email") {
        errorMessage = "Email invalide";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "Utilisateur non trouvé";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Mot de passe incorrect";
      } else if (err.code === "auth/invalid-credential") {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setSubmitting(false);
    }
  };

  // Afficher le spinner pendant le chargement initial de Firebase Auth
  if (authLoading || checkingRestaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {checkingRestaurant ? "Vérification du restaurant..." : "Chargement..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100 mb-4">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Connexion Restaurant
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous pour gérer vos commandes
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email du restaurant
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                placeholder="restaurant@example.com"
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-lg hover:shadow-xl transition-shadow"
                disabled={submitting}
              >
                {submitting ? (
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
                    Connexion...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Vous êtes un admin ?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-800">
                Connexion admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

