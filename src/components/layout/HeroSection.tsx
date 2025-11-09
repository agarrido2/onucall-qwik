

import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

/**
 * Hero Section - Landing Page
 * 
 * Sección principal con propuesta de valor de OnuCall.
 * Conserva el background mesh gradient animado.
 * 
 * [CITE: LANDING_PROMPT.md - Hero Section]
 * [CITE: UX_GUIDE.md - Diseño centrado en usuario]
 * [CITE: TAILWIND_QWIK_GUIDE.md - Styling con Tailwind v4]
 */
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
    <section id="hero" class="mesh-gradient relative overflow-hidden" style="height: 100vh;">
      {/* Contenido Principal - Grid 2 columnas */}
      <div class="container mx-auto px-4 h-full flex items-center">
        <div class="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center w-full pb-24">
          
          {/* Columna Izquierda - Texto */}
          <div class="hero-content space-y-8 text-center lg:text-left">
            <h1 class="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              El mejor empleado digital al servicio de tu cliente 24/7
            </h1>
            
            <p class="text-lg text-gray-300 sm:text-xl lg:text-2xl">
              Atiende dudas técnicas sobre tus productos, cualifica leads y agenda visitas de venta con voz profesional — configúralo en minutos, sin complicaciones.
            </p>
            
            {/* CTAs */}
            <div class="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/#pricing"
                class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Comienza Gratis
              </Link>
              
              <Link
                href="/#demo"
                class="inline-flex items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
              >
                Ver Demostración
              </Link>
            </div>
          </div>
          
          {/* Columna Derecha - Visual */}
          <div class="hero-visual flex items-center justify-center">
            <div class="hero-visual-placeholder w-full max-w-lg rounded-2xl aspect-square flex items-center justify-center text-white/50 text-center p-8">
              <div>
                <svg aria-hidden="true" class="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p class="text-sm">Dashboard de gestión de llamadas y citas</p>
                <p class="text-xs mt-2 opacity-70">(Imagen placeholder)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carrusel de Tecnologías - Parte inferior */}
      <div class="tech-carousel absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-sm py-6">
        <div class="container mx-auto px-4">
          <p class="text-center text-sm text-white/60 mb-4">
            Construido con las mejores tecnologías
          </p>
          
          <div class="overflow-hidden relative">
            <div class="tech-scroll flex gap-12 justify-center items-center">
              {/* Primera iteración de logos */}
              {['Qwik', 'Supabase', 'Drizzle', 'Retell AI', 'Zadarma', 'n8n', 'OVH'].map((tech, idx) => (
                <div key={`tech-1-${idx}`} class="tech-item flex-shrink-0 text-white/40 font-semibold text-sm grayscale hover:grayscale-0 hover:text-white/60">
                  {tech}
                </div>
              ))}
              
              {/* Segunda iteración (duplicada para efecto infinito) */}
              {['Qwik', 'Supabase', 'Drizzle', 'Retell AI', 'Zadarma', 'n8n', 'OVH'].map((tech, idx) => (
                <div key={`tech-2-${idx}`} class="tech-item flex-shrink-0 text-white/40 font-semibold text-sm grayscale hover:grayscale-0 hover:text-white/60">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});