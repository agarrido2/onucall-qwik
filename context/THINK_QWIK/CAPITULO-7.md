# PARTE 7: QWIK CITY ROUTING DEEP DIVE

Esta sección profundiza en el mecanismo de enrutamiento de Qwik City, detallando el algoritmo, el manejo de parámetros y las estrategias de organización de rutas.

---
## 7.1 Algoritmo de Routing Basado en Archivos

El enrutamiento en Qwik City es determinista y se basa enteramente en la estructura del sistema de archivos dentro del directorio `src/routes/`.

- **Principio Fundamental**: Cada directorio dentro de `src/routes/` se corresponde con un segmento de la URL.
- **Archivos Clave**:
    - `index.tsx`: Define el componente que se renderiza en la raíz de un segmento de directorio. Por ejemplo, `src/routes/dashboard/settings/index.tsx` corresponde a la URL `/dashboard/settings`.
    - `layout.tsx`: Define un componente de layout que envuelve a todas las rutas hijas (en el mismo directorio y en subdirectorios). Proporciona una estructura compartida (ej. cabecera, pie de página).
- **Prioridad de Coincidencia (Matching Priority)**: El algoritmo siempre da prioridad a las rutas estáticas y más específicas sobre las dinámicas.
    - `src/routes/blog/featured/index.tsx` se resolverá para `/blog/featured`.
    - `src/routes/blog/[slug]/index.tsx` se resolverá para `/blog/cualquier-otra-cosa`, pero no para `/blog/featured`.

---
## 7.2 Parámetros de Ruta y Catch-all

- **Parámetros Dinámicos `[param]`**:
    - **Sintaxis**: Un directorio o archivo nombrado entre corchetes, ej: `src/routes/products/[productID]/index.tsx`.
    - **Funcionalidad**: Captura un único segmento de la URL como un parámetro. Para la URL `/products/123`, el valor `123` estará disponible.
    - **Acceso**: En el servidor (dentro de `routeLoader$`, `onRequest`, etc.), el valor se accede a través del objeto `params` del `RequestEvent`: `requestEv.params.productID`.
    - **Caso de Uso**: Páginas de detalle para productos, artículos de blog, perfiles de usuario, etc.

- **Parámetros Catch-all `[...param]`**:
    - **Sintaxis**: Un directorio nombrado con corchetes y tres puntos, ej: `src/routes/docs/[...path]/index.tsx`.
    - **Funcionalidad**: Captura el segmento de la URL actual **y todos los segmentos subsecuentes** en una sola cadena de texto. Para la URL `/docs/guides/getting-started`, el valor capturado sería `guides/getting-started`.
    - **Acceso**: Se accede de la misma forma: `requestEv.params.path`.
    - **Caso de Uso**: Sitios de documentación, exploradores de archivos, o cualquier ruta con una profundidad de anidamiento arbitraria.

---
## 7.3 Grupos de Rutas (sintaxis `(folder)`)

- **Sintaxis**: Un directorio nombrado entre paréntesis, ej: `src/routes/(dashboard)/settings/index.tsx`.
- **Funcionalidad**: Este es un patrón de organización crucial. [cite_start]El nombre del directorio entre paréntesis **es completamente ignorado por el algoritmo de enrutamiento** y no forma parte de la URL final [cite: 2062-2063]. La URL para el ejemplo anterior sería `/settings`.
- **Caso de Uso Principal**:
    - **Aplicar Layouts a un Subconjunto de Rutas**: Permite agrupar un conjunto de rutas para que compartan un `layout.tsx` específico sin afectar su estructura de URL. Por ejemplo, todas las rutas dentro de `(dashboard)` pueden compartir el `src/routes/(dashboard)/layout.tsx`, que podría contener una barra lateral de navegación del panel de control, mientras que las rutas públicas fuera de este grupo no lo tendrían.
    - **Organización Lógica**: Ayuda a organizar lógicamente el proyecto sin añadir segmentos de URL innecesarios.

    ---
## 7.4 Manejo de 404 y Páginas de Error

- **Mecanismo por Archivo**: Qwik City gestiona las páginas "No Encontrado" a través de un archivo con un nombre especial.
    - [cite_start]**`src/routes/404.tsx`**: Este archivo, ubicado en la raíz del directorio de rutas, actúa como la **página 404 global** por defecto para cualquier URL que no coincida con ninguna ruta existente[cite: 2058].
    - **404s Anidados (Scoped)**: Se puede proporcionar una página 404 más específica para una sección de la aplicación. [cite_start]Por ejemplo, un archivo `src/routes/dashboard/404.tsx` se mostrará para rutas no encontradas dentro de `/dashboard/*`, en lugar de la página 404 global[cite: 2060]. Qwik City siempre utilizará el `404.tsx` más cercano en el árbol de directorios.

- **404 Programático**: Desde una función de servidor (como un `routeLoader$`), se puede indicar que una página no se ha encontrado, incluso si la ruta existe. Esto es crucial para páginas dinámicas donde el recurso solicitado no existe en la base de datos.
    ```tsx
    export const useProductLoader = routeLoader$(async (requestEv) => {
      const product = await db.getProduct(requestEv.params.id);
      if (!product) {
        // Establece el código de estado y detiene la ejecución
        requestEv.status(404);
        return; // Opcional, pero buena práctica
      }
      return product;
    });
    ```

---
## 7.5 Patrones de Redirección

Las redirecciones son una operación del lado del servidor que resulta en una respuesta HTTP con un código de estado `3xx`. En Qwik City, se implementan lanzando una excepción de redirección.

- **API Principal**: `throw requestEv.redirect(statusCode, url);`
    - Es imperativo usar `throw` para detener la ejecución del resto del código del servidor y enviar la redirección inmediatamente.
- **Casos de Uso Comunes**:
    - **Guardias de Autenticación (en Middleware)**: Proteger rutas verificando la sesión del usuario.
        ```ts
        // src/routes/(protected)/layout.tsx
        export const onRequest: RequestHandler = async ({ cookie, redirect }) => {
          if (!isValidSession(cookie)) {
            throw redirect(302, '/login');
          }
        };
        ```
    - **Post/Redirect/Get (en `routeAction$`)**: Después de que un formulario se envíe con éxito, redirigir al usuario para prevenir re-envíos si recarga la página.
        ```ts
        export const useCreateTaskAction = routeAction$(async (data, { redirect }) => {
          const newTask = await db.createTask(data);
          throw redirect(303, `/tasks/${newTask.id}`);
        });
        ```
    - **Redirecciones Permanentes (SEO)**: Para contenido que se ha movido permanentemente, se debe usar el código de estado `301`.
        ```ts
        // src/routes/old-path/index.tsx
        export const onGet: RequestHandler = ({ redirect }) => {
          throw redirect(301, '/new-path');
        };
        ```

---
## 7.6 Estrategias de Carga de Datos en Rutas

- **Ejecución de Loaders**: Todos los `routeLoader$` que aplican a una URL solicitada (incluyendo los de sus `layout.tsx` padres) se ejecutan **en paralelo** en el servidor para maximizar la eficiencia.
- **Disponibilidad de Datos**: Los datos cargados por un `routeLoader$` en un layout padre están disponibles automáticamente para todos los layouts y páginas hijas a través de su hook `use...()` correspondiente.
- **Navegación en el Cliente y Re-obtención (Re-fetching)**:
    - **Comportamiento por Defecto**: Cuando un usuario navega de una página a otra en el cliente (usando el componente `<Link>`), los `routeLoader$` **NO se vuelven a ejecutar**. Qwik City asume que los datos de la ruta son estáticos para esa sesión de navegador y utiliza los datos serializados de la carga inicial del servidor.
    - **Forzar Re-obtención de Datos**: Para forzar que los `routeLoader$` se vuelvan a ejecutar, se debe realizar una **navegación de página completa** (full page navigation). Esto se logra mediante:
        1.  El uso de una etiqueta `<a>` estándar en lugar del componente `<Link>`.
        2.  Una redirección programática con `window.location.href = '...'`.
    - **Implicación**: Este comportamiento es una optimización de rendimiento fundamental, pero debe ser tenido en cuenta al diseñar aplicaciones que necesiten datos "frescos" en cada navegación de ruta.