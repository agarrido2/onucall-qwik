import { component$ } from '@builder.io/qwik'
import { useAuth } from '~/lib/auth'
import { useAuthGuard } from '../layout'

/**
 * Dashboard Page (Protegida)
 * 
 * [CITE: GUIDE_AUTH_SUPA_QWIK.md] - Ruta protegida por el guard global
 * [CITE: UX_GUIDE.md] - Feedback al usuario con información de sesión
 */
export default component$(() => {
  const auth = useAuth()
  const authData = useAuthGuard()
  
  // Usar datos del guard si auth.user está null (durante hidratación)
  const user = auth.user || authData.value.user

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <nav class="bg-white shadow-sm">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between">
            <div class="flex">
              <div class="flex flex-shrink-0 items-center">
                <h1 class="text-xl font-bold text-gray-900">OnuCall</h1>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-700 mr-4">
                {user?.email}
              </span>
              <button
                onClick$={auth.logout}
                class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main class="py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div class="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
            <h2 class="text-2xl font-bold text-gray-900">
              ¡Bienvenido al Dashboard!
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              Has iniciado sesión correctamente con: <strong>{user?.email}</strong>
            </p>

            <div class="mt-6 border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900">
                Información de Usuario
              </h3>
              <dl class="mt-4 space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">ID</dt>
                  <dd class="mt-1 text-sm text-gray-900 font-mono">
                    {user?.id}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Estado</dt>
                  <dd class="mt-1">
                    <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Autenticado
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* System Status */}
          <div class="mt-6 rounded-lg bg-blue-50 px-5 py-4">
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
                <h3 class="text-sm font-medium text-blue-800">
                  Sistema de Autenticación Activo
                </h3>
                <p class="mt-2 text-sm text-blue-700">
                  El sistema de autenticación con Supabase está funcionando correctamente.
                  Esta es una ruta protegida que solo es accesible para usuarios autenticados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
})
