/**
 * Auth Facade - Punto de entrada único
 * 
 * Re-exports de todos los componentes y utilidades de autenticación.
 * SIEMPRE importa desde aquí, nunca desde los módulos internos.
 * 
 * [CITE: GUIDE_AUTH_SUPA_QWIK.md - Facade Pattern]
 * [CITE: ARQUITECTURA_FOLDER.md - PARTE 4: Patrón Híbrido]
 */

// Context
export { AuthContext, type AuthContextValue } from '~/lib/contexts/auth-context'

// Provider
export { AuthProvider } from './AuthProvider'

// Route Guards
export { RouteClassifier, getAuthRedirect, getRedirectPathname, ROUTE_CONFIG } from './route-guards'

// Hook
export { useAuth } from '~/features/auth/hooks/use-auth'
