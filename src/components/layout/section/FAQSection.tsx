import { component$, useSignal } from "@builder.io/qwik";

/**
 * FAQ Section - Preguntas y Respuestas
 *
 * Acordeón con preguntas frecuentes.
 *
 * [CITE: LANDING_PROMPT.md - FAQSection]
 */

const faqs = [
  {
    question:
      "¿Es difícil configurar el agente de IA? No tengo conocimientos técnicos.",
    answer:
      "¡Para nada! Hemos diseñado el proceso para que sea increíblemente sencillo. Si sabes rellenar un formulario, sabes configurar Onucall. En menos de 5 minutos, estarás listo para recibir llamadas. Nosotros nos encargamos de toda la complejidad técnica.",
  },
  {
    question: '¿Cómo "aprende" el agente sobre mis productos?',
    answer:
      "Es muy fácil. Puedes subir un fichero (como un CSV o un Excel) con la información de tu catálogo, o conectar directamente tu tienda online (compatible con Shopify, WooCommerce, etc.). El agente procesa esta información y la usa para responder a las preguntas de tus clientes.",
  },
  {
    question: "¿Qué pasa si una llamada es muy compleja para el agente?",
    answer:
      "Nuestro agente está entrenado para reconocer cuándo una conversación requiere intervención humana. En esos casos, puede tomar nota y asegurar al cliente que un experto humano le devolverá la llamada, o incluso intentar transferir la llamada a un número que tú especifiques.",
  },
  {
    question: "¿Mis datos y los de mis clientes están seguros?",
    answer:
      "La seguridad es nuestra máxima prioridad. Todas las conversaciones y datos se gestionan bajo estrictos protocolos de seguridad y encriptación. Cumplimos con todas las normativas de protección de datos.",
  },
];

export const FAQSection = component$(() => {
  const openIndex = useSignal<number | null>(null);

  return (
    <section id="faq" class="bg-white py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-3xl">
          {/* Título */}
          <h2 class="mb-12 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
            Resolvemos tus dudas
          </h2>

          {/* Acordeón */}
          <div class="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                class="rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <button
                  onClick$={() => {
                    openIndex.value = openIndex.value === idx ? null : idx;
                  }}
                  class="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span class="pr-4 font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <svg
                    class={{
                      "h-5 w-5 flex-shrink-0 text-gray-600 transition-transform": true,
                      "rotate-180": openIndex.value === idx,
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openIndex.value === idx && (
                  <div class="px-6 pb-4 leading-relaxed text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
