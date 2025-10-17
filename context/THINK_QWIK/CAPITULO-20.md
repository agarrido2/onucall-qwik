# PARTE 20: DEPLOYMENT Y PRODUCCIÓN

Esta sección cubre el proceso de compilación, despliegue y configuración de una aplicación Qwik para un entorno de producción, enfocándose en la optimización y las mejores prácticas.

---
## 20.1 Optimización de la Compilación (Build)

- **Comando**: `pnpm run build` es el comando que inicia el proceso de compilación para producción.
- **Mecanismo**: Este comando invoca a **Vite** y al **Optimizador de Qwik**, que trabajan en conjunto para realizar una serie de optimizaciones automáticas:
    - **Minificación**: Se minimiza todo el código JavaScript y CSS.
    - **Tree-Shaking**: Se elimina el código no utilizado.
    - **Bundling Inteligente**: Se agrupan los símbolos (`$`) en *bundles* de forma estratégica para optimizar las peticiones de red.
- **Artefactos de la Compilación**: El proceso genera dos directorios principales:
    - **`dist/`**: Contiene todos los **assets estáticos** del lado del cliente (los *bundles* de JS, CSS, imágenes, fuentes, etc.). Este directorio está diseñado para ser servido por un CDN.
    - **`server/`**: Contiene la lógica del lado del servidor de la aplicación, compilada para un entorno de Node.js. Incluye el punto de entrada para arrancar el servidor.
- **`q-manifest.json`**: Se genera un manifiesto que es el "mapa" de la aplicación. [cite_start]Es utilizado por el Qwik Loader y el Service Worker para saber qué *bundles* cargar en respuesta a las interacciones del usuario. [cite: 1696]

---
## 20.2 Estrategias de Despliegue

La arquitectura de Qwik es flexible y se adapta a múltiples modelos de despliegue.

- **Hosting Estático (para SSG)**:
    - **Mecanismo**: Si la aplicación se genera de forma estática (SSG), solo se necesita desplegar el contenido del directorio `dist/`.
    - **Plataformas**: Vercel, Netlify, Cloudflare Pages, AWS S3/CloudFront, GitHub Pages.
    - **Ventaja**: Es la opción más barata, rápida y escalable.

- **Servidor Node.js (para SSR)**:
    - **Mecanismo**: Se despliega el contenido de los directorios `dist/` y `server/` en una plataforma que soporte Node.js. Se arranca la aplicación ejecutando el punto de entrada del servidor (ej. `node server/entry.mjs`).
    - **Plataformas**: VPS (DigitalOcean, Linode), PaaS (Render, Heroku), o servidores on-premise.

- **Edge/Serverless (Patrón Recomendado)**:
    - **Mecanismo**: Es el modelo de despliegue idiomático para Qwik, ya que aprovecha al máximo su rendimiento. Qwik City utiliza un sistema de **"adaptadores"** para optimizar la `build` para una plataforma específica.
    - **Implementación**: Se ejecuta el comando `pnpm run qwik add <adapter>`, por ejemplo:
        - `pnpm run qwik add vercel-edge`
        - `pnpm run qwik add netlify-edge`
        - `pnpm run qwik add cloudflare-pages`
    - **Ventaja**: Proporciona un rendimiento global excepcional al ejecutar el código del servidor lo más cerca posible del usuario, con escalabilidad automática.

---
## 20.3 Configuración de Entornos

- **Mecanismo**: La gestión de variables de entorno se realiza a través de archivos `.env`.
- **Jerarquía de Archivos**: Vite carga los archivos `.env` en un orden específico, donde los últimos tienen prioridad:
    1.  `.env`: Variables por defecto (se versiona en git).
    2.  `.env.local`: Variables locales que no se deben versionar (contiene secretos).
    3.  `.env.[mode]`: Variables para un modo específico (ej. `.env.production`).
    4.  `.env.[mode].local`: Variables locales para un modo específico.
- **Integración con Plataformas de Hosting**: La mayoría de las plataformas de despliegue (Vercel, Netlify, etc.) ofrecen una interfaz para configurar las variables de entorno. Estas variables inyectadas en el entorno de la `build` y en el `runtime` **tienen prioridad** sobre las definidas en los archivos `.env` del repositorio.
- **Variables Públicas vs. Privadas**:
    - **Públicas (accesibles en el cliente)**: Deben llevar el prefijo `VITE_`. Se acceden con `import.meta.env.VITE_...`.
    - **Privadas (solo servidor)**: **No llevan prefijo**. Se acceden de forma segura en el servidor a través del `RequestEvent`: `requestEv.env.get('MI_SECRETO_PRIVADO')`.

---
## 20.4 Monitoreo y Logging

- **Logging (Registro de Eventos)**:
    - **Lado del Servidor**: No utilices `console.log` en producción. Implementa una librería de **logging estructurado** como `pino`. Esto genera logs en formato JSON, que pueden ser ingeridos, indexados y analizados por servicios de agregación de logs (Datadog, Logtail, etc.).
    - **Lado del Cliente**: Para depurar problemas complejos de usuario, considera integrar un servicio de **reproducción de sesiones** como LogRocket o Sentry Replay. Estos capturan no solo los logs de la consola, sino también las interacciones del usuario y los errores de red.

- **Monitoring (Supervisión)**:
    - **Disponibilidad (Uptime)**: Utiliza un servicio externo (UptimeRobot, Better Uptime) para monitorear un endpoint de salud de tu aplicación (ej. `/api/health`). Esto te alertará inmediatamente si la aplicación se cae.
    - **Métricas del Servidor**: Si despliegas en un servidor Node.js tradicional (VPS/PaaS), monitorea las métricas clave: uso de CPU, consumo de memoria y tráfico de red. En despliegues serverless/edge, la plataforma se encarga de esto.

---
## 20.5 Seguimiento de Errores (Error Tracking)

- **Herramienta Recomendada**: Un servicio dedicado como **Sentry**. Es superior al logging simple porque agrupa errores, proporciona contexto completo y facilita la depuración.
- **Mecanismo de Integración**:
    - **Servidor**: Integra el SDK de Sentry para Node.js en el punto de entrada de tu servidor. Capturará automáticamente las excepciones no manejadas y los `crashes` del proceso.
    - **Cliente**: Integra el SDK de Sentry para navegador. **Es crucial cargar este script a través de Partytown** para que su impacto en el rendimiento del hilo principal sea nulo.
- **Beneficios**: Un panel centralizado para todos los errores de frontend y backend, con `stack traces`, `breadcrumbs` (el rastro de acciones del usuario antes del error), información del navegador y gestión de versiones.

---
## 20.6 Monitoreo de Rendimiento

- **RUM (Real User Monitoring)**:
    - **Qwik Insights**: Es la herramienta de primera parte para recopilar métricas de rendimiento de usuarios reales. [cite_start]Su principal ventaja es que puede **retroalimentar el proceso de `build`** para crear estrategias de empaquetado más inteligentes basadas en datos de uso real. [cite: 1858-1861]
    - **Terceros**: Se pueden integrar otros proveedores de RUM (Datadog, Vercel Analytics) para rastrear las Core Web Vitals y otras métricas de rendimiento en producción.

- **Pruebas de Laboratorio en CI/CD**:
    - **Lighthouse CI**: Integra Lighthouse en tu pipeline de CI/CD para ejecutar auditorías de rendimiento en cada Pull Request. Establece **presupuestos de rendimiento** (ej. la puntuación no debe bajar de 95) para que la pipeline falle si se introduce una regresión, previniendo que el mal rendimiento llegue a producción.

---
## 20.7 Patrones de Escalabilidad

- **Escalado en Servidores Tradicionales (VPS/PaaS)**:
    - **Vertical**: Aumentar los recursos (CPU, RAM) de un único servidor. Es simple pero tiene un límite físico y económico.
    - [cite_start]**Horizontal (Single-Machine)**: Utilizar el módulo `cluster` de Node.js para crear un proceso de la aplicación por cada núcleo de CPU de la máquina, multiplicando su capacidad para manejar peticiones concurrentes. [cite: 2942-2943, 2947-2948]
    - **Horizontal (Multi-Machine)**: Ejecutar la aplicación en múltiples servidores detrás de un balanceador de carga. Es el patrón tradicional para alta disponibilidad.

- **Escalado en Edge/Serverless (El "Modo Qwik")**:
    - **Mecanismo**: Desplegar la aplicación en una plataforma serverless o en el borde de la red (Vercel, Netlify, Cloudflare) utilizando los adaptadores de Qwik City.
    - **Beneficio**: **Escalabilidad automática y sin esfuerzo**. La plataforma gestiona todo: provisiona recursos bajo demanda, realiza el balanceo de carga global, distribuye la aplicación a través de su red mundial y escala a cero cuando no hay tráfico (ahorrando costes). Es el modelo más resiliente, eficiente y rentable, y se alinea perfectamente con la arquitectura moderna de Qwik.