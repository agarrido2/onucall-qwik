# Prompt para la Creación de la Estructura Inicial de la Landing Page "Onucall"

## 1. Contexto General del Proyecto

Vas a actuar como un desarrollador frontend experto en **Qwik** y **Tailwind CSS**. Tu tarea es generar el código para la estructura inicial de la landing page de **"Onucall"**, un servicio de agente comercial con IA por voz, disponible 24/7. El público objetivo son dueños de negocios que venden productos. El objetivo es guiar al usuario a la acción "Empezar Gratis".

## 2. Stack Tecnológico y Principios de Diseño

* **Framework**: Qwik
* **Estilos**: Tailwind CSS version 4.
* **Principios Clave**: Sigue rigurosamente la "Guía de Estilo y UX/UI para IA (Versión 2025)". y "TAILWIND_QWIK_GUIDE". Esto implica:
    * **Claridad y Simplicidad**: Jerarquía visual, mucho espacio en blanco.
    * **Dinamismo y Feedback**: Micro-interacciones y animaciones sutiles.
    * **Performance como UX**: Carga instantánea.
    * **Accesibilidad (a11y)**: HTML semántico, roles ARIA y contraste adecuado.
    * **Tendencias 2025**: Fondos con gradientes de malla, tipografía audaz.

## 3. Estructura de Archivos Solicitada

Organiza el código en los siguientes componentes modulares dentro del directorio `src/`:

```
src/
├── components/
│   ├── icons/
│   │   └── OnucallLogo.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── HeroSection.tsx
└── routes/
    └── index.tsx
```

## 4. Tareas a Realizar

Genera el código para los siguientes 4 componentes, siguiendo las especificaciones detalladas. **No utilices ningún archivo de imagen (`<img>`, etc.). Todos los logos e iconos deben ser generados como texto estilizado o SVG inline.**

### Tarea 1: Componente `Header.tsx` (Cabecera y Navbar)

**Objetivo**: Crear una barra de navegación superior con un diseño limpio y profesional, basado en una descripción textual explícita.

* **Comportamiento y Layout**:
    * **Posicionamiento**: Normal, en el flujo del documento (no `sticky` ni `fixed`).
    * **Fondo**: Blanco (`bg-white`).
    * **Contenedor Principal**: El contenido debe estar centrado horizontalmente (`max-w-screen-xl`, `mx-auto`) y tener `padding` horizontal (`px-4 sm:px-6 lg:px-8`). Debe usar `flex` con `justify-between` y `items-center` para alinear los elementos.
* **Contenido (De izquierda a derecha)**:
    * **Elemento Izquierdo (Logo)**:
        * Genera el texto "**Onucall**".
        * Estilo: `font-sans`, `font-bold`, `text-2xl`, color `text-gray-900`.
    * **Elemento Derecho (Contenedor Agrupado)**:
        * Crea un `div` que agrupe todos los elementos de navegación y acción.
        * **Estilo del Contenedor**: Aplica un borde fino (`border border-gray-200`), esquinas totalmente redondeadas (`rounded-full`) y una sombra sutil (`shadow-sm`). Añade `padding` interno (`p-2`). Debe usar `flex` con `items-center` y un espaciado entre elementos (`space-x-4`).
        * **Elementos Internos del Contenedor (de izquierda a derecha)**:
            1.  **Enlaces de Navegación**: `Industrias`, `Empleados IA`, `Nosotros`, `Partners`, `Recursos`. Estilo: `text-gray-600`, `font-medium`, `text-sm`.
            2.  **Botón "Login"**: Un botón con el texto "Login". Estilo **contorneado**: `border border-gray-300`, `text-gray-700`, `bg-white`, `rounded-full`, `px-4 py-1.5`.
            3.  **Botón "Prueba Onucall"**: Un botón con el texto "Prueba Onucall". Estilo **relleno**: `bg-blue-600`, `text-white`, `rounded-full`, `px-4 py-1.5`.
* **Responsive (Móvil)**:
    * En pantallas pequeñas (`md:` y menores), el "Contenedor Agrupado" debe ocultarse.
    * En su lugar, a la derecha del logo, debe aparecer un **botón de menú (hamburguesa)**. Genera este icono usando tres `divs` horizontales con SVG inline o directamente con divs estilizados.

---

### Tarea 2: Componente `HeroSection.tsx` (Sección Principal)

**Objetivo**: Captar la atención, comunicar la propuesta de valor y guiar a la acción.

* **Layout y Estilo**:
    * Debe ocupar el 100% de la altura de la ventana (`min-h-screen`).
    * **Fondo**: Crea un **gradiente de malla (Mesh Gradient)** animado lentamente. Combina colores oscuros y tecnológicos como `slate-900`, `indigo-900` y `black`.
    * El contenido principal debe estar centrado usando `flex`, `flex-col`, `items-center`, `justify-center`.
* **Contenido de Texto (Centrado)**:
    * **Título (H1)**: Tipografía muy grande (`text-5xl md:text-7xl`), `font-extrabold`, `text-white`, `text-center`. Texto: `"El mejor empleado digital al servicio de tu cliente 24/7."`
    * **Subtítulo (p)**: Fuente más ligera, `text-gray-300`, `max-w-2xl`, `text-center`, `mt-4`. Texto: `"Atiende dudas técnicas sobre tus productos, cualifica leads y agenda visitas de venta con voz profesional — configúralo en minutos, sin complicaciones."`
* **Botones de Acción (CTAs)**:
    * Debajo del subtítulo (`mt-8`), alinea dos botones en una fila (`flex space-x-4`):
        1.  **Botón Primario**: Texto "Empieza Gratis". Estilo prominente: `bg-indigo-600`, `text-white`, `rounded-full`, `px-6 py-3`.
        2.  **Botón Secundario**: Texto "Ver Demostración". Estilo sutil: `border border-white`, `text-white`, `bg-transparent`, `rounded-full`, `px-6 py-3`.
    * Ambos deben tener una micro-animación al `hover` (ej. `hover:bg-indigo-500`).
* **Barra de Tecnologías (Tech Bar)**:
    * Posicionada en la parte inferior de la sección (`absolute bottom-10`), centrada.
    * **Título**: Texto pequeño y semi-transparente (`text-gray-500 text-sm`): `"Construido con las mejores tecnologías:"`.
    * **Logos (como texto)**: Debajo del título, una fila (`flex space-x-6 mt-4`) de `divs` o `spans` que contengan solo los nombres de las tecnologías, con un estilo sutil y legible (`text-gray-400 text-xs`). Los nombres son: **Qwik, Supabase, Drizzle, Retell AI, Zadarma, n8n, OVH**.

---

### Tarea 3: Componente `Footer.tsx` (Pie de Página)

**Objetivo**: Proporcionar información secundaria y legal de forma organizada.

* **Layout**: Diseño multi-columna responsive (ej. `grid grid-cols-1 md:grid-cols-4 gap-8`).
* **Estilo**: Fondo oscuro (`bg-gray-950`), texto principal `text-gray-400`, `padding` vertical y horizontal.
* **Contenido**:
    * **Columna 1**:
        * El logo textual de "Onucall".
        * Un eslogan breve (`"Tu mejor agente comercial, 24/7."`).
        * Iconos de redes sociales: Genera SVG inline simples para **LinkedIn**, **Twitter/X** y **Facebook**.
    * **Columna 2 (Producto)**: Título "Producto" y una lista de enlaces: `Características`, `Precios`, `Casos de Uso`.
    * **Columna 3 (Empresa)**: Título "Empresa" y una lista de enlaces: `Nosotros`, `Partners`, `Contacto`.
    * **Columna 4 (Legal)**: Título "Legal" y una lista de enlaces: `Política de Privacidad`, `Términos de Servicio`.
    * **Barra Inferior**: Separada por un borde superior (`border-t border-gray-800 mt-8 pt-8`), una línea final con la información de copyright: `© 2025 onucall. Todos los derechos reservados.`

---

### Tarea 4: Página `index.tsx` (Ensamblador)

**Objetivo**: Construir la página de inicio importando y organizando los componentes creados.

* **Estructura**:
    1.  Renderiza el componente `Header`.
    2.  Dentro de una etiqueta `<main>`, renderiza el componente `HeroSection`.
    3.  Añade placeholders en comentarios HTML para las futuras secciones (``, ``, etc.).
    4.  Renderiza el componente `Footer`.
* **Estilo Global**: En el archivo `src/global.css`, asegúrate de que el `<body>` tenga un `font-family` sans-serif base (ej. `font-sans`) y un color de fondo oscuro (`bg-slate-950` o similar) para que toda la página sea consistente.

**Instrucción Final**: Todo el código debe ser escrito en formato `.tsx` para Qwik, ser completamente responsive, semántico y accesible. Utiliza exclusivamente clases de utilidad de Tailwind CSS para todos los estilos.