# Bun Setup - Qwik OnuCall

Este proyecto utiliza **Bun** como package manager y runtime para un desarrollo más rápido y eficiente.

## ¿Por qué Bun?

- **⚡ Velocidad**: Bun es significativamente más rápido que npm/pnpm para instalar dependencias
- **🔧 Todo en uno**: Runtime, package manager, bundler y test runner integrados
- **🎯 Compatibilidad**: 100% compatible con el ecosistema Node.js
- **📦 Optimización**: Mejor gestión de memoria y paralelización

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
bun qwik add
```

## Migración desde pnpm

Si vienes de pnpm, estos son los cambios principales:

| pnpm | Bun |
|------|-----|
| `pnpm install` | `bun install` |
| `pnpm run dev` | `bun run dev` |
| `pnpm build` | `bun run build` |
| `pnpm qwik add` | `bun qwik add` |

## Archivos de Lock

- **Usado**: `bun.lock` (binario, optimizado)
- **Ignorado**: `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`

## Instalación de Bun

Si no tienes Bun instalado:

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verificar instalación
bun --version
```

## Scripts Adicionales

Todos los scripts de package.json funcionan con bun:

```bash
bun start          # Desarrollo con auto-open browser
bun run build      # Build completo de producción
bun run preview    # Preview del build con servidor local
```

## Rendimiento

Bun típicamente ofrece:
- **2-3x más rápido** en instalación de dependencias
- **Menor uso de memoria** durante el desarrollo
- **Startup más rápido** del servidor de desarrollo

---

🚀 **¡Disfruta del desarrollo súper rápido con Bun!**