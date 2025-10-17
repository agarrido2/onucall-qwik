# PARTE 17: SEO Y WEB VITALS

Esta sección detalla cómo la arquitectura de Qwik está inherentemente optimizada para el **Search Engine Optimization (SEO)** y cómo gestionar los metadatos y archivos necesarios para un posicionamiento óptimo.

---
## 17.1 Optimización SEO Automática

Qwik no requiere de optimizaciones SEO manuales complejas porque su arquitectura está diseñada para ser amigable con los motores de búsqueda por defecto.

- **SSR por Defecto**: Qwik City es un framework **SSR-first**. [cite_start]Los crawlers de los motores de búsqueda siempre reciben un documento HTML completamente renderizado, con todo el contenido presente, lo cual es el factor más crítico para una indexación correcta. [cite: 2239]
- **Rendimiento por Defecto**: Como se ha detallado en capítulos anteriores, Qwik está diseñado para alcanzar puntuaciones casi perfectas en las **Core Web Vitals**. [cite_start]Dado que Google utiliza estas métricas como un factor de ranking significativo, las aplicaciones Qwik tienen una ventaja competitiva inherente. [cite: 2551]
- [cite_start]**HTML Semántico**: El uso de JSX y la estructura de componentes de Qwik fomentan el uso de HTML semántico, lo que facilita a los crawlers la comprensión de la estructura y el significado del contenido de la página. [cite: 2278-2280]

---
## 17.2 Core Web Vitals a Fondo

La excelencia en las Core Web Vitals es una consecuencia directa de la arquitectura de Qwik.

- [cite_start]**LCP (Largest Contentful Paint)**: Se optimiza porque el servidor envía HTML con contenido visible de inmediato, y no hay JavaScript de aplicación bloqueando el hilo principal. [cite: 2558-2561]
- [cite_start]**CLS (Cumulative Layout Shift)**: Es mínimo o nulo porque el layout se genera de forma estable en el servidor, y las herramientas de optimización de imágenes (`?jsx`) reservan el espacio necesario para los medios visuales. [cite: 2580-2582]
- **INP (Interaction to Next Paint)**: Es el punto más fuerte de Qwik. [cite_start]La ausencia de hidratación significa que el hilo principal está libre para responder a las interacciones del usuario de forma casi instantánea. [cite: 2674-2678]

---
## 17.3 Meta Tags y Datos Estructurados

La gestión de la cabecera del documento (`<head>`) es fundamental para el SEO. Qwik City lo centraliza a través de una exportación `head`.

- **Mecanismo (`head` export)**:
    - Se puede exportar un objeto `head` desde cualquier `index.tsx` o `layout.tsx`.
    - Las propiedades de `head` (`title`, `meta`, `link`) se fusionan de forma jerárquica, desde el layout raíz hasta la página final, permitiendo anular o añadir metadatos.
- **Metadatos Dinámicos**: Para SEO, los metadatos deben ser dinámicos y basarse en los datos de la página. Para ello, `head` puede ser una **función** que recibe los datos resueltos del `routeLoader$` de la página.
    ```tsx
    import type { DocumentHead } from '@builder.io/qwik-city';

    export const useProductData = routeLoader$(async (requestEv) => { ... });

    export const head: DocumentHead = ({ resolveValue }) => {
      const product = resolveValue(useProductData);
      return {
        title: `Comprar ${product.name}`,
        meta: [
          { name: 'description', content: product.description },
          { property: 'og:title', content: product.name },
          { property: 'og:image', content: product.imageUrl },
        ],
      };
    };
    ```
- **Datos Estructurados (JSON-LD)**: Es la mejor práctica para proporcionar contexto a los motores de búsqueda sobre el contenido (productos, artículos, etc.). Se inyecta a través de la propiedad `meta` en la función `head`.
    ```tsx
    const structuredData = { "@context": "[https://schema.org/](https://schema.org/)", ... };

    return {
      meta: [
        ...
        {
          "key": "json-ld", // Clave única para evitar duplicados
          "innerHTML": `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`
        }
      ]
    }
    ```

---
## 17.4 Generación de Sitemap

Un `sitemap.xml` es crucial para ayudar a los motores de búsqueda a descubrir todas las páginas de un sitio.

- **Mecanismo**: Debe ser generado dinámicamente a través de un endpoint de API.
- **Implementación**:
    1.  Crea un endpoint de ruta en `src/routes/sitemap.xml/index.ts`.
    2.  Dentro del manejador `onGet`, obtén todas las URLs de tu sitio (tanto estáticas como dinámicas, consultando la base de datos si es necesario).
    3.  Construye la cadena de texto del XML del sitemap siguiendo el estándar.
    4.  Establece la cabecera `Content-Type` a `application/xml` y devuelve el XML.
    ```ts
    // src/routes/sitemap.xml/index.ts
    import type { RequestHandler } from '@builder.io/qwik-city';

    export const onGet: RequestHandler = async ({ text }) => {
      const staticRoutes = ['/', '/about'];
      const dynamicProductRoutes = await db.getAllProductSlugs(); // -> ['/products/p1', ...]
      const allRoutes = [...staticRoutes, ...dynamicProductRoutes];

      const xml = `<urlset xmlns="[http://www.sitemaps.org/schemas/sitemap/0.9](http://www.sitemaps.org/schemas/sitemap/0.9)">
        ${allRoutes.map(route => `<url><loc>https://mysite.com${route}</loc></url>`).join('')}
      </urlset>`;
      
      text(200, xml, { 'Content-Type': 'application/xml' });
    };
    ```

    ---
## 17.5 Patrones para `robots.txt`

El archivo `robots.txt` instruye a los crawlers sobre las páginas o secciones del sitio que no deben rastrear.

- [cite_start]**Mecanismo**: Es un **asset estático**. [cite: 2447]
- **Ubicación Canónica**: El archivo debe ser creado en el directorio **`public/`** del proyecto (`public/robots.txt`). [cite_start]Los archivos en este directorio se copian a la raíz del sitio durante la `build`, asegurando que `robots.txt` esté disponible en `https://tusitio.com/robots.txt`. [cite: 2469]
- **Contenido Esencial**:
    ```
    # Permitir a todos los crawlers
    User-agent: *
    # Permitir rastrear todo por defecto
    Allow: /

    # Deshabilitar el rastreo de secciones específicas
    Disallow: /admin/
    Disallow: /cart/
    Disallow: /private/

    # Ubicación del sitemap
    Sitemap: [https://tusitio.com/sitemap.xml](https://tusitio.com/sitemap.xml)
    ```
- [cite_start]**Mejor Práctica**: Siempre incluye una referencia al `sitemap.xml` en tu `robots.txt` para ayudar a los crawlers a descubrirlo. [cite: 2445]

---
## 17.6 Optimización para Redes Sociales

Para controlar cómo se muestran las vistas previas de tus enlaces en redes sociales, se utilizan los protocolos **Open Graph** (usado por Facebook, LinkedIn, etc.) y **Twitter Cards**.

- **Mecanismo**: Se implementan a través de etiquetas `<meta>` específicas dentro del `<head>` del documento.
- [cite_start]**Implementación en Qwik**: Se gestionan de forma dinámica a través de la **exportación `head`** de la ruta, utilizando los datos del `routeLoader$` para poblar el contenido. [cite: 456]
- **Etiquetas Esenciales**:
    - `og:title`: El título que se mostrará en la vista previa.
    - `og:description`: La descripción breve.
    - `og:image`: **La más importante**. La URL de la imagen que se usará en la tarjeta.
    - `og:url`: La URL canónica de la página.
    - `og:type`: El tipo de contenido (ej. `website`, `article`).
    - `twitter:card`: El tipo de tarjeta de Twitter (ej. `summary_large_image`).
    - `twitter:title`, `twitter:description`, `twitter:image`: Equivalentes para Twitter.
- **Ejemplo Dinámico**:
    ```tsx
    export const head: DocumentHead = ({ resolveValue }) => {
      const product = resolveValue(useProductData);
      return {
        // ... title y description
        meta: [
          // Open Graph
          { property: 'og:title', content: product.name },
          { property: 'og:image', content: product.imageUrl },
          { property: 'og:type', content: 'product' },

          // Twitter Card
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: product.name },
          { name: 'twitter:image', content: product.imageUrl },
        ],
      };
    };
    ```

---
## 17.7 Integración con Analíticas

Los scripts de analíticas (Google Analytics, etc.) son conocidos por su impacto negativo en el rendimiento. Qwik soluciona esto con una integración de primera clase con Partytown.

- [cite_start]**Problema**: Los scripts de terceros son pesados, bloquean el hilo principal y empeoran las Core Web Vitals. [cite: 2500-2501]
- **Solución Canónica**: **Partytown**. [cite_start]Se integra fácilmente con el comando `pnpm run qwik add partytown`. [cite: 2514, 2528]
- [cite_start]**Mecanismo**: Partytown **relocaliza la ejecución** de los scripts de terceros desde el hilo principal a un **Web Worker**. [cite: 2515] El Service Worker intercepta las peticiones de estos scripts y las delega al Worker.
- **Implementación**: Después de ejecutar el comando de integración, solo se necesita añadir el atributo `type="text/partytown"` al script de analíticas.
    ```tsx
    // En root.tsx o layout.tsx
    <script
      async
      type="text/partytown" // Esto activa Partytown
      src="[https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX](https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX)"
    ></script>
    ```
- [cite_start]**Beneficio**: Se obtienen todos los datos de analíticas sin sacrificar el rendimiento del hilo principal, protegiendo las puntuaciones de las Core Web Vitals y la experiencia del usuario. [cite: 2517]