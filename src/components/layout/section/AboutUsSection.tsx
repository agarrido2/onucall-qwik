import { component$ } from "@builder.io/qwik";

/**
 * About Us Section - Nosotros
 *
 * Presenta la misión de Onucall.
 *
 * [CITE: LANDING_PROMPT.md - AboutUsSection]
 */

export const AboutUsSection = component$(() => {
  return (
    <section id="about" class="bg-white py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-4xl text-center">
          <h2 class="mb-8 text-4xl font-bold text-gray-900 sm:text-5xl">
            Nuestra misión es potenciar a los vendedores
          </h2>

          <div class="space-y-6 text-lg leading-relaxed text-gray-700">
            <p>
              Creamos Onucall porque creemos que cada negocio, sin importar su
              tamaño, merece tener acceso a tecnología de voz de IA de nivel
              empresarial.
            </p>

            <p>
              Nos apasiona ayudar a negocios como el de Elena o Carlos a
              competir en igualdad de condiciones en un mundo digital. La
              tecnología no debería ser una barrera, sino un aliado comercial
              que te ayude a crecer.
            </p>

            <p>
              Nuestro compromiso es con la simplicidad, el soporte cercano y
              resultados medibles. No vendemos humo, vendemos llamadas atendidas
              y ventas cerradas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});
