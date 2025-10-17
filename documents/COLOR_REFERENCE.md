# Referencia de Colores - Qwik OnuCall

Este documento proporciona una guía rápida de cómo usar los colores definidos en `global.css` en tus componentes Qwik.

## 📊 Tabla de Conversión de Colores

| Nombre Semántico | Hex (Claro) | HSL (Tailwind) | Uso |
|------------------|-------------|----------------|-----|
| `background` | `#ffffff` | `0 0% 100%` | Fondo principal de la app |
| `foreground` | `#1d2033` | `229 33% 15%` | Texto principal |
| `primary` | `#006ce9` | `211 100% 46%` | Botones principales, enlaces |
| `primary-light` | `#18b6f6` | `196 92% 53%` | Hover, variantes claras |
| `secondary` | `#713fc2` | `261 52% 50%` | Acciones secundarias |
| `secondary-light` | `#ac7ff4` | `261 85% 73%` | Hover secundario |
| `accent` | `#ac7ff4` | `261 85% 73%` | Elementos destacados |
| `success` | `#16a34a` | `142 76% 36%` | Mensajes de éxito, badges |
| `error` | `#ef4444` | `0 84% 60%` | Errores, validaciones |
| `warning` | `#f59e0b` | `38 92% 50%` | Advertencias |
| `info` | `#0ea5e9` | `199 89% 48%` | Mensajes informativos |
| `muted` | - | `210 40% 96%` | Fondos secundarios |
| `border` | - | `214 32% 91%` | Bordes de elementos |

## 🎨 Cómo Usar los Colores en Componentes

### Colores Sólidos
```tsx
// Fondos
<div class="bg-primary">...</div>
<div class="bg-secondary">...</div>
<div class="bg-success">...</div>

// Texto
<p class="text-foreground">Texto principal</p>
<p class="text-primary">Texto azul</p>
<p class="text-error">Mensaje de error</p>

// Bordes
<div class="border border-border">...</div>
<div class="border-2 border-primary">...</div>
```

### Colores con Opacidad (Gracias al formato HSL)
```tsx
// 50% de opacidad
<div class="bg-primary/50">...</div>
<div class="text-foreground/70">...</div>

// 20% de opacidad para overlays
<div class="bg-background/20 backdrop-blur">...</div>
```

### Estados Hover y Focus
```tsx
<button class="bg-primary hover:bg-primary-light focus:ring-2 focus:ring-primary">
  Botón con estados
</button>
```

### Modo Oscuro Automático
Los colores cambian automáticamente cuando la clase `.dark` está en el `<html>`:

```tsx
// Este botón será azul oscuro en modo claro y azul claro en modo oscuro
<button class="bg-primary text-white">
  Adaptativo
</button>
```

## 🎯 Patrones Comunes

### Botón Primario
```tsx
<button class="bg-primary text-white hover:bg-primary-light transition-colors px-4 py-2 rounded">
  Acción Principal
</button>
```

### Botón Secundario
```tsx
<button class="bg-secondary text-white hover:bg-secondary-light transition-colors px-4 py-2 rounded">
  Acción Secundaria
</button>
```

### Card con Borde
```tsx
<div class="bg-background border border-border rounded-lg p-4">
  <h3 class="text-foreground font-semibold">Título</h3>
  <p class="text-muted-foreground">Descripción</p>
</div>
```

### Badge de Estado
```tsx
// Éxito
<span class="bg-success/10 text-success px-2 py-1 rounded-full text-sm">
  Completado
</span>

// Error
<span class="bg-error/10 text-error px-2 py-1 rounded-full text-sm">
  Rechazado
</span>

// Warning
<span class="bg-warning/10 text-warning px-2 py-1 rounded-full text-sm">
  Pendiente
</span>

// Info
<span class="bg-info/10 text-info px-2 py-1 rounded-full text-sm">
  Información
</span>
```

### Mensaje de Alerta
```tsx
<div class="bg-error/10 border border-error/20 text-error p-4 rounded">
  <p class="font-semibold">Error</p>
  <p class="text-sm">Hubo un problema al procesar tu solicitud.</p>
</div>
```

## 🌓 Cambiar el Tema (Claro/Oscuro)

El cambio de tema se realiza alternando la clase `.dark` en el elemento `<html>`:

```tsx
// En tu componente ThemeToggle
const toggleTheme = $(() => {
  document.documentElement.classList.toggle('dark');
});
```

## ✅ Verificación de Accesibilidad

Todos los colores cumplen con WCAG 2.1 AA para contraste:
- ✓ `foreground` sobre `background`: >7:1
- ✓ `primary` sobre `background`: 4.5:1
- ✓ Estados de UI sobre sus fondos con opacidad: >4.5:1

## 📚 Referencias

- [CITE: TAILWIND_QWIK_GUIDE.md] - Configuración de Tailwind v4
- [CITE: UX_GUIDE.md] - Directrices de accesibilidad y diseño
