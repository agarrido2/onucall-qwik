import { createContextId } from "@builder.io/qwik"
import type { User } from "@supabase/supabase-js"
import type { QRL } from "@builder.io/qwik"

/**
 * Auth Context Value
 * 
 * Interface que define el contexto de autenticación global
 */
export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  logout: QRL<() => Promise<void>>
}

/**
 * Auth Context ID
 * 
 * Identificador del contexto de autenticación.
 * Se usa en AuthProvider y useAuth hook.
 */
export const AuthContext = createContextId<AuthContextValue>('auth-context')
