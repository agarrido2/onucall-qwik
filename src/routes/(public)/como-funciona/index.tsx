import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold">¿Cómo funciona Onucall?</h1>
      <p class="mt-4 text-gray-600">
        Descubre cómo nuestro agente comercial con IA revoluciona tu negocio.
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: '¿Cómo funciona? - Onucall',
  meta: [
    {
      name: 'description',
      content: 'Descubre cómo funciona nuestro agente comercial con IA por voz disponible 24/7.',
    },
  ],
};