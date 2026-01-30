/**
 * Utilitaire pour obtenir l'URL de base du site
 * Fonctionne côté client et serveur
 */

export function getBaseUrl(): string {
  // Côté client: utiliser window.location.origin
  if (typeof window !== "undefined") {
    // Si une variable d'environnement est définie, l'utiliser en priorité
    // (pour forcer l'URL de production même en développement)
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envUrl) {
      return envUrl;
    }
    return window.location.origin;
  }

  // Côté serveur: utiliser la variable d'environnement
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Fallback
  return "http://localhost:3000";
}
