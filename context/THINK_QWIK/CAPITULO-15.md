# PARTE 15: INTEGRACIÓN CON APIs

Esta sección describe los patrones y mejores prácticas para consumir APIs externas (REST, GraphQL) y manejar comunicaciones en tiempo real (WebSockets) dentro de una aplicación Qwik.

---
## 15.1 Patrones para APIs REST

La elección de dónde realizar la llamada a la API (servidor o cliente) es la decisión arquitectónica más importante.

- **Fetching en el Servidor (Patrón Recomendado)**:
    - **Mecanismo**: Utilizar la API `fetch` nativa dentro de las funciones de servidor de Qwik City.
        - Para peticiones `GET`: `routeLoader$()`.
        - Para mutaciones (`POST`, `PUT`, `DELETE`, etc.): `routeAction$()` o `server$()`.
    - **Ventajas**:
        1.  **Seguridad**: Las claves de API (`API Keys`) y tokens secretos nunca se exponen al navegador.
        2.  **Rendimiento**: Las peticiones se realizan de servidor a servidor, lo que generalmente tiene menor latencia que una petición desde el navegador del cliente.
        3.  **Prevención de CORS**: Se eliminan los problemas de Cross-Origin Resource Sharing (CORS), ya que las peticiones se originan desde el propio backend.
        4.  **Optimización de LCP**: Los datos se obtienen durante el SSR y se incrustan en el HTML, permitiendo un renderizado de contenido inmediato.

- **Fetching en el Cliente**:
    - **Mecanismo**: Utilizar la API `fetch` dentro de `useResource$()` o en un manejador de eventos como `onClick$()`.
    - **Caso de Uso**: Solo es apropiado en escenarios específicos:
        - Cuando se interactúa con **APIs públicas** que no requieren autenticación secreta.
        - Para funcionalidades altamente dinámicas que dependen del estado del cliente y no pueden ser pre-calculadas en el servidor (ej. un buscador "search-as-you-type").

---
## 15.2 Integración con GraphQL

El enfoque es conceptualmente idéntico al de las APIs REST, priorizando la ejecución en el servidor.

- **Mecanismo**: Se puede utilizar cualquier cliente de GraphQL para Node.js (como `graphql-request` o `urql`).
- **Patrón Recomendado (en `routeLoader$`)**:
    1.  Crea una instancia del cliente de GraphQL (puede ser una instancia global para reutilizarla).
    2.  Dentro del `routeLoader$()`, construye tu consulta GraphQL.
    3.  Ejecuta la consulta y devuelve los datos.
    ```ts
    import { GraphQLClient, gql } from 'graphql-request';

    const client = new GraphQLClient('[https://api.my-graphql.com/](https://api.my-graphql.com/)...');

    export const useMyQuery = routeLoader$(async (requestEv) => {
      const query = gql`{ ... }`;
      const data = await client.request(query, { id: requestEv.params.id });
      return data;
    });
    ```
- **Ventaja**: Este patrón mantiene el endpoint de GraphQL y cualquier cabecera de autenticación ocultos en el servidor, y se beneficia de todas las ventajas del fetching en el servidor mencionadas para REST.

---
## 15.3 WebSocket y Tiempo Real

Las conexiones persistentes como los WebSockets deben ser gestionadas en el cliente.

- **Patrón Canónico en Qwik**:
    1.  **Establecer la Conexión (`useVisibleTask$`)**: La conexión del WebSocket se debe iniciar dentro de un hook `useVisibleTask$()`. Esto asegura que la conexión solo se establezca en el navegador y únicamente cuando el componente que la necesita sea visible.
    2.  **Almacenar los Datos (`useStore`/`useSignal`)**: El estado que se recibe a través del WebSocket debe ser almacenado en un `Store` o `Signal` para que la UI pueda reaccionar a los nuevos datos.
    3.  **Manejar Mensajes**: El manejador `onmessage` del WebSocket se encargará de actualizar el `Store` o `Signal`.
    4.  **Limpiar la Conexión (`cleanup`)**: Es **crítico** devolver una función `cleanup` desde el `useVisibleTask$()` que cierre la conexión del WebSocket (`ws.close()`). Esto previene fugas de memoria cuando el componente es destruido o deja de ser visible.
    ```tsx
    const messages = useStore([]);
    useVisibleTask$(({ cleanup }) => {
      const ws = new WebSocket('wss://my-realtime-service.com');
      ws.onmessage = (event) => {
        messages.push(JSON.parse(event.data));
      };
      cleanup(() => ws.close());
    });
    ```

---
## 15.4 Integración con APIs de Terceros

- **Abstracción**: No llames a las APIs de terceros directamente desde los componentes o loaders. Crea una capa de abstracción o un "cliente de servicio" (ej. `src/lib/services/stripe.ts`). Esto centraliza la lógica de la API, facilita los cambios y mantiene el resto del código limpio.
- **Prioridad al Servidor**: Como regla general, toda la interacción con APIs de terceros, especialmente si requiere una clave secreta, debe ocurrir en funciones de servidor (`routeLoader$`, `routeAction$`, `server$`).
- **SDKs de Cliente**: Para librerías de terceros que **deben** ejecutarse en el navegador (ej. el SDK de UI de Stripe, Google Analytics), deben ser cargadas utilizando la integración con **Partytown** para minimizar su impacto en el rendimiento del hilo principal.

---
## 15.5 Estrategias de Manejo de Errores

Un manejo de errores robusto es crucial al interactuar con APIs que pueden fallar.

- **Errores en el Servidor (`routeLoader$`, `routeAction$`)**:
    - **Mecanismo**: Utiliza bloques `try...catch` estándar para capturar excepciones durante las llamadas `fetch`.
    - **Comunicar Errores al Cliente**:
        - **En `routeLoader$`**: No dejes que el error se propague sin control. Captúralo, establece un código de estado apropiado con `requestEv.status()` y devuelve un valor que el componente pueda interpretar como un estado de error (ej. `return { error: 'Failed to fetch data' }`).
            ```ts
            export const useData = routeLoader$(async ({ status }) => {
              try {
                const res = await fetch('...');
                if (!res.ok) throw new Error();
                return res.json();
              } catch (e) {
                status(500);
                return { error: 'API unavailable' };
              }
            });
            ```
        - **En `routeAction$`**: Utiliza la función `fail()` del `RequestEvent` para devolver un estado de fallo estructurado. Esto poblará la propiedad `action.fail` en el cliente de forma idiomática.
            ```ts
            export const useMyAction = routeAction$(async (data, { fail }) => {
              const res = await fetch('...', { method: 'POST', body: JSON.stringify(data) });
              if (!res.ok) {
                return fail(500, { message: 'Server error during submission.' });
              }
              return { success: true };
            });
            ```

- **Errores en el Cliente (`useResource$`)**:
    - **Mecanismo**: El componente `<Resource>` tiene un slot dedicado (`onRejected`) para manejar `Promises` rechazadas. Cualquier error lanzado en la función del `useResource$` será capturado y pasado a este slot.
        ```tsx
        <Resource
          value={myResource}
          onPending={() => <Loading />}
          onRejected={(error) => <ErrorMessage message={error.message} />}
          onResolved={(data) => <DataView data={data} />}
        />
        ```

---
## 15.6 Patrones de Caché de Datos

Cachear las respuestas de la API es una de las optimizaciones de rendimiento más efectivas.

- **Caché de CDN (para peticiones `GET`)**:
    - **Estrategia**: Es la forma de caché más potente. El servidor de Qwik actúa como un proxy para la API externa, y el CDN cachea la respuesta del servidor de Qwik.
    - **Implementación**: Se controla mediante las cabeceras `Cache-Control` establecidas con la utilidad `cacheControl()` dentro de un `routeLoader$`, como se vio en el Capítulo 13.

- **Caché en el Servidor (Aplicación)**:
    - **Estrategia**: Para peticiones muy frecuentes a la misma API dentro del servidor de Node.js, se puede implementar un caché en memoria (ej. con un `Map` y un TTL) o un caché externo (ej. `Redis`).
    - **Uso**: Esto es una optimización a nivel de infraestructura y no una característica específica de Qwik, pero se implementa dentro de las funciones de servidor de Qwik.

- **Caché en el Cliente**:
    - **Caché Implícito de Qwik**: El resultado de un `routeLoader$` es, en efecto, "cacheado" en el cliente, ya que sus datos se serializan en el HTML y no se vuelven a pedir en navegaciones del lado del cliente (`<Link>`).
    - **Caché del Navegador**: Las cabeceras `Cache-Control` (`max-age`) también instruyen al navegador sobre cómo cachear respuestas.
    - **Caché Manual**: Para datos obtenidos con `useResource$`, el desarrollador puede implementar su propia lógica de caché utilizando `sessionStorage` o librerías de estado como TanStack Query si es necesario.

---
## 15.7 Flujos de Autenticación

- **Patrón Canónico: JWT con Cookies `httpOnly`**: Este es el flujo más seguro y recomendado.
    1.  **Login (`routeAction$`):** El cliente envía credenciales a través de un `<Form>`. El `routeAction$` en el servidor las verifica contra un proveedor de autenticación.
    2.  **Generación de Token**: Si las credenciales son válidas, el proveedor de autenticación devuelve un **JSON Web Token (JWT)**.
    3.  **Establecer Cookie Segura**: El `routeAction$` recibe el JWT y lo establece en una cookie con las directivas de seguridad más importantes:
        - `httpOnly: true`: **Crítico**. Impide que el JavaScript del cliente pueda acceder a la cookie, previniendo ataques de Cross-Site Scripting (XSS).
        - `secure: true`: Asegura que la cookie solo se envíe sobre HTTPS.
        - `sameSite: 'strict'` o `'lax'`: Mitiga ataques de Cross-Site Request Forgery (CSRF).
        - `path: '/'`: Asegura que la cookie se envíe en todas las peticiones al dominio.
    4.  **Peticiones Autenticadas (Servidor a Servidor)**: En `routeLoader$`s posteriores que necesiten acceder a recursos protegidos, el servidor lee el JWT de la cookie (`requestEv.cookie.get('jwt')`), y lo adjunta a la petición `fetch` a la API protegida, típicamente en la cabecera `Authorization: Bearer <token>`.
- **Anti-Patrón (Almacenamiento en `localStorage`)**: **Nunca se deben almacenar JWTs en `localStorage`**. Son vulnerables a ataques XSS, donde un script malicioso podría robar el token y suplantar la identidad del usuario. El patrón de cookie `httpOnly` mantiene el token completamente aislado del entorno de JavaScript del navegador.