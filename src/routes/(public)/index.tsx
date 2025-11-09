/**
 * Landing Page - Onucall
 * 
 * Página principal de la landing page de Onucall.
 * Ensambla todos los componentes principales: Header, HeroSection y Footer.
 * 
 * [CITE: UX_GUIDE.md] - Arquitectura de landing pages de alta conversión
 * [CITE: TAILWIND_QWIK_GUIDE.md] - Organización modular de componentes
 */

import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import { HeroSection } from "~/components/layout/HeroSection";
import { PainSection } from "~/components/layout/PainSection";


export default component$(() => {
  return (
    <>
      
        {/* Hero Section */}
        <HeroSection />

        {/* Pain Section - Validación de problemas del usuario */}
        <PainSection />

        {/* Placeholders para futuras secciones */}
        {/* Beneficios Section */}
        {/* Como Funciona Section */}
        {/* Metricas Section */}
        {/* Testimonios Section */}
        {/* FAQ Section */}
        {/* CTA Final Section */}
 


    </>
  );
});

export const head: DocumentHead = {
  title: "Onucall - El mejor empleado digital 24/7",
  meta: [
    {
      name: "description",
      content: "Agente comercial con IA por voz disponible 24/7. Atiende dudas técnicas, cualifica leads y agenda visitas de venta con voz profesional.",
    },
    {
      name: "keywords",
      content: "IA, agente comercial, voz artificial, lead qualification, automatización, ventas",
    },
    {
      name: "author",
      content: "Onucall",
    },
    {
      property: "og:title",
      content: "Onucall - El mejor empleado digital 24/7",
    },
    {
      property: "og:description",
      content: "Agente comercial con IA por voz disponible 24/7. Configúralo en minutos, sin complicaciones.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
};
