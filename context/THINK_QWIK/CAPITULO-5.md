# PARTE 5: APIS CRÍTICAS Y REACTIVIDAD

Este capítulo detalla el núcleo del sistema de reactividad de Qwik. La comprensión profunda de estas APIs es fundamental para escribir código eficiente y correcto.

---
## 5.1 `useSignal()` vs `useStore()` (diferencias críticas de reactividad)

Ambas APIs crean estado reactivo, pero su mecanismo y casos de uso son distintos.

### `useSignal()`
- **Definición**: Crea un objeto contenedor reactivo (`Signal`) para un **único valor**. Este valor puede ser un primitivo (string, number, boolean) o un objeto.
- **Mecanismo de Reactividad**: **Basado en suscripción al acceso de `.value`**. El framework registra dónde se lee la propiedad `.value` de la señal en el JSX. Al modificar `.value`, Qwik actualiza **únicamente** esos nodos específicos del DOM. Es la forma de reactividad más granular y performante.
- **Caso de Uso Principal**:
    - Para valores primitivos: `const count = useSignal(0);`
    - Para objetos donde solo se reemplazará el objeto completo, sin mutar sus propiedades internas: `const user = useSignal({ name: 'John' }); user.value = { name: 'Jane' };`

### `useStore()`
- **Definición**: Crea un **Proxy** reactivo profundo para un **objeto o array**.
- **Mecanismo de Reactividad**: **Basado en Proxy**. Qwik rastrea el acceso a **cada propiedad** del objeto. Cuando una propiedad es modificada, todos los consumidores de esa propiedad específica son notificados para su actualización. Por defecto, este rastreo es recursivo para objetos y arrays anidados.
- **Diferencia Crítica de Comportamiento**:
    - `useSignal` reacciona a la reasignación de la propiedad `.value`.
    - `useStore` reacciona a la **mutación de las propiedades** del objeto, no a la reasignación de la variable que lo contiene.
    ```tsx
    // Comportamiento de useStore
    const state = useStore({ count: 0 });

    // ESTO FUNCIONA: Mutar la propiedad 'count' dispara la reactividad.
    state.count++;

    // ESTO NO FUNCIONA: Reasignar la variable 'state' rompe la reactividad del Proxy.
    // state = { count: 1 }; // ¡INCORRECTO!
    ```
- **Caso de Uso Principal**:
    - Para estado complejo con múltiples propiedades que deben ser reactivas individualmente: `const form = useStore({ name: '', email: '', errors: {} });`

---
## 5.2 `PropFunction` vs `QRL` (props correctas)

Esta es una regla de tipado fundamental para la correcta operación del optimizador de Qwik.

- **`QRL` (Qwik Resource Locator)**: Es el tipo de bajo nivel que representa una referencia serializable a un símbolo (`$`). Es la estructura interna que usa Qwik para la carga perezosa.
- **`PropFunction`**: Es un **alias de tipo** específico para `QRL`s que se pasan como props de funciones (callbacks) a los componentes.

- **Regla de Oro**: **Siempre se debe usar `PropFunction` para tipar las props de funciones**. No usar `Function`, `() => void`, o `QRL` directamente.
    - **Incorrecto ❌**:
        ```tsx
        interface ButtonProps {
          onClick: () => void; // No es serializable
          // ó
          onClick: QRL<() => void>; // Demasiado genérico
        }
        ```
    - **Correcto ✅**:
        ```tsx
        import type { PropFunction } from '@builder.io/qwik';

        interface ButtonProps {
          onClick$: PropFunction<(data: MyData) => void>;
        }
        ```
- **Razón**: El uso de `PropFunction` (y la convención del sufijo `$`) proporciona al compilador y al linter la información necesaria para:
    1.  Validar que la función es serializable.
    2.  Aplicar correctamente la extracción de clausuras.
    3.  Ofrecer un tipado y autocompletado precisos en el editor.

---
## 5.3 `component$()` - Límites Reactivos

- **Definición**: La función constructora para todos los componentes de Qwik.
- **Límite de Carga Perezosa**: El `$` indica que el cuerpo del componente (su función de renderizado) es un **símbolo**. El código de renderizado de un componente no se descarga en el cliente hasta que es explícitamente necesario para un re-renderizado (lo cual es poco común, gracias a la reactividad granular).
- **Límite de Estado y Contexto**: Un componente encapsula su propio estado y puede actuar como proveedor (`useContextProvider`) o consumidor (`useContext`) de un contexto, definiendo así un límite para la propagación de ese estado.
- **Props Serializables**: Una restricción fundamental de la arquitectura de Qwik es que **todas las props pasadas a un componente deben ser serializables**. Esto es necesario porque las props deben poder sobrevivir la transferencia de estado del servidor al cliente. No se pueden pasar funciones no-QRL, clases, o datos complejos no serializables.

---
## 5.4 `useContext()` - Patrones de Estado Global

`useContext` es el mecanismo integrado de Qwik para la inyección de dependencias y la gestión de estado a través del árbol de componentes, evitando el `prop-drilling`.

- **Mecanismo en 3 Pasos**:
    1.  **Crear un ID de Contexto**: Se crea un identificador único y serializable para el contexto. Este ID es lo que conecta al proveedor con los consumidores.
        ```tsx
        import { createContextId } from '@builder.io/qwik';
        export const MyContext = createContextId<MyStateType>('com.my-app.my-context');
        ```
    2.  **Proveer el Estado**: En un componente ancestro (típicamente un `layout.tsx`), se utiliza `useContextProvider()` para asociar el ID del contexto con un estado reactivo (`Signal` o `Store`).
        ```tsx
        import { useStore, useContextProvider } from '@builder.io/qwik';
        import { MyContext } from './my-context';

        const state = useStore<MyStateType>({ ... });
        useContextProvider(MyContext, state);
        ```
    3.  **Consumir el Estado**: En cualquier componente descendiente, se utiliza `useContext()` con el mismo ID para acceder al estado.
        ```tsx
        import { useContext } from '@builder.io/qwik';
        import { MyContext } from './my-context';

        const state = useContext(MyContext);
        // state.someValue
        ```
- **Patrones de Uso**:
    - **Estado de Sesión**: Proporcionar la información del usuario autenticado a toda la aplicación.
    - **Gestión de Temas (Theming)**: Suministrar el tema actual (claro/oscuro) y la función para cambiarlo.
    - **Estado a Nivel de Módulo**: En un layout de una ruta agrupada (ej. `(dashboard)/layout.tsx`), se puede proporcionar un estado que solo sea accesible para las rutas de ese dashboard.

    ---
## 5.5 `useComputed$()` - Estado Derivado

- **Definición**: Un hook que crea una **señal (`Signal`) de solo lectura y memoizada**, cuyo valor se calcula a partir de otras señales.
- **Mecanismo**:
    1.  Recibe una función (`getter`) como argumento.
    2.  El framework rastrea automáticamente qué señales (`.value`) se leen dentro de esa función.
    3.  La función `getter` se re-ejecuta, y el valor de la señal computada se actualiza, **únicamente cuando una de las señales de las que depende cambia su valor**.
- **Caso de Uso y Mejor Práctica**: Es la herramienta canónica para evitar la duplicación de estado y la sincronización manual. Si una pieza de estado puede derivarse de otra, **siempre debe** ser un `useComputed$`.
    ```tsx
    // Correcto: fullName se deriva y actualiza automáticamente
    const firstName = useSignal('John');
    const lastName = useSignal('Doe');
    const fullName = useComputed$(() => `${firstName.value} ${lastName.value}`);

    // Incorrecto: Requiere sincronización manual y es propenso a errores
    const firstName = useSignal('John');
    const lastName = useSignal('Doe');
    const fullName = useSignal('John Doe'); // Estado redundante
    // ...requeriría un useTask$ para mantener fullName sincronizado
    ```

---
## 5.6 `useResource$()` - Datos Asíncronos

- **Definición**: Un hook diseñado para gestionar el ciclo de vida completo de una operación asíncrona (típicamente una llamada `fetch`) y su estado resultante, directamente dentro de un componente. Es el análogo en el cliente de `routeLoader$`.
- **Estados Gestionados**: Maneja automáticamente los tres estados de una `Promise`:
    - `pending`: La operación está en curso.
    - `resolved`: La operación se completó con éxito.
    - `rejected`: La operación falló.
- **Mecanismo**:
    1.  Recibe una función asíncrona (el "recurso") que devuelve una `Promise`.
    2.  Utiliza `track` para observar dependencias (señales). Si una dependencia cambia, la función recurso se vuelve a ejecutar.
    3.  Devuelve un objeto `Resource` que puede ser renderizado con el componente `<Resource>`.
- **Patrón de Renderizado con `<Resource>`**:
    ```tsx
    import { Resource, useResource$ } from '@builder.io/qwik';

    const searchResults = useResource$(({ track, cleanup }) => {
      const searchTerm = track(() => searchInput.value);
      // ...lógica de fetch...
    });

    <Resource
      value={searchResults}
      onPending={() => <p>Loading...</p>}
      onRejected={(error) => <p>Error: {error.message}</p>}
      onResolved={(data) => <ul>{data.map(item => <li>{item.name}</li>)}</ul>}
    />
    ```
- **Caso de Uso**: Ideal para funcionalidades del lado del cliente que dependen de la interacción del usuario, como un buscador "search-as-you-type" o la carga de datos en respuesta a un filtro.

---
## 5.7 Jerarquía Completa de Hooks de Ciclo de Vida

El orden y el entorno de ejecución de los hooks son críticos. La siguiente jerarquía describe el flujo desde el servidor hasta el cliente.

- **Fase de Servidor (Durante la Petición)**:
    1.  **`onRequest` (Middleware)**: Se ejecuta al principio de todo en el servidor para una ruta. Ideal para autenticación o redirecciones.
    2.  **`routeLoader$`**: Se ejecuta a continuación, también en el servidor, para cargar los datos necesarios para la ruta. Su resultado se serializa.
    3.  **`useTask$` (Ejecución en Servidor)**: Se ejecuta una vez durante el SSR. Puede usarse para inicializar estado basado en otro estado (ej. de un `routeLoader$`) antes del renderizado.

- **Fase de Cliente (Post-Carga e Interacción)**:
    1.  **`useVisibleTask$`**:
        - **Entorno**: Cliente.
        - **Disparador**: Se ejecuta **de forma ansiosa (`eagerly`)** tan pronto como el componente entra en el *viewport*.
        - **Uso**: Escotilla de escape para librerías de terceros que necesitan manipular el DOM al ser visibles. **Su uso debe ser mínimo y justificado**.
    2.  **`useOn()` (y variantes `useOnWindow`, `useOnDocument`)**:
        - **Entorno**: Cliente.
        - **Disparador**: El código del *handler* se **carga y ejecuta perezosamente** la primera vez que el evento especificado (`click`, `scroll`, etc.) ocurre.
        - **Uso**: El patrón principal para toda la lógica impulsada por eventos.
    3.  **`useTask$` (Ejecución en Cliente)**:
        - **Entorno**: Cliente.
        - **Disparador**: El código del *handler* se **carga y ejecuta perezosamente** cuando una de las señales que observa (`track`) cambia su valor debido a una interacción.
        - **Uso**: El equivalente a `useEffect` para reaccionar a cambios de estado.
    4.  **`cleanup()`**:
        - **Entorno**: Cliente.
        - **Disparador**: Es una función devuelta dentro de un `useTask$` o `useVisibleTask$`. Se ejecuta justo antes de que la tarea se vuelva a ejecutar, o cuando el componente es "destruido" (eliminado del DOM).
        - **Uso**: Para limpiar suscripciones, `setTimeout`, o cualquier efecto secundario que necesite ser deshecho.