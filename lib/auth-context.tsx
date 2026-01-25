"use client";

/**
 * Contexte d'authentification
 * 
 * Fournit l'état d'authentification et les fonctions d'auth
 * à tous les composants de l'application via React Context
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange, getCurrentUser } from "./firebase-auth";
import { getRestaurantUser } from "@/services/restaurant-user-service";
import { RestaurantUser } from "@/lib/types/restaurant-user";

interface AuthContextType {
  user: User | null;
  restaurantUser: RestaurantUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider d'authentification
 * À placer dans le layout racine pour rendre l'auth disponible partout
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [restaurantUser, setRestaurantUser] = useState<RestaurantUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Écoute les changements d'état d'authentification
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const rUser = await getRestaurantUser(currentUser.uid);
          setRestaurantUser(rUser);
        } catch (err) {
          console.error("Erreur lors de la récupération du profil restaurant:", err);
          setRestaurantUser(null);
        }
      } else {
        setRestaurantUser(null);
      }
      setLoading(false);
    });

    // Nettoyage lors du démontage
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { signIn: firebaseSignIn } = await import("./firebase-auth");
      await firebaseSignIn(email, password);
      // L'état sera mis à jour automatiquement via onAuthChange
    } catch (error: any) {
      console.error("Erreur dans signIn du contexte:", error);
      throw error;
    }
  };

  const signOut = async () => {
    const { logout } = await import("./firebase-auth");
    await logout();
    // L'état sera mis à jour automatiquement via onAuthChange
  };

  return (
    <AuthContext.Provider value={{ user, restaurantUser, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte d'authentification
 * @throws Error si utilisé en dehors d'un AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}

