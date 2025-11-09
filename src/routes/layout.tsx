/**
 * Layout Raíz de la Aplicación
 * 
 * [CITE: CAPITULO-7.md, sección 7.2] - Layouts anidados
 * [CITE: GUIDE_AUTH_SUPA_QWIK.md] - Guard Global + AuthProvider
 * 
 * Este layout envuelve TODAS las rutas de la aplicación.
 * - Implementa el guard de autenticación global
 * - Proporciona el AuthProvider a toda la app
 */

import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { AuthProvider, getAuthRedirect } from '~/lib/auth';
import { createServerSupabaseClient } from '~/lib/supabase';

/**
 * Guard de autenticación GLOBAL
 * - Se ejecuta en TODAS las rutas
 * - Verifica sesión en el servidor (SSR)
 * - Redirige antes de renderizar (sin flash)
 * 
 * [CITE: QUALITY_STANDARDS.md] - Seguridad: Validación server-side
 */
export const useAuthGuard = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent);
  const { data: { user } } = await supabase.auth.getUser();
  
  const { pathname } = requestEvent.url;
  const isAuthenticated = !!user;
  
  // Obtener redirección si es necesaria
  const redirectPath = getAuthRedirect(pathname, isAuthenticated);
  
  if (redirectPath) {
    throw requestEvent.redirect(302, redirectPath);
  }
  
  return { user };
});

export default component$(() => {
  const authData = useAuthGuard();
  
  return (
    <AuthProvider user={authData.value.user}>
      <Slot />
    </AuthProvider>
  );
});

