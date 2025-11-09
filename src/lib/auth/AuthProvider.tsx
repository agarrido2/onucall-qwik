import { component$, Slot, useContextProvider, $, useSignal, useVisibleTask$, useTask$ } from "@builder.io/qwik"
import { useNavigate } from "@builder.io/qwik-city"
import { isBrowser } from "@builder.io/qwik/build"
import { createClient } from "~/lib/supabase"
import { AuthContext, type AuthContextValue } from "~/lib/contexts/auth-context"
import type { User } from "@supabase/supabase-js"

interface AuthProviderProps {
  user: User | null
}

/**
 * Auth Provider
 * 
 * Componente que proporciona el contexto de autenticación a toda la aplicación.
 * - Recibe el usuario desde SSR (props.user)
 * - Se suscribe a cambios de sesión en el cliente
 * - Proporciona método logout
 * 
 * [CITE: GUIDE_AUTH_SUPA_QWIK.md - Auth Provider]
 * [CITE: CAPITULO-5.md] - useTask$ para sincronización de props
 */
export const AuthProvider = component$<AuthProviderProps>((props) => {
  const nav = useNavigate()
  
  // Inicializar con usuario del SSR
  const currentUser = useSignal<User | null>(props.user || null)

  /**
   * 🔄 SINCRONIZACIÓN DE PROPS → STATE
   * 
   * useTask$ se ejecuta en SERVIDOR y CLIENTE
   * Trackea cambios en props.user y actualiza currentUser.value
   * 
   * Soluciona problema de caché cuando:
   * - Usuario A logout → Usuario B login
   * - SSR tiene nuevo user pero signal no se actualiza
   * 
   * [CITE: CAPITULO-5.md] - useTask$ para efectos reactivos
   */
  useTask$(({ track }) => {
    const user = track(() => props.user)
    currentUser.value = user
  })

  const logout = $(async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (!error) {
      currentUser.value = null
      nav('/')
    }
  })

  // Sincronización en el cliente
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (!isBrowser) return
    
    const supabase = createClient()

    // ✅ Solo suscribirse a cambios (no verificar de nuevo)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      currentUser.value = session?.user ?? null
    })

    cleanup(() => subscription.unsubscribe())
  }, { strategy: 'document-ready' })

  const ctx: AuthContextValue = {
    user: currentUser.value,
    isAuthenticated: !!currentUser.value,
    logout,
  }

  useContextProvider(AuthContext, ctx)
  return <Slot />
})
