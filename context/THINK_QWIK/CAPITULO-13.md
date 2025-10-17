# PARTE 13: SSR Y PERFORMANCE

Esta sección analiza en profundidad las estrategias de renderizado del lado del servidor y su impacto directo en el rendimiento, así como los mecanismos que Qwik utiliza para automatizar la optimización.

---
## 13.1 Server-Side Rendering (SSR) a Fondo

- **Definición en Qwik**: SSR en Qwik es más que la simple generación de HTML. Es un proceso de **pre-renderizado y serialización** diseñado para la reanudación (`Resumability`).
- **Mecanismo Detallado**:
    1.  **Ejecución de Lógica de Servidor**: Se ejecutan todos los manejadores de servidor para la ruta solicitada, incluyendo `onRequest` (middleware) y todos los `routeLoader$`.
    2.  **Generación de HTML**: Se renderiza el árbol de componentes, produciendo el HTML visible.
    3.  **Serialización de Estado y Listeners**: Este es el paso clave. Qwik recorre el estado de la aplicación y la estructura de componentes, y serializa toda la información necesaria para que el cliente pueda reanudar la ejecución sin reconstruir nada. Esto incluye:
        - El estado de los `Signals` y `Stores`.
        - Los `listeners` de eventos como QRLs (ej. `on:click="./chunk-abc.js#onClick_0"`).
        - Información interna del framework.
    4.  **Incrustación en HTML**: Toda la información serializada se inyecta en el HTML final, principalmente en el script `<script type="qwik/json">`.
- **Resultado**: El producto final del SSR de Qwik no es solo una página visible, es una aplicación "pausada" y completamente interactuable, lista para ser reanudada por el Qwik Loader.

---
## 13.2 Static Site Generation (SSG)

- [cite_start]**Definición**: Es el proceso de pre-renderizar **todas las páginas** de una aplicación a archivos HTML estáticos durante el **tiempo de compilación (`build time`)**[cite: 374].
- **Mecanismo en Qwik City**: Durante la `build`, Qwik City puede descubrir todas las rutas estáticas (y dinámicas si se proporcionan los parámetros) y ejecutar el proceso de SSR para cada una, guardando el resultado como un archivo `.html`.
- **Ventajas**:
    - **Máximo Rendimiento**: Los archivos pueden ser desplegados en un CDN global. Las peticiones se resuelven sin ninguna computación en el servidor, ofreciendo la menor latencia posible.
    - **Escalabilidad y Seguridad**: Al no haber un servidor de Node.js que gestionar, la superficie de ataque es mínima y la escalabilidad es prácticamente infinita.
- **Caso de Uso**: Ideal para sitios cuyo contenido cambia con poca frecuencia: blogs, sitios de documentación, portfolios, sitios de marketing.

---
## 13.3 Incremental Static Regeneration (ISR)

- [cite_start]**Definición**: Una estrategia híbrida que combina la velocidad del SSG con la frescura de datos del SSR[cite: 412].
- **Mecanismo**:
    1.  Una página se genera estáticamente en tiempo de compilación (o en la primera petición).
    2.  Esta página estática (considerada "stale" o caducada) se sirve instantáneamente desde el CDN a todos los usuarios.
    3.  **En segundo plano**, si ha pasado un tiempo de revalidación definido, el servidor vuelve a generar la página con datos frescos y actualiza la caché del CDN.
    4.  La siguiente petición a esa página recibirá la versión recién generada.
- **Implementación en Qwik**: Se controla mediante las cabeceras `Cache-Control` establecidas en un `routeLoader$` o middleware. La directiva `stale-while-revalidate` es la clave para implementar este patrón.
- **Caso de Uso**: Sitios que necesitan un rendimiento de carga estático pero cuyo contenido se actualiza periódicamente sin requerir un `rebuild` completo del sitio. Ejemplos: sitios de e-commerce (precios que cambian), perfiles de redes sociales, sitios de noticias.

---
## 13.4 Estrategias de Bundles y Puntos de Entrada

- **Punto de Entrada**: A diferencia de las SPAs tradicionales con un `main.js`, el único punto de entrada real en Qwik es el **`qwikloader.js` (~1KB)**. La aplicación en sí no tiene un punto de entrada; es un grafo de símbolos que se cargan perezosamente.
- **Estrategia por Defecto (`smart`)**: El Optimizador de Qwik agrupa automáticamente los símbolos en *bundles* basándose en heurísticas para minimizar las cascadas de red (`network waterfalls`). Agrupa los símbolos que probablemente se necesitarán juntos.
- **Configuración Manual (`entryStrategy`)**: Aunque raramente es necesario, la configuración de `qwikVite` permite un control granular sobre la estrategia de empaquetado:
    - `single`: (Anti-patrón) Agrupa toda la aplicación en un solo *bundle*, rompiendo la carga perezosa.
    - `hook`: Un *bundle* por cada símbolo. Se usa en desarrollo para facilitar la depuración.
    - `manual`: Permite al desarrollador definir manualmente qué símbolos van en qué *bundles*, útil para optimizaciones avanzadas basadas en datos de monitoreo de usuarios reales (RUM).

    ---
## 13.5 Automatización de Core Web Vitals

La arquitectura de Qwik está inherentemente diseñada para sobresalir en las **Core Web Vitals (CWV)** de Google, automatizando gran parte de la optimización que en otros frameworks es manual.

- **LCP (Largest Contentful Paint)**:
    - **Optimización Automática**: El SSR de Qwik envía un HTML completo y significativo de inmediato. [cite_start]Al no haber JavaScript de aplicación que bloquee el renderizado, el navegador puede pintar el elemento más grande de la página (LCP) muy rápidamente. [cite: 2558-2561]
    - [cite_start]**Herramientas de Soporte**: La optimización de imágenes (`?jsx`, `@unpic/qwik`) asegura que los recursos de imagen se sirvan en el tamaño y formato correctos. [cite: 2586-2590]

- **CLS (Cumulative Layout Shift)**:
    - **Optimización Automática**: El CLS es casi nulo por defecto. [cite_start]Como el servidor renderiza el HTML completo, no hay "saltos" de contenido cargado en el cliente. [cite: 2580-2581]
    - [cite_start]**Herramientas de Soporte**: El sistema de importación de imágenes (`?jsx`) añade automáticamente los atributos `width` y `height` a las etiquetas `<img>`, permitiendo que el navegador reserve el espacio correcto para la imagen antes de que se cargue. [cite: 2586, 2648]

- **INP (Interaction to Next Paint)**:
    - **Optimización Automática**: Esta es la **métrica estrella** de Qwik. [cite_start]Dado que no existe un proceso de hidratación que bloquee el hilo principal, este está disponible casi instantáneamente para responder a la primera (y a todas las demás) interacciones del usuario. [cite: 2674-2678]
    - [cite_start]**Resultado**: El INP es extremadamente bajo por diseño, ya que la latencia entre la acción del usuario y la ejecución del código del `listener` se reduce a la descarga perezosa de un pequeño fragmento de JS (si no está ya en caché). [cite: 2672]

---
## 13.6 Cabeceras de Control de Caché (Cache Control Headers)

La configuración correcta de las cabeceras de caché es esencial para aprovechar los CDNs y mejorar drásticamente el rendimiento.

- [cite_start]**Mecanismo de Control**: Se gestionan en el servidor a través de la utilidad `cacheControl()` disponible en el `RequestEvent` (dentro de `routeLoader$` o middleware). [cite: 4104-4106]
- **Directivas Clave**:
    - `public`: Indica que la respuesta puede ser almacenada en cualquier caché (navegador, CDN).
    - `private`: La respuesta es específica para un usuario y solo debe ser almacenada por el caché del navegador de ese usuario.
    - [cite_start]`max-age=<seconds>`: Especifica el tiempo que el **navegador** del usuario debe considerar la respuesta como fresca. [cite: 4107]
    - `s-maxage=<seconds>`: Similar a `max-age`, pero está destinada específicamente para **cachés compartidos (CDNs)**. [cite_start]Si está presente, los CDNs ignoran `max-age`. [cite: 4113-4114]
    - `stale-while-revalidate=<seconds>`: El pilar de la estrategia ISR. [cite_start]Permite que el CDN sirva una respuesta caducada (`stale`) de forma inmediata, mientras que en segundo plano solicita una versión fresca para actualizar su caché para futuras peticiones. [cite: 4118, 4122-4123]
- **Patrón Recomendado**: Combinar un `max-age` corto (para dar control al navegador) con un `s-maxage` más largo y `stale-while-revalidate` para dar al CDN la mayor flexibilidad, logrando un equilibrio óptimo entre rendimiento y frescura de los datos.

---
## 13.7 Monitoreo de Rendimiento

- [cite_start]**Herramientas Estándar**: Las aplicaciones Qwik pueden ser analizadas con herramientas de laboratorio (`Lighthouse`) y de Monitoreo de Usuarios Reales (RUM) estándar del mercado. [cite: 2749]

- **Qwik Insights**:
    - [cite_start]**Definición**: Una solución RUM opcional y de primera parte, diseñada específicamente para Qwik. [cite: 1858-1860]
    - [cite_start]**Funcionalidad**: Recopila datos anónimos de usuarios reales en producción sobre qué símbolos se descargan, con qué frecuencia y en qué orden para cada ruta. [cite: 1860, 1862-1863]
    - **Bucle de Optimización (Feedback Loop)**: La característica más potente es que estos datos del mundo real pueden ser reincorporados al proceso de `build`. El Optimizador de Qwik puede usar esta información para tomar decisiones de empaquetado más inteligentes, agrupando los símbolos que los usuarios *realmente* usan juntos. [cite_start]Esto crea un ciclo de mejora continua del rendimiento basado en el comportamiento real del usuario en lugar de solo en heurísticas. [cite: 1861, 1865]