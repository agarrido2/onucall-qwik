# 🔐 Guía de Autenticación en Qwik (Provider-Agnostic)

> **Patrones universales de autenticación en Qwik City con SSR**  
> Esta guía es agnóstica del proveedor. Aplica los mismos principios para Supabase, Firebase, Auth0, Clerk, etc.

---

## 📋 Tabla de Contenidos

- [Filosofía de Arquitectura](#filosofía-de-arquitectura)
- [Patrones de Qwik para Auth](#patrones-de-qwik-para-auth)
- [Arquitectura de Carpetas](#arquitectura-de-carpetas)
- [Comparativa de Providers](#comparativa-de-providers)
- [Flujos de Autenticación](#flujos-de-autenticación)
- [Protección de Rutas](#protección-de-rutas)
- [Validación y Seguridad](#validación-y-seguridad)
- [UX Patterns](#ux-patterns)
- [Implementaciones Disponibles](#implementaciones-disponibles)

---

## 🎯 Filosofía de Arquitectura

### Principios Fundamentales

Independientemente del provider que elijas (Supabase, Firebase, Auth0), el sistema de auth debe cumplir estos principios:

1. **SSR-First** 🖥️
   - Toda verificación de autenticación ocurre en el servidor
   - Las cookies se leen en `routeLoader$` (SSR)
   - El cliente solo muestra UI basándose en datos del servidor

2. **Single Source of Truth** 🎯
   - Un guard global (`useAuthGuard`) maneja todas las redirecciones
   - Evita lógica de auth duplicada en múltiples rutas
   - Estado de usuario centralizado en AuthContext

3. **Progressive Enhancement** 📈
   - La app funciona sin JavaScript habilitado
   - Los formularios usan `<form action={routeAction$}>` (HTML nativo)
   - El JavaScript solo mejora la UX (estados de loading, animaciones)

4. **Type-Safe End-to-End** 🔒
   - TypeScript para tipos de usuario, sesión, errores
   - Validación con Zod en el servidor (nunca confiar en cliente)
   - Contratos claros entre frontend y backend

5. **Facade Pattern** 🎭
   - API pública limpia (`lib/auth/`) que oculta complejidad interna
   - Implementación detallada en `features/auth/` (Feature-Sliced Design)
   - Fácil cambiar provider sin romper código existente

---

## 🔧 Patrones de Qwik para Auth

### 1. `routeLoader$` - Verificar Sesión en SSR

El patrón canónico para leer la sesión del usuario **antes** del renderizado:

```typescript
// src/routes/layout.tsx o src/routes/(app)/layout.tsx
import { routeLoader$ } from '@builder.io/qwik-city';
import { getUser } from '~/lib/[provider]/server'; // Abstracción del provider

export const useAuthGuard = routeLoader$(async ({ cookie, url, redirect }) => {
  // 1. Leer cookies de sesión
  const user = await getUser(cookie);
  
  // 2. Clasificar rutas
  const isPublicRoute = url.pathname === '/' || url.pathname.startsWith('/blog');
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/register');
  const isProtectedRoute = url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/profile');
  
  // 3. Lógica de redirección
  if (!user && isProtectedRoute) {
    throw redirect(302, `/login?redirect=${url.pathname}`);
  }
  
  if (user && isAuthRoute) {
    throw redirect(302, '/dashboard');
  }
  
  // 4. Retornar usuario para el contexto
  return { user };
});
```

**Ventajas**:
- ✅ Se ejecuta en **cada request** (SSR)
- ✅ Bloquea renderizado si necesita redirigir (302)
- ✅ Los datos se serializan con el HTML (no fetch adicional)

---

### 2. `routeAction$` - Mutaciones de Auth

El patrón para login, register, logout, etc.:

```typescript
// src/routes/(auth)/login/index.tsx
import { routeAction$, zod$ } from '@builder.io/qwik-city';
import { z } from 'zod';
import { signIn } from '~/lib/[provider]/server';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const useLoginAction = routeAction$(async (data, { cookie, redirect }) => {
  try {
    const { user, session } = await signIn(data.email, data.password);
    
    // Guardar sesión en cookie (específico del provider)
    cookie.set('session', session.token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    });
    
    throw redirect(302, '/dashboard');
  } catch (error) {
    return {
      success: false,
      error: 'Credenciales inválidas',
    };
  }
}, zod$(loginSchema));
```

**Ventajas**:
- ✅ Validación server-side con Zod
- ✅ CSRF protection automático (Qwik City)
- ✅ Progressive Enhancement (funciona sin JS)

---

### 3. Context API - Estado Global de Auth

Compartir el usuario autenticado en toda la app:

```typescript
// src/lib/auth/context.tsx
import { createContextId, useContextProvider, useContext } from '@builder.io/qwik';
import type { User } from '~/lib/types/user'; // Tipo agnóstico

export const AuthContext = createContextId<{ user: User | null }>('auth-context');

export const AuthProvider = component$<{ user: User | null }>(({ user, children }) => {
  const store = useStore({ user });
  
  useContextProvider(AuthContext, store);
  
  return <Slot />;
});

export const useAuth = () => {
  return useContext(AuthContext);
};
```

**Uso**:
```typescript
// En cualquier componente
const auth = useAuth();

if (auth.user) {
  return <p>Hola, {auth.user.email}</p>;
}
```

---

## 📁 Arquitectura de Carpetas (Universal)

Esta estructura aplica para **cualquier provider**. Solo cambia el contenido de `lib/[provider]/`:

```
src/
├── lib/
│   ├── auth/                       # 🎭 FACADE (API pública)
│   │   ├── index.ts                # Re-exporta todo lo público
│   │   └── context.tsx             # AuthContext y useAuth
│   │
│   ├── [provider]/                 # 🔧 IMPLEMENTACIÓN ESPECÍFICA
│   │   ├── client.ts               # Cliente del provider (browser + server)
│   │   └── server.ts               # Helpers SSR (getUser, signIn, signOut)
│   │
│   └── types/
│       └── user.ts                 # Tipo User agnóstico del provider
│
├── features/
│   └── auth/                       # 📦 FEATURES DETALLADAS
│       ├── components/
│       │   ├── LoginForm.tsx       # UI agnóstica (usa routeAction$)
│       │   ├── RegisterForm.tsx
│       │   └── OAuthButtons.tsx    # Botones de Google, GitHub, etc.
│       │
│       └── schemas/
│           └── auth.schemas.ts     # Validación Zod (universal)
│
└── routes/
    ├── layout.tsx                  # useAuthGuard global
    │
    ├── (auth)/                     # Rutas públicas de auth
    │   ├── login/
    │   ├── register/
    │   └── forgot-password/
    │
    ├── (app)/                      # Rutas protegidas
    │   ├── layout.tsx              # AuthProvider con user del guard
    │   ├── dashboard/
    │   └── profile/
    │
    └── api/
        └── auth/
            ├── oauth/              # Callback de OAuth
            └── callback/           # Callback de email verification
```

---

## 🗺️ Comparativa de Providers

| Feature | Supabase | Firebase | Auth0 | Clerk | Kinde |
|---------|----------|----------|-------|-------|-------|
| **Email/Password** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **OAuth (Google/GitHub)** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Magic Links** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **MFA/2FA** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Email Verification** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Password Reset** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Database Incluido** | ✅ Postgres | ❌ | ❌ | ❌ | ❌ |
| **Precio (Free Tier)** | 50k users | Spark: gratis | 7k users/mes | 10k users/mes | 10k users/mes |
| **Docs para Qwik** | [Ver](./PROVIDERS/SUPABASE.md) | [Ver](./PROVIDERS/FIREBASE.md) | 💭 | 💭 | 💭 |

### 🎯 Recomendación del Proyecto

**Este proyecto usa: Supabase** ✅

**Razones**:
- ✅ Integración nativa con PostgreSQL (usamos Drizzle ORM)
- ✅ Row Level Security (RLS) para seguridad a nivel de DB
- ✅ Storage incluido (para avatares, archivos)
- ✅ Realtime capabilities (si necesitamos en futuro)
- ✅ Self-hosting option (control total)
- ✅ Excelente DX y documentación

**Alternativas consideradas**:
- **Firebase**: Excelente si priorizas simplicidad y ecosistema Google
- **Auth0**: Mejor para B2B/Enterprise con SSO complejo
- **Clerk**: Mejor para SaaS B2C con onboarding pulido

---

## 🔄 Flujos de Autenticación

### 1. Login (Email + Password)

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuario → Form                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              POST /login (routeAction$)                      │
│                                                              │
│  1. Validar datos con Zod                                   │
│  2. Llamar a provider.signIn(email, password)              │
│  3. Guardar sesión en cookie (httpOnly)                    │
│  4. Redirigir a /dashboard (302)                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│            /dashboard (useAuthGuard)                         │
│                                                              │
│  1. Lee cookie de sesión                                    │
│  2. Verifica usuario con provider                           │
│  3. Renderiza dashboard con user                            │
└─────────────────────────────────────────────────────────────┘
```

### 2. OAuth (Google, GitHub, etc.)

```
┌─────────────────────────────────────────────────────────────┐
│         Usuario → Clic en "Login con Google"                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              GET /api/auth/oauth?provider=google             │
│                                                              │
│  1. Generar URL de OAuth del provider                       │
│  2. Redirigir al consent screen de Google (302)            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│           Usuario aprueba en Google                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         GET /api/auth/callback?code=...                      │
│                                                              │
│  1. Intercambiar code por tokens                            │
│  2. Crear/actualizar usuario en DB                          │
│  3. Guardar sesión en cookie                                │
│  4. Redirigir a /dashboard (302)                           │
└─────────────────────────────────────────────────────────────┘
```

### 3. Logout

```typescript
// src/routes/(app)/layout.tsx
export const useLogoutAction = routeAction$(async ({ cookie, redirect }) => {
  // 1. Invalidar sesión en provider (si aplica)
  await provider.signOut();
  
  // 2. Eliminar cookie
  cookie.delete('session', { path: '/' });
  
  // 3. Redirigir a home
  throw redirect(302, '/');
});
```

---

## 🛡️ Protección de Rutas

### Patrón Recomendado: Guard Global en Layout

```typescript
// src/routes/layout.tsx (layout raíz)
export const useAuthGuard = routeLoader$(async ({ cookie, url, redirect }) => {
  const user = await getUser(cookie);
  
  // Definir rutas (puedes mover a configuración)
  const publicRoutes = ['/', '/blog', '/pricing', '/about'];
  const authRoutes = ['/login', '/register', '/forgot-password'];
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  
  const isPublic = publicRoutes.some(route => url.pathname.startsWith(route));
  const isAuth = authRoutes.some(route => url.pathname.startsWith(route));
  const isProtected = protectedRoutes.some(route => url.pathname.startsWith(route));
  
  // Lógica de redirección
  if (!user && isProtected) {
    throw redirect(302, `/login?redirect=${url.pathname}`);
  }
  
  if (user && isAuth) {
    const redirectTo = url.searchParams.get('redirect') || '/dashboard';
    throw redirect(302, redirectTo);
  }
  
  return { user };
});
```

**Ventajas**:
- ✅ Un solo lugar para lógica de redirección
- ✅ SSR (no hay flash de contenido protegido)
- ✅ Fácil de testear y mantener

---

## 🔒 Validación y Seguridad

### Checklist Obligatorio

- ✅ **Validación server-side**: Siempre validar con Zod en `routeAction$`
- ✅ **CSRF protection**: Qwik City lo incluye por defecto
- ✅ **httpOnly cookies**: La sesión nunca debe ser accesible desde JS
- ✅ **Secure cookies**: `secure: true` en producción (HTTPS)
- ✅ **SameSite cookies**: `sameSite: 'lax'` para prevenir CSRF
- ✅ **Password hashing**: El provider debe manejar esto (nunca hasear manualmente)
- ✅ **Rate limiting**: Implementar en API routes (ej. max 5 login attempts/minuto)
- ✅ **Sanitización de inputs**: Zod + validación de strings (no XSS)

### Ejemplo de Schema Zod

```typescript
// src/features/auth/schemas/auth.schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido').trim().toLowerCase(),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido').trim().toLowerCase(),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .max(72, 'Máximo 72 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido').trim().toLowerCase(),
});
```

---

## 🎨 UX Patterns

### Estados de Loading

```typescript
export default component$(() => {
  const loginAction = useLoginAction();
  
  return (
    <form action={loginAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      
      <button 
        type="submit"
        disabled={loginAction.isRunning}
      >
        {loginAction.isRunning ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
      
      {loginAction.value?.error && (
        <p class="text-error" role="alert">{loginAction.value.error}</p>
      )}
    </form>
  );
});
```

### Redirección Post-Login

```typescript
// Guardar URL de origen antes de redirigir a login
const handleProtectedAction = $(() => {
  if (!auth.user) {
    nav(`/login?redirect=${location.pathname}`);
  }
});

// En el login action, leer el redirect
export const useLoginAction = routeAction$(async (data, { url, redirect }) => {
  // ... lógica de login ...
  
  const redirectTo = url.searchParams.get('redirect') || '/dashboard';
  throw redirect(302, redirectTo);
});
```

### Feedback Visual

- ✅ **Loading states**: Spinner o skeleton en buttons
- ✅ **Error messages**: Rol `alert` para screen readers
- ✅ **Success states**: Toast notifications (ej. "Login exitoso")
- ✅ **Validation**: Mostrar errores de Zod en tiempo real (opcional, mejora progresiva)

---

## 📚 Implementaciones Disponibles

Selecciona tu provider para ver la guía de implementación completa:

### ✅ Implementaciones Completas

- **[Supabase](./PROVIDERS/SUPABASE.md)** - ✅ **Implementado en este proyecto**
  - Email/Password ✅
  - OAuth (Google) ✅
  - OAuth (GitHub) ⏸️ Futuro
  - Email Verification ⏸️ Pendiente
  - Password Reset ⏸️ Pendiente

### 📅 Implementaciones Planificadas

- **[Firebase](./PROVIDERS/FIREBASE.md)** - 📅 Planificado para futuro
- **[Auth0](./PROVIDERS/AUTH0.md)** - 💭 Considerado
- **[Clerk](./PROVIDERS/CLERK.md)** - 💭 Considerado

---

## 🔗 Referencias

- [CITE: QUALITY_STANDARDS.md - Pilar "Seguro"]
- [CITE: ANEXO_QWIK.md - routeLoader$, routeAction$]
- [CITE: ARQUITECTURA_FOLDER.md - Estructura de carpetas]
- [Qwik City - Route Loaders](https://qwik.builder.io/docs/route-loader/)
- [Qwik City - Actions](https://qwik.builder.io/docs/action/)
- [OWASP - Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Última actualización**: 15 de noviembre de 2025
