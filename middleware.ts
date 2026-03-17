import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de sécurité SERVA
 *
 * Note : L'authentification Firebase est vérifiée côté client (ProtectedRoute)
 * et côté Firestore (rules). Le middleware ajoute les headers de sécurité HTTP.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ── Headers de sécurité ──────────────────────────────────
  // Protection contre le clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Empêche le navigateur de deviner le type MIME
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Active la protection XSS du navigateur
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Empêche le referrer de fuiter sur les liens externes
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Limite les permissions du navigateur
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // ── Protection des routes API ────────────────────────────
  // Bloque les requêtes API sans origine (protection CSRF basique)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (origin && host && !origin.includes(host)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Appliquer à toutes les routes sauf les fichiers statiques
    "/((?!_next/static|_next/image|favicon.ico|icon-.*\\.png|sw\\.js|manifest\\.json|offline\\.html).*)",
  ],
};
