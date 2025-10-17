/**
 * Color Showcase Page
 * 
 * Ruta de demostración para visualizar todos los colores del sistema de diseño.
 * Útil para desarrollo y verificación de la configuración de Tailwind v4.
 * 
 * Ruta: /colors
 * 
 * [CITE: ARQUITECTUR_FOLDER.md] - Las rutas orquestan componentes
 * [CITE: TAILWIND_QWIK_GUIDE.md] - Sistema de colores en Tailwind v4
 */

import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { ThemeToggle } from '~/components/ui/ThemeToggle';

export default component$(() => {
  return (
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Sistema de Colores</h1>
          <p class="text-muted-foreground mt-2">
            Paleta completa de colores del design system con soporte para tema claro y oscuro
          </p>
        </div>
        <ThemeToggle variant="floating" />
      </div>

      <div class="grid gap-8">
        {/* Colores Principales */}
        <section>
          <h2 class="text-2xl font-semibold mb-4">Colores Principales</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch color="primary" name="Primary" />
            <ColorSwatch color="secondary" name="Secondary" />
            <ColorSwatch color="accent" name="Accent" />
            <ColorSwatch color="muted" name="Muted" />
          </div>
        </section>

        {/* Estados */}
        <section>
          <h2 class="text-2xl font-semibold mb-4">Estados</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch color="success" name="Success" />
            <ColorSwatch color="error" name="Error" />
            <ColorSwatch color="warning" name="Warning" />
            <ColorSwatch color="info" name="Info" />
          </div>
        </section>
      </div>
    </div>
  )
})

const ColorSwatch = component$<{ color: string; name: string }>(({ color, name }) => {
  return (
    <div class="rounded-lg border p-4">
      <div class={`h-16 w-full rounded-md bg-${color} mb-3`}></div>
      <h3 class="font-medium">{name}</h3>
      <p class="text-sm text-muted-foreground">bg-{color}</p>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Paleta de Colores - Qwik OnuCall',
  meta: [
    {
      name: 'description',
      content: 'Sistema de diseño y paleta de colores de Qwik OnuCall basado en Tailwind CSS v4',
    },
  ],
};
