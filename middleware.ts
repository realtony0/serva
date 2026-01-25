import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware minimal pour SERVA
 * 
 * La protection des routes se fait côté client via ProtectedRoute.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Appliquer uniquement aux routes admin
export const config = {
  matcher: ["/dashboard/:path*"],
};
