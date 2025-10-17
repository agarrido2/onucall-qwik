<!-- ARQUITECTUR_FOLDER -->
# **Arquitectura Canónica Definitiva para Qwik + Supabase**

**Propósito**: Este documento establece la arquitectura y las reglas canónicas para la construcción de aplicaciones Qwik con secciones públicas y privadas. Su objetivo es servir como la **única fuente de verdad** para la organización del código, eliminando la ambigüedad y asegurando la escalabilidad y mantenibilidad del proyecto.

---

### **PARTE 1: PRINCIPIOS FUNDAMENTALES DE ARQUITECTURA**

1.  **Separación Estricta de Dominios**: La estructura del proyecto impone una separación inflexible entre tres dominios principales:
    * **Presentación y Orquestación (`src/routes`)**: Gestiona el enrutamiento y ensambla las vistas.
    * **Sistema de Diseño y UI (`src/components`)**: Contiene componentes de UI reutilizables y agnósticos.
    * **Lógica de Negocio y Servicios (`src/lib`)**: Encapsula toda la lógica, el estado y la comunicación con servicios externos.

2.  **Orquestación en las Rutas**: El directorio `src/routes` es el **orquestador**. Su única responsabilidad es consumir componentes de `src/components` y lógica de `src/lib` para construir las páginas. **Regla de Oro**: Jamás debe contener lógica de negocio reutilizable.

3.  **Seguridad Centralizada en el Servidor**: La protección de las rutas privadas **debe** implementarse a través de un `routeLoader$` que actúe como *Auth Guard*. Este debe ubicarse en el `layout.tsx` del grupo de rutas protegido (`src/routes/(app)/layout.tsx`), redirigiendo a los usuarios no autenticados **antes** de que se renderice cualquier contenido.

4.  **Gestión de Estado Explícita**: El estado debe ser gestionado de forma predecible.
    * **Estado Local**: Usa `useSignal()` para estado reactivo simple y local a un componente.
    * **Estado Global**: Usa `useContext()` para estado que necesita ser compartido. La definición (`createContextId`) vive en `src/lib/contexts`, y el proveedor (`AuthProvider`) es un componente lógico que vive en `src/lib/auth`.

---

### **PARTE 2: ESTRUCTURA DE DIRECTORIOS CANÓNICA**

Esta es la estructura de directorios oficial y definitiva del proyecto. Es el plano maestro que materializa los principios de esta guía. Aplícala sin desviaciones.

```markdown
/
├── public/                     #  favicon.svg, manifest.json, robots.txt y otros ficheros estáticos que no se procesan.
└── src/                        # 📂 Directorio raíz del código fuente de tu aplicación Qwik.
    │
    ├── assets/                 # 📦 Ficheros estáticos que SÍ se procesan (CSS, fuentes, imágenes).
    │   ├── css/                #    - Ficheros CSS globales, como 'global.css' o 'fonts.css'.
    │   └── fonts/              #    - Ficheros de fuentes locales (woff2, ttf).
    │
    ├── components/             # 🧩 Componentes de UI reutilizables en toda la aplicación.
    │   ├── icons/              #    - Colección de iconos en formato de componentes Qwik (.tsx).
    │   ├── layout/             #    - Componentes estructurales (Sidebar, Header, Footer, AppLayout).
    │   └── ui/                 #    - Componentes de UI puros y agnósticos (Botones, Inputs, Cards, Modales).
    │
    ├── hooks/                  # 🪝 Hooks personalizados (`use...$`) para encapsular lógica reactiva reutilizable.
    │
    ├── lib/                    # 🧠 Lógica de negocio, servicios y código no-visual (el cerebro de la app).
    │   ├── auth/               #    - Lógica de autenticación (AuthProvider, helpers para actions/loaders).
    │   ├── contexts/           #    - Definiciones de contextos de Qwik (`createContextId`) para estado global.
    │   ├── db/                 #    - Configuración del cliente de base de datos y ORM (Drizzle).
    │   ├── schemas/            #    - Schemas de validación (usualmente Zod) para formularios y datos de API.
    │   ├── services/           #    - Lógica para interactuar con APIs externas (ej: Stripe, servicios de email).
    │   ├── supabase/           #    - Configuración y exportación de los clientes de Supabase (servidor/cliente).
    │   ├── types/              #    - Definiciones de tipos e interfaces globales de TypeScript.
    │   └── utils/              #    - Funciones de utilidad genéricas y reutilizables (ej: formateadores, `cn`).
    │
    └── routes/                 # 🗺️ Directorio principal del enrutador de Qwik City (páginas y endpoints).
        │
        ├── api/                # ✨ GRUPO DE RUTAS PARA ENDPOINTS DE API (backend).
        │   └── products/       #    - Endpoint para obtener productos (ej: /api/products).
        │       └── index.ts    #    - Aquí viven los handlers (onGet, onPost) que devuelven JSON.
        │
        ├── (public)/           # 🌐 Grupo de rutas para la parte pública (Landing Page).
        │   ├── layout.tsx      #    - Layout específico para la landing (ej: header y footer públicos).
        │   └── index.tsx       #    - Página de inicio de la aplicación (Home).
        │
        ├── (auth)/             # 🔐 Grupo de rutas para el flujo de autenticación.
        │   ├── layout.tsx      #    - Layout simple centrado en formularios.
        │   ├── login/          #    - Página de inicio de sesión.
        │   ├── register/       #    - Página de registro de nuevos usuarios.
        │   └── forgot-password/#    - Página para recuperación de contraseña.
        │
        ├── (app)/              #  dashboards Grupo de rutas protegidas para el dashboard de la aplicación.
        │   ├── layout.tsx      #    - Layout principal del dashboard (con Sidebar y Header de usuario).
        │   └── dashboard/      #    - Página principal del panel de administración.
        │       └── index.tsx   #
        │
        ├── layout.tsx          # 🚪 Layout raíz de TODA la aplicación (Auth Guard, Providers globales, etc.).
        └── service-worker.ts   # ⚙️ Lógica del Service Worker para PWA, caching y funcionalidades offline.
   


```markdown
### **PARTE 3: REGLAS DETALLADAS POR DOMINIO**

#### 3.1 `src/components/` - El Sistema de Diseño

* **Directiva**: Este directorio contiene exclusivamente componentes de UI. Deben ser puros, reutilizables y agnósticos a la lógica de negocio.
* **`ui/`**: El corazón de tu sistema de diseño.
    * **Regla**: Componentes como `Button.tsx` o `Input.tsx` reciben datos y emiten eventos a través de `props`. No deben contener lógica de negocio.
* **`layout/`**: Contiene componentes que definen la estructura principal de las páginas.
    * **Regla**: `AppLayout.tsx` y algun otro se colocan aquí. Pueden consumir contextos (ej. para mostrar el nombre del usuario), pero no implementan la lógica directamente.

#### 3.2 `src/lib/` - La Lógica de Negocio y Servicios

* **Directiva**: Es el cerebro de la aplicación. Las rutas y los componentes **deben** importar la lógica desde aquí. Está estrictamente prohibido que `lib` importe desde `components` o `routes`.
* **`auth/`**: Único lugar para la lógica de autenticación del usuario.
    * **Regla**: Define el componente proveedor `AuthProvider.tsx` y helpers específicos para las `routeAction$` y `routeLoader$` de autenticación.
* **`supabase/`**: Centraliza toda la comunicación con Supabase.
    * **Regla**: Define y exporta los clientes (`client.ts`) para interactuar con la API de Supabase. Cualquier configuración relacionada con Supabase vive aquí.
* **`schemas/`**: Punto único de verdad para la validación de datos.
    * **Regla**: Contiene todos los schemas de Zod (o similar) para validar formularios, respuestas de API y cualquier otra estructura de datos en la aplicación.
* **`types/`**: Centraliza todas las definiciones de tipos e interfaces de TypeScript.
    * **Regla**: Si un tipo o interfaz es utilizado en más de un lugar, debe ser definido aquí para asegurar consistencia.
* **`contexts/`**: Centraliza las definiciones de `createContextId`.
    * **Regla**: Esto desacopla la *definición* del contexto de su *implementación* (el Proveedor).
* **`services/`**: Encapsula la comunicación con APIs externas.
    * **Regla**: Aquí se escribe la lógica para llamar a servicios de terceros (ej. `fetch` a la API de Stripe). Los `routeLoader$` o `routeAction$` importarán y usarán estos servicios.

#### 3.3 `src/routes/` - El Orquestador

* **`(public)` y `(auth)` (Grupos Públicos)**:
    * **Regla**: Los `routeLoader$` en estos grupos deben estar optimizados para el SEO y la velocidad de carga. Las páginas de autenticación se agrupan en `(auth)` para mayor claridad.
* **`(app)/` (Grupo Privado)**:
    * **Regla**: El `layout.tsx` de este grupo **es el guardián**. Su `routeLoader$` **debe** importar y ejecutar la lógica de verificación de sesión desde `lib/supabase/client.ts`. Este es el punto de control de seguridad para toda la sección privada de la aplicación.
* **`api/`**:
    * **Regla**: Este directorio es exclusivamente para endpoints de servidor (handlers `onGet`, `onPost`, etc.) que serán consumidos por servicios externos (ej. webhooks de Stripe, una API para una app móvil). No es para las `routeAction$` de tus formularios.
* **`layout.tsx` (Raíz)**:
    * **Regla**: Es el lugar canónico para los proveedores de contexto globales, como `<AuthProvider>`, que deben estar disponibles en **toda** la aplicación. También es el lugar ideal para implementar el Auth Guard inicial que gestiona las redirecciones principales.
---