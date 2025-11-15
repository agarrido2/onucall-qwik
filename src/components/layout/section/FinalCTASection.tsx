import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

/**
 * Final CTA Section - Llamada a la Acción Final
 *
 * Último empujón para la conversión.
 *
 * [CITE: LANDING_PROMPT.md - FinalCTASection]
 */

export const FinalCTASection = component$(() => {
  return (
    <section
      id="final-cta"
      class="relative bg-gradient-to-br from-blue-600 to-blue-800 py-20"
    >
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-4xl text-center text-white">
          <h2 class="mb-6 text-5xl font-bold sm:text-6xl">
            ¿Listo para convertir cada llamada en una venta?
          </h2>

          <p class="mb-10 text-xl text-blue-100">
            Empieza en menos de 5 minutos. Sin contratos a largo plazo ni
            permanencia. Cancela en cualquier momento si no estás satisfecho.
          </p>

          <Link
            href="/register"
            class="inline-flex items-center justify-center rounded-lg bg-white px-12 py-5 text-xl font-bold text-blue-600 shadow-2xl transition-all hover:scale-105 hover:bg-blue-50 focus:ring-4 focus:ring-white/50 focus:outline-none"
          >
            Empieza Gratis
          </Link>
        </div>
      </div>
    </section>
  );
});
