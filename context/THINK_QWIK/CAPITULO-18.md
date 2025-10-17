# PARTE 18: PWA Y MOBILE

Esta sección detalla cómo transformar una aplicación Qwik en una **Progressive Web App (PWA)**, ofreciendo una experiencia similar a la de una aplicación nativa, incluyendo funcionalidad offline y notificaciones push.

---
## 18.1 Configuración de una Progressive Web App (PWA)

- **Definición**: Una PWA es una aplicación web que utiliza tecnologías web modernas para proporcionar una experiencia de usuario similar a la de una aplicación nativa. [cite_start]Puede ser "instalada" en el dispositivo del usuario, funcionar sin conexión y mucho más. [cite: 3232-3233]
- **Requisitos Técnicos Fundamentales**:
    1.  **HTTPS**: La aplicación debe ser servida a través de una conexión segura.
    2.  [cite_start]**Web App Manifest**: Un archivo JSON (generalmente `manifest.webmanifest`) que le dice al navegador cómo debe comportarse la aplicación una vez instalada (nombre, iconos, pantalla de inicio, modo de visualización, etc.). [cite: 3265]
    3.  **Service Worker**: Un script que se ejecuta en segundo plano, separado del hilo principal, y que actúa como un proxy de red. [cite_start]Es la tecnología que habilita la funcionalidad offline y las notificaciones push. [cite: 3263]
- **Ventaja de Qwik**: Qwik está **preparado para PWA por defecto**. [cite_start]Ya incluye y utiliza un Service Worker para su mecanismo principal de pre-carga especulativa, por lo que la configuración adicional es mínima. [cite: 3263]

---
## 18.2 Patrones de Service Worker

- **Service Worker por Defecto de Qwik**: El archivo `src/service-worker.ts` que genera el CLI está preconfigurado para el rendimiento de Qwik, es decir, para la pre-carga inteligente de *bundles* basándose en el `q-manifest.json`.
- **Extensión para PWA (Caching del App Shell)**: Para habilitar la funcionalidad offline, este Service Worker debe ser extendido para cachear los assets principales de la aplicación (el "App Shell").
- **Estrategia de Caché (`Cache-First`)**:
    1.  **Evento `install`**: Durante la instalación del Service Worker, se le indica que abra una caché y guarde una lista de archivos esenciales (ej. la página de inicio `/`, el CSS principal, el Qwik Loader).
    2.  **Evento `fetch`**: El Service Worker intercepta todas las peticiones de red. Para las peticiones de los assets del App Shell, primero busca en su caché. Si encuentra el recurso, lo sirve desde allí (rápido y offline). Si no, realiza la petición a la red y, opcionalmente, guarda la respuesta en caché para futuras peticiones.
- **Librerías de Ayuda**: Aunque se puede escribir la lógica del Service Worker manualmente, librerías como **Workbox** de Google pueden simplificar enormemente la implementación de estrategias de caché complejas.

---
## 18.3 Funcionalidad Offline

- **Mecanismo**: El Service Worker actúa como un proxy de red programable entre la aplicación, el navegador y la red.
- **Estrategia de Implementación**:
    1.  **Cacheo del App Shell**: Como se mencionó anteriormente, los recursos estáticos que componen la estructura básica de la aplicación (definidos en `layout.tsx`, CSS global, etc.) se guardan en caché durante la instalación del Service Worker. Esto asegura que la "carcasa" de la aplicación siempre se pueda cargar, incluso sin conexión.
    2.  **Cacheo de Rutas Visitadas**: A medida que el usuario navega por la aplicación, el Service Worker puede cachear dinámicamente el HTML y los datos de las páginas visitadas.
    3.  **Manejo de Datos Dinámicos**: La verdadera funcionalidad offline para aplicaciones dinámicas requiere una estrategia más avanzada:
        - **Cacheo de Respuestas de API**: Se cachean las respuestas de las peticiones `GET` a la API en `IndexedDB` o `CacheStorage`.
        - **Sincronización en Segundo Plano (`Background Sync`)**: Las mutaciones de datos (peticiones `POST`, `PUT`, etc.) realizadas offline se guardan en una cola (ej. en `IndexedDB`). Cuando se recupera la conexión, el Service Worker las envía al servidor en segundo plano.

---
## 18.4 Notificaciones Push

- **Mecanismo**: Una colaboración entre el Service Worker, las APIs del navegador (`Push API`, `Notifications API`) y un servidor de aplicación.
- **Flujo de Ejecución**:
    1.  **Suscripción (Cliente)**: La aplicación solicita permiso al usuario para enviar notificaciones. Si se concede, el navegador proporciona un objeto `PushSubscription` único para ese usuario y dispositivo.
    2.  **Almacenamiento (Backend)**: La aplicación envía este objeto `PushSubscription` a su propio backend y lo guarda asociado al usuario.
    3.  **Envío del Push (Backend)**: Cuando el backend quiere enviar una notificación, envía un mensaje al "Push Service" del proveedor del navegador (Google, Apple, Mozilla), utilizando la información del `PushSubscription` guardado.
    4.  **Recepción y Visualización (Service Worker)**: El "Push Service" entrega el mensaje al navegador correcto, que despierta al Service Worker de la aplicación (incluso si la pestaña está cerrada). El Service Worker recibe un evento `push` y es el responsable de mostrar la notificación al usuario utilizando la API `self.registration.showNotification()`.

    ---
## 18.5 Optimización para Móviles

Además del rendimiento inherente de Qwik, hay prácticas específicas para asegurar una experiencia móvil de alta calidad.

- **Diseño Responsivo (Responsive Design)**: Es la base. La UI debe ser fluida y adaptarse a cualquier tamaño de pantalla utilizando técnicas de CSS modernas como Media Queries, Flexbox y Grid.
- [cite_start]**Rendimiento como Prioridad**: La arquitectura de Qwik, con su mínimo JavaScript inicial y su reanudabilidad, es una ventaja fundamental en dispositivos móviles, que a menudo tienen CPUs menos potentes y conexiones de red más lentas. [cite: 3226-3228]
- **Interacciones Táctiles**: Utiliza los eventos táctiles (`onTouchStart$`, `onTouchMove$`, `onTouchEnd$`) para implementar gestos y una interactividad que se sienta nativa en dispositivos móviles.
- **Configuración del Manifest para Móviles**: El archivo `manifest.webmanifest` contiene propiedades clave para definir la experiencia de la aplicación instalada:
    - [cite_start]**`display: 'standalone'`**: Oculta la interfaz del navegador (barra de direcciones, etc.), haciendo que la aplicación ocupe toda la pantalla y se sienta como una app nativa. [cite: 3272, 3276]
    - **`orientation`**: Permite bloquear la orientación de la pantalla (ej. `'portrait'`).
    - [cite_start]**`theme_color`**: Define el color de la barra de herramientas del sistema operativo. [cite: 3279]
    - [cite_start]**`background_color`**: Establece el color de la pantalla de bienvenida (`splash screen`) que se muestra mientras la aplicación se inicia. [cite: 3280]
    - [cite_start]**`icons`**: Proporciona un conjunto de iconos en diferentes tamaños que se usarán en la pantalla de inicio del dispositivo. [cite: 3281-3282]

---
## 18.6 Patrones de App Shell

- **Definición**: El "App Shell" es el HTML, CSS y JavaScript mínimo necesario para renderizar la "carcasa" de la interfaz de usuario. Es la parte de la aplicación que es estática y persiste entre diferentes páginas (cabecera, navegación, pie de página).
- **Implementación en Qwik**: El archivo `src/routes/layout.tsx` raíz es la implementación natural del patrón App Shell. Contiene la estructura fundamental de la UI que envuelve todo el contenido dinámico de las rutas.
- **Estrategia de Caché**: El Service Worker debe ser configurado para cachear agresivamente todos los assets que componen el App Shell. Al hacerlo, en visitas posteriores, la "carcasa" de la aplicación se carga instantáneamente desde la caché, incluso antes de que se realice una petición de red para el contenido de la página, proporcionando una experiencia de usuario extremadamente rápida y resiliente.

---
## 18.7 Prompts de Instalación

- **Prompt Automático del Navegador**: Si una aplicación web cumple con los criterios de instalabilidad de una PWA, los navegadores modernos mostrarán automáticamente una indicación para que el usuario la instale (ej. un icono en la barra de direcciones).
- **Experiencia de Instalación Personalizada**: Para un mayor control sobre la experiencia, se puede interceptar el prompt del navegador y activarlo mediante un botón personalizado en la UI.
    - **Mecanismo**: Escuchar el evento `beforeinstallprompt` en el objeto `window`.
    - **Flujo de Implementación**:
        1.  **En un `useVisibleTask$`** (para asegurar que se ejecuta en el cliente), se añade un `listener` para el evento `beforeinstallprompt`.
        2.  Dentro del `listener`, se llama a `event.preventDefault()` para evitar que el navegador muestre su banner de instalación por defecto.
        3.  Se guarda el objeto `event` en una señal (`Signal`).
        4.  Se muestra un botón personalizado en la UI ("Instalar Aplicación").
        5.  Cuando el usuario hace clic en ese botón, se llama al método `prompt()` sobre el objeto `event` guardado en la señal, lo que activará el diálogo de instalación del navegador.