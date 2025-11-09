import { component$, useSignal } from '@builder.io/qwik'
import { routeAction$, Form, zod$ } from '@builder.io/qwik-city'
import { createServerSupabaseClient } from '~/lib/supabase'
import { registerSchema } from '~/features/auth/schemas/auth-schemas'

/**
 * Register Action
 * 
 * [CITE: CAPITULO-9.md] - routeAction$ para mutaciones
 * [CITE: QUALITY_STANDARDS.md] - Seguridad: Validación server-side
 */
export const useRegisterAction = routeAction$(
  async (values, requestEvent) => {
    const supabase = createServerSupabaseClient(requestEvent)

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Cuenta creada. Revisa tu email para confirmar tu cuenta.',
    }
  },
  zod$(registerSchema)
)

/**
 * Register Page
 * 
 * [CITE: UX_GUIDE.md] - Estados de loading/error/success obligatorios
 * [CITE: QUALITY_STANDARDS.md] - Accesible: Labels, ARIA, contraste 4.5:1
 */
export default component$(() => {
  const registerAction = useRegisterAction()
  const isLoading = useSignal(false)

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        {/* Header */}
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Crear Cuenta
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <a
              href="/login"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              inicia sesión con tu cuenta
            </a>
          </p>
        </div>

        {/* Form */}
        <Form action={registerAction} class="mt-8 space-y-6">
          {/* Success Message */}
          {registerAction.value?.success && (
            <div
              class="rounded-md bg-green-50 p-4"
              role="alert"
              aria-live="polite"
            >
              <p class="text-sm text-green-800">
                {registerAction.value.message}
              </p>
            </div>
          )}

          {/* Error Message */}
          {registerAction.value?.error && (
            <div
              class="rounded-md bg-red-50 p-4"
              role="alert"
              aria-live="polite"
            >
              <p class="text-sm text-red-800">{registerAction.value.error}</p>
            </div>
          )}

          <div class="space-y-4">
            {/* Email Input */}
            <div>
              <label
                for="email"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                class="mt-2 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="tu@email.com"
                disabled={isLoading.value}
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                for="password"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                class="mt-2 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Mínimo 6 caracteres"
                disabled={isLoading.value}
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                for="confirmPassword"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                class="mt-2 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Confirma tu contraseña"
                disabled={isLoading.value}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading.value}
              class="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Crear cuenta"
            >
              {isLoading.value ? (
                <span>Creando cuenta...</span>
              ) : (
                <span>Crear cuenta</span>
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
})
