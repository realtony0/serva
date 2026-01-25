"use client";

/**
 * Composant pour protéger les routes ADMIN uniquement
 * 
 * Vérifie que l'utilisateur est connecté ET qu'il n'est pas un restaurant
 * Si c'est un restaurant, redirige vers /restaurant/login
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getRestaurantByOwnerId } from "@/services/restaurant-auth-service";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (loading) return;

      // Si pas d'utilisateur, rediriger vers login admin
      if (!user) {
        router.push("/login");
        return;
      }

      // Vérifier si l'utilisateur est un restaurant
      try {
        const restaurant = await getRestaurantByOwnerId(user.uid);
        
        if (restaurant) {
          // C'est un restaurant, rediriger vers la page restaurant
          router.push(`/restaurant/dashboard/${restaurant.id}`);
          return;
        }
        
        // C'est un admin, autoriser l'accès
        setChecking(false);
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
        // En cas d'erreur, autoriser l'accès (pour éviter de bloquer les admins)
        setChecking(false);
      }
    };

    checkUser();
  }, [user, loading, router]);

  // Affiche un loader pendant la vérification
  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l&apos;accès...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }

  // Affiche le contenu protégé (admin uniquement)
  return <>{children}</>;
}


