# PARTE 14: ASSETS Y MEDIA

Esta sección establece las mejores prácticas para el manejo de assets estáticos como imágenes, SVGs, fuentes y otros medios, con un enfoque absoluto en la optimización automática del rendimiento y los Core Web Vitals.

---
## 14.1 Optimización de Imágenes Estáticas (`?jsx`)

Este es el patrón canónico para manejar imágenes que forman parte del repositorio de código (ej. logos, iconos, imágenes de banners estáticos).

- **Mecanismo**: Se basa en una característica del plugin de Vite para Qwik. Al importar una imagen con el sufijo `?jsx`, el optimizador la transforma en un componente en lugar de una simple URL.
    ```tsx
    import MyLogo from '~/media/logo.png?w=200&h=50&jsx';

    export default component$(() => {
      return <MyLogo class="custom-class" />;
    });
    ```
- **Optimizaciones Automáticas**: Esta transformación realiza una serie de optimizaciones críticas para el rendimiento en tiempo de compilación:
    1.  **Generación de `srcset`**: Crea múltiples versiones de la imagen en diferentes resoluciones y las convierte a formatos modernos y eficientes como WebP o AVIF.
    2.  [cite_start]**Prevención de CLS**: El componente `<img>` resultante incluye automáticamente los atributos `width` y `height`, permitiendo que el navegador reserve el espacio correcto en el layout antes de que la imagen se cargue. [cite: 2586, 2592]
    3.  [cite_start]**Carga Perezosa por Defecto**: Añade los atributos `loading="lazy"` y `decoding="async"` por defecto para diferir la carga de imágenes que no están en el *viewport* inicial. [cite: 2643-2646]
- **Regla**: Para cualquier imagen estática dentro de tu base de código, este método es el preferido sobre el uso de una etiqueta `<img>` con un `src` estático.

---
## 14.2 Imágenes Dinámicas (`@unpic/qwik`)

Este patrón se aplica a imágenes cuyo origen no está en el repositorio, sino que proviene de una fuente de datos externa en tiempo de ejecución (ej. un CMS, una API, una base de datos).

- **Problema**: El método `?jsx` no funciona para URLs dinámicas.
- **Solución Óptima**: La librería **`@unpic/qwik`**.
- **Mecanismo**: `@unpic/qwik` proporciona un componente `<Image>` universal que se integra con los CDNs de imágenes más populares (Cloudinary, Imgix, Supabase Storage, etc.).
    - Le proporcionas la URL base de la imagen, las dimensiones deseadas y un `layout`.
    - El componente genera dinámicamente el `srcset` óptimo, utilizando las transformaciones de URL específicas del CDN para servir la imagen del tamaño y formato correctos.
- **Beneficios**:
    - Aplica las mismas optimizaciones (generación de `srcset`, prevención de CLS) a las imágenes dinámicas que el método `?jsx` aplica a las estáticas.
    - Abstrae las complejidades de las diferentes APIs de los CDNs de imágenes.
    ```tsx
    import { Image } from '@unpic/qwik';

    <Image
      src="[https://my-cms.com/image.jpg](https://my-cms.com/image.jpg)"
      layout="constrained"
      width={800}
      height={600}
      alt="A dynamic image"
    />
    ```

---
## 14.3 Patrones de Manejo de SVG (`PropsOf<'svg'>`)

Para asegurar que los SVGs sean flexibles, reutilizables, estilizables y accesibles, deben ser tratados como componentes de primera clase.

- **Anti-Patrón**: Evita usar `<img src="icon.svg" />`. Impide el estilizado del SVG con CSS (`fill`, `stroke`) y no permite que sea tratado como parte del DOM accesible.
- **Patrón Canónico**:
    1.  **Crear un Componente**: Cada SVG debe ser su propio componente Qwik.
    2.  **Tipar las Props con `PropsOf<'svg'>`**: El componente debe aceptar props tipadas con `PropsOf<'svg'>`. Este es un tipo de utilidad de Qwik que hereda todos los atributos válidos de un elemento `<svg>` nativo.
    3.  **Expandir las Props**: Las `props` recibidas deben ser expandidas (`...props`) en el elemento `<svg>` raíz del componente.
- **Implementación**:
    ```tsx
    import { component$, type PropsOf } from '@builder.io/qwik';

    export const MyIcon = component$((props: PropsOf<'svg'>) => {
      return (
        <svg 
          xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" 
          width="1em" 
          height="1em" 
          viewBox="0 0 24 24" 
          {...props} // Permite pasar class, style, onClick$, etc.
        >
          <path fill="currentColor" d="..."></path>
        </svg>
      );
    });
    ```
- **Ventaja**: Este patrón convierte los SVGs en componentes plenamente funcionales que pueden ser estilizados dinámicamente (`fill="currentColor"` hereda el color del texto), son accesibles y mantienen un tipado seguro.

---
## 14.4 Optimización de Fuentes

Las fuentes web son un render-blocking resource, por lo que su optimización es crítica para el rendimiento percibido.

- **Formato y Ubicación**:
    - **Formato**: Utiliza siempre el formato moderno y altamente comprimido **`.woff2`**.
    - **Ubicación**: Aloja los archivos de fuentes de forma local en el directorio **`public/fonts/`**. Evita cargarlas desde Google Fonts u otros servicios de terceros, ya que introduce una petición de red y una búsqueda de DNS adicionales.

- **Carga con `@font-face`**:
    - **Mecanismo**: Define las fuentes en un archivo CSS global.
    - **Propiedad Crítica (`font-display: swap`)**: Esta es la directiva más importante. Le indica al navegador que renderice el texto inmediatamente con una fuente de sistema (fallback), y que la "intercambie" (`swap`) por la fuente web una vez que haya terminado de descargarse. Esto previene el **"Flash of Invisible Text" (FOIT)** y mejora drásticamente el LCP.
    ```css
    @font-face {
      font-family: 'MiFuente';
      src: url('/fonts/mi-fuente-regular.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    ```

- **Precarga (Preloading)**:
    - **Mecanismo**: Para las fuentes más críticas (ej. la fuente del cuerpo del texto o de los titulares principales), se puede instruir al navegador para que las descargue con alta prioridad utilizando `<link rel="preload">`.
    - **Implementación**: Se añade en la exportación `head` del `root.tsx` o del layout de la ruta.
    ```tsx
    // src/routes/layout.tsx
    export const head: DocumentHead = {
      links: [
        {
          rel: 'preload',
          href: '/fonts/mi-fuente-regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        }
      ]
    };
    ```

---
## 14.5 Manejo de Vídeo y Audio

- **Mecanismo**: Utiliza las etiquetas HTML5 estándar `<video>` y `<audio>`.
- **Mejores Prácticas de Rendimiento**:
    - **`preload="none"`**: Es el atributo más importante. Previene que el navegador descargue cualquier contenido del vídeo o audio (incluyendo metadatos) hasta que el usuario inicie la reproducción.
    - **`poster="path/to/image.jpg"`**: Para los vídeos, proporciona siempre un atributo `poster`. Es una imagen ligera que se muestra en lugar del primer fotograma del vídeo, mejorando el LCP y la experiencia visual antes de la reproducción.
    - **Controles Nativos**: Utiliza el atributo `controls` para que el navegador proporcione los controles de reproducción por defecto.
    - **Streaming**: Para vídeos de larga duración, considera el uso de formatos de streaming adaptativo (HLS, DASH) en lugar de un único archivo MP4 grande. Esto permite que el cliente descargue el vídeo en trozos y se adapte a diferentes anchos de banda.

---
## 14.6 Estrategias de Empaquetado de Assets

Qwik, a través de Vite, tiene dos ubicaciones principales para los assets, con comportamientos muy diferentes.

- **Directorio `public/`**:
    - **Comportamiento**: Los archivos en este directorio **no son procesados ni empaquetados** por Vite. Simplemente se copian tal cual a la raíz del directorio de `build` final.
    - **Ventaja**: Las URLs son predecibles y estables.
    - **Caso de Uso**: Assets que necesitan ser referenciados por una URL fija y pública. Ejemplos: `robots.txt`, `favicon.svg`, `manifest.webmanifest` (para PWAs), y fuentes auto-alojadas.

- **Directorio `src/` (Assets Importados)**:
    - **Comportamiento**: Cuando un asset (imagen, CSS, etc.) se importa directamente en un componente o archivo dentro de `src/`, **es procesado y empaquetado por Vite**.
    - **Ventaja**: El nombre del archivo resultante incluye un **hash de contenido** (ej. `mi-imagen.a1b2c3d4.png`). Esto permite configurar cabeceras de caché de muy larga duración (`Cache-Control: public, max-age=31536000, immutable`), ya que si el contenido del archivo cambia, el hash (y por tanto la URL) también cambiará, invalidando automáticamente la caché.
    - **Caso de Uso**: Todas las imágenes, SVGs y otros medios que son parte integral de los componentes de la aplicación.