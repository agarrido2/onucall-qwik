/**
 * Layout Raíz de la Aplicación
 * 
 * [CITE: CAPITULO-7.md, sección 7.2] - Layouts anidados
 * 
 * Este layout envuelve TODAS las rutas de la aplicación.
 */

import { component$, Slot } from '@builder.io/qwik';

export default component$(() => {
  return <Slot />;
});

