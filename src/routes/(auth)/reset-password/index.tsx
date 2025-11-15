import { component$, useSignal } from "@builder.io/qwik";
import { routeAction$, Form, zod$ } from "@builder.io/qwik-city";
import { createServerSupabaseClient } from "~/lib/supabase";
import { resetPasswordSchema } from "~/features/auth/schemas/auth-schemas";

/**
 * Reset Password Action
 *
 * [CITE: CAPITULO-9.md] - routeAction$ para mutaciones
 * [CITE: QUALITY_STANDARDS.md] - Seguridad: Validación server-side
 */
export const useResetPasswordAction = routeAction$(
  async (values, requestEvent) => {
    const supabase = createServerSupabaseClient(requestEvent);

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Redirigir a dashboard después de cambiar contraseña
    throw requestEvent.redirect(302, "/dashboard");
  },
  zod$(resetPasswordSchema),
);

/**
 * Reset Password Page
 *
 * Esta página es accedida mediante el enlace del email de recuperación.
 * Supabase maneja la sesión temporal automáticamente.
 *
 * [CITE: UX_GUIDE.md] - Estados de loading/error obligatorios
 * [CITE: QUALITY_STANDARDS.md] - Accesible: Labels, ARIA, semántica
 */
export default component$(() => {
  const resetPasswordAction = useResetPasswordAction();
  const isLoading = useSignal(false);

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        {/* Header */}
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Restablecer Contraseña
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa tu nueva contraseña
          </p>
        </div>

        {/* Form */}
        <Form action={resetPasswordAction} class="mt-8 space-y-6">
          {/* Error Message */}
          {resetPasswordAction.value?.error && (
            <div
              class="rounded-md bg-red-50 p-4"
              role="alert"
              aria-live="polite"
            >
              <p class="text-sm text-red-800">
                {resetPasswordAction.value.error}
              </p>
            </div>
          )}

          <div class="space-y-4">
            {/* Password Input */}
            <div>
              <label
                for="password"
                class="block text-sm leading-6 font-medium text-gray-900"
              >
                Nueva Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                class="mt-2 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
                placeholder="Mínimo 6 caracteres"
                disabled={isLoading.value}
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                for="confirmPassword"
                class="block text-sm leading-6 font-medium text-gray-900"
              >
                Confirmar Nueva Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                class="mt-2 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
                placeholder="Confirma tu nueva contraseña"
                disabled={isLoading.value}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading.value}
              class="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Restablecer contraseña"
            >
              {isLoading.value ? (
                <span>Restableciendo...</span>
              ) : (
                <span>Restablecer contraseña</span>
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div class="rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm text-blue-700">
                  Después de cambiar tu contraseña, todas tus sesiones activas
                  se cerrarán por seguridad.
                </p>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
});
