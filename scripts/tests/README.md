# 🧪 Sistema de Tests y Verificaciones

Sistema modular de tests para validar configuración, conexiones y servicios del proyecto OnuCall.

## 📁 Estructura

```
scripts/tests/
├── README.md                    # Esta guía
├── connections/                 # Tests de conexión a servicios externos
│   ├── test-supabase.ts        # ✅ Supabase (auth + database + storage)
│   ├── test-firebase.ts        # 📅 Firebase (futuro)
│   └── test-custom-db.ts       # 📅 PostgreSQL directo (futuro)
├── config/                      # Validación de configuración
│   ├── test-env.ts             # Variables de entorno requeridas
│   └── test-build.ts           # Validar compilación sin errores
└── integrations/                # Tests de integraciones
    ├── test-retell-ai.ts       # 📅 Retell AI API (futuro)
    └── test-zadarma.ts         # 📅 Zadarma VoIP (futuro)
```

## 🎯 Filosofía de Testing

### Principios
1. **Multi-Provider Ready**: Cada test es específico a su provider
2. **Fail-Fast**: Detectar problemas antes de deployment
3. **Diagnostic-First**: Mensajes claros con soluciones sugeridas
4. **Environment-Aware**: Distingue entre dev, staging, production

### Cuándo Ejecutar Tests

#### Pre-Deployment (Obligatorio)
```bash
bun run test:all              # Todos los tests críticos
bun run test:connections      # Solo conexiones
```

#### Durante Desarrollo (Recomendado)
```bash
bun run test:supabase         # Validar Supabase
bun run test:env              # Validar .env
```

#### Debug de Problemas
```bash
bun run test:supabase --verbose    # Detalles completos
```

## 📋 Tests Disponibles

### 🟢 Implementados

#### `test-supabase.ts`
Valida conexión completa a Supabase:
- ✅ Variables de entorno (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- ✅ Conexión API exitosa
- ✅ Permisos de autenticación (auth.signInAnonymously)
- ✅ Permisos de base de datos (query a tabla pública)
- ✅ Storage configurado (bucket público existe)

**Uso**:
```bash
bun scripts/tests/connections/test-supabase.ts
```

#### `test-env.ts`
Valida que todas las variables de entorno críticas existen:
- ✅ Supabase (URL, Keys)
- ✅ OAuth (Google Client ID/Secret)
- ✅ Variables futuras (Firebase, Retell AI, etc.)

**Uso**:
```bash
bun scripts/tests/config/test-env.ts
```

#### `test-build.ts`
Valida que el proyecto compila sin errores TypeScript.

**Uso**:
```bash
bun scripts/tests/config/test-build.ts
```

### 🟡 Planificados

#### `test-firebase.ts` (Firebase)
```typescript
// Validará:
- Firebase Config object válido
- Conexión a Firestore
- Authentication providers configurados
```

#### `test-custom-db.ts` (PostgreSQL Directo)
```typescript
// Validará:
- DATABASE_URL formato correcto
- Conexión TCP exitosa
- Permisos CREATE/READ/UPDATE/DELETE
```

#### `test-retell-ai.ts` (Retell AI API)
```typescript
// Validará:
- API Key válida
- Rate limits configurados
- Agent IDs configurados
```

## 🔧 Integración con package.json

Añade estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "test:all": "bun scripts/tests/run-all.ts",
    "test:connections": "bun scripts/tests/run-connections.ts",
    "test:supabase": "bun scripts/tests/connections/test-supabase.ts",
    "test:env": "bun scripts/tests/config/test-env.ts",
    "test:build": "bun scripts/tests/config/test-build.ts"
  }
}
```

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test:env
      - run: bun run test:build
      - run: bun run test:supabase
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

## 📊 Estado de Implementación

| Test | Estado | Provider | Prioridad |
|------|--------|----------|-----------|
| test-supabase.ts | ✅ Implementado | Supabase | Alta |
| test-env.ts | ✅ Implementado | N/A | Alta |
| test-build.ts | ✅ Implementado | N/A | Alta |
| test-firebase.ts | 📅 Planificado | Firebase | Media |
| test-custom-db.ts | 📅 Planificado | PostgreSQL | Baja |
| test-retell-ai.ts | 📅 Planificado | Retell AI | Media |
| test-zadarma.ts | 📅 Planificado | Zadarma | Media |

## 🎓 Cómo Añadir un Nuevo Test

### Paso 1: Crear archivo en carpeta apropiada
```bash
touch scripts/tests/connections/test-[provider].ts
```

### Paso 2: Seguir estructura estándar
```typescript
/**
 * Test: [Provider] Connection
 * Validates: [qué valida]
 */

async function test[Provider]Connection() {
  console.log("🔍 Testing [Provider] connection...\n");
  
  // 1. Validar variables de entorno
  // 2. Intentar conexión
  // 3. Validar permisos/features
  // 4. Reportar resultado
  
  console.log("✅ [Provider] connection OK");
}

test[Provider]Connection().catch(error => {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
});
```

### Paso 3: Añadir script a package.json
```json
"test:[provider]": "bun scripts/tests/connections/test-[provider].ts"
```

### Paso 4: Actualizar `run-all.ts` y `run-connections.ts`

## 🔗 Referencias

- [AUTH/README.md](../../context/THINK_QWIK/AUTH/README.md) - Arquitectura multi-provider
- [QUALITY_STANDARDS.md](../../context/THINK_QWIK/QUALITY_STANDARDS.md) - Estándares de calidad

---

**Última actualización**: 15 de noviembre de 2025  
**Mantenedor**: Sistema de tests modular para OnuCall
