/**
 * HeroSection Component - Landing Page Main Section (Nueva Arquitectura)
 * 
 * Estructura: 
 * - Sección principal con fondo animado
 * - Div principal flex-row con 2 partes (3/5 contenido, 2/5 imagen)
 * - Carrusel de tecnologías independiente
 * 
 * [CITE: UX_GUIDE.md] - Hero section para alta conversión con tipografía audaz
 * [CITE: TAILWIND_QWIK_GUIDE.md] - Variables CSS dinámicas y responsive design
 * [CITE: ARQUITECTUR_FOLDER.md] - Separación de responsabilidades en components/
 */

import { component$, useStylesScoped$ } from '@builder.io/qwik';

export const HeroSection = component$(() => {
  useStylesScoped$(`
    /* Gradiente de fondo animado */
    .mesh-gradient {
      background: linear-gradient(
        135deg,
        rgb(15 23 42) 0%,
        rgb(30 41 59) 25%,
        rgb(55 48 163) 50%,
        rgb(30 41 59) 75%,
        rgb(0 0 0) 100%
      );
      background-size: 400% 400%;
      animation: meshMove 10s ease-in-out infinite;
    }
    
    @keyframes meshMove {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }
    
    /* Animaciones de entrada */
    .hero-content {
      animation: heroFadeIn 1s ease-out;
    }
    
    .hero-visual {
      animation: heroFadeIn 1s ease-out 0.3s both;
    }
    
    .tech-carousel {
      animation: heroFadeIn 1s ease-out 0.6s both;
    }
    
    @keyframes heroFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Carrusel de tecnologías */
    .tech-scroll {
      animation: techScroll 20s linear infinite;
    }
    
    @keyframes techScroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    
    .tech-item {
      transition: all 0.2s ease;
    }
    
    .tech-item:hover {
      transform: translateY(-2px);
      color: oklch(var(--bc) / 0.8);
    }
    
    /* Placeholder para imagen/canvas */
    .hero-visual-placeholder {
      background: linear-gradient(45deg, 
        oklch(var(--p) / 0.1), 
        oklch(var(--s) / 0.1)
      );
      border: 2px dashed oklch(var(--bc) / 0.3);
    }
  `);

  return (
    <section class="mesh-gradient min-screen-minus-header relative">
      {/* Contenido Principal - Flex Row con 2 partes */}
   

      {/* Carrusel de Tecnologías */}
      
    </section>
  );
});