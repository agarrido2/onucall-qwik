import { component$ } from '@builder.io/qwik';

/**
 * Features Section - Características
 * 
 * Detalla las capacidades del agente IA y la plataforma.
 * 
 * [CITE: LANDING_PROMPT.md - FeaturesSection]
 */

const features = [
  {
    icon: '🌙',
    title: 'Asesor de Productos 24/7',
    description: 'Tu negocio siempre abierto. Nuestro agente de IA atiende y asesora a clientes sobre tus productos fuera de tu horario comercial, fines de semana y festivos.',
  },
  {
    icon: '📝',
    title: 'Transcripciones y Datos de Venta',
    description: 'Revisa cada conversación. Todas las llamadas son transcritas y almacenadas para que puedas analizar qué productos interesan más y qué dudas tienen tus clientes.',
  },
  {
    icon: '📅',
    title: 'Agendamiento de Citas Comerciales',
    description: 'Deja que nuestro agente agende demostraciones o citas con tu equipo de ventas directamente en tu calendario, sin intervención manual.',
  },
  {
    icon: '🚀',
    title: 'Lanzamiento en Menos de 5 Minutos',
    description: 'Date de alta, responde unas preguntas sobre tu negocio, sube tu catálogo de productos (¡o conecta tu tienda online!) y tu agente estará listo para atender llamadas.',
  },
  {
    icon: '📚',
    title: 'Gestión Sencilla de Productos',
    description: 'Añade, edita o elimina productos de la base de conocimiento de tu agente de IA desde un panel de control intuitivo y fácil de usar.',
  },
  {
    icon: '📊',
    title: 'Informes Claros y Accionables',
    description: 'Entiende de un vistazo qué está pasando. Recibe informes sobre el número de llamadas, los productos más consultados y los leads generados.',
  },
];

export const FeaturesSection = component$(() => {
  return (
    <section id="features" class="bg-gradient-to-b from-gray-50 to-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          {/* Título */}
          <h2 class="text-4xl font-bold text-gray-900 text-center mb-4 sm:text-5xl">
            Un agente comercial experto y una plataforma insultantemente fácil de usar
          </h2>
          
          <p class="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Todo lo que necesitas para que tu negocio nunca pierda una oportunidad de venta.
          </p>
          
          {/* Grid de Features */}
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-300"
              >
                <div class="text-5xl mb-4">{feature.icon}</div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p class="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
