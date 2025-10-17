# PARTE 22: ANTI-PATTERNS Y GOTCHAS

Esta sección documenta los errores comunes, los anti-patrones y las "trampas" (`gotchas`) en el desarrollo con Qwik. Conocerlos es crucial para evitar bugs, problemas de rendimiento y código difícil de mantener.

---
## 22.1 `useVisibleTask$()` - Cuándo Evitarlo

Este es el anti-patrón más importante que se debe comprender en Qwik.

- **El Anti-Patrón**: Utilizar `useVisibleTask$()` para lógica que podría (y debería) ser manejada por un `listener` de evento, un `useTask$`, o en el servidor.
- **Por qué es un Anti-Patrón**: `useVisibleTask$()` es una **ejecución ansiosa (`eager`)** en el cliente. Rompe deliberadamente el principio de "cero JS por defecto" y la resumibilidad. [cite_start]Fuerza la descarga y ejecución de su código tan pronto como el componente es visible, lo que puede bloquear el hilo principal e impactar negativamente las Core Web Vitals. [cite: 3556, 3558]
- [cite_start]**Uso Correcto (La "Escotilla de Escape")**: Su **único** propósito legítimo es la integración con librerías de terceros que necesitan acceso directo al DOM para inicializarse y que no tienen una alternativa en Qwik (ej. una librería de gráficos como D3.js, o un editor de texto complejo). [cite: 3561]
- **Alternativas Correctas**:
    - **Para reaccionar a un evento del usuario**: Usa un `listener` en línea (`onClick$`, `onInput$`, etc.).
    - **Para reaccionar a un cambio de estado**: Usa `useTask$`.
    - **Para cargar datos del lado del cliente basados en estado**: Usa `useResource$`.

---
## 22.2 Errores Comunes con los Marcadores `$`

El sistema `$` es el corazón del optimizador, y su uso incorrecto es una fuente común de errores.

- **Olvidar el `$`**: Escribir `onClick={...}` en lugar de `onClick$={...}`. La función no será tratada como un QRL, el optimizador no la extraerá, y el `listener` no funcionará en el cliente.
- **Pasar Callbacks sin `PropFunction`**: Pasar una función como prop sin tiparla con `PropFunction` puede llevar a que no se serialice correctamente. **Siempre** usa `PropFunction` para los callbacks.
- **Cerrar sobre Datos no Serializables**: Una función `$` no puede utilizar en su clausura (closure) datos del ámbito padre que no sean serializables (ej. funciones, clases, promesas). Todos los datos capturados deben poder ser convertidos a JSON.

---
## 22.3 Errores en la Gestión del Estado

- **Reasignación de `useStore`**: **El error más crítico y común**. Reasignar la variable que contiene un `Store` **rompe la reactividad** del `Proxy`. El estado siempre debe ser modificado **mutando sus propiedades**.
    - **Incorrecto ❌**: `miStore = { ...nuevosValores };`
    - **Correcto ✅**: `miStore.propiedad = 'nuevo valor';` o `Object.assign(miStore, nuevosValores);`
- **Olvidar `.value` en `useSignal`**: Un error sintáctico común es intentar leer o escribir en la señal directamente en lugar de en su propiedad `.value`.
    - **Incorrecto ❌**: `miSignal++;`
    - **Correcto ✅**: `miSignal.value++;`
- **Usar `useStore` para Primitivos**: Usar `useStore({ valor: 0 })` cuando un `useSignal(0)` es más simple, explícito y performante.

---
## 22.4 Errores de Configuración de Bundles

- **Configuración Manual Prematura**: El anti-patrón principal es intentar configurar manualmente la estrategia de empaquetado (`entryStrategy`) sin tener datos que lo respalden. La estrategia `smart` por defecto es extremadamente eficiente. Solo se debe considerar la configuración manual si un análisis con **Qwik Insights** revela un patrón de uso de usuario real que podría beneficiarse de un agrupamiento diferente.
- **Nombres de Clase Dinámicos que Rompen la Purga**: En integraciones como Tailwind CSS, el proceso de purga (`PurgeCSS`) necesita encontrar los nombres completos de las clases de forma estática en el código.
    - **Incorrecto ❌**: `const color = 'blue'; <div class={`bg-${color}-500`} />`
        - La purga no puede reconstruir `bg-blue-500` y lo eliminará del CSS final.
    - **Correcto ✅**:
        ```tsx
        const myClass = isError ? 'bg-red-500' : 'bg-green-500';
        <div class={myClass} />
        ```

    ---
## 22.5 Reglas de ESLint Críticas

El plugin **`eslint-plugin-qwik`** no es opcional ni es solo para estilizar el código; es una **herramienta de corrección fundamental** para que el Optimizador funcione. Desactivar sus reglas puede resultar en una aplicación que no funciona en producción.

- **`qwik/no-react-props`**: Obliga a usar `class` en lugar de `className`, previniendo un error común en desarrolladores que vienen de React.
- [cite_start]**`qwik/no-use-visible-task`**: La regla que advierte activamente contra el uso de este `hook`, forzando al desarrollador a justificar su uso. [cite: 3557-3558]
- **`qwik/prefer-`$``-ends-in-`$``**: Asegura que las props que son funciones (`PropFunction`) sigan la convención de terminar en `$`. Esto es vital para que el optimizador las identifique correctamente.
- **`qwik/valid-`$``-scope`**: Una de las reglas más importantes. Analiza estáticamente las funciones con `$` y falla si intentan capturar en su clausura (closure) valores no serializables (funciones, promesas, clases), previniendo errores en tiempo de ejecución.

---
## 22.6 Anti-Patrones de Rendimiento

Estos son comportamientos que van en contra de la filosofía de rendimiento de Qwik.

- **Hacer Fetch de Datos en el Cliente para el Renderizado Inicial**: Usar `useResource$` para obtener datos que son necesarios para la vista inicial de la página. Esto introduce una cascada de red (HTML -> JS -> Fetch). El patrón correcto es usar `routeLoader$` para que los datos viajen con el HTML.
- **Abuso de `useStore` con Reactividad Profunda**: Usar `useStore` para objetos muy grandes y anidados donde solo se necesitan cambios superficiales. En casos críticos, `useStore(obj, { deep: false })` puede mejorar el rendimiento al reducir el número de `Proxies` creados.
- **Componentes Monolíticos**: Crear componentes masivos que contienen demasiada lógica y JSX. Esto reduce la efectividad de la carga perezosa granular de Qwik. Es mejor descomponerlos en componentes más pequeños y especializados.
- **Ignorar la Optimización de Imágenes**: Usar etiquetas `<img>` estándar con un `src` estático en lugar de los patrones optimizados (`?jsx` para imágenes estáticas, `@unpic/qwik` para dinámicas). Esto lleva inevitablemente a un mal CLS y a un LCP más lento.

---
## 22.7 Consideraciones de Seguridad

- **Exponer Secretos en el Cliente**: El error más grave. Nunca se debe colocar una clave de API secreta, un token de servicio o una cadena de conexión a la base de datos en código que pueda llegar al cliente. **Todo secreto debe residir y ser usado exclusivamente en funciones de servidor** (`routeLoader$`, `routeAction$`, `server$`).
- **Almacenar JWTs en `localStorage`**: Un anti-patrón común. Almacenar tokens de sesión en `localStorage` los hace vulnerables a ataques XSS. El **patrón correcto y seguro es usar cookies `httpOnly`** gestionadas por el servidor.
- **Confiar en la Validación del Cliente**: Nunca se debe confiar en los datos que llegan de un formulario. Toda entrada del usuario recibida en un `routeAction$` **debe ser re-validada en el servidor** (ej. con Zod) antes de ser procesada.
- **Falta de Aislamiento de Datos (Multi-Tenant)**: En una aplicación multi-tenant, olvidar incluir una cláusula `WHERE tenant_id = ?` en **cada consulta** a la base de datos es una vulnerabilidad crítica que puede llevar a la fuga de datos entre clientes.
- **Saltarse la Protección CSRF**: Las `routeAction$` de Qwik City tienen protección contra Cross-Site Request Forgery (CSRF) incorporada. Crear endpoints de API manuales para mutaciones (`onPost`) sin implementar una protección CSRF propia expone la aplicación a este vector de ataque.