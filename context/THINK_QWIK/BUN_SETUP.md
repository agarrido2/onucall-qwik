# Bun Setup - Qwik

Este proyecto utiliza **Bun** como gestor de paquetes y runtime para un desarrollo más rápido y eficiente.

## ¿Por qué Bun?

* **⚡ Velocidad**: Bun es significativamente más rápido que npm/pnpm para instalar dependencias.
* **🔧 Todo en uno**: Runtime, gestor de paquetes, bundler y test runner integrados.
* **🎯 Compatibilidad**: 100% compatible con el ecosistema Node.js.
* **📦 Optimización**: Mejor gestión de memoria y paralelización.

## Comandos Principales

### Desarrollo
```bash
# Instalar dependencias
bun install

# Servidor de desarrollo
bun run dev

# Servidor con debug
bun run dev.debug
```

### Build y Producción
```bash
# Build de producción
bun run build

# Preview del build
bun run preview

# Verificación de tipos
bun run build.types
```

### Herramientas
```bash
# Formateo de código
bun run fmt

# Verificar formato
bun run fmt.check

# Linting
bun run lint

# Agregar integraciones Qwik
bun run qwik add
```

## Migración desde pnpm

Si vienes de pnpm, esta es la traducción de los comandos más comunes.

| Tarea | pnpm | Bun |
| :--- | :--- | :--- |
| **Instalar Dependencias** | `pnpm install` | `bun install` |
| **Añadir Paquete** | `pnpm add [pkg]` | `bun add [pkg]` |
| **Añadir Paquete (Dev)** | `pnpm add -D [pkg]` | `bun add -d [pkg]` |
| **Borrar Paquete** | `pnpm remove [pkg]` | `bun remove [pkg]` |
| **Correr Script** | `pnpm run [script]` | `bun run [script]` |
| **Integración Qwik** | `pnpm qwik add` | `bun run qwik add` |
| **Correr Tests** | `pnpm test` | `bun test` |

## Archivos de Lock

* **Usado**: `bun.lockb` (binario, optimizado)
* **Ignorado**: `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`

## Instalación de Bun

Si no tienes Bun instalado:

```bash
# macOS/Linux
curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verificar instalación
bun --version
```

## Scripts Adicionales

Todos los scripts de `package.json` funcionan con `bun run`:

```bash
bun run start      # Desarrollo con auto-open browser
bun run build      # Build completo de producción
bun run preview    # Preview del build con servidor local
```

## Rendimiento

Bun típicamente ofrece:
* **2-3x más rápido** en instalación de dependencias.
* **Menor uso de memoria** durante el desarrollo.
* **Startup más rápido** del servidor de desarrollo.

---

## Scripts del Proyecto

### Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo (con hot-reload)
bun run dev
# Servidor disponible en: http://localhost:5174/

# Build de producción (optimizado)
bun run build

# Preview del build de producción (local)
bun run preview

# Verificar tipos de TypeScript
bun run qwik type-check
```

### Scripts Útiles de Bun

```bash
# Agregar nueva dependencia
bun add [nombre-paquete]

# Agregar dependencia de desarrollo
bun add -D [nombre-paquete]

# Actualizar dependencias
bun update

# Eliminar dependencia
bun remove [nombre-paquete]

# Limpiar node_modules y reinstalar
rm -rf node_modules && bun install
```

---

## Variables de Entorno

### Configuración Actual

Actualmente el proyecto **no requiere variables de entorno** para desarrollo local básico.

### Configuración Futura (Roadmap)

Cuando se implemente el sistema de autenticación con Supabase, será necesario crear un archivo `.env.local` en la raíz del proyecto:

```env
# .env.local (NO COMITEAR - ya está en .gitignore)

# Supabase Configuration (Pendiente de implementación)
# PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
# PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Las variables con prefijo PUBLIC_ están disponibles en el cliente
# Las variables sin prefijo solo están disponibles en el servidor
```

### Buenas Prácticas

- ✅ **Nunca** comitear archivos `.env.local` (ya incluido en `.gitignore`)
- ✅ Usar prefijo `PUBLIC_` solo para variables que el cliente puede ver
- ✅ Mantener secrets del servidor (API keys privadas) **sin** prefijo `PUBLIC_`
- ✅ Documentar variables requeridas en el README cuando se agreguen

### Verificación de Variables

Qwik City valida automáticamente las variables de entorno en tiempo de build. Si falta una variable requerida con prefijo `PUBLIC_`, el build fallará con un error claro.

**Ejemplo de uso en código:**

```typescript
// Variables públicas (accesibles en cliente y servidor)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

// Variables privadas (solo servidor, ej. en routeLoader$ o server$)
const secretKey = import.meta.env.SECRET_API_KEY;
```

[CITE: QUALITY_STANDARDS.md - Seguridad: No exponer secrets en código frontend]

---

🚀 **¡Disfruta del desarrollo súper rápido con Bun!**