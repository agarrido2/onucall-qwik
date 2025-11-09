import { createBrowserClient, createServerClient } from '@supabase/ssr'
import type { RequestEventCommon } from '@builder.io/qwik-city'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase')
}

/**
 * Cliente para el NAVEGADOR
 * - Usar en useVisibleTask$, event handlers
 * - ⚠️ NO usar en routeAction$ o routeLoader$
 */
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Cliente para el SERVIDOR
 * - Usar SIEMPRE en routeAction$ y routeLoader$
 * - Maneja cookies correctamente
 */
export const createServerSupabaseClient = (requestEvent: RequestEventCommon) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookieHeader = requestEvent.request.headers.get('cookie')
        if (!cookieHeader) return []
        
        return cookieHeader.split(';').map(cookie => {
          const [name, value] = cookie.trim().split('=')
          return {
            name: name || '',
            value: value ? decodeURIComponent(value) : ''
          }
        }).filter(cookie => cookie.name && cookie.value)
      },
      setAll(cookiesToSet) {
        const isHttps = requestEvent.request.url.startsWith('https://')
        cookiesToSet.forEach(({ name, value, options }) => {
          if (requestEvent.cookie) {
            requestEvent.cookie.set(name, value, {
              path: '/',
              httpOnly: true,
              secure: isHttps,
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 365, // 1 año
              ...options
            })
          }
        })
      },
    },
  })
}
