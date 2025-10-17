# PARTE 8: LAYOUTS Y COMPOSICIÓN

Esta sección explora en profundidad cómo Qwik City utiliza los layouts y el componente `<Slot/>` para crear interfaces de usuario complejas, reutilizables y mantenibles.

---
## 8.1 Patrones de `Layout.tsx` y Herencia

- **Definición**: Un **Layout** es un componente de Qwik que define una estructura de UI compartida para un conjunto de rutas. Su propósito es envolver el contenido de las rutas hijas.
- **Convención de Archivo**: Debe llamarse `layout.tsx` y residir dentro de un directorio en `src/routes/`.
- **Mecanismo Central (`<Slot/>`)**: Cada `layout.tsx` **debe** contener el componente `<Slot/>`. Este componente actúa como un marcador de posición donde Qwik City renderizará el contenido de la ruta hija (que puede ser otra layout anidada o el `index.tsx` final de la página).
- **Herencia Jerárquica**: Los layouts se anidan automáticamente según la estructura de directorios. Una ruta siempre heredará todos los layouts de sus directorios padres, desde la raíz hasta el más específico.
    - **Ejemplo**: La ruta `/dashboard/settings` será renderizada dentro del `layout.tsx` de `.../dashboard/`, el cual a su vez será renderizado dentro del `layout.tsx` de `src/routes/`.
    - **Resultado**: `<RootLayout><DashboardLayout><SettingsPage/></DashboardLayout></RootLayout>`

---
## 8.2 Layouts Nombrados (sintaxis `@name`)

- **Problema que Resuelve**: Permite que una ruta específica **opte por no usar** el `layout.tsx` por defecto de su directorio y, en su lugar, utilice uno diferente. Es una forma de "romper" la herencia de layouts de manera controlada.
- **Sintaxis en Dos Pasos**:
    1.  **Definición del Layout Nombrado**: Se crea un archivo de layout con el prefijo `@` en el nombre, por ejemplo, `src/routes/layout-minimal.tsx`.
    2.  **Asociación de la Ruta**: El archivo de la página que usará este layout también debe incluir el mismo nombre con `@`. Por ejemplo, `src/routes/landing/index@minimal.tsx`.
- **Comportamiento**: Qwik City entenderá que la ruta `/landing` debe ser envuelta por `layout-minimal.tsx` en lugar de `src/routes/layout.tsx`. Sin embargo, **seguirá heredando layouts de niveles superiores** si existieran (por ejemplo, de un hipotético `src/layout.tsx` si Qwik City lo soportara a ese nivel). Es una anulación a nivel de directorio.

---
## 8.3 Layouts Anidados y Composición

La composición de UIs complejas se logra a través del anidamiento de layouts. Cada layout tiene una única responsabilidad estructural.

- **Ejemplo de Estructura**:
    - `src/routes/layout.tsx`: Contiene el `<html>`, `<body>`, la cabecera principal y el pie de página.
        ```tsx
        // src/routes/layout.tsx
        export default component$(() => {
          return (
            <>
              <Header />
              <main>
                <Slot />
              </main>
              <Footer />
            </>
          );
        });
        ```
    - `src/routes/(dashboard)/layout.tsx`: Define la estructura específica del panel de control, como una barra lateral.
        ```tsx
        // src/routes/(dashboard)/layout.tsx
        export default component$(() => {
          return (
            <div class="dashboard-grid">
              <Sidebar />
              <Slot />
            </div>
          );
        });
        ```
- **Resultado Compuesto**: Para una ruta como `/dashboard/analytics`, el resultado final es una composición limpia donde cada layout aporta una parte de la estructura total de la página, sin que la página final (`analytics/index.tsx`) necesite conocer los detalles de la estructura que la rodea.

---
## 8.4 Componente `<Slot/>` y Proyección de Contenido

El componente `<Slot/>` es el mecanismo de Qwik para la **proyección de contenido**, un concepto similar a `children` en React o los slots en Vue/Svelte.

- **Slot por Defecto**: Es el uso más común, visto en los layouts. Simplemente `<Slot/>` renderiza todo el contenido hijo que no está asignado a un slot nombrado.

- **Slots Nombrados (Named Slots)**: Permiten construir componentes complejos y altamente reutilizables al definir múltiples "agujeros" donde el consumidor puede inyectar contenido.
    - **Definición (Componente Padre)**: En el componente que define los slots, se usa el atributo `name`.
        ```tsx
        // Componente Card.tsx
        export const Card = component$(() => {
          return (
            <div class="card">
              <header class="card-header">
                <Slot name="header" />
              </header>
              <section class="card-body">
                <Slot /> {/* Slot por defecto */}
              </section>
            </div>
          );
        });
        ```
    - **Proyección (Componente Consumidor)**: Al usar el componente, se utiliza el atributo `q:slot` para dirigir el contenido al slot nombrado correspondiente.
        ```tsx
        // Componente MyPage.tsx
        import { Card } from '~/components/Card';

        export default component$(() => {
          return (
            <Card>
              <h2 q:slot="header">Título de la Tarjeta</h2>
              <p>Este es el contenido principal y va al slot por defecto.</p>
            </Card>
          );
        });
        ```
        ---
## 8.5 Compartir Datos en Layouts con `routeLoader$()`

Los `routeLoader$` definidos en un archivo `layout.tsx` tienen un propósito especial: cargar datos que estarán disponibles para ese layout y para todas las rutas hijas que envuelve.

- **Mecanismo**: Un `routeLoader$` en un layout se ejecuta en el servidor como cualquier otro. Su hook `use...()` correspondiente puede ser invocado en el propio layout o en cualquier componente descendiente en el árbol de rutas.
- **Patrón de Datos Globales**: El `layout.tsx` raíz (`src/routes/layout.tsx`) es el lugar canónico para cargar datos que se necesitan en toda la aplicación.
    - **Caso de Uso**: Cargar la información del usuario autenticado, el contenido del carrito de compras, o las categorías principales para la navegación.
    ```tsx
    // src/routes/layout.tsx
    export const useUserSession = routeLoader$(({ cookie }) => {
      return getUserFromCookie(cookie); // Devuelve datos del usuario o null
    });

    // src/routes/dashboard/index.tsx (o cualquier otra página)
    import { useUserSession } from '~/routes/layout';

    export default component$(() => {
      const userSession = useUserSession(); // Accede a los datos sin re-fetch
      // ...
    });
    ```
- **Ventaja**: Este patrón es extremadamente eficiente, ya que los datos globales se cargan una sola vez en el servidor por cada petición y se distribuyen a toda la aplicación sin necesidad de `prop-drilling` o múltiples llamadas a la API.

---
## 8.6 Layouts Condicionales y Específicos de Ruta

Existen varios patrones para aplicar layouts de forma dinámica o condicional.

1.  **Grupos de Rutas `( )`**: Es el método principal para aplicar un layout a un **grupo de rutas**. Todas las rutas dentro del directorio `(mi-grupo)` heredarán el `layout.tsx` de ese directorio.
2.  **Layouts Nombrados `@`**: Es el método para que una **ruta individual** elija un layout específico, rompiendo la herencia por defecto de su directorio padre.
3.  **Lógica Condicional dentro de un Layout**: Se puede usar el hook `useLocation()` para renderizar partes de un layout de forma condicional basándose en la URL actual.
    ```tsx
    // src/routes/layout.tsx
    import { useLocation } from '@builder.io/qwik-city';

    export default component$(() => {
      const loc = useLocation();
      const isHomePage = loc.url.pathname === '/';

      return (
        <div class="app-shell">
          {/* Muestra la barra lateral en todas las páginas excepto en la home */}
          {!isHomePage && <Sidebar />}
          <Slot />
        </div>
      );
    });
    ```

---
## 8.7 Middleware en Layouts y Guardias de Rutas (Guards)

El middleware definido en un `layout.tsx` se aplica a todas las rutas que ese layout envuelve, convirtiéndolo en el mecanismo perfecto para implementar "guardias de rutas" (`route guards`).

- **Mecanismo**: Una función `onRequest` exportada desde un `layout.tsx` se ejecutará en el servidor antes que cualquier `routeLoader$` de las rutas hijas.
- **Patrón Canónico para Rutas Protegidas**:
    1.  **Agrupar Rutas**: Crea un grupo de rutas para las secciones protegidas de la aplicación, por ejemplo, `src/routes/(private)/`.
    2.  **Crear un Layout Guardián**: Dentro de ese grupo, crea un `src/routes/(private)/layout.tsx`.
    3.  **Implementar el Middleware**: Dentro del `layout.tsx` guardián, implementa el `onRequest` que verifica la autenticación del usuario. Si el usuario no está autenticado, lanza una redirección a la página de login.
    ```tsx
    // src/routes/(private)/layout.tsx
    import type { RequestHandler } from '@builder.io/qwik-city';

    export const onRequest: RequestHandler = async ({ cookie, redirect }) => {
      const isUserAuthenticated = await checkAuth(cookie);
      if (!isUserAuthenticated) {
        // Detiene la ejecución y redirige al usuario
        throw redirect(302, '/login');
      }
    };

    // Este layout simplemente renderiza a sus hijos si el middleware pasa
    export default component$(() => <Slot />);
    ```
- **Resultado**: Todas las rutas dentro del directorio `(private)` (ej. `/dashboard`, `/settings`) están ahora automáticamente protegidas por esta lógica, sin necesidad de repetir el código de verificación en cada una de ellas.