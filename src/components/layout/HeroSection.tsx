/**
 * HeroSection Component - Landing Page Main Section
 * 
 * Sección principal de la landing page con gradiente de malla animado,
 * título hero, CTAs y barra de tecnologías.
 * 
 * [CITE: UX_GUIDE.md] - Hero section para alta conversión con tipografía audaz
 * [CITE: TAILWIND_QWIK_GUIDE.md] - Gradientes de malla y micro-interacciones
 */

import { component$, useStylesScoped$ } from '@builder.io/qwik';

export const HeroSection = component$(() => {
  useStylesScoped$(`
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
    
    .hero-title {
      animation: heroFadeIn 1s ease-out;
    }
    
    .hero-subtitle {
      animation: heroFadeIn 1s ease-out 0.2s both;
    }
    
    .hero-ctas {
      animation: heroFadeIn 1s ease-out 0.4s both;
    }
    
    .tech-bar {
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
    
    .btn-primary {
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      background-color: rgb(67 56 202);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(67, 56, 202, 0.3);
    }
    
    .btn-secondary {
      transition: all 0.3s ease;
    }
    
    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
    }
    
    .tech-item {
      transition: all 0.2s ease;
    }
    
    .tech-item:hover {
      transform: translateY(-2px);
      color: rgb(156 163 175);
    }
  `);

  return (
    <section class="mesh-gradient min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-4xl mx-auto">
        {/* Título Principal */}
        <h1 class="hero-title text-5xl md:text-7xl font-extrabold text-white text-center leading-tight">
          El mejor empleado digital al servicio de tu cliente 24/7.
        </h1>

        {/* Subtítulo */}
        <p class="hero-subtitle text-gray-300 max-w-2xl text-center mt-6 text-lg md:text-xl leading-relaxed mx-auto">
          Atiende dudas técnicas sobre tus productos, cualifica leads y agenda visitas de venta con voz profesional — configúralo en minutos, sin complicaciones.
        </p>

        {/* Botones de Acción (CTAs) */}
        <div class="hero-ctas mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            class="btn-primary bg-indigo-600 text-white rounded-full px-8 py-4 text-lg font-semibold"
          >
            Empieza Gratis
          </button>
          <button
            type="button"
            class="btn-secondary border border-white text-white bg-transparent rounded-full px-8 py-4 text-lg font-semibold"
          >
            Ver Demostración
          </button>
        </div>
      </div>

      {/* Barra de Tecnologías */}
      <div class="tech-bar absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
        <p class="text-gray-500 text-sm mb-4">
          Construido con las mejores tecnologías:
        </p>
        <div class="flex flex-wrap justify-center items-center space-x-6 text-gray-400 text-xs">
          <span class="tech-item cursor-default">Qwik</span>
          <span class="tech-item cursor-default">Supabase</span>
          <span class="tech-item cursor-default">Drizzle</span>
          <span class="tech-item cursor-default">Retell AI</span>
          <span class="tech-item cursor-default">Zadarma</span>
          <span class="tech-item cursor-default">n8n</span>
          <span class="tech-item cursor-default">OVH</span>
        </div>
      </div>
    </section>
  );
});