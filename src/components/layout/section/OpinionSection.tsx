import { component$ } from "@builder.io/qwik";

/**
 * Opinion Section - Qué opinan de Onucall
 *
 * Testimonios de clientes satisfechos.
 *
 * [CITE: LANDING_PROMPT.md - OpinionSection]
 */

const testimonials = [
  {
    quote:
      "Ha cambiado las reglas del juego para nosotros. El agente conoce nuestro catálogo de impresoras mejor que algunos empleados. Hemos aumentado las solicitudes de presupuesto en un 30%.",
    author: "Marcos Vega",
    role: "Gerente de TecnoDistribución",
  },
  {
    quote:
      "Estaba perdiendo clientes que llamaban para preguntar por modelos de zapatillas mientras atendía en la tienda. Ahora Onucall gestiona todas esas consultas y yo me centro en la venta presencial.",
    author: "Laura Jiménez",
    role: "Propietaria de Urban Step",
  },
  {
    quote:
      "La mejor inversión que he hecho. Simple de configurar y el impacto fue inmediato. Mis clientes valoran poder llamar a cualquier hora para preguntar por los componentes.",
    author: "Ana Torres",
    role: "Fundadora de PC-Componentes Online",
  },
];

export const OpinionSection = component$(() => {
  return (
    <section id="opinion" class="bg-gradient-to-b from-white to-gray-50 py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-6xl">
          {/* Título */}
          <h2 class="mb-16 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
            Lo que dicen los dueños de negocios como tú
          </h2>

          {/* Grid de Testimonios */}
          <div class="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div class="mb-4">
                  <svg
                    class="h-10 w-10 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <p class="mb-6 leading-relaxed text-gray-700 italic">
                  "{testimonial.quote}"
                </p>

                <div class="border-t border-gray-200 pt-4">
                  <p class="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p class="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
