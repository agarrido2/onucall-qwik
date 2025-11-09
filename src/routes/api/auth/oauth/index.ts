import type { RequestHandler } from '@builder.io/qwik-city'
import { createServerSupabaseClient } from '~/lib/supabase'
import type { Provider } from '@supabase/supabase-js'

/**
 * OAuth Initiation Endpoint
 * 
 * POST /api/auth/oauth
 * 
 * Inicia el flujo de autenticación OAuth con Supabase.
 * - Acepta provider (google)
 * - Opcional: redirectTo (donde redirigir post-auth)
 * - Retorna URL de autorización del provider
 * 
 * [CITE: CAPITULO-6.md] - Endpoints del servidor
 * [CITE: QUALITY_STANDARDS.md] - Seguridad: Server-side OAuth
 */
export const onPost: RequestHandler = async (requestEvent) => {
  const formData = await requestEvent.parseBody() as Record<string, string>
  
  const provider = formData.provider as Provider
  const redirectTo = formData.redirectTo || '/dashboard'

  // Validación del provider
  if (!provider || provider !== 'google') {
    requestEvent.status(400)
    requestEvent.json(400, { success: false, error: 'Provider no válido' })
    return
  }

  const supabase = createServerSupabaseClient(requestEvent)

  // Obtener URL base del sitio
  const siteUrl = requestEvent.env.get('PUBLIC_SITE_URL') || requestEvent.url.origin

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  })

  if (error) {
    requestEvent.status(500)
    requestEvent.json(500, { success: false, error: error.message })
    return
  }

  // Redirigir a la URL de autorización del provider
  if (data.url) {
    throw requestEvent.redirect(302, data.url)
  }

  requestEvent.status(500)
  requestEvent.json(500, { success: false, error: 'No se pudo iniciar el flujo OAuth' })
}
