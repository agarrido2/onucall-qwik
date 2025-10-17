# PARTE 10: STATE MANAGEMENT AVANZADO

Esta sección profundiza en las estrategias y patrones para una gestión del estado eficaz y escalable en Qwik, cubriendo desde el alcance del estado hasta la persistencia y la comunicación entre componentes.

---
## 10.1 Estrategias de Estado Local vs. Global

La decisión sobre dónde debe residir el estado es una de las más importantes en la arquitectura de una aplicación.

- **Estado Local (`useSignal`, `useStore`)**:
    - **Definición**: Estado que pertenece y es gestionado por un único componente o un pequeño subárbol de componentes. Se pasa explícitamente hacia abajo a través de `props`.
    - **Alcance**: Su ciclo de vida está ligado al componente que lo define.
    - **Mejor Práctica**: **Siempre empezar con estado local**. Es el enfoque por defecto y el más simple. El estado solo debe ser elevado a un ancestro común o a un contexto global cuando múltiples componentes no relacionados directamente necesiten acceder a él o modificarlo.

- **Estado Global (`useContext`)**:
    - **Definición**: Estado que debe ser accesible desde múltiples componentes en diferentes partes del árbol de la aplicación sin pasarlo a través de `props`.
    - **Alcance**: Su ciclo de vida está ligado al componente proveedor (`useContextProvider`), que típicamente es un layout raíz o un layout de grupo de rutas.
    - **Mejor Práctica**: Utilizarlo con moderación y solo para preocupaciones verdaderamente transversales (`cross-cutting concerns`).
        - **Casos de Uso Ideales**: Sesión de usuario, tema de la UI (claro/oscuro), configuración de internacionalización (i18n), estado del carrito de compras.
        - **Anti-Patrón**: Usar el contexto global para estado que solo pertenece a una sección específica de la aplicación. Esto crea dependencias innecesarias y dificulta el razonamiento sobre el flujo de datos.

---
## 10.2 Patrones de Contexto y Proveedores

El "Provider Pattern" es la forma canónica de implementar `useContext` de manera limpia y reutilizable.

1.  **Crear el ID de Contexto**: Define el "contrato" y la clave única para tu contexto en un archivo separado para poder importarlo de forma segura.
    ```ts
    // src/contexts/auth-context.ts
    import { createContextId } from '@builder.io/qwik';
    
    export interface AuthState {
      user: User | null;
      status: 'authenticated' | 'anonymous' | 'pending';
    }
    
    export const AuthContext = createContextId<AuthState>('app.auth-context');
    ```

2.  **Crear el Proveedor**: En el componente raíz o en un layout, crea el estado y provéelo usando `useContextProvider`.
    ```tsx
    // src/routes/layout.tsx
    import { useStore, useContextProvider } from '@builder.io/qwik';
    import { AuthContext, type AuthState } from '~/contexts/auth-context';

    export default component$(() => {
      const authState = useStore<AuthState>({
        user: null,
        status: 'pending'
      });
      useContextProvider(AuthContext, authState);

      // Lógica para inicializar el estado desde un loader, etc.

      return <Slot />;
    });
    ```

3.  **Encapsular Lógica de Modificación**: Para una mejor arquitectura, el proveedor también puede exponer funciones para modificar el estado, manteniendo la lógica de mutación centralizada.
    ```ts
    // El estado podría incluir acciones
    export interface AuthState { ... }
    export interface AuthActions { login$: PropFunction<...>, logout$: PropFunction<...> }
    
    // El proveedor crearía y proporcionaría tanto el estado como las acciones.
    ```

---
## 10.3 Patrones de Persistencia de Estado

El estado del cliente es, por naturaleza, efímero y se pierde al recargar la página. Para persistirlo, se utilizan las APIs de almacenamiento del navegador.

- **Mecanismos**:
    - **Cookies**: Para datos pequeños y críticos (tokens de sesión, identificadores). Son accesibles tanto en el servidor (`requestEv.cookie`) como en el cliente.
    - **`localStorage` / `sessionStorage`**: Para datos más grandes y no críticos del lado del cliente (preferencias de UI, datos de formularios a medio completar).

- **Patrón de Sincronización en Qwik**: La interacción con el almacenamiento del navegador debe ocurrir en el cliente. El patrón idiomático combina `useVisibleTask$` y `useTask$`.
    ```tsx
    const theme = useSignal<'light' | 'dark'>('light');

    // 1. HIDRATACIÓN: Al cargar, lee el valor persistido.
    // Se usa useVisibleTask$ para asegurar que se ejecuta en el cliente.
    useVisibleTask$(() => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        theme.value = storedTheme as 'light' | 'dark';
      }
    });

    // 2. PERSISTENCIA: Cuando el estado cambie, guárdalo.
    // se usa useTask$ para reaccionar a los cambios en la señal.
    useTask$(({ track }) => {
      track(() => theme.value);

      // El código se ejecuta en el cliente después de la primera interacción.
      // isBrowser es un guard de Qwik para asegurar la ejecución en el navegador.
      if (isBrowser) {
        localStorage.setItem('theme', theme.value);
      }
    });
    ```
    ---
## 10.4 Comunicación Entre Componentes

La comunicación efectiva entre componentes es fundamental para una arquitectura limpia. Qwik proporciona patrones claros para cada escenario.

- **Padre a Hijo (Parent -> Child)**:
    - **Mecanismo**: **Props**. Es el flujo de datos unidireccional estándar. Los datos (incluyendo `Signals` y `Stores`) se pasan desde el componente padre al hijo.
    - **Nota**: Las props deben ser serializables.

- **Hijo a Padre (Child -> Parent)**:
    - **Mecanismo**: **Callbacks con `PropFunction`**. El componente padre pasa una función (`onClick$`, `onUpdate$`, etc.) como prop al hijo. El hijo invoca esta función para notificar al padre sobre un evento o cambio de estado.
        ```tsx
        // Parent.tsx
        const name = useSignal('');
        <Child onNameChange$={(newName) => name.value = newName} />

        // Child.tsx
        interface ChildProps { onNameChange$: PropFunction<(name: string) => void>; }
        const Child = component$<ChildProps>((props) => {
          return <input onInput$={(e) => props.onNameChange$((e.target as any).value)} />;
        });
        ```

- **Hermanos o Componentes Distantes (Siblings / Distant Components)**:
    - **Mecanismo**: **Estado Global con `useContext`**. Es la solución canónica para la comunicación entre componentes que no tienen una relación directa de padre-hijo. Un `Signal` o `Store` proporcionado a través de un contexto actúa como un "bus de estado" compartido al que cualquier componente descendiente puede suscribirse y/o modificar.

---
## 10.5 Sincronización de Estado

Mantener la consistencia del estado entre el cliente y el servidor, y entre diferentes partes de la UI, es crucial.

- **Fuente Única de Verdad (Single Source of Truth - SSOT)**: Este es el principio más importante. Cada pieza de estado debe tener un único "dueño".
    - **El Servidor como SSOT**: Para datos persistentes (perfiles de usuario, productos, etc.), la base de datos es la fuente de la verdad.
        - **Lectura**: `routeLoader$` se usa para obtener el estado canónico del servidor.
        - **Escritura**: `routeAction$` y `server$` se usan para enviar mutaciones al servidor. La respuesta del servidor (o una revalidación posterior) debe ser la que actualice el estado del cliente.
    - **El Cliente como SSOT**: Para estado efímero de la UI (ej. "está abierto un modal", contenido de un input no guardado), el cliente es la fuente de la verdad, gestionado con `useSignal` o `useStore`.

- **Sincronización de Estado Derivado**: Usa `useComputed$` para asegurar que los datos que dependen de otro estado siempre estén sincronizados, eliminando la posibilidad de inconsistencias.

---
## 10.6 Actualizaciones Optimistas (Optimistic Updates)

Este es un patrón de UX avanzado para hacer que las aplicaciones se sientan instantáneas, incluso con latencia de red.

- **Definición**: Se actualiza la UI del cliente **inmediatamente** después de una acción del usuario, **antes** de recibir la confirmación del servidor.
- **Mecanismo en Qwik**:
    1.  Dentro de un `listener` de evento (ej. `onClick$`), se guarda el estado actual en una variable temporal.
    2.  Se muta el estado local (`Signal` o `Store`) al nuevo estado deseado. La UI se actualiza instantáneamente.
    3.  Se realiza la llamada asíncrona al servidor (`await myAction.submit()` o `await myServer$()`).
    4.  Si la llamada al servidor falla (en un bloque `catch`), se revierte el estado local a su valor original guardado y se muestra un mensaje de error.
    ```tsx
    const isFavorite = useSignal(false);
    const setFavoriteOnServer = server$(...);

    <button onClick$={async () => {
      const previousState = isFavorite.value;
      isFavorite.value = !isFavorite.value; // 1. Actualización optimista
      try {
        await setFavoriteOnServer(isFavorite.value); // 2. Llamada al servidor
      } catch (e) {
        isFavorite.value = previousState; // 3. Reversión en caso de error
        showErrorToast('Failed to update');
      }
    }} />
    ```

---
## 10.7 Resumen de Mejores Prácticas de Gestión de Estado

- **Prioriza el Estado Local**: Empieza siempre con `useSignal`/`useStore` a nivel de componente. Solo eleva el estado a un ancestro común o a `useContext` cuando sea estrictamente necesario.
- **`useSignal` para Primitivos, `useStore` para Objetos**: Usa la herramienta adecuada para el trabajo.
- **Deriva, no Sincronices**: Usa `useComputed$` para cualquier estado que se pueda calcular a partir de otro.
- **Estado Serializable**: Asegúrate de que cualquier estado que deba persistir entre el servidor y el cliente sea serializable.
- **Centraliza la Lógica de Mutación**: Encapsula la lógica que modifica el estado (especialmente el estado compartido) en funciones o acciones específicas, en lugar de dispersarla por múltiples componentes.
- **Usa Actualizaciones Optimistas**: Para acciones de usuario comunes, considera el patrón de actualización optimista para una UX superior, pero siempre implementando la lógica de reversión en caso de error.