import { component$, useSignal } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import type { ActionStore } from '@builder.io/qwik-city';

/**
 * Demo Section - Pruébalo tú mismo
 * 
 * Permite al usuario solicitar una llamada de demostración
 * con el agente IA de OnuCall.
 * 
 * [CITE: LANDING_PROMPT.md - DemoSection]
 * [CITE: QUALITY_STANDARDS.md - Validación con Zod]
 */

interface DemoSectionProps {
  demoAction: ActionStore<any, any, true>;
}

export const DemoSection = component$<DemoSectionProps>(({ demoAction }) => {
  const isLoading = useSignal(false);

  return (
    <section id="demo" class="relative bg-gradient-to-b from-gray-50 to-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          {/* Título */}
          <h2 class="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Escúchalo tú mismo. Recibe una llamada de nuestro agente comercial AI
          </h2>
          
          <p class="text-xl text-gray-600 mb-12">
            Selecciona el tipo de producto sobre el que quieres que el agente te asesore 
            y descubre cómo Onucall convierte tus llamadas.
          </p>

          {/* Formulario */}
          <Form action={demoAction} class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Success Message */}
            {demoAction.value?.success && (
              <div class="rounded-lg bg-green-50 p-4 border border-green-200" role="alert">
                <p class="text-sm text-green-800">{demoAction.value.message}</p>
              </div>
            )}

            {/* Error Message */}
            {demoAction.value?.failed && (
              <div class="rounded-lg bg-red-50 p-4 border border-red-200" role="alert">
                <p class="text-sm text-red-800">
                  {demoAction.value.formErrors?.join(', ') || 'Error al procesar la solicitud'}
                </p>
              </div>
            )}

            {/* Nombre */}
            <div class="text-left">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={isLoading.value}
                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                placeholder="Tu nombre"
              />
            </div>

            {/* Email */}
            <div class="text-left">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading.value}
                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                placeholder="tu@email.com"
              />
            </div>

            {/* Teléfono */}
            <div class="text-left">
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Número de Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                disabled={isLoading.value}
                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                placeholder="+34 600 000 000"
              />
            </div>

            {/* Tipo de Producto */}
            <div class="text-left">
              <label for="productType" class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Producto
              </label>
              <select
                id="productType"
                name="productType"
                required
                disabled={isLoading.value}
                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <option value="">Selecciona una categoría</option>
                <option value="coches">Coches</option>
                <option value="informatica">Componentes Informáticos</option>
                <option value="muebles">Muebles</option>
                <option value="belleza">Productos de Belleza</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading.value || demoAction.value?.success}
              class="w-full rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading.value ? 'Procesando...' : 'Recibir mi Llamada Demo'}
            </button>
          </Form>
        </div>
      </div>
    </section>
  );
});
