# PARTE 6: SERVER-SIDE EXECUTION

Esta sección se centra en las APIs de Qwik y Qwik City que gestionan la ejecución de código exclusivamente en el entorno del servidor. Es fundamental para la seguridad, el rendimiento y la carga de datos.

---
## 6.1 `routeLoader$()` - Patrones de Carga de Datos

- **Definición**: Un hook que define una función para ser ejecutada **exclusivamente en el servidor** antes del renderizado de una ruta. Es el mecanismo primario para cargar datos desde una base de datos, un CMS o una API externa.
- **Ejecución**: Se ejecuta una vez por cada petición HTTP. Su resultado se serializa y se transfiere al cliente dentro del HTML. En el cliente, el hook `use...()` correspondiente accede a los datos de forma síncrona, sin realizar una nueva petición de red.
- **Patrones de Uso**:
    - **Carga de Datos Única**: El caso de uso más común, donde una ruta necesita un conjunto de datos principal.
        ```tsx
        // src/routes/products/[id]/index.tsx
        export const useProductDetails = routeLoader$(async (requestEv) => {
          const product = await db.products.find(requestEv.params.id);
          if (!product) throw requestEv.redirect(302, '/404');
          return product;
        });
        ```
    - **Carga de Datos Múltiple y Paralela**: Una ruta puede exportar múltiples `routeLoader$`. Todos ellos se ejecutarán en paralelo en el servidor para optimizar el tiempo de carga.
        ```tsx
        export const useUser = routeLoader$(({ cookie }) => getUserFromCookie(cookie));
        export const useCart = routeLoader$(({ cookie }) => getCartFromCookie(cookie));
        ```
    - **Carga de Datos Dependiente**: Para evitar la re-ejecución de lógica, un `routeLoader$` puede depender del resultado de otro utilizando `resolveValue()`. Esto establece un orden de ejecución sin duplicar el trabajo.
        ```tsx
        export const useUser = routeLoader$(...);
        export const useUserPermissions = routeLoader$(async (requestEv) => {
          const user = await requestEv.resolveValue(useUser); // Obtiene el resultado de useUser
          return await db.permissions.getForUser(user.id);
        });
        ```
    - **Cacheo de Datos**: Utiliza la función `cacheControl()` dentro del loader para definir la estrategia de caché HTTP, crucial para el rendimiento en producción.
        ```tsx
        export const useProductList = routeLoader$(async ({ cacheControl }) => {
          cacheControl({
            staleWhileRevalidate: 60 * 60 * 24 * 7, // 1 semana
            maxAge: 300, // 5 minutos
          });
          return db.products.listAll();
        });
        ```

---
## 6.2 `routeAction()` vs `globalAction()`

Ambas APIs gestionan mutaciones de datos (`POST`, `PUT`, `DELETE`) de forma segura en el servidor, con soporte para mejora progresiva. La diferencia radica en su **alcance (scope)**.

- **`routeAction$()`**:
    - **Definición**: Una acción de servidor vinculada a una ruta específica.
    - **Alcance**: Solo se puede definir en un archivo `index.tsx` o `layout.tsx` dentro de `src/routes/`. Es accesible únicamente por el componente de esa ruta y sus descendientes.
    - **Caso de Uso**: Acciones que son intrínsecas a una página, como "Actualizar Perfil de Usuario" en la página del perfil, o "Publicar Comentario" en la página de un artículo.

- **`globalAction$()`**:
    - **Definición**: Una acción de servidor que es globalmente disponible en toda la aplicación.
    - **Alcance**: Se puede definir en cualquier lugar (ej. `src/actions/cart.ts`) y luego ser importada y utilizada por cualquier componente `<Form>` en cualquier ruta.
    - **Caso de Uso**: Acciones reutilizables en múltiples páginas, como "Añadir al Carrito", "Logout", o "Suscribirse al Newsletter".

---
## 6.3 `server$()` - Funciones Exclusivas del Servidor

- **Definición**: Una función de orden superior que envuelve una clausura, garantizando que el código en su interior **se ejecutará siempre y únicamente en el servidor**.
- **Mecanismo**: Es una de las características más potentes de Qwik.
    1.  El desarrollador llama a la función `server$()` desde un `listener` en el cliente (ej. `onClick$`).
    2.  El Optimizador de Qwik reemplaza esta llamada por una **petición `fetch` a un endpoint de API privado** que Qwik City genera automáticamente.
    3.  Cualquier variable del ámbito léxico que la función necesite (su clausura) es automáticamente serializada y enviada como parte del cuerpo de la petición.
    4.  El servidor recibe la petición, ejecuta la función original con los datos deserializados y devuelve el resultado.
- **Caso de Uso**: Ideal para ejecutar lógica de servidor arbitraria y segura en respuesta a un evento del cliente que no encaja en el patrón de un formulario completo. Ejemplos: registrar un evento de analítica, realizar una validación rápida en la base de datos, etc.
    ```tsx
    // Este código se ejecuta en el cliente
    onClick$={async () => {
      const productID = 123;
      // La función dentro de server$ se ejecuta en el servidor
      const result = await server$(async (id) => {
        // Lógica segura de base de datos aquí
        return await db.checkStock(id);
      })(productID); // La variable productID se pasa a la clausura
      console.log('Stock disponible:', result);
    }}
    ```

    ---
## 6.4 Arquitectura de Middleware y Plugins

Qwik City procesa las peticiones a través de una cadena de manejadores (`handlers`) en un orden predecible y jerárquico.

- **Middleware (`onRequest`, `onGet`, etc.)**:
    - **Definición**: Son funciones exportadas desde archivos `layout.tsx` o `index.ts`/`index.tsx` que interceptan las peticiones entrantes.
    - **Jerarquía de Ejecución**: El orden es crucial. La ejecución fluye desde el más general al más específico:
        1.  `plugin.ts` (si existe).
        2.  Middleware del `layout.tsx` raíz.
        3.  Middleware de los `layout.tsx` anidados (de padre a hijo).
        4.  Middleware del `index.tsx` final de la ruta.
    - **Flujo de Control**: Dentro de un `handler`, la llamada a `await next()` cede el control al siguiente `handler` en la cadena. Si `next()` no se llama, la cadena se detiene y la respuesta se envía inmediatamente.

- **Plugins (`plugin.ts`)**:
    - **Definición**: Un archivo especial (`src/routes/plugin.ts`) cuyo middleware tiene la **máxima precedencia**.
    - **Ejecución**: Se ejecuta **antes** que cualquier `layout` o middleware de ruta.
    - **Caso de Uso**: Ideal para lógica que debe ejecutarse incondicionalmente en cada petición de la aplicación, como la inicialización de una conexión a la base de datos, la validación de un token de sesión global o la configuración de cabeceras de seguridad (CSP, CORS).

---
## 6.5 Manejo de Petición/Respuesta

El objeto `RequestEvent` es el corazón de la interacción con el servidor. Se pasa como primer argumento a todos los manejadores del lado del servidor.

- **Propiedades Clave del `RequestEvent`**:
    - `request`: El objeto `Request` estándar de la Fetch API.
    - `url`: Un objeto `URL` completo de la petición actual.
    - `params`: Un objeto con los parámetros dinámicos de la ruta. (Ej: para `[id]`, `params.id`).
    - `query`: Un objeto `URLSearchParams` para acceder a los parámetros de la query string.
    - `cookie`: Una API de alto nivel para leer (`get`), escribir (`set`) y eliminar (`delete`) cookies.
    - `headers`: Objeto para **establecer** cabeceras en la **respuesta**. (Para leer, se usa `request.headers`).
    - `sharedMap`: Un `Map` cuyo ciclo de vida está limitado a una única petición. Es el mecanismo para pasar datos entre diferentes manejadores (ej. de un middleware a un `routeLoader$`).
    - `status(code)`: Método para establecer el código de estado de la respuesta HTTP.
    - `redirect(status, url)`: Lanza una excepción especial que resulta en una redirección HTTP.
    - `json(status, data)`: Establece las cabeceras `Content-Type` adecuadas y envía una respuesta JSON.

---
## 6.6 Patrones de `RequestHandler`

- **Creación de Endpoints de API**:
    - **Mecanismo**: Crea un archivo `src/routes/api/mi-endpoint/index.ts`. Exporta funciones con nombres de métodos HTTP (`onGet`, `onPost`, etc.) tipadas con `RequestHandler`.
    - **Ejemplo**:
        ```ts
        // src/routes/api/health/index.ts
        import type { RequestHandler } from '@builder.io/qwik-city';

        export const onGet: RequestHandler = async ({ json }) => {
          json(200, { status: 'ok', time: new Date().toISOString() });
        };
        ```

- **Encadenamiento de Middleware**:
    ```ts
    // src/routes/layout.tsx
    export const onRequest: RequestHandler = async ({ sharedMap, next }) => {
      // 1. Primer middleware se ejecuta
      sharedMap.set('requestTime', Date.now());
      await next(); // 2. Cede el control
    };

    // src/routes/index.tsx
    export const useServerTime = routeLoader$(({ sharedMap }) => {
      // 3. El loader accede al dato puesto por el middleware
      return { time: sharedMap.get('requestTime') };
    });
    ```

---
## 6.7 Gestión de Cookies y Sesiones

- **API de Cookies**: El objeto `cookie` del `RequestEvent` simplifica la manipulación.
    - **Establecer una cookie segura**:
        ```ts
        cookie.set('sessionToken', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
        });
        ```
    - **Leer una cookie**: `const token = cookie.get('sessionToken')?.value;`
    - **Eliminar una cookie**: `cookie.delete('sessionToken', { path: '/' });`

- **Patrón de Sesión Canónico**:
    1.  **Login (`routeAction$`):** Al validar las credenciales de un usuario, el servidor genera un token (ej. JWT) y lo establece en una cookie `httpOnly` y `secure`.
    2.  **Middleware de Autenticación (en `src/routes/plugin.ts`)**:
        - En cada petición, este middleware se ejecuta primero.
        - Lee la cookie de sesión.
        - Si no existe, la petición es de un usuario anónimo.
        - Si existe, valida el token (verifica firma, expiración, etc.).
        - Si la validación es **exitosa**, extrae la información del usuario (ej. ID, roles) y la almacena en `sharedMap`. `sharedMap.set('user', userData)`.
        - Si la validación **falla**, elimina la cookie inválida.
    3.  **Consumo de Datos de Sesión**: Los `routeLoader$` y `routeAction$` de toda la aplicación ahora pueden acceder de forma síncrona a la información del usuario a través de `sharedMap.get('user')`, sin necesidad de revalidar el token en cada uno de ellos.