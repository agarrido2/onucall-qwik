/**
 * Landing Page - Onucall
 *
 * Página principal de la landing page de Onucall.
 * Implementación completa según LANDING_PROMPT.md
 *
 * [CITE: LANDING_PROMPT.md] - Briefing completo del producto
 * [CITE: UX_GUIDE.md] - Arquitectura de landing pages de alta conversión
 * [CITE: TAILWIND_QWIK_GUIDE.md] - Organización modular de componentes
 */

import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeAction$, zod$, z } from "@builder.io/qwik-city";

import { HeroSection } from "~/components/layout/HeroSection";
import { DemoSection } from "~/components/layout/section/DemoSection";
import { PainPointsSection } from "~/components/layout/section/PainPointsSection";
import { StoriesTabs } from "~/components/layout/section/StoriesTabs";
import { OpinionSection } from "~/components/layout/section/OpinionSection";
import { FeaturesSection } from "~/components/layout/section/FeaturesSection";
import { FAQSection } from "~/components/layout/section/FAQSection";
import { PricingSection } from "~/components/layout/section/PricingSection";
import { AboutUsSection } from "~/components/layout/section/AboutUsSection";
import { FinalCTASection } from "~/components/layout/section/FinalCTASection";

/**
 * Demo Action - Procesa solicitud de llamada demo
 *
 * [CITE: CAPITULO-9.md] - routeAction$ para mutaciones
 * [CITE: QUALITY_STANDARDS.md] - Validación server-side con Zod
 */
const demoSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  productType: z.enum(["coches", "informatica", "muebles", "belleza"], {
    errorMap: () => ({ message: "Selecciona un tipo de producto" }),
  }),
});

export const useDemoAction = routeAction$(async (values) => {
  // TODO: Integrar con Retell AI / Zadarma para iniciar llamada
  console.log("Demo solicitada:", values);

  return {
    success: true,
    message:
      "Recibirás tu llamada en breve. Prepárate para hablar con nuestro agente IA.",
  };
}, zod$(demoSchema));

export default component$(() => {
  const demoAction = useDemoAction();

  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Demo Section - Pruébalo tú mismo */}
      <DemoSection demoAction={demoAction} />

      {/* Pain Points - ¿Es para ti? */}
      <PainPointsSection />

      {/* Stories - Elena y Carlos */}
      <StoriesTabs />

      {/* Opinion - Testimonios */}
      <OpinionSection />

      {/* Features - Características */}
      <FeaturesSection />

      {/* FAQ - Preguntas frecuentes */}
      <FAQSection />

      {/* Pricing - Planes */}
      <PricingSection />

      {/* About Us - Nosotros */}
      <AboutUsSection />

      {/* Final CTA */}
      <FinalCTASection />
    </main>
  );
});

export const head: DocumentHead = {
  title: "Onucall - El mejor empleado digital 24/7",
  meta: [
    {
      name: "description",
      content:
        "Agente comercial con IA por voz disponible 24/7. Atiende dudas técnicas, cualifica leads y agenda visitas de venta con voz profesional.",
    },
    {
      name: "keywords",
      content:
        "IA, agente comercial, voz artificial, lead qualification, automatización, ventas",
    },
    {
      name: "author",
      content: "Onucall",
    },
    // Open Graph
    {
      property: "og:title",
      content: "Onucall - El mejor empleado digital 24/7",
    },
    {
      property: "og:description",
      content:
        "Agente comercial con IA por voz disponible 24/7. Configúralo en minutos, sin complicaciones.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://onucall.com",
    },
    {
      property: "og:image",
      content: "https://onucall.com/og-image.png",
    },
    {
      property: "og:image:width",
      content: "1200",
    },
    {
      property: "og:image:height",
      content: "630",
    },
    // Twitter Card
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "Onucall - El mejor empleado digital 24/7",
    },
    {
      name: "twitter:description",
      content:
        "Agente comercial con IA por voz disponible 24/7. Configúralo en minutos, sin complicaciones.",
    },
    {
      name: "twitter:image",
      content: "https://onucall.com/og-image.png",
    },
  ],
};
