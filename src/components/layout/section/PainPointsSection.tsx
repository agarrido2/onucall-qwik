import { component$ } from "@builder.io/qwik";

/**
 * Pain Points Section - ¿Es para ti?
 *
 * Presenta los problemas comunes que Onucall resuelve
 * para negocios de productos.
 *
 * [CITE: LANDING_PROMPT.md - PainPointsSection]
 */

const painPoints = [
  {
    icon: "📦",
    text: "¿Cansado de que el teléfono te interrumpa con preguntas sobre el stock o especificaciones de un producto mientras atiendes a un cliente en persona?",
  },
  {
    icon: "🛒",
    text: "¿Te preocupa cuántas ventas pierdes al día por no poder asesorar inmediatamente a cada cliente que llama interesado en tus productos?",
  },
  {
    icon: "📞",
    text: "¿Sientes que tu equipo pierde tiempo valioso respondiendo preguntas repetitivas sobre productos en lugar de centrarse en cerrar ventas complejas?",
  },
  {
    icon: "💰",
    text: "¿El coste de contratar a un equipo comercial para cubrir todas las horas y responder a todas las consultas te parece inasumible?",
  },
];

export const PainPointsSection = component$(() => {
  return (
    <section id="foryou" class="bg-white py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-4xl">
          {/* Título */}
          <h2 class="mb-16 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
            ¿Eres dueño de una tienda, distribuidora, concesionario o vendes
            algo?
          </h2>

          {/* Grid de Pain Points */}
          <div class="grid gap-8 sm:grid-cols-2">
            {painPoints.map((point, idx) => (
              <div
                key={idx}
                class="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all hover:border-blue-300 hover:shadow-lg"
              >
                <div class="mb-4 text-4xl">{point.icon}</div>
                <p class="leading-relaxed text-gray-700">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
