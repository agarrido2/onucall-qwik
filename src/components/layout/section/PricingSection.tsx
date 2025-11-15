import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

/**
 * Pricing Section - Planes de Precios
 *
 * Presenta los planes de suscripción de Onucall.
 *
 * [CITE: LANDING_PROMPT.md - PricingSection]
 */

const plans = [
  {
    name: "Starter",
    price: "49€",
    period: "mes",
    description: "Perfecto para tiendas y negocios con un catálogo pequeño.",
    features: [
      "Hasta 100 llamadas/mes",
      "Gestión de hasta 50 productos",
      "1 Agente de IA",
      "Transcripciones",
      "Soporte por email",
    ],
    cta: "Empezar ahora",
    highlighted: false,
  },
  {
    name: "Business",
    price: "99€",
    period: "mes",
    description: "Ideal para PYMES en crecimiento con catálogos más amplios.",
    badge: "Más Popular",
    features: [
      "Hasta 500 llamadas/mes",
      "Gestión de hasta 500 productos",
      "3 Agentes de IA",
      "Todo lo de Starter +",
      "Agendamiento de Citas",
      "Soporte Prioritario",
    ],
    cta: "Empezar ahora",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Contactar",
    period: "",
    description: "Soluciones a medida para grandes volúmenes y catálogos.",
    features: [
      "Llamadas ilimitadas",
      "Productos ilimitados",
      "Todo lo de Business +",
      "Integración directa con eCommerce/CRM",
      "Manager de cuenta dedicado",
    ],
    cta: "Contactar con Ventas",
    highlighted: false,
  },
];

export const PricingSection = component$(() => {
  return (
    <section id="pricing" class="bg-gradient-to-b from-gray-50 to-white py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-6xl">
          {/* Título */}
          <h2 class="mb-16 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
            Un plan para cada tamaño de catálogo
          </h2>

          {/* Grid de Planes */}
          <div class="grid gap-8 lg:grid-cols-3">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                class={{
                  "relative rounded-2xl p-8 transition-all": true,
                  "scale-105 border-4 border-blue-400 bg-blue-600 text-white shadow-2xl":
                    plan.highlighted,
                  "border-2 border-gray-200 bg-white shadow-sm hover:shadow-lg":
                    !plan.highlighted,
                }}
              >
                {plan.badge && (
                  <div class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-gray-900">
                    {plan.badge}
                  </div>
                )}

                <div class="mb-6">
                  <h3
                    class={{
                      "mb-2 text-2xl font-bold": true,
                      "text-white": plan.highlighted,
                      "text-gray-900": !plan.highlighted,
                    }}
                  >
                    {plan.name}
                  </h3>

                  <div class="mb-3 flex items-baseline gap-1">
                    <span
                      class={{
                        "text-4xl font-bold": true,
                        "text-white": plan.highlighted,
                        "text-gray-900": !plan.highlighted,
                      }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        class={{
                          "text-lg": true,
                          "text-blue-100": plan.highlighted,
                          "text-gray-600": !plan.highlighted,
                        }}
                      >
                        /{plan.period}
                      </span>
                    )}
                  </div>

                  <p
                    class={{
                      "text-sm": true,
                      "text-blue-100": plan.highlighted,
                      "text-gray-600": !plan.highlighted,
                    }}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul class="mb-8 space-y-3">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} class="flex items-start gap-2">
                      <svg
                        class={{
                          "mt-0.5 h-5 w-5 flex-shrink-0": true,
                          "text-blue-200": plan.highlighted,
                          "text-green-600": !plan.highlighted,
                        }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span
                        class={{
                          "text-sm": true,
                          "text-blue-50": plan.highlighted,
                          "text-gray-700": !plan.highlighted,
                        }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Enterprise" ? "/#contacto" : "/register"}
                  class={{
                    "block w-full rounded-lg px-6 py-3 text-center font-semibold transition-all": true,
                    "bg-white text-blue-600 hover:bg-blue-50": plan.highlighted,
                    "bg-blue-600 text-white hover:bg-blue-700":
                      !plan.highlighted,
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
