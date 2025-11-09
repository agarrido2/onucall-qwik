import { component$, useSignal } from '@builder.io/qwik'
import { routeAction$, Form, zod$ } from '@builder.io/qwik-city'
import { createServerSupabaseClient } from '~/lib/supabase'
import { forgotPasswordSchema } from '~/features/auth/schemas/auth-schemas'

/**
 * Forgot Password Action
 * 
 * [CITE: CAPITULO-9.md] - routeAction$ para mutaciones
 * [CITE: QUALITY_STANDARDS.md] - Seguridad: Validación server-side
 */
export const useForgotPasswordAction = routeAction$(
  async (values, requestEvent) => {
    const supabase = createServerSupabaseClient(requestEvent)

    // Obtener la URL base del sitio
    const siteUrl = requestEvent.env.get('PUBLIC_SITE_URL') || requestEvent.url.origin

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${siteUrl}/reset-password`,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Revisa tu email. Te hemos enviado un enlace para restablecer tu contraseña.',
    }
  },
  zod$(forgotPasswordSchema)
)

/**
 * Forgot Password Page
 * 
 * [CITE: UX_GUIDE.md] - Estados de loading/error/success obligatorios
 * [CITE: QUALITY_STANDARDS.md] - Accesible: Labels, ARIA, semántica
 */
export default component$(() => {
  const forgotPasswordAction = useForgotPasswordAction()
  const isLoading = useSignal(false)

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        {/* Header */}
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Recuperar Contraseña
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {/* Form */}
        <Form action={forgotPasswordAction} class="mt-8 space-y-6">
          {/* Success Message */}
          {forgotPasswordAction.value?.success && (
            <div
              class="rounded-md bg-green-50 p-4"
              role="alert"
              aria-live="polite"
            >
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800">
                    {forgotPasswordAction.value.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {forgotPasswordAction.value?.error && (
            <div
              class="rounded-md bg-red-50 p-4"
              role="alert"
              aria-live="polite"
            >
              <p class="text-sm text-red-800">
                {forgotPasswordAction.value.error}
              </p>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Correo electrónico
            </label>
            <div class="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="tu@email.com"
                disabled={isLoading.value || forgotPasswordAction.value?.success}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading.value || forgotPasswordAction.value?.success}
              class="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Enviar enlace de recuperación"
            >
              {isLoading.value ? (
                <span>Enviando...</span>
              ) : forgotPasswordAction.value?.success ? (
                <span>Enlace enviado</span>
              ) : (
                <span>Enviar enlace de recuperación</span>
              )}
            </button>
          </div>

          {/* Back to Login Link */}
          <div class="text-center">
            <a
              href="/login"
              class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Volver a iniciar sesión
            </a>
          </div>
        </Form>
      </div>
    </div>
  )
})
