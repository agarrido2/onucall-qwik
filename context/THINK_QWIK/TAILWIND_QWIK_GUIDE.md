
````markdown
# Guía de Tailwind CSS v4 para Qwik

**Propósito**: Este documento establece los patrones y directivas para la integración y personalización de **Tailwind CSS v4** en un proyecto Qwik. Está optimizado para ser una base de conocimiento para una IA, enfocándose en la nueva arquitectura de configuración "zero-JS" de Tailwind v4.

---
## PARTE 1: INTEGRACIÓN Y CONFIGURACIÓN FUNDAMENTAL

Tailwind CSS v4 simplifica drásticamente la configuración inicial, eliminando la necesidad de un archivo `tailwind.config.js` para el funcionamiento básico.

### 1.1 Instalación Canónica

El proceso de integración se inicia a través del CLI de Qwik, que configura PostCSS y las dependencias necesarias.

```bash
pnpm run qwik add tailwind
````

### 1.2 Mecanismo de Configuración en v4

El cambio fundamental en Tailwind v4 es que la configuración y las personalizaciones se realizan directamente en el archivo CSS principal.

1.  **Archivo de Entrada**: El único punto de entrada necesario es `src/global.css`.
2.  **Directiva `@import`**: Para habilitar todo el conjunto de utilidades por defecto de Tailwind, la primera línea del archivo `src/global.css` debe ser:
    ```css
    @import "tailwindcss";
    ```
    Esta directiva es procesada en tiempo de compilación por el plugin de PostCSS de Tailwind.

### 1.3 El Rol del `tailwind.config.ts` en v4

El archivo `tailwind.config.ts` (o `.js`) **es completamente opcional en la v4**. Su uso se reserva para casos de uso avanzados que no se pueden definir en CSS.

  * **No se usa para**: Definir colores, fuentes, espaciado, breakpoints o cualquier valor del tema.
  * **Se usa para**: Configurar **plugins** de Tailwind o integraciones con herramientas externas. Para la mayoría de los proyectos, **no es necesario**.

-----

## PARTE 2: PERSONALIZACIÓN DEL TEMA VÍA CSS

La personalización del sistema de diseño se realiza a través de la directiva `@theme` en `src/global.css`.

### 2.1 Colores (`colors`)

Se definen nuevos colores o se sobreescriben los existentes.

  * **Sintaxis**:
    ```css
    @theme {
      --color-primary: #007bff;
      --color-secondary: #6c757d;
      --color-brand-accent: #ff4500;
    }
    ```
  * **Uso en Componentes Qwik**: Tailwind genera automáticamente las clases de utilidad (`bg-primary`, `text-secondary`, `border-brand-accent`, etc.).
    ```tsx
    <button class="bg-primary text-white hover:bg-brand-accent">
      Botón Primario
    </button>
    ```

### 2.2 Fuentes (`fontFamily`)

Se definen las pilas de fuentes para las utilidades `font-*`.

  * **Sintaxis**:
    ```css
    @theme {
      --font-family-sans: "Inter", system-ui, sans-serif;
      --font-family-serif: "Georgia", serif;
    }
    ```
  * **Uso en Componentes Qwik**:
    ```tsx
    <p class="font-sans">Texto principal.</p>
    ```

### 2.3 Breakpoints (`screens`)

Se definen los breakpoints para el diseño responsivo.

  * **Sintaxis**:
    ```css
    @theme {
      --screen-md: 768px;
      --screen-lg: 1024px;
    }
    ```
  * **Uso en Componentes Qwik**:
    ```tsx
    <div class="w-full lg:w-1/2">...</div>
    ```

-----

## PARTE 3: THEMES (MODO CLARO/OSCURO)

El patrón canónico para implementar temas se basa exclusivamente en variables de CSS y la directiva `@theme`.

### 3.1 Definición de Variables de Tema

En `src/global.css`, se definen las variables para el tema por defecto (`:root`) y se sobreescriben para el tema oscuro (`.dark`).

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%; /* blanco */
    --foreground: 222.2 84% 4.9%; /* negro */
    --primary: 222.2 47.4% 11.2%;
  }

  .dark {
    --background: 222.2 84% 4.9%; /* negro */
    --foreground: 210 40% 98%; /* blanco */
    --primary: 210 40% 98%;
  }
}
```

### 3.2 Conexión de Variables al Tema de Tailwind

Para que Tailwind genere clases de utilidad semánticas (ej. `bg-background`), se referencian estas variables dentro de la directiva `@theme`. **Este paso reemplaza la configuración en `tailwind.config.ts`**.

```css
@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
}
```

Ahora puedes usar clases como `bg-background`, `text-foreground` y `text-primary` en tus componentes.

### 3.3 Implementación del Interruptor de Tema en Qwik

El componente para cambiar el tema sigue siendo el mismo, ya que su función es simplemente alternar la clase `.dark` en el elemento `<html>` y persistir la preferencia.

```tsx
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

export const ThemeToggle = component$(() => {
  const theme = useSignal<'light' | 'dark'>('light');

  // Lee el tema guardado al cargar en el cliente
  useVisibleTask$(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    theme.value = savedTheme;
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  });

  const toggleTheme = $(() => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light';
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  });

  return (
    <button onClick$={toggleTheme}>
      {theme.value === 'light' ? '🌙' : '☀️'}
    </button>
  );
});
```

---
## PARTE 4: REGLAS DE INTEROPERABILIDAD (TAILWIND + MOTION)

**Directiva Principal**: Tailwind y Motion One deben colaborar, no competir. Motion One gestiona animaciones complejas (basadas en JS) y Tailwind gestiona animaciones simples (basadas en CSS).

### Regla 1: Transiciones de Estado (CSS/Tailwind)

**Cuándo usar Tailwind (`transition-`):**
Usa las utilidades `transition` de Tailwind **solo** para animaciones simples basadas en cambios de estado o pseudo-clases de CSS.

* **Hover y Focus**: `hover:scale-105 transition-transform`
* **Modo Oscuro**: Animar el cambio de `bg-background`.
* **Clases Condicionales (Scroll)**: Perfecto para tu **Header con Glassmorphism**. El cambio de `isScrolled` (que añade/quita clases `bg-transparent` o `bg-gray-900/50`) debe ser animado con `transition-all duration-300` en el CSS del Header.

### Regla 2: Animaciones de Entrada y Secuencias (JS/Motion)

**Cuándo usar Motion One (`animate()`):**
Usa `animate()`, `timeline()` o `scroll()` de Motion One para todas las animaciones de "entrada" (al aparecer) y para secuencias coreografiadas.

* **Animaciones "On Reveal"**: *Siempre* usa `useVisibleTask$` + `animate()`.
* **Scrollytelling**: *Siempre* usa `useVisibleTask$` + `scroll()`.
* **Animaciones Coreografiadas**: *Siempre* usa `useVisibleTask$` + `timeline()`.

**Regla de Oro**: Si un elemento va a ser controlado por `animate()` de Motion One, **NO DEBES** añadirle clases de `transition-*` de Tailwind que afecten a las mismas propiedades (como `opacity` o `transform`).

### Regla 3: Sinergia de Clases

* **Estado Inicial**: Usa siempre clases de Tailwind para definir el estado inicial *antes* de la animación de Motion. (Ej. `class="opacity-0 translate-y-5"`).
* **Optimización**: Usa siempre la utilidad `will-change-*` de Tailwind en los elementos que vayas a animar con Motion One. (Ej. `class="will-change-[transform,opacity]"`).