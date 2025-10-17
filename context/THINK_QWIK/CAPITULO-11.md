# PARTE 11: EVENTS Y INTERACTIVIDAD

Esta sección detalla el sistema de eventos de Qwik, que es el núcleo de su modelo de ejecución perezosa. La interactividad se logra sin el coste inicial de la hidratación, gracias a un sistema de delegación de eventos y carga de código bajo demanda.

---
## 11.1 Patrones de Manejo de Eventos

- **Manejadores en Línea (`onClick$`, etc.)**:
    - **Definición**: Es el patrón más común. El manejador de eventos se define directamente como un prop en un elemento JSX.
    - **Mecanismo**: El `$` al final del nombre del prop (ej. `onClick$`) es un marcador crucial que le indica al optimizador que la función es un **símbolo** que debe ser extraído y cargado de forma perezosa.
    - **Ejemplo**:
        ```tsx
        import { component$, useSignal } from '@builder.io/qwik';

        export default component$(() => {
          const count = useSignal(0);
          return <button onClick$={() => count.value++}>Count: {count.value}</button>;
        });
        ```

- **Manejadores Programáticos**:
    - **Definición**: Los `listeners` pueden ser declarados como variables y luego asignados a los props. Esto es útil para la reutilización y la lógica condicional.
    - **Ejemplo**:
        ```tsx
        const handleClick: PropFunction<(ev: MouseEvent) => void> = $(() => {
          console.log('Button clicked!');
        });

        <button onClick$={handleClick}>Click me</button>
        ```

- **Sintaxis Especial para Eventos Globales**:
    - **`document:on...`**: Permite adjuntar un `listener` directamente al `document` desde el JSX.
    - **`window:on...`**: Permite adjuntar un `listener` directamente al objeto `window`.
    - **Caso de Uso**: Ideal para manejar eventos globales, como cerrar un menú desplegable cuando el usuario hace clic en cualquier lugar fuera de él (`document:onClick$`).

---
## 11.2 Familia de Hooks `useOn()`

Proporcionan una forma programática de declarar `listeners` de eventos desde la lógica de un componente, en lugar de hacerlo en el JSX.

- **`useOn(eventName, handlerQRL)`**:
    - **Objetivo**: Adjunta un `listener` de eventos al **elemento raíz** del componente.
    - **Uso**: Útil para encapsular la lógica de eventos de un componente sin exponerla en el JSX.

- **`useOnDocument(eventName, handlerQRL)`**:
    - **Objetivo**: Adjunta un `listener` de eventos al objeto `document`.
    - **Uso**: El equivalente programático a la sintaxis `document:on...`.

- **`useOnWindow(eventName, handlerQRL)`**:
    - **Objetivo**: Adjunta un `listener` de eventos al objeto `window`.
    - **Uso**: El equivalente programático a `window:on...`. Ideal para eventos como `scroll` o `resize`.

- **Limpieza Automática (`cleanup`)**: Una de las principales ventajas de usar estos hooks es que Qwik se encarga de registrar y **eliminar automáticamente** los `listeners` cuando el componente se "destruye", previniendo fugas de memoria.

---
## 11.3 Creación de Eventos Personalizados

Qwik utiliza la API estándar del DOM `CustomEvent` para la comunicación de hijo a padre, ofreciendo una alternativa a los callbacks con `PropFunction`.

- **Mecanismo**:
    1.  **Despachar (en el Componente Hijo)**: Se crea y despacha un `CustomEvent` desde un elemento. El `detail` del evento puede contener cualquier dato serializable.
        ```tsx
        // ChildComponent.tsx
        <button onClick$={(e, element) => {
          const customEvent = new CustomEvent('myCustomEvent', {
            bubbles: true, // Importante para que el evento "suba" por el DOM
            composed: true,
            detail: { message: 'Hello from child!' },
          });
          element.dispatchEvent(customEvent);
        }}>
          Despachar Evento
        </button>
        ```
    2.  **Escuchar (en el Componente Padre)**: El padre escucha el evento personalizado utilizando la misma sintaxis `on...$` que para los eventos nativos. El nombre del evento se convierte de `kebab-case` a `camelCase`.
        ```tsx
        // ParentComponent.tsx
        <ChildComponent onMyCustomEvent$={(event) => {
          // El primer argumento es el CustomEvent
          console.log(event.detail.message); // -> "Hello from child!"
        }} />
        ```
- **Caso de Uso**: Es útil para desacoplar componentes. El hijo no necesita saber *quién* está escuchando, solo necesita anunciar que "algo ha sucedido".

---
## 11.4 Delegación de Eventos (Event Delegation)

Este es el principio fundamental que permite a Qwik ser instantáneamente interactivo sin adjuntar `listeners` individuales en el arranque.

- **Mecanismo Central**:
    1.  El **Qwik Loader** no itera sobre el DOM para adjuntar un `listener` a cada elemento con un prop `on...$`.
    2.  En su lugar, registra **un único `listener` global por tipo de evento** directamente en el objeto `document` (o `window` según corresponda). Por ejemplo, hay un solo `listener` para todos los eventos `click` de toda la aplicación.
    3.  Cuando un evento ocurre en un elemento, este "burbujea" (`bubbles up`) a través del árbol del DOM.
    4.  El `listener` global en `document` captura el evento.
    5.  Luego, inspecciona el `event.target` y busca hacia arriba en sus ancestros para encontrar el elemento que tiene el atributo del `listener` serializado (ej. `on:click`).
    6.  Una vez encontrado, extrae el QRL de ese atributo y procede a cargar y ejecutar perezosamente el código del manejador específico.

- **Beneficio de Rendimiento**: Este enfoque es extremadamente eficiente en términos de memoria y tiempo de CPU en la carga inicial. El navegador no se sobrecarga registrando potencialmente miles de `listeners`, lo que contribuye directamente a un Time To Interactive (TTI) casi nulo.

---
## 11.5 Eventos de Teclado y Ratón

Qwik soporta todos los eventos estándar del DOM para teclado y ratón, utilizando la misma convención `on...$`.

- **Eventos de Teclado**: `onKeyDown$`, `onKeyUp$`, `onKeyPress$`.
- **Eventos de Ratón**: `onMouseEnter$`, `onMouseLeave$`, `onMouseMove$`, `onMouseOver$`, `onMouseOut$`.
- **Objeto del Evento**: El primer argumento pasado al QRL del manejador es el objeto `Event` nativo del navegador (`KeyboardEvent`, `MouseEvent`), permitiendo el acceso a todas sus propiedades:
    - `event.key`, `event.code` para eventos de teclado.
    - `event.clientX`, `event.clientY`, `event.button` para eventos de ratón.
- **Modificadores (`Ctrl`, `Shift`, etc.) y Comportamientos (`preventDefault`)**:
    - Qwik **no tiene una sintaxis de modificadores** especial (como `.prevent` o `.stop` en Vue).
    - Este tipo de lógica debe ser manejada **explícitamente** dentro del cuerpo del manejador.
    ```tsx
    <a href="/page" onClick$={(event) => {
      // Prevenir la navegación por defecto
      event.preventDefault();

      // Comprobar si la tecla Ctrl estaba pulsada
      if (event.ctrlKey) {
        console.log('Ctrl + Click!');
      }
    }}>
      Link
    </a>
    ```

---
## 11.6 Eventos Táctiles y Móviles

De la misma manera, los eventos táctiles estándar están soportados para interacciones en dispositivos móviles.

- **Eventos Táctiles**: `onTouchStart$`, `onTouchMove$`, `onTouchEnd$`, `onTouchCancel$`.
- **Objeto del Evento**: El manejador recibe el `TouchEvent` nativo, que da acceso a las listas de puntos de contacto (`touches`, `targetTouches`, `changedTouches`), esenciales para implementar gestos como el deslizamiento (`swipe`) o el pellizco para hacer zoom (`pinch-to-zoom`).

---
## 11.7 Optimización del Rendimiento de Eventos

- **Optimización por Defecto**: El modelo de Qwik (delegación + carga perezosa) ya es la principal optimización. Para la mayoría de los eventos, no se requiere ninguna acción adicional por parte del desarrollador.
- **Eventos de Alta Frecuencia**: Eventos como `onMouseMove$`, `onScroll$`, o `window:onResize$` pueden dispararse cientos de veces por segundo, y un manejador ingenuo puede causar problemas de rendimiento.
- **Patrón `Debounce` y `Throttle`**:
    - **Mejor Práctica**: Para eventos de alta frecuencia, el desarrollador es responsable de aplicar patrones de **`debounce`** (agrupar eventos y ejecutar una sola vez después de un período de inactividad) o **`throttle`** (ejecutar como máximo una vez cada X milisegundos).
    - **Implementación**: Esta lógica se implementa dentro del QRL del manejador, típicamente utilizando una función de utilidad. Qwik no proporciona un modificador incorporado para esto.
    ```tsx
    import { $, component$ } from '@builder.io/qwik';
    import { debounce } from '~/utils/debounce'; // Función de utilidad

    export default component$(() => {
      const handleScroll = $(debounce(() => {
        console.log('Scrolled!');
      }, 200));

      return <div window:onScroll$={handleScroll}>...</div>;
    });
    ```
    