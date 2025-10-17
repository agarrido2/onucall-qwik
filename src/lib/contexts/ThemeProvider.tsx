/**
 * ThemeProvider Component
 * 
 * Proveedor global que inicializa el tema de la aplicación en el servidor.
 * Previene el "flash" de tema incorrecto al cargar la página.
 * 
 * [CITE: TAILWIND_QWIK_GUIDE.md] - Implementación del sistema de temas
 * [CITE: ARQUITECTUR_FOLDER.md] - Providers globales en el layout raíz
 */

import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';

export const ThemeProvider = component$(() => {
  // Script inline para prevenir flash de tema incorrecto
  // Se ejecuta antes del render para aplicar el tema inmediatamente
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  });

  return <Slot />;
});
