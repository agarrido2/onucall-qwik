# ⚡ GUÍA DE INICIO RÁPIDO - Sistema de Diseño

## Inicio Rápido

```bash
bun install
bun run dev

### 2. Ver las Demos (2 minutos)
- **Colores**: http://localhost:5173/colors
- **Componentes**: http://localhost:5173/components

### 3. Crear tu Primer Componente (2 minutos)
```tsx
// src/routes/(public)/ejemplo/index.tsx
import { component$ } from '@builder.io/qwik';
import { Card, Button, Badge, Alert } from '~/components/ui';

export default component$(() => {
  return (
    <div class="container mx-auto p-8">
      <Card variant="elevated">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold">Mi Primera Página</h1>
          <Badge variant="success">Nuevo</Badge>
        </div>
        
        <Alert variant="info" class="mb-4">
          Bienvenido al sistema de diseño de Qwik OnuCall
        </Alert>
        
        <Button variant="primary" fullWidth>
          Empezar
        </Button>
      </Card>
    </div>
  );
});
```

### 4. Probar el Modo Oscuro (30 segundos)
Haz clic en el botón 🌙/☀️ en la navegación.

---

## 📖 Recetas Comunes

### Tarjeta de Usuario
```tsx
<Card variant="elevated">
  <div class="flex items-start justify-between mb-4">
    <div>
      <h3 class="text-xl font-semibold">Antonio García</h3>
      <p class="text-muted-foreground text-sm">antonio@example.com</p>
    </div>
    <Badge variant="success">Activo</Badge>
  </div>
  <Button size="sm" variant="primary" fullWidth>Ver Perfil</Button>
</Card>
```

### Formulario de Login
```tsx
<Card>
  <h2 class="text-2xl font-bold mb-6">Iniciar Sesión</h2>
  
  <form class="space-y-4">
    <div>
      <Label for="email" required>Email</Label>
      <Input id="email" type="email" placeholder="tu@email.com" required />
    </div>
    
    <div>
      <Label for="password" required>Contraseña</Label>
      <Input id="password" type="password" required />
    </div>
    
    <Button type="submit" variant="primary" fullWidth>
      Entrar
    </Button>
  </form>
</Card>
```

### Notificación de Éxito
```tsx
<Alert variant="success" title="Guardado">
  Los cambios se han guardado correctamente.
</Alert>
```

### Lista de Estados
```tsx
<div class="flex gap-2">
  <Badge variant="success">✓ Completado</Badge>
  <Badge variant="warning">⚠ Pendiente</Badge>
  <Badge variant="error">✗ Rechazado</Badge>
</div>
```

---

## 🎨 Colores Más Usados

```tsx
// Fondos
class="bg-background"      // Fondo principal
class="bg-muted"          // Fondo secundario
class="bg-primary"        // Fondo de marca

// Texto
class="text-foreground"        // Texto principal
class="text-muted-foreground"  // Texto secundario
class="text-primary"           // Texto destacado

// Bordes
class="border-border"     // Borde estándar
class="border-primary"    // Borde destacado

// Estados
class="bg-success/10"     // Fondo de éxito (10% opacidad)
class="bg-error/10"       // Fondo de error (10% opacidad)
```

---

## 🧩 Componentes Más Usados

### Button
```tsx
<Button variant="primary" size="md">Primario</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Badge
```tsx
<Badge variant="success">Activo</Badge>
<Badge variant="warning" size="sm">Pendiente</Badge>
```

### Card
```tsx
<Card variant="elevated" padding="lg">
  {/* Contenido */}
</Card>
```

### Alert
```tsx
<Alert variant="info" title="Información">
  Este es un mensaje informativo.
</Alert>
```

---

## 📚 Documentación Completa

Para más detalles, consulta:
- **README_DESIGN_SYSTEM.md** - Resumen ejecutivo
- **DESIGN_SYSTEM_INTEGRATION.md** - Guía completa
- **COLOR_REFERENCE.md** - Referencia de colores
- **/colors** - Demo interactiva de colores
- **/components** - Demo interactiva de componentes

---

## ⚡ Tips Rápidos

1. **Importa desde el índice**
   ```tsx
   import { Button, Card, Badge } from '~/components/ui';
   ```

2. **Usa variantes de opacidad**
   ```tsx
   class="bg-primary/10"  // 10% opacidad
   class="text-error/50"  // 50% opacidad
   ```

3. **Combina componentes**
   ```tsx
   <Card>
     <Alert variant="info">...</Alert>
     <Button variant="primary">...</Button>
   </Card>
   ```

4. **El modo oscuro es automático**
   - Los colores se adaptan solos
   - No necesitas clases especiales

---

**¿Listo? ¡Empieza a construir! 🚀**
