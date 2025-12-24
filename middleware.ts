import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authMiddlewareService } from "@/infrastructure/security/auth-middleware.service";

/**
 * Middleware para proteger rutas de administración
 * Verifica que el usuario esté autenticado y tenga rol de administrador
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger todas las rutas que comiencen con /admin
  if (pathname.startsWith("/admin")) {
    // Obtener el storage encriptado de las cookies
    const encryptedStorage = request.cookies.get("auth-storage")?.value;

    // Si no hay storage, redirigir al login
    if (!encryptedStorage) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar que el usuario tenga rol de administrador
    const isAdmin = authMiddlewareService.isAdmin(encryptedStorage);

    if (!isAdmin) {
      // Si no es admin, redirigir a página de no autorizado o home
      const unauthorizedUrl = new URL("/", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Usuario autenticado y con rol admin - permitir acceso
  }

  // Proteger todas las rutas que comiencen con /configurations
  // if (pathname.startsWith("/configurations")) {
  //   // Obtener el storage encriptado de las cookies
  //   const encryptedStorage = request.cookies.get("auth-storage")?.value;

  //   // Si no hay storage, redirigir al home o login
  //   if (!encryptedStorage) {
  //     const homeUrl = new URL("/home", request.url);
  //     return NextResponse.redirect(homeUrl);
  //   }

  //   // Verificar que el usuario esté autenticado
  //   const isAuthenticated = authMiddlewareService.isAuthenticated(encryptedStorage);

  //   if (!isAuthenticated) {
  //     const homeUrl = new URL("/home", request.url);
  //     return NextResponse.redirect(homeUrl);
  //   }
  // }

  // Proteger rutas de checkout y order-details
  if (pathname.startsWith("/checkout") || pathname.startsWith("/order-details")) {
    // Obtener el storage encriptado de las cookies
    const encryptedStorage = request.cookies.get("auth-storage")?.value;

    // Si no hay storage, redirigir al login con redirect parameter
    if (!encryptedStorage) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar que el usuario esté autenticado
    const isAuthenticated = authMiddlewareService.isAuthenticated(encryptedStorage);

    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Usuario autenticado - permitir acceso
  }

  return NextResponse.next();
}

/**
 * Configuración del middleware
 * Define qué rutas serán procesadas por este middleware
 */
export const config = {
  matcher: [
    /*
     * Match todas las rutas admin, checkout, order-details y configurations excepto:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/admin/:path*",
    "/checkout/:path*",
    "/order-details/:path*",
    //"/configurations/:path*",
  ],
};
