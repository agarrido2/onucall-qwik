import { component$, useSignal } from "@builder.io/qwik";

/**
 * Stories Tabs - Las historias de Elena y Carlos
 *
 * Historias de transformación de clientes.
 *
 * [CITE: LANDING_PROMPT.md - StoriesTabs]
 */

const stories = [
  {
    name: "Elena",
    subtitle: "Distribuidora de Componentes",
    problem:
      "El estrés de las llamadas perdidas y las oportunidades de venta evaporadas",
    before:
      "Elena pasaba sus días en un caos constante. Las llamadas con preguntas sobre especificaciones de componentes la interrumpían mientras atendía a clientes en la tienda. Cada llamada perdida era una venta que se evaporaba. El teléfono sonaba sin parar preguntando por stock, compatibilidades y precios, mientras los clientes presenciales esperaban frustrados.",
    after:
      "Tras implementar Onucall, Elena ha recuperado el control total. El agente de IA gestiona el 95% de las consultas iniciales sobre su catálogo de productos, cualifica a los clientes potenciales y agenda llamadas para ella. Ahora puede dedicarse a cerrar ventas importantes sin interrupciones.",
    quote:
      "Onucall no es una herramienta, es mi empleado más rentable. Conoce mi inventario mejor que nadie.",
  },
  {
    name: "Carlos",
    subtitle: "Concesionario de Coches",
    problem:
      "Un equipo de ventas desbordado y clientes impacientes en la exposición",
    before:
      "Su mejor vendedor pasaba horas al día al teléfono respondiendo preguntas básicas sobre modelos de coches y equipamiento. Los clientes que estaban físicamente en el concesionario esperaban tiempos interminables, generando frustración y perdiendo oportunidades de venta. El equipo estaba agotado y las ventas se resentían.",
    after:
      "El agente de IA de Onucall se encarga ahora de toda la gestión de citas para pruebas de conducción y de las preguntas frecuentes sobre los vehículos 24/7. Su equipo de ventas se centra exclusivamente en la atención presencial y en el cierre de ventas. Los clientes valoran poder llamar fuera de horario.",
    quote:
      "Hemos duplicado nuestra capacidad de atención sin contratar a nadie nuevo. Es increíble.",
  },
];

export const StoriesTabs = component$(() => {
  const activeTab = useSignal(0);

  return (
    <section id="stories" class="bg-white py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-5xl">
          {/* Título */}
          <h2 class="mb-12 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
            Creado para negocios de productos como el tuyo
          </h2>

          {/* Tabs */}
          <div class="mb-8 flex justify-center gap-4">
            {stories.map((story, idx) => (
              <button
                key={idx}
                onClick$={() => (activeTab.value = idx)}
                class={{
                  "rounded-lg px-6 py-3 font-semibold transition-all": true,
                  "bg-blue-600 text-white shadow-lg": activeTab.value === idx,
                  "bg-gray-100 text-gray-700 hover:bg-gray-200":
                    activeTab.value !== idx,
                }}
              >
                {story.name} | {story.subtitle}
              </button>
            ))}
          </div>

          {/* Content */}
          <div class="rounded-2xl bg-gray-50 p-8 shadow-lg">
            <h3 class="mb-4 text-2xl font-bold text-gray-900">
              {stories[activeTab.value].problem}
            </h3>

            <div class="space-y-6">
              <div>
                <h4 class="mb-2 text-lg font-semibold text-red-600">
                  El Antes
                </h4>
                <p class="leading-relaxed text-gray-700">
                  {stories[activeTab.value].before}
                </p>
              </div>

              <div>
                <h4 class="mb-2 text-lg font-semibold text-green-600">
                  El Después
                </h4>
                <p class="leading-relaxed text-gray-700">
                  {stories[activeTab.value].after}
                </p>
              </div>

              <blockquote class="border-l-4 border-blue-600 pl-4 text-gray-800 italic">
                "{stories[activeTab.value].quote}"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
