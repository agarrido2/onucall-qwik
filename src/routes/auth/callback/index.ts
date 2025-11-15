import type { RequestHandler } from "@builder.io/qwik-city";
import { createServerSupabaseClient } from "~/lib/supabase";

/**
 * OAuth Callback Endpoint
 *
 * GET /auth/callback
 *
 * Maneja el retorno del flujo OAuth después de que el usuario autoriza la app.
 * - Supabase intercambia el code por una sesión
 * - Redirige al usuario a la página solicitada (o /dashboard por defecto)
 *
 * [CITE: CAPITULO-6.md] - Server endpoints
 * [CITE: QUALITY_STANDARDS.md] - Seguridad: Server-side OAuth
 */
export const onGet: RequestHandler = async (requestEvent) => {
  const url = requestEvent.url;
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = createServerSupabaseClient(requestEvent);

    // Intercambiar el code por una sesión
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Redirigir a login con mensaje de error
      throw requestEvent.redirect(
        302,
        `/login?error=${encodeURIComponent(error.message)}`,
      );
    }

    // Éxito: redirigir a la página solicitada
    throw requestEvent.redirect(302, next);
  }

  // Si no hay code, redirigir a login
  throw requestEvent.redirect(
    302,
    "/login?error=No+se+recibi%C3%B3+c%C3%B3digo+OAuth",
  );
};
