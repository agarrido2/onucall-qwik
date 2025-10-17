import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold">Empleados IA</h1>
      <p class="mt-4 text-gray-600">
        Conoce nuestros agentes comerciales con inteligencia artificial.
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Empleados IA - Onucall',
  meta: [
    {
      name: 'description',
      content: 'Agentes comerciales con IA especializados para tu sector empresarial.',
    },
  ],
};