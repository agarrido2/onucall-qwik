/**
 * Header Component - Landing Page Navigation with Glassmorphism
 *
 * Header flotante que aparece con efecto glassmorphism al hacer scroll.
 * Estructura principal que contiene el logo y delega la navegación al
 * componente Navigation para mantener separación de responsabilidades.
 *
 * [CITE: UX_GUIDE.md] - Glassmorphism y micro-interacciones
 * [CITE: ANEXO_QWIK.md] - useOnWindow para eventos del navegador
 * [CITE: ARQUITECTUR_FOLDER.md] - Separación de componentes en section/
 *
 * Características:
 * - Glassmorphism responsive con detección de scroll
 * - Componente Navigation extraído para mejor mantenibilidad
 * - Logo y estructura base del header
 * - Código limpio y enfocado
 */

import { component$, useSignal, useOnWindow, $ } from "@builder.io/qwik";
import { Navigation } from "./section";

// import image from '~/assets/images/logo-onucall.png'
import Image from "~/assets/images/onucall-logo.webp?quality=100&jsx";

export const Header = component$(() => {
  const isScrolled = useSignal(false);

  // Detección de scroll para activar glassmorphism
  useOnWindow(
    "scroll",
    $(() => {
      if (window.scrollY > 10) {
        isScrolled.value = true;
      } else {
        isScrolled.value = false;
      }
    }),
  );

  return (
    <header
      class={{
        // Posicionamiento base responsive con altura dinámica
        "fixed right-0 left-0 z-50 transition-all duration-300 ease-in-out header-height": true,
        // Estados condicionales - Solo posición, sin background
        "top-0": !isScrolled.value,
        "top-4": isScrolled.value,
      }}
    >
      <div class="container-responsive">
        <div
          class={{
            "relative mt-1 flex items-center justify-between border-2 rounded-full transition-all duration-300": true,
            // Altura responsive adaptada por breakpoint
            "h-14 px-4 sm:h-14 sm:px-5 lg:h-22 lg:px-6": true,
            // Glassmorphism solo cuando hay scroll
            "border-white/20": !isScrolled.value,
            "border-white/30 bg-white/5 backdrop-blur-xl": isScrolled.value,
          }}
        >
          {/* Logo responsive con tipografía adaptativa */}
          <div class="flex items-center justify-center">
            <Image
              style={{ width: "32px", height: "auto" }}
              class="sm:w-8 lg:w-10"
              alt="onucall logo"
            />
            <p class="ml-2 text-lg font-semibold sm:text-xl lg:text-2xl">
              <strong class="text-primary text-2xl font-light sm:text-2xl lg:text-3xl">O</strong>nucall
            </p>
          </div>

          {/* Navegación - Delegada al componente Navigation */}
          <Navigation isScrolled={isScrolled.value} />
        </div>
      </div>
    </header>
  );
});
