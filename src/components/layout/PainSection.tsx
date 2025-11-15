/**
 * PainSection Component - Landing Page Pain Points Section
 *
 * Sección que identifica y valida los puntos de dolor del usuario,
 * siguiendo los patrones de alta conversión establecidos en la guía UX.
 * Implementa diseño responsive completo con Bento Grid adaptativo.
 *
 * [CITE: UX_GUIDE.md] - Sección Pain para validar problemas del usuario
 * [CITE: TAILWIND_QWIK_GUIDE.md] - Variables CSS dinámicas y Bento Grid responsive
 * [CITE: ARQUITECTUR_FOLDER.md] - Componente en sistema de diseño
 */

import { component$ } from "@builder.io/qwik";

export const PainSection = component$(() => {
  return (
    <section class="section-spacing bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div class="container-responsive">
        {/* Título Principal de la Sección */}
        <div class="mb-8 text-center sm:mb-12 lg:mb-16">
          <h2 class="mb-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            ¿Cansado de perder clientes o tenerlos desantentidos?
          </h2>
          <p class="mx-auto max-w-2xl text-base text-gray-300 sm:text-lg lg:text-xl">
            Las empresas pierden miles de euros cada día por no estar
            disponibles 24/7. Estos son los problemas que tu negocio enfrenta:
          </p>
        </div>

        {/* Bento Grid Responsive con Pain Points */}
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Pain Point 1 - Card Principal (destacada) */}
          <div class="pain-card rounded-2xl border border-red-500/30 bg-red-900/20 p-6 lg:col-span-2 lg:p-8">
            <div class="flex items-start space-x-4">
              {/* Icono Pain */}
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/20 lg:h-16 lg:w-16">
                <svg
                  class="h-6 w-6 text-red-400 lg:h-8 lg:w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Contenido */}
              <div class="flex-1">
                <h3 class="mb-2 text-lg font-semibold text-white lg:text-xl">
                  Llamadas desantendidas = Clientes Perdidos
                </h3>
                <p class="text-sm leading-relaxed text-gray-300 lg:text-base">
                  El 73% de los clientes que no son atendidos inmediatamente
                  contacta con la competencia. Cada llamada sin respuesta puede
                  representar cientos o miles de euros en ingresos perdidos.
                </p>
              </div>
            </div>
          </div>

          {/* Pain Point 2 */}
          <div class="pain-card rounded-2xl border border-orange-500/30 bg-orange-900/20 p-6">
            <div class="text-center">
              {/* Icono */}
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20">
                <svg
                  class="h-6 w-6 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>

              <h3 class="mb-2 text-lg font-semibold text-white">
                Personal costoso y limitado
              </h3>
              <p class="text-sm leading-relaxed text-gray-300">
                Contratar y formar personal especializado cuesta tiempo y
                dinero. Además, solo pueden atender en horario laboral.
              </p>
            </div>
          </div>

          {/* Pain Point 3 */}
          <div class="pain-card rounded-2xl border border-yellow-500/30 bg-yellow-900/20 p-6">
            <div class="text-center">
              {/* Icono */}
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">
                <svg
                  class="h-6 w-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 class="mb-2 text-lg font-semibold text-white">
                Leads sin cualificar
              </h3>
              <p class="text-sm leading-relaxed text-gray-300">
                Tu equipo pierde tiempo con clientes que no están listos para
                comprar, en lugar de enfocarse en oportunidades reales.
              </p>
            </div>
          </div>

          {/* Pain Point 4 */}
          <div class="pain-card rounded-2xl border border-purple-500/30 bg-purple-900/20 p-6">
            <div class="text-center">
              {/* Icono */}
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                <svg
                  class="h-6 w-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 class="mb-2 text-lg font-semibold text-white">
                Horarios limitados
              </h3>
              <p class="text-sm leading-relaxed text-gray-300">
                Los clientes llaman cuando necesitan información, no solo de 9 a
                18h. Pierdes oportunidades fuera del horario laboral.
              </p>
            </div>
          </div>

          {/* Pain Point 5 */}
          <div class="pain-card rounded-2xl border border-purple-500/30 bg-purple-900/20 p-6">
            <div class="text-center">
              {/* Icono */}
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                <svg
                  class="h-6 w-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 class="mb-2 text-lg font-semibold text-white">Control</h3>
              <p class="text-sm leading-relaxed text-gray-300">
                Los clientes llaman cuando necesitan información, no solo de 9 a
                18h. Pierdes oportunidades fuera del horario laboral.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action al final de la sección */}
        <div class="mt-8 text-center sm:mt-12 lg:mt-16">
          <p class="mb-4 text-sm text-gray-400 sm:text-base">
            ¿Te suena familiar? Hay una solución mejor...
          </p>
          <button
            type="button"
            class="inline-flex items-center rounded-full border border-indigo-500 px-6 py-3 font-medium text-indigo-400 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-500/10 sm:px-8 sm:py-4"
          >
            Descubre la Solución
            <svg
              class="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
});
