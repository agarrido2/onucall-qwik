# 🎨 Demostración de Colores - Qwik OnuCall

Este directorio contiene la página de demostración del sistema de colores implementado en `global.css`.

## 📍 Ubicación

**Ruta**: `/colors`

**URL de desarrollo**: `http://localhost:5173/colors`

## 🎯 Propósito

Esta página tiene múltiples propósitos:

1. **Verificación Visual**: Permite verificar que todos los colores definidos en `global.css` se están aplicando correctamente
2. **Referencia Rápida**: Sirve como guía visual para desarrolladores al elegir colores
3. **Testing de Modo Oscuro**: Incluye un toggle para probar el cambio entre tema claro y oscuro
4. **Documentación Viva**: Muestra ejemplos prácticos de cómo usar los colores en componentes reales

## 🧩 Componentes Incluidos

### 1. `ColorShowcase.tsx`
**Ubicación**: `src/components/ui/ColorShowcase.tsx`

Componente principal que muestra:
- Todos los colores base (background, foreground)
- Colores de marca (primary, secondary y sus variantes)
- Colores de estado (success, error, warning, info)
- Colores auxiliares (muted, border)
- Ejemplos de componentes (botones, badges, cards, alertas)
- Variantes de opacidad para cada color

### 2. `ThemeToggle.tsx`
**Ubicación**: `src/components/ui/ThemeToggle.tsx`

Botón flotante que permite:
- Alternar entre modo claro y oscuro
- Persistir la preferencia en localStorage
- Actualizar la clase `.dark` en el elemento `<html>`

## 🚀 Cómo Usar

### 1. Iniciar el servidor de desarrollo

```bash
pnpm run dev
```

### 2. Navegar a la página de colores

Abre tu navegador en: `http://localhost:5173/colors`

### 3. Probar el toggle de tema

Haz clic en el botón flotante de la esquina superior derecha (🌙/☀️) para cambiar entre modo claro y oscuro.

## 📊 Estructura de la Demostración

```
/colors
├── ColorShowcase.tsx (Componente principal)
│   ├── Header (Título y descripción)
│   ├── Colores Base (background, foreground)
│   ├── Colores de Marca (primary, secondary, accent)
│   ├── Estados de UI (success, error, warning, info)
│   ├── Colores Auxiliares (muted, border)
│   ├── Ejemplos de Componentes
│   │   ├── Botones
│   │   ├── Badges
│   │   ├── Cards
│   │   └── Alertas
│   └── Footer (Info técnica)
└── ThemeToggle.tsx (Botón flotante)
```

## 🎨 Colores Disponibles

### Colores Base
- `background` - Fondo principal (#ffffff en claro, #101010 en oscuro)
- `foreground` - Texto principal (#1d2033 en claro, #ffffff en oscuro)

### Colores de Marca
- `primary` - Azul oscuro (#006ce9)
- `primary-light` - Azul claro (#18b6f6)
- `secondary` - Púrpura oscuro (#713fc2)
- `secondary-light` - Púrpura claro (#ac7ff4)
- `accent` - Color de acento (#ac7ff4)

### Estados de UI
- `success` - Verde (#16a34a)
- `error` - Rojo (#ef4444)
- `warning` - Amarillo (#f59e0b)
- `info` - Azul (#0ea5e9)

### Colores Auxiliares
- `muted` - Fondos secundarios
- `muted-foreground` - Texto secundario
- `border` - Bordes de elementos

## ✨ Características Técnicas

### Formato HSL Separado
Todos los colores están definidos en formato HSL sin el wrapper `hsl()`:
```css
--primary: 211 100% 46%;
```

Esto permite a Tailwind generar automáticamente variantes con opacidad:
```tsx
<div class="bg-primary/50">50% de opacidad</div>
<div class="text-error/70">70% de opacidad</div>
```

### Modo Oscuro Automático
Los colores cambian automáticamente cuando la clase `.dark` está presente en el `<html>`:
```tsx
// Este botón será azul oscuro en claro y azul claro en oscuro
<button class="bg-primary">...</button>
```

### Transiciones Suaves
El cambio de tema incluye transiciones CSS suaves definidas en `global.css`:
```css
transition: background-color 0.3s ease, color 0.3s ease;
```

## 📚 Referencias

- [CITE: TAILWIND_QWIK_GUIDE.md] - Configuración de Tailwind v4
- [CITE: UX_GUIDE.md] - Directrices de diseño y accesibilidad
- [CITE: COLOR_REFERENCE.md] - Guía rápida de uso de colores

## 🧪 Testing

Para verificar que todo funciona correctamente:

1. ✅ Todos los colores se muestran correctamente
2. ✅ Las variantes de opacidad funcionan (30%, 50%, 70%)
3. ✅ El hover en las cards produce una elevación visual
4. ✅ El toggle de tema cambia todos los colores instantáneamente
5. ✅ La preferencia se persiste al recargar la página
6. ✅ Los ejemplos de componentes se ven correctos en ambos temas

## 🔧 Mantenimiento

Si añades nuevos colores a `global.css`:

1. Añade la variable en `@layer base` (formato HSL separado)
2. Conéctala en `@theme` con `--color-<nombre>: hsl(var(--<nombre>))`
3. Añade una nueva `ColorCard` en `ColorShowcase.tsx`
4. Actualiza `COLOR_REFERENCE.md` con el nuevo color

---

**Nota**: Esta página es solo para desarrollo. En producción, puedes eliminarla o protegerla con autenticación.
