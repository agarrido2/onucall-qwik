# 📁 Documentación de Autenticación Multi-Provider

Esta carpeta contiene la documentación del sistema de autenticación de OnuCall, diseñada para soportar múltiples providers sin duplicación de código ni conocimiento.

---

## 🏗️ Arquitectura de Documentación

```
AUTH/
├── GUIDE_AUTH_QWIK.md          # 🌟 GUÍA CANÓNICA (Provider-Agnostic)
├── OAUTH_SETUP.md              # 📘 Configuración de OAuth (Universal)
├── PROVIDERS/                  # 🔧 Implementaciones Específicas
│   ├── SUPABASE.md            # ✅ Implementado
│   ├── FIREBASE.md            # 📅 Planificado
│   ├── AUTH0.md               # 💭 Considerado
│   └── CLERK.md               # 💭 Considerado
└── README.md                   # 📄 Este archivo
```

---

## 📖 Orden de Lectura Recomendado

### 1️⃣ Primero: Patrones Universales
**Lee: [`GUIDE_AUTH_QWIK.md`](./GUIDE_AUTH_QWIK.md)**

Contiene:
- ✅ Patrones de Qwik para auth (`routeLoader$`, `routeAction$`, Context API)
- ✅ Arquitectura de carpetas (universal para cualquier provider)
- ✅ Flujos de autenticación (login, register, OAuth, logout)
- ✅ Validación con Zod
- ✅ Seguridad (cookies, CSRF, XSS)
- ✅ UX patterns (loading states, errores, redirects)
- ✅ Comparativa de providers

**Este documento es agnóstico del provider. Los conceptos aplican a Supabase, Firebase, Auth0, etc.**

---

### 2️⃣ Segundo: Implementación Específica
**Lee: [`PROVIDERS/SUPABASE.md`](./PROVIDERS/SUPABASE.md)** (o el provider que elijas)

Contiene:
- ✅ Setup específico del provider (Dashboard, API keys, SDKs)
- ✅ Configuración de [`src/lib/[provider]/`](../../src/lib)
- ✅ Triggers SQL, RLS policies (si aplica)
- ✅ OAuth configuration específica
- ✅ Troubleshooting del provider
- ✅ Estado de implementación en este proyecto

**Este documento es específico de Supabase. Solo consulta el provider que estés usando.**

---

### 3️⃣ Tercero: OAuth Configuration (Si usas Google/GitHub/etc.)
**Lee: [`OAUTH_SETUP.md`](./OAUTH_SETUP.md)**

Contiene:
- ✅ Crear credenciales en Google Cloud Console
- ✅ Crear credenciales en GitHub OAuth Apps
- ✅ Configurar callbacks en el provider
- ✅ Troubleshooting de OAuth (redirect_uri mismatch, etc.)

**Este documento es universal. Aplica a cualquier provider que soporte OAuth.**

---

## 🎯 Filosofía: Separación de Conceptos

### ¿Por qué esta arquitectura?

**Problema Anterior:**
```
GUIDE_AUTH_SUPA_QWIK.md (1689 líneas)
├── Patrones de Qwik (universales)
├── Setup de Supabase (específico)
├── OAuth setup (universal)
└── Troubleshooting (específico)

❌ Mezcla patrones universales con detalles específicos
❌ Dificulta añadir Firebase sin duplicar patrones
❌ No es escalable para múltiples providers
```

**Solución Actual:**
```
GUIDE_AUTH_QWIK.md (patrones universales)
PROVIDERS/SUPABASE.md (solo detalles de Supabase)
PROVIDERS/FIREBASE.md (solo detalles de Firebase)

✅ Patrones de Qwik en UN solo lugar
✅ Añadir provider = crear 1 archivo en PROVIDERS/
✅ Escalable sin duplicación
```

---

## 🔧 Implementaciones Disponibles

### ✅ Completas (Listas para Usar)

| Provider | Estado | Archivo | Features | Pricing |
|----------|--------|---------|----------|---------|
| **Supabase** | ✅ Implementado | [`SUPABASE.md`](./PROVIDERS/SUPABASE.md) | Email/Password, OAuth (Google) | Free: 50k users |

### 📅 Planificadas (Futuro)

| Provider | Estado | Archivo | Features | Pricing |
|----------|--------|---------|----------|---------|
| **Firebase** | 📅 Planificado | [`FIREBASE.md`](./PROVIDERS/FIREBASE.md) | Email/Password, OAuth, Phone | Free: ilimitado |

### 💭 Consideradas (Si se necesitan)

| Provider | Estado | Archivo | Cuándo Usar |
|----------|--------|---------|-------------|
| **Auth0** | 💭 Considerado | [`AUTH0.md`](./PROVIDERS/AUTH0.md) | B2B, SSO, Enterprise |
| **Clerk** | 💭 Considerado | [`CLERK.md`](./PROVIDERS/CLERK.md) | SaaS B2C, UX premium |

---

## 🚀 Añadir un Nuevo Provider

Si quieres añadir un provider (ej. WorkOS, Kinde, FusionAuth):

### Paso 1: Decidir si es Necesario
Consulta la tabla comparativa en [`GUIDE_AUTH_QWIK.md`](./GUIDE_AUTH_QWIK.md) y evalúa:
- ✅ ¿Resuelve un caso de uso que Supabase no cubre?
- ✅ ¿El pricing tiene sentido para el proyecto?
- ✅ ¿Es mantenible a largo plazo?

### Paso 2: Crear el Archivo del Provider
```bash
cp PROVIDERS/FIREBASE.md PROVIDERS/TU_PROVIDER.md
```

Actualiza:
- ✅ Título y prerequisito
- ✅ Estado de implementación
- ✅ Roadmap específico
- ✅ Setup steps (API keys, SDKs, etc.)
- ✅ Comparativa con otros providers

### Paso 3: Implementar en Código
```
src/lib/tu_provider/
├── client.ts       # Cliente del provider
└── server.ts       # Helpers SSR
```

**Importante**: La estructura de [`src/features/auth/`](../../src/features/auth) NO cambia. Solo cambia [`src/lib/[provider]/`](../../src/lib).

### Paso 4: Documentar en GUIDE_AUTH_QWIK.md
Añade el provider a la tabla comparativa.

### Paso 5: Actualizar AGENTS.md
Añade el nuevo archivo a la lista de Capa 1 (si es implementación completa).

---

## 🎓 Aplicar esta Técnica a Otras Features

Esta arquitectura de **Patrón Universal + Implementaciones Específicas** debe aplicarse a:

### ✅ Ya Implementado
- **Autenticación** → `AUTH/GUIDE_AUTH_QWIK.md` + `PROVIDERS/`

### 🔜 Próximas Features que Requieren Multi-Provider

1. **Pagos (Payments)**
   ```
   PAYMENTS/
   ├── GUIDE_PAYMENTS_QWIK.md      # Patrones de Stripe, webhooks, subscriptions
   ├── PROVIDERS/
   │   ├── STRIPE.md               # Implementación con Stripe
   │   ├── PADDLE.md               # Alternativa europea
   │   └── LEMONSQUEEZY.md         # Alternativa MOR simplificada
   ```

2. **Email (Transaccional)**
   ```
   EMAIL/
   ├── GUIDE_EMAIL_QWIK.md         # Patrones de templates, SMTP, tracking
   ├── PROVIDERS/
   │   ├── RESEND.md               # Implementación con Resend
   │   ├── SENDGRID.md             # Alternativa enterprise
   │   └── POSTMARK.md             # Alternativa especializada
   ```

3. **Storage (Archivos)**
   ```
   STORAGE/
   ├── GUIDE_STORAGE_QWIK.md       # Patrones de upload, CDN, signed URLs
   ├── PROVIDERS/
   │   ├── SUPABASE_STORAGE.md     # Implementación con Supabase Storage
   │   ├── CLOUDFLARE_R2.md        # Alternativa S3-compatible
   │   └── AWS_S3.md               # Alternativa enterprise
   ```

4. **Analytics**
   ```
   ANALYTICS/
   ├── GUIDE_ANALYTICS_QWIK.md     # Patrones de tracking, eventos, funnels
   ├── PROVIDERS/
   │   ├── PLAUSIBLE.md            # Implementación privacy-first
   │   ├── POSTHOG.md              # Alternativa open source
   │   └── MIXPANEL.md             # Alternativa product analytics
   ```

---

## ✅ Checklist para Multi-Provider

Cuando documentes una feature con múltiples providers:

- [ ] Crear guía canónica agnóstica (`GUIDE_[FEATURE]_QWIK.md`)
- [ ] Separar patrones universales de detalles específicos
- [ ] Crear carpeta `PROVIDERS/` con implementaciones
- [ ] Cada provider tiene su propio archivo markdown
- [ ] Tabla comparativa en la guía canónica
- [ ] Enlaces cruzados entre documentos
- [ ] README.md explicando la arquitectura
- [ ] Actualizar AGENTS.md con nuevos archivos

---

## 🔗 Referencias

- [CITE: AGENTS.md - Protocolo de Consulta y Capas]
- [CITE: ARQUITECTURA_FOLDER.md - Estructura de carpetas]
- [CITE: QUALITY_STANDARDS.md - DRY principle]

---

**Última actualización**: 15 de noviembre de 2025
