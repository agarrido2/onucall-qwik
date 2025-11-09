# Guía Canónica de Motion One para Qwik

**Propósito**: Este documento establece los patrones y directivas canónicos para integrar la librería de animación de alto rendimiento **Motion One (`motion.dev`)** en una aplicación Qwik. El objetivo es permitir a un agente de IA crear animaciones fluidas y modernas, respetando los principios de **resumibilidad** y **carga perezosa (lazy-loading)** de Qwik.

---
## PARTE 1: FILOSOFÍA Y FUNDAMENTOS (POR QUÉ MOTION ONE)

Motion One es la librería de animación ideal para Qwik por tres razones fundamentales:

1.  **Rendimiento Nativo (WAAPI)**: Está construida sobre la **Web Animations API (WAAPI)** nativa del navegador. Esto significa que las animaciones se ejecutan en el hilo del compositor (aceleradas por hardware) siempre que es posible, garantizando una fluidez máxima sin bloquear el hilo principal de JavaScript.
2.  **Tamaño Mínimo**: Es extremadamente ligera (menos de 10kb). No incluye un *runtime* de animación pesado porque utiliza el que ya provee el navegador.
3.  **Framework-Agnostic**: Es JavaScript puro. No tiene dependencias de VDOM (React, Vue) y funciona manipulando directamente los elementos del DOM, lo que la hace perfecta para la arquitectura de Qwik.

---
## PARTE 2: EL PATRÓN DE INTEGRACIÓN CANÓNICO

Para usar **CUALQUIER** librería de terceros que manipule el DOM en Qwik, se debe usar un patrón específico para no romper la resumibilidad.

### 2.1 `useVisibleTask$()`: La "Escotilla de Escape" Correcta

El error más grave sería importar y ejecutar la librería de animación en el servidor o en la carga inicial del cliente. Esto iría en contra del principio de "cero JS por defecto" de Qwik.

El hook `useVisibleTask$()` es la herramienta canónica de Qwik diseñada para este propósito.

* **Por Qué**:
    * **Solo Cliente**: `useVisibleTask$()` garantiza que el código **solo se ejecute en el navegador**, evitando errores de SSR donde `document` o `window` no existen.
    * **Carga Perezosa**: Se ejecuta *solo* cuando el componente entra en el *viewport* del usuario.
    * **Lazy-Loading de la Librería**: Al usar una importación dinámica (`import()`) *dentro* del hook, la librería Motion One (`motion.dev`) no se descarga hasta que el componente es visible. Esto es el pilar del rendimiento en Qwik.

### 2.2 Esqueleto de Código Canónico (Qwik + Motion One)

Este es el patrón que la IA debe seguir **siempre** para animar un componente al volverse visible.

```tsx
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

export const MiComponenteAnimado = component$(() => {
  // 1. Crear una Señal (Signal) para la referencia del elemento DOM
  const elRef = useSignal<HTMLDivElement>();

  // 2. Usar useVisibleTask$ para ejecutar la animación en el cliente
  //    cuando el componente sea visible.
  useVisibleTask$(({ cleanup }) => {
    
    // 3. IMPORTACIÓN DINÁMICA: Cargar Motion One perezosamente
    import('motion').then(({ animate, spring }) => {
      
      // 4. Verificar que el elemento existe en el DOM
      if (elRef.value) {
        
        // 5. Definir y ejecutar la animación de Motion One
        const anim = animate(
          elRef.value,
          { 
            opacity: [0, 1], // Fade in
            y: [10, 0]         // Slide up
          },
          { 
            duration: 0.7,
            easing: spring({ stiffness: 150, damping: 20 }) // Easing con físicas
          }
        );

        // 6. LIMPIEZA (Cleanup): Detener la animación si el componente se destruye
        //    para prevenir fugas de memoria.
        cleanup(() => anim.stop());
      }
    });
    
  }, { strategy: 'document-ready' }); // Estrategia de carga

  return (
    <div 
      // 7. Asignar la referencia al elemento
      ref={elRef} 
      // 8. Estado inicial (invisible) antes de que se ejecute la animación
      class="opacity-0" 
    >
      Contenido Animado
    </div>
  );
});
```

---
## PARTE 3: API DE MOTION ONE (Uso con JS Puro)

La IA debe centrarse en estas funciones clave, que se importan desde `'motion'`.

### 3.1 `animate(element, keyframes, options)`

Es la función principal para crear una animación.

* `element`: El elemento del DOM (`elRef.value` en Qwik).
* `keyframes`: Un objeto que define los estados de la animación.
    * **Implícito (Desde el estado actual al final):**
        ```js
        { opacity: 1, x: 50 } 
        // Anima la opacidad desde su valor actual (ej. 0) a 1
        ```
    * **Explícito (Desde -> Hacia):**
        ```js
        { opacity: [0, 1], y: [20, 0] } 
        // Anima opacidad de 0 a 1, y 'y' de 20px a 0px
        ```
* `options`: Un objeto para controlar la animación.
    * `duration: 0.8` (en segundos)
    * `delay: 0.2`
    * `repeat: Infinity`
    * `direction: 'alternate'`

### 3.2 `easing` (Físicas y Curvas)

Esta es una de las características más potentes de Motion One. Se pasa dentro de las `options`.

* **Curvas Estándar**: `easing: 'ease-in-out'` (string)
* **Físicas (Spring)**: Proporciona una sensación natural y física (como en la Guía de UX 1.3).
    ```js
    import { spring } from 'motion';
    
    // Opciones de animate
    { 
      easing: spring({ 
        stiffness: 100, // Rigidez (cuán rápido)
        damping: 10,    // Amortiguación (cuánto rebota)
        mass: 1         // Masa
      }) 
    }
    ```

---
## PARTE 4: API AVANZADA (SECUENCIACIÓN Y SCROLL)

### 4.1 `timeline(sequence, options)`

Para orquestar múltiples animaciones en una secuencia compleja (Scrollytelling).

* `sequence`: Un array de animaciones. Cada animación es un array: `[elemento, keyframes, opciones]`.

**Sintaxis JS Pura:**
```js
import { timeline, stagger } from 'motion';

const sequence = [
  // [elemento, keyframes, opciones]
  ['.titulo', { opacity: 1, y: 0 }],
  
  // 'at' controla el tiempo: 0.2s después del inicio total
  ['.subtitulo', { opacity: 1, y: 0 }, { at: 0.2 }], 
  
  // 'stagger' aplica un retraso incremental a múltiples elementos
  // 'at: "-0.1"' empieza 0.1s ANTES del final de la animación anterior
  ['.item-lista', { opacity: 1 }, { delay: stagger(0.1), at: '-0.1' }] 
];

timeline(sequence);
```

### 4.2 `scroll(onScroll, options)`

Para animaciones basadas en el scroll (Scrollytelling, como en la Guía de UX 2.4).

* `onScroll`: Una función callback que se dispara con el progreso del scroll. El objeto devuelto incluye `y.progress` (un valor de 0 a 1 que indica el progreso del scroll).

**Sintaxis JS Pura (para Qwik, usar dentro de `useVisibleTask$`)**
```js
import { scroll, animate } from 'motion';

const elementoBarra = document.querySelector('#barra-progreso');

scroll(({ y }) => {
  // y.progress va de 0 a 1 mientras se hace scroll por la página
  animate(elementoBarra, { scaleX: y.progress });
}, 
{ 
  // Opcional: define en qué elemento se basa el scroll
  target: document.querySelector('#mi-seccion') 
});
```

---
## PARTE 5: ANTI-PATRONES Y MEJORES PRÁCTICAS EN QWIK

### 5.1 Anti-Patrones (QUÉ NO HACER)

* **❌ INCORRECTO: Importación Global**
    ```tsx
    // NO HACER ESTO
    import { animate } from 'motion'; // ❌ MAL
    import { component$, useSignal } from '@builder.io/qwik';
    
    export default component$(() => {
      // Esto rompe el "cero JS" y añade 'motion' al bundle inicial
    });
    ```
    **Razón**: Esto fuerza a Qwik a descargar y parsear Motion One en la carga inicial, destruyendo el beneficio de la resumibilidad.

* **❌ INCORRECTO: Usar `useTask$`**
    ```tsx
    // NO HACER ESTO
    useTask$(() => {
      // ❌ MAL: useTask$ puede ejecutarse en el servidor
      // donde 'document' y 'window' no existen.
      import('motion').then(...) 
    });
    ```
    **Razón**: `useTask$` es isomórfico (se ejecuta en servidor y cliente) y no es el hook correcto para interactuar con el DOM del cliente de forma ansiosa.

### 5.2 Mejores Prácticas

* **✅ CORRECTO: `will-change` (Performance)**
    * Añade `will-change: transform, opacity;` (o las propiedades que vayas a animar) al elemento que se animará.
    * Esto le dice al navegador que prepare una capa de composición separada para el elemento, haciendo la animación mucho más fluida.
    * **En Tailwind**: `class="will-change-[transform,opacity]"`

* **✅ CORRECTO: Usar Referencias (Refs) sobre Selectores de String**
    * **Preferir**: `animate(elRef.value, ...)`
    * **Evitar**: `animate('.mi-clase', ...)`
    * **Razón**: Usar la `ref` de `useSignal` (como en el esqueleto canónico) es explícito, está encapsulado dentro del componente y no depende de selectores globales de CSS que pueden cambiar.

---
## PARTE 6: REGLAS DE INTEROPERABILIDAD (TAILWIND + MOTION)

**Directiva Principal**: Tailwind y Motion One deben colaborar, no competir. Motion One gestiona animaciones complejas (basadas en JS) y Tailwind gestiona animaciones simples (basadas en CSS).

### Regla 1: Transiciones de Estado (CSS/Tailwind)

**Cuándo usar Tailwind (`transition-`):**
Usa las utilidades `transition` de Tailwind **solo** para animaciones simples basadas en cambios de estado o pseudo-clases de CSS.

* **Hover y Focus**: `hover:scale-105 transition-transform`
* **Modo Oscuro**: Animar el cambio de `bg-background`.
* **Clases Condicionales (Scroll)**: Perfecto para tu **Header con Glassmorphism**. El cambio de `isScrolled` (que añade/quita clases `bg-transparent` o `bg-gray-900/50`) debe ser animado con `transition-all duration-300` en el CSS del Header.

### Regla 2: Animaciones de Entrada y Secuencias (JS/Motion)

**Cuándo usar Motion One (`animate()`):**
Usa `animate()`, `timeline()` o `scroll()` de Motion One para todas las animaciones de "entrada" (al aparecer) y para secuencias coreografiadas.

* **Animaciones "On Reveal"**: *Siempre* usa `useVisibleTask$` + `animate()`.
* **Scrollytelling**: *Siempre* usa `useVisibleTask$` + `scroll()`.
* **Animaciones Coreografiadas**: *Siempre* usa `useVisibleTask$` + `timeline()`.

**Regla de Oro**: Si un elemento va a ser controlado por `animate()` de Motion One, **NO DEBES** añadirle clases de `transition-*` de Tailwind que afecten a las mismas propiedades (como `opacity` o `transform`).

### Regla 3: Sinergia de Clases

* **Estado Inicial**: Usa siempre clases de Tailwind para definir el estado inicial *antes* de la animación de Motion. (Ej. `class="opacity-0 translate-y-5"`).
* **Optimización**: Usa siempre la utilidad `will-change-*` de Tailwind en los elementos que vayas a animar con Motion One. (Ej. `class="will-change-[transform,opacity]"`).