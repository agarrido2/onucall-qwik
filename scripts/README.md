# 📜 Scripts Disponibles - OnuCall

Guía completa de todos los scripts npm/bun disponibles en el proyecto.

## 🎯 Scripts por Categoría

### 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
bun run dev

# Iniciar con auto-open en navegador
bun run start

# Modo debug con inspector
bun run dev.debug
```

### 🏗️ Build y Deploy

```bash
# Build completo para producción
bun run build

# Build solo del cliente
bun run build.client

# Build preview (SSR)
bun run build.preview

# Preview del build
bun run preview
```

### 🔍 Validación de Código

#### Type Checking

```bash
# Validar TypeScript (sin emitir archivos)
bun run build.types

# Type checking continuo (watch mode)
bun run types:watch
```

#### Linting y Formato

```bash
# Ejecutar ESLint
bun run lint

# Formatear código con Prettier
bun run fmt

# Verificar formato sin modificar
bun run fmt.check
```

#### Validación Completa

```bash
# Ejecutar TODAS las validaciones
# (lint + formato + types + tests)
bun run check:all
```

**Uso recomendado**: Ejecutar antes de commits importantes o antes de merge a `main`.

---

### 🧪 Tests

#### Tests de Configuración

```bash
# Validar variables de entorno
bun run test:env

# Validar compilación TypeScript
bun run test:build
```

#### Tests de Conexión

```bash
# Test completo de Supabase
bun run test:supabase

# Ejecutar todos los tests de conexión
bun run test:connections
```

#### Suite Completa

```bash
# Ejecutar TODOS los tests
bun run test:all
```

**Ver documentación completa**: [`scripts/tests/README.md`](./tests/README.md)

---

### 📦 Gestión de Dependencias

#### Información

```bash
# Ver dependencias desactualizadas
bun run deps:outdated

# Ver árbol completo de dependencias
bun run deps:tree
```

#### Actualizaciones

```bash
# Actualizar dependencias (versiones compatibles)
bun run deps:update

# Actualizar a últimas versiones (breaking changes)
bun update --latest
```

**⚠️ Nota**: Siempre ejecutar `bun run test:all` después de actualizar dependencias.

---

### 🔒 Seguridad

```bash
# Auditoría de vulnerabilidades
bun run audit
```

**Salida esperada**:

- ✅ Sin vulnerabilidades: Exit code 0
- ⚠️ Vulnerabilidades detectadas: Exit code 1 + reporte detallado

**Acción recomendada**: Si detecta vulnerabilidades, ejecutar `bun run deps:update`.

---

### 🧹 Mantenimiento

#### Limpieza de Caché

```bash
# Limpiar caché de Bun
bun run cache:clear
```

**Usar cuando**:

- Problemas de instalación de dependencias
- Comportamiento inesperado después de cambios en `package.json`
- Debug de issues relacionados con lockfile

#### Limpieza Completa

```bash
# Limpieza profunda + reinstalación
bun run clean
```

**⚠️ Advertencia**: Esto elimina:

- `node_modules/`
- `.qwik/` (caché de Qwik)
- `tmp/` (archivos temporales)
- `dist/` (builds)

Luego reinstala todas las dependencias con `bun install`.

---

## 🎓 Workflows Recomendados

### Workflow Diario (Desarrollo)

```bash
# 1. Iniciar desarrollo
bun run dev

# 2. Antes de commit (validación rápida)
bun run lint
bun run fmt

# 3. Commit con VS Code Source Control
```

### Workflow Pre-Deploy

```bash
# Validación completa antes de push a producción
bun run check:all

# Si pasa, estás listo para deploy
```

### Workflow Semanal (Mantenimiento)

```bash
# 1. Ver qué está desactualizado
bun run deps:outdated

# 2. Auditar seguridad
bun run audit

# 3. Si hay actualizaciones críticas
bun run deps:update
bun run test:all

# 4. Commit cambios de dependencias
```

### Workflow Debug

```bash
# 1. Problema con dependencias
bun run cache:clear
bun install

# 2. Problema persistente
bun run clean

# 3. Verificar configuración
bun run test:env
```

---

## 📊 Matriz de Comandos

| Comando         | Tiempo Aprox | Cuándo Usar                    | Frecuencia         |
| --------------- | ------------ | ------------------------------ | ------------------ |
| `dev`           | -            | Desarrollo activo              | Siempre            |
| `lint`          | ~2s          | Pre-commit                     | Cada commit        |
| `fmt`           | ~1s          | Formatear código               | Según necesidad    |
| `fmt.check`     | ~1s          | CI/CD                          | Automático         |
| `build.types`   | ~3s          | Validar tipos                  | Pre-push           |
| `types:watch`   | -            | Desarrollo con tipos estrictos | Opcional           |
| `test:all`      | ~5s          | Pre-deploy                     | Antes de deploy    |
| `test:env`      | <1s          | Debug config                   | Onboarding / Debug |
| `test:supabase` | ~2s          | Debug Supabase                 | Cuando hay issues  |
| `check:all`     | ~10s         | Pre-merge a main               | Antes de merge     |
| `deps:outdated` | <1s          | Revisar actualizaciones        | Semanal            |
| `deps:update`   | ~10s         | Actualizar deps                | Mensual            |
| `audit`         | ~2s          | Verificar seguridad            | Semanal            |
| `cache:clear`   | <1s          | Debug instalación              | Raramente          |
| `clean`         | ~15s         | Reset completo                 | Solo si necesario  |

---

## 🔗 Referencias

- **Tests**: [`scripts/tests/README.md`](./tests/README.md)
- **Qwik Docs**: https://qwik.dev
- **Bun Docs**: https://bun.sh/docs
- **Calidad de Código**: [`context/THINK_QWIK/QUALITY_STANDARDS.md`](../context/THINK_QWIK/QUALITY_STANDARDS.md)

---

**Última actualización**: 15 de noviembre de 2025  
**Mantenedor**: Scripts de utilidad para desarrollo y mantenimiento de OnuCall
