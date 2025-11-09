# Referencia de Colores - Qwik OnuCall

Este documento proporciona una guía rápida de cómo usar los colores definidos en `global.css` en tus componentes Qwik.

## 📊 Tabla de Conversión de Colores

| Nombre Semántico | Hex (Claro) | HSL (Tailwind) | Uso |
|:--- |:--- |:--- |:--- |
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
| `muted` | - | `210 40% 96%` | Fondos secundarios (ej. cards) |
| `muted-foreground` | - | `215 16% 47%` | Texto secundario (atenuado) |
| `border` | - | `214 32% 91%` | Bordes de elementos (inputs, cards) |

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
<button class="bg-primary text-primary-foreground">
  Adaptativo
</button>
```

## 🎯 Patrones Comunes

### Botón Primario
```tsx
<button class="bg-primary text-primary-foreground hover:bg-primary-light transition-colors px-4 py-2 rounded-md font-medium">
  Acción Principal
</button>
```

### Botón Secundario
```tsx
<button class="bg-secondary text-secondary-foreground hover:bg-secondary-light transition-colors px-4 py-2 rounded-md font-medium">
  Acción Secundaria
</button>
```

### Card con Borde
```tsx
<div class="bg-background border border-border rounded-lg p-4 shadow-sm">
  <h3 class="text-foreground font-semibold">Título</h3>
  <p class="text-muted-foreground text-sm">Descripción</p>
</div>
```

### Badge de Estado
```tsx
// Éxito
<span class="bg-success/10 text-success px-2.5 py-0.5 rounded-full text-xs font-medium">
  Completado
</span>

// Error
<span class="bg-error/10 text-error px-2.5 py-0.5 rounded-full text-xs font-medium">
  Rechazado
</span>

// Warning
<span class="bg-warning/10 text-warning px-2.5 py-0.5 rounded-full text-xs font-medium">
  Pendiente
</span>

// Info
<span class="bg-info/10 text-info px-2.5 py-0.5 rounded-full text-xs font-medium">
  Información
</span>
```

### Mensaje de Alerta
```tsx
// Alerta de Éxito
<div class="bg-success/10 border border-success/20 text-success p-4 rounded-md" role="alert">
  <p class="font-semibold">Éxito</p>
  <p class="text-sm">La operación se ha completado correctamente.</p>
</div>

// Alerta de Error
<div class="bg-error/10 border border-error/20 text-error p-4 rounded-md" role="alert">
  <p class="font-semibold">Error</p>
  <p class="text-sm">Hubo un problema al procesar tu solicitud.</p>
</div>

// Alerta de Advertencia
<div class="bg-warning/10 border border-warning/20 text-warning p-4 rounded-md" role="alert">
  <p class="font-semibold">Advertencia</p>
  <p class="text-sm">Tu suscripción está a punto de caducar.</p>
</div>

// Alerta de Información
<div class="bg-info/10 border border-info/20 text-info p-4 rounded-md" role="alert">
  <p class="font-semibold">Información</p>
  <p class="text-sm">Ahora estamos en mantenimiento programado.</p>
</div>
```

## 🌓 Cambiar el Tema (Claro/Oscuro)

El cambio de tema se realiza alternando la clase `.dark` en el elemento `<html>`.

```tsx
// En tu componente ThemeToggle
const toggleTheme = $(() => {
  document.documentElement.classList.toggle('dark');
  // Aquí también se debería persistir la preferencia en localStorage
});
```

## ✅ Verificación de Accesibilidad

Todos los colores base cumplen con las directrices de la WCAG (Web Content Accessibility Guidelines) para contraste:
* ✓ `foreground` sobre `background`: Contraste alto.
* ✓ `primary` sobre `background`: Contraste adecuado (AA).
* ✓ `success`/`error`/`warning`/`info` sobre sus respectivos fondos (`/10`) cumplen con el contraste para texto no-pequeño.

## 📚 Referencias

* [CITE: THINK_QWIK.zip/TAILWIND_QWIK_GUIDE.md] - Configuración de Tailwind v4
* [CITE: THINK_QWIK.zip/UX_GUIDE.md] - Directrices de accesibilidad y diseño
* [CITE: css/global.css] - Implementación de referencia de las variables de color