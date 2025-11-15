import { component$, isDev } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { themeInitScript } from "./lib/utils/theme-init";

import "./assets/css/global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   *
   * [CITE: TAILWIND_QWIK_GUIDE.md] - Sistema de temas con prevención de flash
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        {/* Script para inicializar el tema antes del render (previene flash) */}
        <script dangerouslySetInnerHTML={themeInitScript} />
        <RouterHead />
      </head>
      <body lang="en" class="antialiased">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
