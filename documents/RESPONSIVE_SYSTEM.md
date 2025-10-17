# Sistema de Responsive Design - Qwik OnuCall

Sistema de diseño responsive basado en **Mobile First** con breakpoints optimizados para dispositivos reales y mejores prácticas de UX.

## 📱 **Filosofía Mobile First**

El diseño se construye desde móvil hacia desktop, asegurando que la experiencia en dispositivos móviles sea prioritaria y optimizada.

```css
/* Base: Mobile (320px - 639px) */
.elemento { font-size: 1rem; }

/* Tablet: 640px+ */
@media (min-width: 640px) {
  .elemento { font-size: 1.125rem; }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .elemento { font-size: 1.25rem; }
}
```

## 📐 **Breakpoints Definidos**

### **Sistema de Breakpoints**
| Nombre | Min Width | Dispositivos | Variables CSS |
|--------|-----------|--------------|---------------|
| **Base** | - | Mobile | `--container-padding: 1rem` |
| **sm** | 640px | Tablet pequeña | `--container-padding: 1.5rem` |
| **md** | 768px | Tablet estándar | `--container-padding: 2rem` |
| **lg** | 1024px | Desktop pequeño | `--container-padding: 2.5rem` |
| **xl** | 1280px | Desktop estándar | `--container-padding: 3rem` |
| **2xl** | 1536px | Desktop grande | `--container-padding: 3rem` |
| **3xl** | 1920px | Ultra wide | `--container-padding: 4rem` |

### **Variables Dinámicas por Breakpoint**

#### **Espaciado de Container**
```css
/* Mobile */    --container-padding: 1rem;    /* 16px */
/* sm */        --container-padding: 1.5rem;  /* 24px */
/* md */        --container-padding: 2rem;    /* 32px */
/* lg */        --container-padding: 2.5rem;  /* 40px */
/* xl+ */       --container-padding: 3rem;    /* 48px */
```

#### **Altura de Header**
```css
/* Mobile */    --header-height: 3.5rem;  /* 56px */
/* sm */        --header-height: 4rem;    /* 64px */
/* md */        --header-height: 4.5rem;  /* 72px */
/* lg+ */       --header-height: 5rem;    /* 80px */
```

#### **Espaciado de Secciones**
```css
/* Mobile */    --section-spacing: 2rem;   /* 32px */
/* sm */        --section-spacing: 3rem;   /* 48px */
/* md */        --section-spacing: 4rem;   /* 64px */
/* lg */        --section-spacing: 5rem;   /* 80px */
/* xl */        --section-spacing: 6rem;   /* 96px */
/* 2xl+ */      --section-spacing: 8rem;   /* 128px */
```

## 🛠️ **Clases Helper Disponibles**

### **Container Responsivo**
```tsx
<div class="container-responsive">
  {/* Contenido centrado con padding dinámico */}
</div>
```

### **Espaciado de Secciones**
```tsx
<section class="section-spacing">
  {/* Padding vertical que se adapta al breakpoint */}
</section>
```

### **Grid Responsivo Automático**
```tsx
<div class="grid-responsive">
  {/* Grid que se adapta: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop) → 4 cols (wide) */}
</div>
```

### **Visibilidad Condicional**
```tsx
{/* Solo visible en móvil */}
<div class="mobile-only">
  <MobileMenu />
</div>

{/* Visible desde tablet hacia arriba */}
<div class="tablet-up">
  <DesktopNavigation />
</div>
```

### **Utilidades de Altura**
```tsx
{/* Header con altura dinámica */}
<header class="header-height">

{/* Contenido que ocupa pantalla menos header */}
<main class="min-screen-minus-header">
```

## 📋 **Uso en Componentes Qwik**

### **Ejemplo: Componente Hero Responsive**
```tsx
export const Hero = component$(() => {
  return (
    <section class="section-spacing bg-primary">
      <div class="container-responsive">
        <div class="grid-responsive">
          <div class="col-span-full lg:col-span-2">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
              Título Responsive
            </h1>
            <p class="text-base sm:text-lg lg:text-xl mt-4">
              Descripción que se adapta al breakpoint
            </p>
          </div>
          <div class="tablet-up lg:col-span-1">
            <img src="/hero-image.webp" alt="Hero" class="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
});
```

### **Ejemplo: Navegación Condicional**
```tsx
export const Navigation = component$<NavigationProps>(({ isScrolled }) => {
  return (
    <>
      {/* Desktop Navigation */}
      <nav class="tablet-up">
        <div class={{
          'flex items-center space-x-6 px-6 py-2 rounded-full transition-all': true,
          'border border-white/20': !isScrolled,
          'border border-white/30': isScrolled,
        }}>
          {/* Menu items */}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <Button class="mobile-only">
        <MenuIcon />
      </Button>
    </>
  );
});
```

## 🎨 **Patrones de Diseño Responsive**

### **1. Contenido Apilado → Side by Side**
```tsx
{/* Mobile: Apilado | Desktop: Lado a lado */}
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div>Contenido 1</div>
  <div>Contenido 2</div>
</div>
```

### **2. Cards Grid Adaptable**
```tsx
{/* 1 col → 2 cols → 3 cols → 4 cols */}
<div class="grid-responsive gap-6">
  <Card />
  <Card />
  <Card />
  <Card />
</div>
```

### **3. Texto Escalable**
```tsx
<h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
  Título que escala suavemente
</h1>
```

## 🔧 **Variables CSS Disponibles**

```css
/* Usar en cualquier CSS personalizado */
.mi-componente {
  padding: var(--spacing-container);
  margin-bottom: var(--spacing-section);
  max-width: var(--width-content);
  height: var(--height-header);
}
```

## 📱 **Testing Responsive**

### **Breakpoints de Prueba**
- **Mobile**: 375px (iPhone), 360px (Android)
- **Tablet**: 768px (iPad vertical), 1024px (iPad horizontal)
- **Desktop**: 1280px (laptop), 1440px (desktop), 1920px (wide)

### **Herramientas de Testing**
```bash
# Servidor de desarrollo
bun run dev

# Abrir en diferentes dispositivos con DevTools
# Chrome DevTools → Toggle Device Toolbar
# Probar todos los breakpoints definidos
```

---

**[CITE: UX_GUIDE.md]** - Sistema responsive optimizado para experiencia de usuario
**[CITE: TAILWIND_QWIK_GUIDE.md]** - Integración con Tailwind v4 y Qwik

🎯 **Sistema listo para implementar responsive design consistente en toda la landing page.**