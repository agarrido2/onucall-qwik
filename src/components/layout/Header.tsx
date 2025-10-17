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
        // Posicionamiento base
        "fixed right-0 left-0 z-50 transition-all duration-300 ease-in-out": true,
        // Estados condicionales - Solo posición, sin background
        "top-0": !isScrolled.value,
        "top-4": isScrolled.value,
      }}
    >
      <div class="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div
          class={{
            "relative mt-1 flex h-16 items-center justify-between rounded-full border px-6 transition-all duration-300": true,
            // Glassmorphism solo cuando hay scroll
            "border-white/20": !isScrolled.value,
            "border-white/30 bg-white/5 backdrop-blur-xl": isScrolled.value,
          }}
        >
          {/* Logo */}
          <div class="flex items-center justify-center">
            <Image
              style={{ width: "40px", height: "auto" }}
              alt="onucall logo"
            />
            <p class="text-xl font-semibold">
              <strong class="text-primary text-3xl font-light">O</strong>nucall
            </p>
          </div>

          {/* Navegación - Delegada al componente Navigation */}
          <Navigation isScrolled={isScrolled.value} />
        </div>
      </div>
    </header>
  );
});
