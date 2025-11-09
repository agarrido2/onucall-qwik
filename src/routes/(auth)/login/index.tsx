import { component$, useSignal } from '@builder.io/qwik'
import { routeAction$, Form, zod$ } from '@builder.io/qwik-city'
import { createServerSupabaseClient } from '~/lib/supabase'
import { getRedirectPathname } from '~/lib/auth'
import { loginSchema } from '~/features/auth/schemas/auth-schemas'
import { OAuthButtons } from '~/features/auth/components/OAuthButtons'

/**
 * Login Action
 * 
 * [CITE: CAPITULO-9.md] - routeAction$ para mutaciones
 * [CITE: QUALITY_STANDARDS.md] - Seguridad: Validación server-side
 */
export const useLoginAction = routeAction$(
  async (values, requestEvent) => {
    const supabase = createServerSupabaseClient(requestEvent)

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // Redirigir a dashboard o a redirectTo
    const redirectTo = getRedirectPathname(requestEvent.url) || '/dashboard'
    throw requestEvent.redirect(302, redirectTo)
  },
  zod$(loginSchema)
)

/**
 * Login Page
 * 
 * [CITE: UX_GUIDE.md] - Estados de loading/error obligatorios
 * [CITE: QUALITY_STANDARDS.md] - Accesible: Labels, ARIA, contraste
 */
export default component$(() => {
  const loginAction = useLoginAction()
  const isLoading = useSignal(false)

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        {/* Header */}
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Iniciar Sesión
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <a
              href="/register"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              crea una cuenta nueva
            </a>
          </p>
        </div>

        {/* Form */}
        <Form action={loginAction} class="mt-8 space-y-6">
          {/* Error Message */}
          {loginAction.value?.error && (
            <div
              class="rounded-md bg-red-50 p-4"
              role="alert"
              aria-live="polite"
            >
              <p class="text-sm text-red-800">{loginAction.value.error}</p>
            </div>
          )}

          <div class="-space-y-px rounded-md shadow-sm">
            {/* Email Input */}
            <div>
              <label for="email" class="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                class="relative block w-full rounded-t-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Correo electrónico"
                disabled={isLoading.value}
              />
            </div>

            {/* Password Input */}
            <div>
              <label for="password" class="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                class="relative block w-full rounded-b-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Contraseña"
                disabled={isLoading.value}
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div class="flex items-center justify-between">
            <div class="text-sm">
              <a
                href="/forgot-password"
                class="font-medium text-indigo-600 hover:text-indigo-500"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading.value}
              class="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Iniciar sesión"
            >
              {isLoading.value ? (
                <span>Iniciando sesión...</span>
              ) : (
                <span>Iniciar sesión</span>
              )}
            </button>
          </div>
        </Form>

        {/* OAuth Buttons */}
        <OAuthButtons mode="login" />
      </div>
    </div>
  )
})
