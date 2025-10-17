# PARTE 4: BEST PRACTICES

Esta sección documenta las mejores prácticas y patrones recomendados para desarrollar aplicaciones robustas, mantenibles y de alto rendimiento con Qwik.

---
## 4.1 Patrones de Diseño de Componentes

- **Principio de Responsabilidad Única (SRP)**: Cada componente debe tener una única y clara responsabilidad. Evita componentes monolíticos que gestionan demasiadas tareas. Divídelos en componentes más pequeños y especializados.
- **Colocación (Colocation)**: Mantén la lógica, los estilos y las pruebas de un componente lo más cerca posible. La estructura de Qwik City (`src/routes/feature/`) fomenta este patrón de forma natural. Los componentes reutilizables deben residir en un directorio compartido como `src/components/`.
- **Props de Funciones (`PropFunction`)**: **Regla crítica**: Cuando pases una función como prop a un componente hijo, siempre debe ser tipada con `PropFunction` en lugar de `Function` o `QRL`. Esto garantiza que el optimizador de Qwik pueda extraer y cargar perezosamente la función correctamente.
    ```tsx
    interface MyButtonProps {
      onClick$: PropFunction<() => void>;
    }
    ```
- **Abstracción Tardía**: No crees componentes reutilizables de forma prematura. Es preferible repetir un poco de código al principio. Abstrae a un componente reutilizable solo cuando tengas al menos dos o tres casos de uso claros. Esto evita la creación de abstracciones incorrectas o demasiado complejas.
- **Composición sobre Herencia**: Utiliza la composición y el componente `<Slot/>` para construir UIs complejas a partir de piezas más simples y reutilizables. La herencia no es un patrón idiomático en Qwik.

---
## 4.2 Mejores Prácticas en la Gestión del Estado

- **`useSignal()` vs `useStore()`**: La elección entre ambos es crucial para el rendimiento y la claridad del código.
    - **`useSignal()`**: **Opción preferida para valores primitivos** (string, number, boolean, null, undefined). Ofrece la reactividad más granular y explícita. Úsalo también cuando un objeto no necesite ser reactivo en profundidad (el objeto en sí puede cambiar, pero no sus propiedades internas).
    - **`useStore()`**: **Diseñado para objetos y arrays complejos con reactividad profunda**. Qwik envuelve el objeto en un `Proxy` que sigue los cambios en cualquier nivel de anidamiento.
    - **Advertencia de `useStore()`**: Su reactividad profunda es poderosa pero puede tener un coste de rendimiento si se abusa de ella con objetos muy grandes y complejos. Para optimizar, se puede desactivar la reactividad profunda: `useStore(myObject, { deep: false })`.

- **Estado Derivado con `useComputed$`**: **Nunca sincronices estados manualmente**. Si un valor de estado se puede calcular a partir de otro, utiliza siempre `useComputed$()`. Esto crea una señal derivada que se actualiza automáticamente cuando sus dependencias cambian, garantizando la consistencia y evitando la duplicación de datos.
    ```tsx
    const price = useSignal(10);
    const quantity = useSignal(2);
    const total = useComputed$(() => price.value * quantity.value); // Se actualiza solo si price o quantity cambian.
    ```

- **Estado Global con `useContext()`**:
    - **Uso limitado**: Resérvalo para estados verdaderamente globales que son necesarios en muchas partes del árbol de componentes, como la sesión del usuario, el tema de la UI o el contenido de un carrito de compras.
    - **Evita `prop-drilling`**: Es la herramienta principal para evitar pasar props a través de múltiples niveles de componentes que no las necesitan.
    - **Proporcionar el estado**: El estado debe ser creado (con `useStore` o `useSignal`) y luego proporcionado al árbol de componentes usando `useContextProvider()`, típicamente en un `layout.tsx` raíz.

---
## 4.3 Guías de Optimización del Rendimiento

- **Confía en el Framework**: La principal directriz es no aplicar patrones de optimización de otros frameworks. **Qwik es performante por defecto**. No necesitas `memo`, `useCallback`, etc. La mejor optimización es escribir código idiomático de Qwik.

- **Evita `useVisibleTask$()` siempre que sea posible**:
    - **Propósito**: `useVisibleTask$()` es una **escotilla de escape** (`escape hatch`) diseñada específicamente para ejecutar código en el cliente de forma ansiosa (`eagerly`) cuando un componente se hace visible.
    - **Cuándo usarlo (casos raros)**: Su uso principal es para integrar librerías de terceros que necesitan acceso directo al DOM para inicializarse (ej. una librería de gráficos como D3.js).
    - **Por qué evitarlo**: Rompe el principio de "cero JS por defecto". Introduce ejecución de código ansiosa que puede bloquear el hilo principal. **Casi siempre existe una alternativa mejor** y más performante en Qwik.
    - **Alternativas**:
        - Para reaccionar a eventos del usuario: Usa `onClick$`, `onInput$`, etc.
        - Para reaccionar a cambios de estado: Usa `useTask$`.
        - Para eventos no directamente ligados a un elemento: Usa `useOn()`, `useOnWindow()`, `useOnDocument()`.

- **Optimización de Imágenes**:
    - **Imágenes Estáticas (en tu código fuente)**: Para la máxima optimización de los Core Web Vitals (cero CLS), importa la imagen con los parámetros de optimización de Vite y úsala como un componente. Esto genera automáticamente `srcset` para diferentes resoluciones.
        ```tsx
        import MyImage from '~/media/my-image.png?w=1000&h=500&jsx';
        export default component$(() => <MyImage />);
        ```
    - **Imágenes Dinámicas (desde un CMS o API)**: Utiliza el paquete `@unpic/qwik`. Es la solución óptima ya que se integra con los CDNs de imágenes más populares (Cloudinary, Imgix, etc.) para servir imágenes optimizadas en tamaño y formato sobre la marcha.

    ---
## 4.4 Patrones de Organización de Código

Una estructura de proyecto consistente es clave para la mantenibilidad a largo plazo.

- **`src/routes/`**: Es el corazón de la aplicación. Contiene todas las páginas, layouts y endpoints de API. Su estructura de directorios define directamente el enrutamiento de la aplicación.
- **`src/components/`**: Directorio para **componentes reutilizables y agnósticos de la ruta**. Elementos como `Button`, `Card`, `Modal`, que se usan en múltiples lugares, deben residir aquí para promover la reutilización y mantener el directorio `routes` limpio.
- **Grupos de Rutas `(nombre-grupo)`**: Para organizar rutas relacionadas sin afectar la URL final, utiliza carpetas con paréntesis. Por ejemplo, `src/routes/(auth)/login/` y `src/routes/(auth)/register/` comparten el layout de `src/routes/(auth)/layout.tsx` pero sus URLs son `/login` y `/register`.
- **`src/lib/` o `src/utils/`**: Para todo el código que no es un componente. Esto incluye funciones de utilidad, constantes, definiciones de tipos (`types`), clientes de API, etc. Ayuda a mantener una clara separación de responsabilidades.
- **Colocación de Archivos**: Siempre que sea posible, los archivos relacionados con una ruta específica (estilos, pruebas, componentes de un solo uso) deben vivir dentro del mismo directorio de esa ruta.

---
## 4.5 Estrategias de Testing

Qwik es totalmente compatible con herramientas modernas de testing. La estrategia recomendada sigue el modelo de la pirámide de testing.

- **Tests Unitarios (con Vitest)**:
    - **Objetivo**: Probar funciones puras, lógica de negocio y utilidades de forma aislada.
    - **Características**: Son extremadamente rápidos, ya que se ejecutan en un entorno de Node.js sin necesidad de un navegador. Constituyen la base de la pirámide.

- **Tests de Componentes (con Cypress o Playwright)**:
    - **Objetivo**: Probar un componente o un pequeño grupo de componentes de forma aislada, verificando su renderizado y su interactividad.
    - **Características**: Es el punto intermedio ideal. Se monta el componente en un navegador real, permitiendo simular interacciones del usuario (`click`, `type`) y hacer aserciones sobre el DOM, pero sin el coste de levantar toda la aplicación. El comando `pnpm run qwik add cypress` configura esto automáticamente.

- **Tests End-to-End (E2E) (con Cypress o Playwright)**:
    - **Objetivo**: Validar flujos críticos del usuario a través de toda la aplicación, desde el login hasta el checkout.
    - **Características**: Son los más potentes para garantizar la funcionalidad real, pero también los más lentos, costosos de mantener y frágiles. Deben reservarse para los "caminos felices" más importantes de la aplicación.

---
## 4.6 Mejores Prácticas de Seguridad

- **La Lógica Sensible Siempre en el Servidor**: **Regla de oro: nunca confíes en el cliente**. Cualquier operación que implique mutaciones de datos, acceso a bases de datos, o uso de claves secretas, **debe** ejecutarse en el servidor. Utiliza `routeAction$`, `globalAction$` y `server$` para garantizarlo.
- **Gestión de Variables de Entorno**:
    - **Públicas**: Deben empezar con el prefijo `VITE_`. Son accesibles tanto en el cliente (`import.meta.env.VITE_...`) como en el servidor. Son seguras para claves publicables (ej. clave pública de Stripe).
    - **Privadas**: **No deben llevar prefijo**. Solo son accesibles en el servidor a través del `requestEvent` (ej. `requestEv.env.get('MI_SECRETO')`) dentro de funciones como `routeLoader$` o `routeAction$`. Aquí es donde deben ir las claves de API, secretos de bases de datos, etc.
- **Validación de Entradas**: Valida siempre los datos de entrada en el servidor (dentro de un `routeAction$`, por ejemplo), incluso si ya existe una validación en el cliente. La librería **Zod** es el estándar recomendado y se integra nativamente con `routeAction$`.

---
## 4.7 Guías de Accesibilidad (a11y)

- **HTML Semántico**: Usa siempre el elemento HTML semánticamente correcto para el trabajo (`<button>`, `<nav>`, `<main>`, `<article>`, etc.). Esto proporciona una base de accesibilidad sólida sin esfuerzo adicional.
- **Atributos ARIA**: Cuando el HTML semántico no sea suficiente, utiliza atributos `aria-*` para proporcionar contexto adicional a los lectores de pantalla (ej. `aria-expanded` para un acordeón, `aria-label` para un botón con solo un icono).
- **Navegación por Teclado**: Asegúrate de que todos los elementos interactivos sean accesibles y operables utilizando solo el teclado. Esto incluye la gestión del foco (`focus`).
- **Patrón para SVGs**: Para que los SVGs sean flexibles y accesibles, deben ser componentes que acepten props estándar de SVG. **Aplica siempre este esquema**:
    ```tsx
    import type { PropsOf } from '@builder.io/qwik';

    // El componente acepta todas las props de un <svg> nativo.
    export function MiIcono(props: PropsOf<'svg'>) {
      return (
        <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
          <path d="..."></path>
        </svg>
      );
    }
    ```
- **Testing Automatizado**: Integra herramientas de auditoría de accesibilidad como `cypress-axe` en tus suites de tests para detectar violaciones comunes de forma automática.