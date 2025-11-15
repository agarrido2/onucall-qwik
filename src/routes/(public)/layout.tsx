import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Header } from "~/components/layout/Header";

import { Footer } from "~/components/layout/Footer";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <>
      {/* Header con altura responsive dinámica */}
      <Header />

      {/* Main content con espaciado responsive y variables CSS */}
      <main class="flex min-h-screen flex-col">
        <Slot />
      </main>

      {/* Footer responsive */}
      <Footer />
    </>
  );
});
