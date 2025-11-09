/**
 * Route Guards - Sistema de protección de rutas
 * 
 * Clasificación y redirección de rutas basada en estado de autenticación
 */

/**
 * Configuración de rutas por tipo
 */
export const ROUTE_CONFIG = {
  landing: ['/'] as const,
  auth: ['/login', '/register', '/forgot-password', '/reset-password'] as const,
  protected: ['/dashboard', '/users', '/create'] as const,
} as const

/**
 * Clasificadores de rutas
 */
export const RouteClassifier = {
  isLanding: (pathname: string): boolean => 
    ROUTE_CONFIG.landing.some(route => pathname === route),
    
  isAuth: (pathname: string): boolean => 
    ROUTE_CONFIG.auth.some(route => pathname.startsWith(route)),
    
  isProtected: (pathname: string): boolean => 
    ROUTE_CONFIG.protected.some(route => pathname.startsWith(route)),
    
  isPublic: (pathname: string): boolean => 
    RouteClassifier.isLanding(pathname) || RouteClassifier.isAuth(pathname),
}

/**
 * Lógica de redirección centralizada
 */
export function getAuthRedirect(
  pathname: string, 
  isAuthenticated: boolean
): string | null {
  // Usuario autenticado en rutas de auth → dashboard
  if (isAuthenticated && RouteClassifier.isAuth(pathname)) {
    return '/dashboard'
  }
  
  // Usuario no autenticado en rutas protegidas → login
  if (!isAuthenticated && RouteClassifier.isProtected(pathname)) {
    return `/login?redirectTo=${encodeURIComponent(pathname)}`
  }
  
  return null
}

/**
 * Obtiene pathname de redirectTo query param
 */
export function getRedirectPathname(url: URL): string | null {
  const redirectTo = url.searchParams.get('redirectTo')
  
  if (!redirectTo) return null
  
  // Validar seguridad: solo rutas relativas
  if (!redirectTo.startsWith('/')) return null
  if (redirectTo.includes('//')) return null
  
  return redirectTo
}
