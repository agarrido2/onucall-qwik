# PARTE 23: CÓDIGO DE REFERENCIA Y TROUBLESHOOTING

Esta sección final actúa como una guía de referencia rápida, un compendio de ejemplos canónicos y una guía para la solución de problemas comunes, consolidando el conocimiento de los capítulos anteriores.

---
## 23.1 Componentes Completos de Ejemplo

En lugar de nuevos ejemplos, esta sección referencia los patrones de componentes completos ya establecidos como modelos canónicos.

- **Componente de Página Simple (`Joke App`)**:
    - **Ubicación**: Capítulo 9.
    - **Conceptos Demostrados**: `component$`, `routeLoader$` para fetching de API externa, `routeAction$` con `<Form>` para mutaciones, `useSignal` para estado local, `useTask$` para reaccionar a cambios de estado, y `useStylesScoped$` para estilos.
    - **Representa**: El ciclo de vida completo de una página interactiva simple en Qwik.

- **Layout Protegido (Guardia de Ruta)**:
    - **Ubicación**: Capítulo 8.7.
    - **Conceptos Demostrados**: Uso de un `layout.tsx` dentro de un grupo de rutas `(private)`. Implementación de un `onRequest` middleware que verifica una cookie de sesión y ejecuta `throw redirect()` si la autenticación falla.
    - **Representa**: El patrón canónico para proteger secciones enteras de una aplicación.

- **Tarjeta de Producto (E-commerce)**:
    - **Ubicación**: `vendure-ecommerce/storefront-qwik-starter` y Capítulo 8 del libro.
    - **Conceptos Demostrados**: `routeLoader$` para cargar datos de producto, renderizado condicional basado en el estado de autenticación (obtenido de un `useContext` global), y `globalAction$` para una acción de "Añadir al Carrito" reutilizable.
    - **Representa**: Un componente del mundo real en una arquitectura de e-commerce headless.

---
## 23.2 Arquitecturas Reales (Vendure, etc.)

- **Arquitectura Headless E-commerce**:
    - **Referencia**: `vendure-ecommerce/storefront-qwik-starter`.
    - **Patrón**: Qwik actúa como el "head" (frontend) que consume una API de GraphQL de un backend de e-commerce como Vendure. Toda la lógica de negocio (productos, carrito, pedidos) reside en el backend, mientras que Qwik se enfoca exclusivamente en una presentación ultra-rápida y optimizada para la conversión.

- **Arquitectura de Micro-Frontends**:
    - **Referencia**: Capítulo 21.2 y el repositorio `qwik-microfrontends`.
    - **Patrón**: Una aplicación "shell" o "host" de Qwik que orquesta y renderiza múltiples micro-aplicaciones, también construidas en Qwik.
    - **Ventaja Clave**: Demuestra la capacidad única de Qwik para escalar la complejidad de la UI sin el coste de rendimiento asociado a la carga de múltiples frameworks, gracias a la resumibilidad.

---
## 23.3 Benchmarks de Rendimiento

Las cifras exactas varían, pero la arquitectura de Qwik está diseñada para producir los siguientes resultados de rendimiento de forma consistente.

- [cite_start]**Core Web Vitals**: Puntuaciones de **95-100** en PageSpeed Insights son el resultado esperado por defecto para una aplicación bien estructurada. [cite: 4926]
- **Time To Interactive (TTI)** y **Total Blocking Time (TBT)**: **Cercanos a cero** en la carga inicial. La ausencia de hidratación deja el hilo principal del navegador libre para las interacciones del usuario.
- **JavaScript Inicial**: El único JS bloqueante en la carga es el **Qwik Loader (~1KB)**. El tamaño total de la aplicación no afecta a esta métrica inicial.

---
## 23.4 Guía de Solución de Problemas (Troubleshooting Playbook)

Esta es una lista de comprobación para diagnosticar los problemas más comunes en Qwik.

- **Problema: La interactividad no funciona (un botón no responde).**
    - **Checklist**:
        1.  **Sufijo `$`**: ¿El manejador de evento tiene el sufijo `$`? (ej. `onClick$`).
        2.  **`PropFunction`**: Si el manejador es una prop, ¿está tipada con `PropFunction`?
        3.  **Exportación del Componente**: ¿El archivo del componente tiene un `export default component$(...)`?
        4.  **Consola del Navegador**: ¿Hay algún error visible en las DevTools?

- **Problema: El estado no se actualiza en la UI.**
    - **Checklist**:
        1.  **`useSignal`**: ¿Estás accediendo y modificando la propiedad `.value` de la señal (`miSignal.value++`)?
        2.  **`useStore`**: ¿Estás **mutando** una propiedad (`miStore.count++`) en lugar de **reasignar** la variable (`miStore = ...`)?

- **Problema: Los datos de `routeLoader$` son `undefined` en el componente.**
    - **Checklist**:
        1.  **Llamada al Hook**: ¿El componente está llamando al hook correspondiente (`const misDatos = useMisDatosLoader()`)?
        2.  **Consola del Servidor**: ¿Hay algún error en la terminal donde se ejecuta el servidor de Qwik? El `routeLoader$` se ejecuta allí, y cualquier error aparecerá en esa consola, no en la del navegador.

- **Problema: Error de "Cannot serialize..." durante la compilación o ejecución.**
    - **Checklist**:
        1.  **Props de Componentes**: Revisa todas las props que se pasan a los componentes hijos. ¿Son todas serializables (objetos planos, strings, números, arrays)?
        2.  **Clausuras (`$`)**: Inspecciona todas las funciones con `$`. ¿Están intentando capturar (`close over`) variables de su ámbito padre que no son serializables (funciones, promesas, clases, etc.)?

---
## 23.5 Estrategias de Migración

- [cite_start]**Estrategia Principal: Arquitectura de Islas con `qwikify$()`**. [cite: 4795]
- **Pasos**:
    1.  **Crear el Shell de Qwik**: Construir la aplicación contenedora (layouts, routing) en Qwik.
    2.  **Identificar Islas Interactivas**: Localizar los componentes interactivos en la aplicación existente (ej. React).
    3.  [cite_start]**Envolver con `qwikify$()`**: Envolver estos componentes de React con `qwikify$()` para hacerlos compatibles con Qwik. [cite: 4795]
    4.  [cite_start]**Controlar Hidratación**: Usar las directivas `client:*` (ej. `client:visible`) para retrasar la hidratación de estas islas y obtener ganancias de rendimiento inmediatas. [cite: 4844]
    5.  [cite_start]**Reescribir Gradualmente**: Migrar las islas a componentes nativos de Qwik de forma paulatina, una por una. [cite: 4880]

---
## 23.6 Técnicas de Depuración (Debugging)

- **Depuración en el Servidor**:
    - **`console.log()`**: Utiliza `console.log()` dentro de `routeLoader$`, `routeAction$`, o middleware. La salida aparecerá en la **terminal** donde se ejecuta el servidor de desarrollo, no en la consola del navegador.
- **Depuración en el Cliente**:
    - **DevTools del Navegador**: La herramienta estándar para inspeccionar el DOM, la red y la consola.
    - **`debugger;`**: Coloca esta instrucción dentro de cualquier función `$` (ej. `onClick$`) para pausar la ejecución del código en el navegador y abrir las herramientas de depuración.
    - **`log$()`**: Una utilidad de `@builder.io/qwik` que permite imprimir valores en la consola directamente desde el JSX, útil para depurar valores reactivos.
        ```tsx
        import { log$ } from '@builder.io/qwik';
        ...
        <div>Mi valor de señal es: {log$(miSignal.value)}</div>
        ```
- **Extensión Qwik DevTools**: Utiliza la extensión oficial para navegadores. Permite inspeccionar el árbol de componentes, el estado serializado y los `listeners` de eventos, facilitando la comprensión de la resumibilidad en acción.

---
## 23.7 Cheatsheet y Referencias Rápidas

- **Estado**:
    - `useSignal(valorInicial)`: Para primitivos. Acceso con `.value`.
    - `useStore(objetoInicial)`: Para objetos/arrays. Mutar propiedades directamente.
    - `useComputed$(() => ...)`: Para estado derivado y memoizado.
- **Datos (Servidor)**:
    - `routeLoader$(...)`: Carga datos para una ruta. Se ejecuta en el servidor.
- **Mutaciones (Servidor)**:
    - `routeAction$(...)`: Maneja envíos de `<Form>`. Se ejecuta en el servidor.
    - `server$(...)`: Ejecuta una clausura en el servidor, invocada desde el cliente.
- **Eventos**:
    - `onClick$`, `onInput$`, ...: Manejadores de eventos cargados perezosamente.
- **Ciclo de Vida**:
    - `useTask$`: Reacciona a cambios de estado. Isomórfico.
    - `useVisibleTask$`: "Escotilla de escape" para ejecución ansiosa en el cliente. Usar con precaución.
- **Estilos**:
    - `useStylesScoped$(...)`: Para CSS encapsulado a nivel de componente.
- **Integración React**:
    - `qwikify$(ReactComponent, options)`: Envuelve un componente de React. Controla su hidratación con `client:*`.