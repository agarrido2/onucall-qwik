# PARTE 21: ARQUITECTURAS AVANZADAS

Esta sección explora patrones arquitectónicos de alto nivel y cómo implementarlos utilizando las características únicas de Qwik, desde e-commerce y micro-frontends hasta la gestión de monorepos.

---
## 21.1 Arquitectura E-commerce (Patrones de Vendure)

Qwik es una opción ideal para e-commerce debido a su rendimiento de carga superior, que impacta directamente en las tasas de conversión. La arquitectura canónica es la de **comercio headless**.

- **Mecanismo**:
    1.  **Backend Headless**: Un sistema de e-commerce como **Vendure**, Shopify o BigCommerce actúa como el backend, exponiendo sus datos y lógica a través de una API (típicamente GraphQL).
    2.  **Frontend en Qwik**: La aplicación Qwik es el "head" o la "cabeza", consumiendo esta API para construir la interfaz de usuario.
- **Patrones de Implementación en Qwik**:
    - **Catálogo de Productos**: Las páginas de categorías y de detalle de productos utilizan `routeLoader$` para obtener los datos del producto desde la API de GraphQL del backend. Se configuran con cabeceras de caché agresivas (ISR) para un rendimiento máximo.
    - **Gestión del Carrito**: El estado del carrito se gestiona con un `useStore()` global, proporcionado a través de `useContext()`. Las mutaciones (añadir, quitar, actualizar cantidad) se manejan con un `globalAction$()` que invoca la API de GraphQL del carrito.
    - **Checkout**: Es un flujo multi-paso gestionado con un `useStore()` local. El envío final se realiza a través de un `routeAction$` que coordina la creación del pedido en el backend y la iniciación del pago con una pasarela como Stripe.
    - **Autenticación**: El flujo de login/registro se integra con la API de autenticación del backend, gestionando la sesión del usuario a través de cookies seguras `httpOnly`.

---
## 21.2 Micro-frontends sin Librerías Externas

Qwik resuelve uno de los mayores problemas de los micro-frontends: el sobrecoste de rendimiento por tener múltiples frameworks y *runtimes*.

- **El Problema Tradicional**: Las arquitecturas de micro-frontends que utilizan librerías como Module Federation a menudo resultan en la descarga de múltiples frameworks (ej. React, Angular) en la misma página, lo que degrada gravemente el rendimiento.
- **El Enfoque Único de Qwik**:
    - [cite_start]**Mecanismo**: Una aplicación Qwik puede actuar como un "host" o "shell" que integra otras aplicaciones Qwik independientes (los micro-frontends) sin necesidad de una librería de orquestación externa. [cite: 4907-4908]
    - **Sin Sobrecoste de Rendimiento**: Gracias a la resumibilidad, no importa cuántos micro-frontends se compongan en una página. El JavaScript inicial sigue siendo solo el `Qwik Loader` (~1KB). No hay colisión de *runtimes* ni múltiples procesos de hidratación. [cite_start]La interactividad de cada micro-frontend se carga de forma perezosa e independiente. [cite: 4911-4914]
    - **Comunicación**: Si se componen dentro del mismo shell, los micro-frontends pueden compartir estado utilizando el `useContext()` de la aplicación host, actuando como un bus de estado compartido.

---
## 21.3 Monorepo con Nx

Para gestionar proyectos complejos, especialmente con micro-frontends o librerías compartidas, un monorepo es la estrategia preferida.

- [cite_start]**Herramienta**: **Nx** es el sistema de compilación de monorepos de facto, con un soporte de primera clase para Qwik a través de un plugin oficial. [cite: 4918]
- **Beneficios Clave**:
    - [cite_start]**Código Compartido**: Facilita enormemente la creación y el uso de librerías compartidas (ej. una librería de componentes de UI, tipos de TypeScript, utilidades) entre diferentes aplicaciones (ej. la tienda y el panel de administración) dentro del mismo repositorio. [cite: 4917]
    - **Compilación y Tests Cacheados**: Nx utiliza un sistema de caché de computación. [cite_start]Solo vuelve a compilar y a probar el código que ha cambiado, ahorrando una cantidad masiva de tiempo en los pipelines de CI/CD. [cite: 4920-4921]
    - **Grafo de Dependencias**: Nx entiende las dependencias entre los proyectos del monorepo, permitiendo ejecutar comandos de forma inteligente solo en los proyectos afectados por un cambio.

---
## 21.4 Modo Librería y Librerías de Componentes

Qwik está diseñado no solo para construir aplicaciones, sino también para **crear librerías de componentes** publicables en npm.

- **Mecanismo**: La configuración de la `build` de Qwik se puede establecer en "modo librería".
- **Salida (`Output`)**: El proceso de compilación genera formatos de módulos estándar (ESM, CJS) y sus correspondientes declaraciones de tipos (`.d.ts`), listos para ser empaquetados y publicados.
- **Patrón "Headless"**: La mejor práctica para librerías reutilizables es diseñarlas como **componentes headless**. La librería proporciona toda la lógica, estado y accesibilidad, pero no los estilos. Esto permite a los consumidores de la librería aplicar su propio sistema de diseño sin conflictos. **Qwik UI** es el ejemplo canónico de esta arquitectura.

---
## 21.5 Aplicaciones Multi-Tenant

- **Definición**: Una arquitectura donde una única instancia desplegada de una aplicación sirve a múltiples clientes (o "tenants"), manteniendo los datos de cada cliente completamente aislados.
- **Patrón de Implementación en Qwik**:
    1.  **Identificación del Tenant**: Este es el paso más crítico y debe ocurrir al principio del ciclo de vida de la petición.
        - **Mecanismo**: Se implementa en un middleware global (`src/routes/plugin.ts`).
        - **Estrategias**: El tenant se puede identificar a partir del `hostname` de la petición (ej. `tenant-a.miapp.com`) o de un segmento de la URL (ej. `/tenant-a/...`).
    2.  **Propagación del Contexto del Tenant**: Una vez identificado, el `tenantId` se almacena en `requestEv.sharedMap`.
        ```ts
        // src/routes/plugin.ts
        export const onRequest: RequestHandler = (requestEv) => {
          const tenantId = getTenantId(requestEv.url.hostname);
          requestEv.sharedMap.set('tenantId', tenantId);
        };
        ```
    3.  **Aislamiento de Datos (Data Scoping)**: Todas las funciones de servidor (`routeLoader$`, `routeAction$`) **deben** leer el `tenantId` desde `sharedMap` y utilizarlo para filtrar cada una de sus consultas a la base de datos. Esto asegura que un tenant nunca pueda acceder a los datos de otro.
        ```ts
        // Un routeLoader$ en la aplicación
        export const useProductsLoader = routeLoader$(async ({ sharedMap }) => {
          const tenantId = sharedMap.get('tenantId');
          return db.products.findMany({ where: { tenantId: tenantId } });
        });
        ```

---
## 21.6 Aplicaciones en Tiempo Real

- **Mecanismo**: Las funcionalidades en tiempo real se basan en conexiones persistentes entre el cliente y el servidor, típicamente **WebSockets**. [cite_start]Servicios como Supabase Realtime o Ably abstraen esta complejidad. [cite: 4321]
- **Patrón Canónico en Qwik**:
    1.  **Gestión en el Cliente**: La conexión WebSocket **debe** ser gestionada en el cliente.
    2.  **`useVisibleTask$`**: La conexión se establece dentro de un `useVisibleTask$`. Esto garantiza que solo se inicie en el navegador y cuando el componente que necesita los datos en tiempo real es visible.
    3.  **Sincronización con el Estado**: Los datos recibidos a través del `listener` `onmessage` del WebSocket se almacenan en un `Store` o `Signal`. La UI se actualizará de forma granular y automática a medida que lleguen nuevos datos.
    4.  **Limpieza de la Conexión**: Es **imperativo** devolver una función `cleanup` desde `useVisibleTask$` que cierre la conexión (`ws.close()`). [cite_start]Esto previene fugas de memoria y conexiones zombie cuando el componente se destruye o deja de ser visible. [cite: 4387-4388]

---
## 21.7 Máquinas de Estado Complejas (Complex State Machines)

- **El Problema**: Para componentes con un gran número de estados y transiciones complejas (ej. un reproductor de vídeo, un asistente de checkout, un editor), gestionar la lógica con múltiples `Signals` booleanos (ej. `isLoading`, `isError`, `isSuccess`) se vuelve frágil y propenso a errores, permitiendo "estados imposibles".
- **La Solución**: Utilizar una **máquina de estados finitos (FSM)**. Define formalmente todos los estados posibles, los eventos que causan transiciones entre ellos y las acciones que se ejecutan en esas transiciones.
- **Librería Recomendada**: **XState**. Es la librería estándar en el ecosistema JavaScript para crear y gestionar máquinas de estado.
- **Patrón de Integración con Qwik**:
    1.  **Definir la Máquina**: La lógica de la máquina de estados se define con XState en un archivo separado, manteniéndola agnóstica al framework.
    2.  **Instanciar el Servicio**: En el componente de Qwik, el "servicio" (la instancia en ejecución de la máquina) se crea en el cliente, típicamente dentro de un `useVisibleTask$`.
    3.  **Sincronizar el Estado**: El estado actual de la máquina de XState se sincroniza con un `useStore()` de Qwik. El `listener` `onTransition` del servicio de la máquina actualiza el `Store`.
    4.  **Enviar Eventos**: Los `listeners` de eventos de Qwik (ej. `onClick$`) no mutan el estado directamente. En su lugar, envían eventos al servicio de la máquina (`miServicio.send('EVENTO')`).
- **Beneficio**: Este patrón **desacopla completamente** la lógica de estado compleja del componente de la UI. El componente de Qwik se convierte en una capa de vista "tonta" que simplemente renderiza el estado actual que le proporciona la máquina y le envía eventos. Esto resulta en un código mucho más robusto, predecible y fácil de testear.