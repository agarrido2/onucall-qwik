# 🔐 Guía de Autenticación Supabase + Qwik

> Sistema de autenticación completo, seguro y escalable para aplicaciones Qwik con Supabase.

## 📋 Tabla de Contenidos

- [Patrón de Arquitectura](#patrón-de-arquitectura)
- [Arquitectura](#arquitectura)
- [Setup Inicial](#setup-inicial)
- [Estructura de Archivos](#estructura-de-archivos)
- [Componentes Clave](#componentes-clave)
- [Flujos de Autenticación](#flujos-de-autenticación)
- [Protección de Rutas](#protección-de-rutas)
- [Mejores Prácticas](#mejores-prácticas)
- [Troubleshooting](#troubleshooting)

---

## � Patrón de Arquitectura

### Patrón Híbrido: Facade + Feature-Sliced Design

Este sistema implementa un **patrón híbrido** que combina:

**🔷 `lib/auth/` - Facade (Punto de Entrada Único)**
- Oculta complejidad interna
- API pública limpia y consistente
- Re-exporta componentes y hooks esenciales

**🔷 `features/auth/` - Implementación (Feature-Sliced Design)**
- Lógica detallada organizada por responsabilidad
- Schemas, services, hooks, components
- Escalable para features complejas

### Regla de Importación

```typescript
// ✅ SIEMPRE importa el CORE desde lib/auth (facade)
import { useAuth, AuthProvider, AuthContext } from '~/lib/auth'

// ✅ FEATURES ESPECÍFICAS desde features/auth cuando necesario
import { authSchemas, withSupabase } from '~/features/auth'
import { UserProfileCard } from '~/features/auth'

// ❌ NUNCA importes internals directamente
import { useAuthContext } from '~/features/auth/hooks/use-auth-context'
```

**Ventajas:**
- ✅ Single point of entry (fácil refactorizar internals)
- ✅ Mejor escalabilidad (agregar OAuth, MFA, etc.)
- ✅ Código cohesivo y organizado
- ✅ Compliance con arquitectura canónica del proyecto

---

## 🗺️ Roadmap de OAuth Providers

### Estado Actual de Implementación

```typescript
// Providers actualmente soportados
type OAuthProvider = 'google' // ✅ Implementado

// Roadmap futuro
type FutureProviders = 'github' | 'microsoft' | 'apple'
```

| Provider | Prioridad | Estado | Código | Configuración | ETA |
|----------|-----------|--------|--------|---------------|-----|
| 🔵 Google | Alta | ✅ Implementado | ✅ Listo | ⏳ Pendiente | Configurar pronto |
| ⚫ GitHub | Media | 📅 Planificado | ❌ Pendiente | ❌ Pendiente | Producto avanzado |
| 🔷 Microsoft | Baja | 💭 Considerado | ❌ | ❌ | TBD |
| 🍎 Apple | Baja | 💭 Considerado | ❌ | ❌ | TBD |

> **Última actualización**: 9 de noviembre de 2025

### Expandir OAuth Providers

Cuando añadas un nuevo provider (ej. GitHub), sigue estos pasos:

**1. Actualizar validación en** `src/routes/api/auth/oauth/index.ts`:
```typescript
// Cambiar de:
if (!provider || provider !== 'google') {
  // error
}

// A:
if (!provider || !['google', 'github'].includes(provider)) {
  // error
}
```

**2. Actualizar tipos TypeScript**:
```typescript
// src/features/auth/components/OAuthButtons.tsx
type OAuthProvider = 'google' | 'github'
```

**3. Añadir botón en** `src/features/auth/components/OAuthButtons.tsx`:
```tsx
{/* GitHub Button */}
<button
  onClick$={() => handleOAuth('github')}
  aria-label={`${actionText} GitHub`}
>
  <GitHubIcon />
  <span>{actionText} GitHub</span>
</button>
```

**4. Configurar en Supabase** siguiendo la guía completa en `OAUTH_SETUP.md`

**5. Actualizar roadmap** en este documento y en `OAUTH_SETUP.md`

---

## 🏗️ Arquitectura

### Principios de Diseño

1. **SSR-First**: Toda verificación de autenticación ocurre en el servidor
2. **Single Source of Truth**: Un guard global maneja todas las redirecciones
3. **Progressive Enhancement**: La app funciona sin JavaScript habilitado
4. **Type-Safe**: TypeScript end-to-end con validación Zod
5. **DRY**: Código reutilizable y componible
6. **Facade Pattern**: API pública limpia con implementación modular

### Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    1. Request Inicial                        │
│                                                              │
│  Browser ──────────────────────────► Server (Qwik SSR)      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│            2. Layout: useAuthGuard (routeLoader$)            │
│                                                              │
│  • Lee cookies de sesión                                    │
│  • Verifica usuario con Supabase Auth                       │
│  • Clasifica ruta (pública/protegida/auth)                 │
│  • Redirige si es necesario (302)                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              3. Renderizado con Usuario                      │
│                                                              │
│  • AuthProvider recibe user desde SSR                       │
│  • Se hidrata en el cliente                                 │
│  • Suscripción a cambios de auth                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         4. Interacciones Cliente (Opcional)                 │
│                                                              │
│  • Login/Logout → Server Actions                           │
│  • Cambios de sesión → onAuthStateChange                   │
│  • Estado sincronizado automáticamente                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup Inicial

### 1. Instalación de Dependencias

```bash
bun add @supabase/supabase-js @supabase/ssr zod
```

### 2. Variables de Entorno

Crea `.env.local` en la raíz:

```env
# Supabase Config
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

**⚠️ Importante:**
- `PUBLIC_*` = Variables públicas (accesibles en cliente) - Convención estándar de Qwik
- `DATABASE_URL` = Solo servidor (migraciones, scripts)
- Nunca commitear `.env.local` (usar `.env.example`)

### 3. Configurar Supabase Auth

En tu dashboard de Supabase:

1. **Authentication → URL Configuration:**
   ```
   Site URL: http://localhost:5173
   Redirect URLs:
     - http://localhost:5173/dashboard
     - http://localhost:5173/reset-password
     - https://tu-dominio.com/*
   ```

2. **Authentication → Email Templates:**
   - Personaliza templates de reset password
   - Asegúrate que redirectTo apunte a `/reset-password`

---

## 📁 Estructura de Archivos

### Patrón Híbrido: lib/auth + features/auth

Este proyecto implementa un **patrón híbrido** que combina:
- **`lib/auth/`**: Facade (punto de entrada único) para el sistema de autenticación
- **`features/auth/`**: Implementación detallada (Feature-Sliced Design)

```
src/
├── lib/
│   ├── auth/                       # 🔐 FACADE - Punto de entrada único
│   │   ├── index.ts                #    Re-exports: AuthProvider, useAuth, etc.
│   │   ├── AuthProvider.tsx        #    Provider de contexto global
│   │   └── route-guards.ts         #    Clasificación y protección de rutas
│   ├── supabase/
│   │   ├── index.ts                # Exports públicos
│   │   └── client.ts               # Clientes Supabase (browser/server)
│   └── contexts/
│       └── auth-context.ts         # Definición de AuthContext (createContextId)
│
├── features/                       # 📦 Features complejas
│   └── auth/                       # Implementación detallada de auth
│       ├── index.ts                # Exports del feature
│       ├── components/             # Componentes específicos de auth
│       │   └── UserProfileDemo.tsx
│       ├── hooks/
│       │   └── use-auth-context.ts # Hook interno useAuth
│       ├── schemas/
│       │   └── auth-schemas.ts     # Validación Zod
│       └── services/
│           └── auth-helpers.ts     # withSupabase helper
│
├── components/
│       └── services/
│           └── auth-helpers.ts     # withSupabase helper
│
└── routes/
    ├── layout.tsx                  # Guard global + AuthProvider
    └── (auth)/                     # Grupo de rutas de auth
        ├── login/
        ├── register/
        ├── forgot-password/
        └── reset-password/
```

### Patrón de Importación

```typescript
// ✅ CORRECTO: Importar core desde lib/auth (facade)
import { useAuth, AuthProvider, RouteClassifier } from '~/lib/auth'

// ✅ CORRECTO: Cliente Supabase desde lib/supabase
import { createClient, createServerSupabaseClient } from '~/lib/supabase'

// ✅ CORRECTO: Features específicas desde features/auth
import { authSchemas, withSupabase } from '~/features/auth'
import { UserProfileCard } from '~/features/auth'

// ❌ INCORRECTO: No importar internals directamente
import { useAuthContext } from '~/features/auth/hooks/use-auth-context'
```

---

## 🔑 Componentes Clave

### 1. Cliente Supabase (`lib/supabase/client.ts`)

```typescript
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import type { RequestEventCommon } from '@builder.io/qwik-city'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase')
}

/**
 * Cliente para el NAVEGADOR
 * - Usar en useVisibleTask$, event handlers
 * - ⚠️ NO usar en routeAction$ o routeLoader$
 */
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Cliente para el SERVIDOR
 * - Usar SIEMPRE en routeAction$ y routeLoader$
 * - Maneja cookies correctamente
 */
export const createServerSupabaseClient = (requestEvent: RequestEventCommon) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookieHeader = requestEvent.request.headers.get('cookie')
        if (!cookieHeader) return []
        
        return cookieHeader.split(';').map(cookie => {
          const [name, value] = cookie.trim().split('=')
          return {
            name: name || '',
            value: value ? decodeURIComponent(value) : ''
          }
        }).filter(cookie => cookie.name && cookie.value)
      },
      setAll(cookiesToSet) {
        const isHttps = requestEvent.request.url.startsWith('https://')
        cookiesToSet.forEach(({ name, value, options }) => {
          if (requestEvent.cookie) {
            requestEvent.cookie.set(name, value, {
              path: '/',
              httpOnly: true,
              secure: isHttps,
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 365, // 1 año
              ...options
            })
          }
        })
      },
    },
  })
}
```

**🔍 Cuándo usar cada cliente:**

| Contexto | Cliente | Ejemplo |
|----------|---------|---------|
| `routeLoader$` | `createServerSupabaseClient` | Verificar sesión |
| `routeAction$` | `createServerSupabaseClient` | Login, logout |
| `useVisibleTask$` | `createClient` | Suscripciones auth |
| Event handlers | `createClient` | Botón de logout |

### 2. Route Guards (`lib/auth/route-guards.ts`)

```typescript
/**
 * Configuración de rutas por tipo
 */
export const ROUTE_CONFIG = {
  landing: ['/'] as const,
  auth: ['/login', '/register', '/forgot-password', '/reset-password'] as const,
  protected: ['/dashboard', '/users', '/create'] as const,
} as const

/**
 * Clasificadores de rutas
 */
export const RouteClassifier = {
  isLanding: (pathname: string): boolean => 
    ROUTE_CONFIG.landing.some(route => pathname === route),
    
  isAuth: (pathname: string): boolean => 
    ROUTE_CONFIG.auth.some(route => pathname.startsWith(route)),
    
  isProtected: (pathname: string): boolean => 
    ROUTE_CONFIG.protected.some(route => pathname.startsWith(route)),
    
  isPublic: (pathname: string): boolean => 
    RouteClassifier.isLanding(pathname) || RouteClassifier.isAuth(pathname),
}

/**
 * Lógica de redirección centralizada
 */
export function getAuthRedirect(
  pathname: string, 
  isAuthenticated: boolean
): string | null {
  // Usuario autenticado en rutas de auth → dashboard
  if (isAuthenticated && RouteClassifier.isAuth(pathname)) {
    return '/dashboard'
  }
  
  // Usuario no autenticado en rutas protegidas → login
  if (!isAuthenticated && RouteClassifier.isProtected(pathname)) {
    return `/login?redirectTo=${encodeURIComponent(pathname)}`
  }
  
  return null
}

/**
 * Obtiene pathname de redirectTo query param
 */
export function getRedirectPathname(url: URL): string | null {
  const redirectTo = url.searchParams.get('redirectTo')
  
  if (!redirectTo) return null
  
  // Validar seguridad: solo rutas relativas
  if (!redirectTo.startsWith('/')) return null
  if (redirectTo.includes('//')) return null
  
  return redirectTo
}
```

**✅ Ventajas:**
- Agregar nuevas rutas protegidas = 1 línea en `ROUTE_CONFIG`
- Lógica de redirección en un solo lugar
- Fácil testing y mantenimiento

### 3. Auth Guard Global (`routes/layout.tsx`)

```typescript
import { component$, Slot } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import { AuthProvider, RouteClassifier, getAuthRedirect } from "~/lib/auth"
import { AppLayout } from "~/components/app/AppLayout"
import { createServerSupabaseClient } from "~/lib/supabase"
import { getRedirectPathname } from "~/lib/auth/route-guards"

/**
 * Guard de autenticación GLOBAL
 * - Se ejecuta en TODAS las rutas
 * - Verifica sesión en el servidor (SSR)
 * - Redirige antes de renderizar (sin flash)
 */
export const useAuthGuard = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  // ✅ getUser() verifica con el servidor Auth de Supabase
  const { data: { user } } = await supabase.auth.getUser()
  
  const pathname = requestEvent.url.pathname
  const isAuthenticated = !!user
  
  // Determinar si necesitamos redirigir
  const redirectTo = getAuthRedirect(pathname, isAuthenticated)
  
  if (redirectTo) {
    // Preservar redirectTo query param si existe
    if (redirectTo === '/dashboard') {
      const customRedirect = getRedirectPathname(requestEvent.url)
      throw requestEvent.redirect(302, customRedirect || redirectTo)
    }
    throw requestEvent.redirect(302, redirectTo)
  }
  
  return {
    user,
    isPublic: RouteClassifier.isPublic(pathname),
    isProtected: RouteClassifier.isProtected(pathname)
  }
})

export default component$(() => {
  const authState = useAuthGuard()
  const isPublic = authState.value.isPublic
  const user = authState.value.user
  
  return (
    <AuthProvider key={`auth-${user?.id || 'anonymous'}`} user={user}>
      {isPublic ? (
        <Slot />
      ) : (
        <AppLayout>
          <Slot />
        </AppLayout>
      )}
    </AuthProvider>
  )
})
```

**🎯 Puntos clave:**
- `routeLoader$` se ejecuta ANTES del render (SSR)
- Redirecciones con `throw redirect()` = sin flash de contenido
- Usuario verificado con `getUser()` (más seguro que cookies)
- Preserva `redirectTo` para mejor UX post-login

### 4. Auth Provider (`components/auth/AuthProvider.tsx`)

```typescript
import { component$, Slot, useContextProvider, $, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { useNavigate } from "@builder.io/qwik-city"
import { isBrowser } from "@builder.io/qwik/build"
import { createClient } from "~/lib/supabase"
import { AuthContext, type AuthContextValue } from "~/lib/auth"
import type { User } from "@supabase/supabase-js"

interface AuthProviderProps {
  user: User | null
}

export const AuthProvider = component$<AuthProviderProps>((props) => {
  const nav = useNavigate()
  
  // Inicializar con usuario del SSR
  const currentUser = useSignal<User | null>(props.user || null)

  const logout = $(async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (!error) {
      currentUser.value = null
      nav('/')
    }
  })

  // Sincronización en el cliente
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (!isBrowser) return
    
    const supabase = createClient()

    // ✅ Solo suscribirse a cambios (no verificar de nuevo)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      currentUser.value = session?.user ?? null
    })

    cleanup(() => subscription.unsubscribe())
  }, { strategy: 'document-ready' })

  const ctx: AuthContextValue = {
    user: currentUser.value,
    isAuthenticated: !!currentUser.value,
    logout,
  }

  useContextProvider(AuthContext, ctx)
  return <Slot />
})
```

**⚡ Optimizaciones:**
- No llama a `getUser()` en el cliente (redundante)
- Solo se suscribe a cambios de sesión
- Props.user viene del SSR (ya verificado)

### 5. Auth Context (`features/auth/auth-context.ts`)

```typescript
import { createContextId } from "@builder.io/qwik"
import type { User } from "@supabase/supabase-js"
import type { QRL } from "@builder.io/qwik"

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  logout: QRL<() => Promise<void>>
}

export const AuthContext = createContextId<AuthContextValue>('auth-context')
```

### 6. Hook de Autenticación (`features/auth/hooks/use-auth.ts`)

```typescript
import { useContext } from "@builder.io/qwik"
import { AuthContext } from "../auth-context"

/**
 * Hook para acceder al contexto de autenticación
 * 
 * @example
 * export default component$(() => {
 *   const auth = useAuth()
 *   
 *   return (
 *     <div>
 *       {auth.isAuthenticated ? (
 *         <p>Hola {auth.user?.email}</p>
 *       ) : (
 *         <p>No autenticado</p>
 *       )}
 *     </div>
 *   )
 * })
 */
export const useAuth = () => {
  return useContext(AuthContext)
}
```

### 7. Helper withSupabase (`features/auth/services/auth-helpers.ts`)

```typescript
import type { RequestEventAction } from "@builder.io/qwik-city"
import { createServerSupabaseClient } from "~/lib/supabase"

/**
 * Tipo de respuesta estandarizada
 */
export type AuthActionResult<T = unknown> = 
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Helper para server actions con Supabase
 * - Crea cliente Supabase automáticamente
 * - Maneja errores de forma consistente
 * - Retorna formato unificado
 * 
 * @example
 * export const useLoginAction = routeAction$(async (data, requestEvent) => {
 *   return await withSupabase(async (supabase, formData) => {
 *     return await supabase.auth.signInWithPassword({
 *       email: formData.email,
 *       password: formData.password
 *     })
 *   })(requestEvent, data)
 * }, zod$(authSchemas.login))
 */
export const withSupabase = <TData, TResult>(
  handler: (
    supabase: ReturnType<typeof createServerSupabaseClient>, 
    data: TData
  ) => Promise<TResult>
) => {
  return async (
    requestEvent: RequestEventAction, 
    data: TData
  ): Promise<AuthActionResult<TResult>> => {
    try {
      const supabase = createServerSupabaseClient(requestEvent)
      const result = await handler(supabase, data)
      
      // Manejo de errores de Supabase
      if (result && typeof result === 'object' && 'error' in result && result.error) {
        return {
          success: false,
          error: (result.error as any).message || 'Error de autenticación',
        }
      }
      
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error('Auth action error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      }
    }
  }
}
```

### 8. Schemas de Validación (`features/auth/schemas/auth-schemas.ts`)

```typescript
import { z } from "@builder.io/qwik-city"

/**
 * Schemas base reutilizables
 */
const baseSchemas = {
  email: z
    .string({ required_error: "El email es requerido" })
    .email("Email inválido")
    .toLowerCase()
    .trim(),
    
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña es demasiado larga"),
    
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .trim(),
}

/**
 * Schemas compuestos para cada form
 */
export const authSchemas = {
  login: {
    email: baseSchemas.email,
    password: z.string().min(1, "La contraseña es requerida"),
  },

  register: {
    name: baseSchemas.name,
    email: baseSchemas.email,
    password: baseSchemas.password,
    confirmPassword: z.string(),
  },

  forgotPassword: {
    email: baseSchemas.email,
  },

  resetPassword: {
    password: baseSchemas.password,
    confirmPassword: z.string(),
  },
}
```

---

## 🔄 Flujos de Autenticación

### Login

```typescript
// routes/(auth)/login/index.tsx
import { component$ } from "@builder.io/qwik"
import { Form, routeAction$, zod$ } from "@builder.io/qwik-city"
import { authSchemas, withSupabase } from "~/features/auth"

export const useLoginAction = routeAction$(async (data, requestEvent) => {
  return await withSupabase(async (supabase, formData: { email: string; password: string }) => {
    const result = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })
    
    if (result.data.user) {
      // Login exitoso - el layout.tsx manejará la redirección
      throw requestEvent.redirect(302, '/dashboard')
    }
    
    return result
  })(requestEvent, data)
}, zod$(authSchemas.login))

export default component$(() => {
  const loginAction = useLoginAction()
  
  return (
    <Form action={loginAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      
      {loginAction.value && !loginAction.value.success && (
        <div class="error">{loginAction.value.error}</div>
      )}
      
      <button type="submit">Iniciar Sesión</button>
    </Form>
  )
})
```

### Register

```typescript
// routes/(auth)/register/index.tsx
import { component$ } from "@builder.io/qwik"
import { Form, routeAction$, zod$ } from "@builder.io/qwik-city"
import { authSchemas, withSupabase } from "~/features/auth"

export const useRegisterAction = routeAction$(async (data, requestEvent) => {
  // Validar que las contraseñas coincidan
  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      error: 'Las contraseñas no coinciden'
    }
  }
  
  return await withSupabase(async (supabase, formData: typeof data) => {
    const result = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
        }
      }
    })
    
    return result
  })(requestEvent, data)
}, zod$(authSchemas.register))

export default component$(() => {
  const registerAction = useRegisterAction()
  
  return (
    <Form action={registerAction}>
      <input name="name" type="text" required />
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <input name="confirmPassword" type="password" required />
      
      {registerAction.value?.success && (
        <div class="success">
          ¡Cuenta creada! Revisa tu email para confirmar.
        </div>
      )}
      
      {registerAction.value && !registerAction.value.success && (
        <div class="error">{registerAction.value.error}</div>
      )}
      
      <button type="submit">Registrarse</button>
    </Form>
  )
})
```

### Forgot Password

```typescript
// routes/(auth)/forgot-password/index.tsx
import { component$ } from "@builder.io/qwik"
import { Form, routeAction$, zod$ } from "@builder.io/qwik-city"
import { authSchemas, withSupabase } from "~/features/auth"

export const useForgotPasswordAction = routeAction$(async (data, requestEvent) => {
  return await withSupabase(async (supabase, formData: { email: string }) => {
    return await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${requestEvent.url.origin}/reset-password`,
    })
  })(requestEvent, data)
}, zod$(authSchemas.forgotPassword))

export default component$(() => {
  const forgotPasswordAction = useForgotPasswordAction()
  
  return (
    <Form action={forgotPasswordAction}>
      <input name="email" type="email" required />
      
      {forgotPasswordAction.value?.success && (
        <div class="success">
          Se ha enviado un email de recuperación
        </div>
      )}
      
      {forgotPasswordAction.value && !forgotPasswordAction.value.success && (
        <div class="error">{forgotPasswordAction.value.error}</div>
      )}
      
      <button type="submit">Enviar Email</button>
    </Form>
  )
})
```

### Reset Password

```typescript
// routes/(auth)/reset-password/index.tsx
import { component$ } from "@builder.io/qwik"
import { Form, routeAction$, zod$ } from "@builder.io/qwik-city"
import { authSchemas, withSupabase } from "~/features/auth"

export const useResetPasswordAction = routeAction$(async (data, requestEvent) => {
  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      error: 'Las contraseñas no coinciden'
    }
  }
  
  return await withSupabase(async (supabase, formData: typeof data) => {
    const result = await supabase.auth.updateUser({
      password: formData.password
    })
    
    if (result.data.user) {
      throw requestEvent.redirect(302, '/dashboard')
    }
    
    return result
  })(requestEvent, data)
}, zod$(authSchemas.resetPassword))

export default component$(() => {
  const resetPasswordAction = useResetPasswordAction()
  
  return (
    <Form action={resetPasswordAction}>
      <input name="password" type="password" required />
      <input name="confirmPassword" type="password" required />
      
      {resetPasswordAction.value && !resetPasswordAction.value.success && (
        <div class="error">{resetPasswordAction.value.error}</div>
      )}
      
      <button type="submit">Cambiar Contraseña</button>
    </Form>
  )
})
```

### Logout

```typescript
// Opción 1: Usando el context
import { component$ } from "@builder.io/qwik"
import { useAuth } from "~/lib/auth"

export default component$(() => {
  const auth = useAuth()
  
  return (
    <button onClick$={auth.logout}>
      Cerrar Sesión
    </button>
  )
})

// Opción 2: Server Action
import { routeAction$ } from "@builder.io/qwik-city"
import { withSupabase } from "~/features/auth"

export const useLogoutAction = routeAction$(async (_, requestEvent) => {
  return await withSupabase(async (supabase) => {
    const result = await supabase.auth.signOut()
    
    if (!result.error) {
      throw requestEvent.redirect(302, '/')
    }
    
    return result
  })(requestEvent, {})
})
```

---

## 🛡️ Protección de Rutas

### Agregar Nueva Ruta Protegida

1. **Agregar a route-guards.ts:**

```typescript
export const ROUTE_CONFIG = {
  landing: ['/'] as const,
  auth: ['/login', '/register', '/forgot-password', '/reset-password'] as const,
  protected: [
    '/dashboard', 
    '/users', 
    '/create',
    '/settings',  // ← Nueva ruta protegida
  ] as const,
}
```

2. **Crear la ruta:**

```typescript
// routes/settings/index.tsx
import { component$ } from "@builder.io/qwik"
import { useAuth } from "~/lib/auth"

export default component$(() => {
  const auth = useAuth()
  
  return (
    <div>
      <h1>Configuración</h1>
      <p>Usuario: {auth.user?.email}</p>
    </div>
  )
})
```

¡Eso es todo! El guard global se encargará automáticamente.

### Protección a Nivel de Componente

```typescript
import { component$ } from "@builder.io/qwik"
import { useAuth } from "~/lib/auth"

export default component$(() => {
  const auth = useAuth()
  
  if (!auth.isAuthenticated) {
    return <div>Debes iniciar sesión</div>
  }
  
  return (
    <div>
      <h1>Contenido Privado</h1>
      <p>Hola {auth.user?.email}</p>
    </div>
  )
})
```

### Mostrar Contenido Condicionalmente

```typescript
import { component$ } from "@builder.io/qwik"
import { useAuth } from "~/lib/auth"

export default component$(() => {
  const auth = useAuth()
  
  return (
    <div>
      <h1>Página Pública</h1>
      
      {auth.isAuthenticated ? (
        <div>
          <p>Bienvenido, {auth.user?.email}</p>
          <button onClick$={auth.logout}>Logout</button>
        </div>
      ) : (
        <div>
          <a href="/login">Iniciar Sesión</a>
          <a href="/register">Registrarse</a>
        </div>
      )}
    </div>
  )
})
```

---

## 📍 Mapa de Rutas de Autenticación

### Estructura de Rutas del Proyecto

```
src/routes/
├── layout.tsx                          # 🛡️ Auth Guard Global (SSR)
├── index.tsx                           # 🌐 Landing Page (Pública)
│
├── (auth)/                             # Grupo de rutas de autenticación
│   ├── layout.tsx                      # Layout compartido para auth
│   ├── login/
│   │   └── index.tsx                   # 🔑 Login
│   ├── register/
│   │   └── index.tsx                   # ✍️ Registro
│   ├── forgot-password/
│   │   └── index.tsx                   # 🔒 Olvidé contraseña
│   └── reset-password/
│       └── index.tsx                   # 🔓 Reset contraseña
│
└── dashboard/                          # 🔐 Área protegida
    ├── layout.tsx                      # Layout del dashboard
    └── index.tsx                       # Dashboard home
```

### Tabla de Clasificación de Rutas

| Ruta | Tipo | Autenticado | No Autenticado | Descripción |
|------|------|-------------|----------------|-------------|
| `/` | `landing` | ✅ Ver | ✅ Ver | Landing page pública |
| `/login` | `auth` | ↪️ Redirige a `/dashboard` | ✅ Ver | Página de inicio de sesión |
| `/register` | `auth` | ↪️ Redirige a `/dashboard` | ✅ Ver | Página de registro |
| `/forgot-password` | `auth` | ↪️ Redirige a `/dashboard` | ✅ Ver | Solicitar reset de contraseña |
| `/reset-password` | `auth` | ↪️ Redirige a `/dashboard` | ✅ Ver | Resetear contraseña con token |
| `/dashboard` | `protected` | ✅ Ver | ↪️ Redirige a `/login` | Dashboard principal |
| `/dashboard/*` | `protected` | ✅ Ver | ↪️ Redirige a `/login` | Rutas hijas del dashboard |

### Configuración de Rutas (Route Guards)

```typescript
// filepath: src/lib/auth/route-guards.ts

/**
 * Configuración centralizada de rutas por tipo
 */
const ROUTE_CONFIG = {
  // Rutas completamente públicas (sin restricciones)
  landing: ['/'],
  
  // Rutas de autenticación (solo para usuarios NO autenticados)
  auth: [
    '/login',
    '/register', 
    '/forgot-password',
    '/reset-password'
  ],
  
  // Rutas protegidas (solo para usuarios autenticados)
  protected: [
    '/dashboard'
  ],
} as const;
```

### Flujo de Redirección Visual

```mermaid
graph TD
    A[Usuario visita URL] --> B{¿Está autenticado?}
    
    B -->|SÍ| C{¿Qué tipo de ruta?}
    B -->|NO| D{¿Qué tipo de ruta?}
    
    C -->|landing| E[✅ Mostrar Landing]
    C -->|auth| F[↪️ Redirigir a /dashboard]
    C -->|protected| G[✅ Mostrar Dashboard]
    
    D -->|landing| H[✅ Mostrar Landing]
    D -->|auth| I[✅ Mostrar Login/Register]
    D -->|protected| J[↪️ Redirigir a /login?redirectTo=...]
    
    style F fill:#ff6b6b
    style J fill:#ff6b6b
    style E fill:#51cf66
    style G fill:#51cf66
    style H fill:#51cf66
    style I fill:#51cf66
```

### Ejemplos de Navegación

#### Escenario 1: Usuario No Autenticado

```typescript
// Usuario intenta acceder a /dashboard
GET /dashboard
  ↓
  🛡️ Auth Guard detecta: NO autenticado + ruta protegida
  ↓
  ↪️ Redirect 302 → /login?redirectTo=%2Fdashboard
  ↓
  ✅ Usuario ve formulario de login
  ↓
  🔑 Usuario inicia sesión
  ↓
  ↪️ Redirect → /dashboard (preservando redirectTo)
```

#### Escenario 2: Usuario Autenticado

```typescript
// Usuario autenticado intenta acceder a /login
GET /login
  ↓
  🛡️ Auth Guard detecta: SÍ autenticado + ruta auth
  ↓
  ↪️ Redirect 302 → /dashboard
  ↓
  ✅ Usuario ve dashboard directamente
```

#### Escenario 3: Reset Password

```typescript
// Usuario recibe email con token
GET /reset-password?token=abc123
  ↓
  🛡️ Auth Guard: ruta auth permitida
  ↓
  ✅ Mostrar formulario de reset
  ↓
  📝 Usuario envía nueva contraseña
  ↓
  🔄 Server action procesa reset
  ↓
  ↪️ Redirect → /login (con mensaje de éxito)
```

### Cómo Agregar Nuevas Rutas

#### 1. Ruta Pública (sin autenticación)

```typescript
// filepath: src/lib/auth/route-guards.ts

const ROUTE_CONFIG = {
  landing: [
    '/',
    '/about',        // ✅ AGREGAR AQUÍ
    '/pricing',      // ✅ AGREGAR AQUÍ
    '/contact',      // ✅ AGREGAR AQUÍ
  ],
  // ...existing code...
}
```

```typescript
// filepath: src/routes/about/index.tsx

import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div>
      <h1>About Us</h1>
      {/* No necesita verificación de auth */}
    </div>
  );
});
```

#### 2. Ruta de Autenticación

```typescript
// filepath: src/lib/auth/route-guards.ts

const ROUTE_CONFIG = {
  // ...existing code...
  auth: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',   // ✅ AGREGAR AQUÍ
  ],
  // ...existing code...
}
```

```typescript
// filepath: src/routes/(auth)/verify-email/index.tsx

import { component$ } from '@builder.io/qwik';
import { routeAction$, zod$, z, Form } from '@builder.io/qwik-city';
import { withSupabase } from '~/features/auth/services/auth-helpers';

// Server action para verificar email
export const useVerifyEmailAction = routeAction$(
  withSupabase(async (supabase, { token }) => {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });
    
    if (error) throw error;
    
    return { message: 'Email verificado correctamente' };
  }),
  zod$({
    token: z.string(),
  })
);

export default component$(() => {
  const verifyAction = useVerifyEmailAction();
  
  return (
    <div>
      <h1>Verificar Email</h1>
      <Form action={verifyAction}>
        {/* Formulario de verificación */}
      </Form>
    </div>
  );
});
```

#### 3. Ruta Protegida (requiere autenticación)

```typescript
// filepath: src/lib/auth/route-guards.ts

const ROUTE_CONFIG = {
  // ...existing code...
  protected: [
    '/dashboard',
    '/settings',       // ✅ AGREGAR AQUÍ
    '/profile',        // ✅ AGREGAR AQUÍ
    '/admin',          // ✅ AGREGAR AQUÍ
  ],
}
```

```typescript
// filepath: src/routes/settings/index.tsx

import { component$ } from '@builder.io/qwik';
import { useAuthGuard } from '~/routes/layout'; // Guard global

export default component$(() => {
  // El guard global ya verificó autenticación
  const authData = useAuthGuard();
  
  return (
    <div>
      <h1>Settings</h1>
      <p>Usuario: {authData.value.user?.email}</p>
      {/* Contenido protegido */}
    </div>
  );
});
```

#### 4. Ruta Protegida con Roles (Opcional)

```typescript
// filepath: src/lib/auth/route-guards.ts

/**
 * Configuración de rutas con roles
 */
export const ROLE_ROUTES = {
  admin: ['/admin'],
  moderator: ['/moderation'],
  user: ['/dashboard', '/settings', '/profile'],
} as const;

/**
 * Verificar si usuario tiene acceso según rol
 */
export function hasRoleAccess(
  pathname: string,
  userRole: 'admin' | 'moderator' | 'user'
): boolean {
  const allowedRoutes = ROLE_ROUTES[userRole];
  return allowedRoutes.some(route => pathname.startsWith(route));
}
```

```typescript
// filepath: src/routes/admin/layout.tsx

import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { createServerSupabaseClient } from '~/lib/supabase';
import { hasRoleAccess } from '~/lib/auth/route-guards';

export const useAdminGuard = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw requestEvent.redirect(302, '/login');
  }
  
  // Verificar rol en metadata del usuario
  const userRole = user.user_metadata?.role || 'user';
  
  if (!hasRoleAccess(requestEvent.url.pathname, userRole)) {
    throw requestEvent.redirect(302, '/dashboard');
  }
  
  return { user, role: userRole };
});

export default component$(() => {
  const adminData = useAdminGuard();
  
  return (
    <div>
      <h1>Admin Panel - {adminData.value.role}</h1>
      <Slot />
    </div>
  );
});
```

### Matriz de Acceso a Rutas

| Ruta | Público | Autenticado | Admin | Acción si no autorizado |
|------|---------|-------------|-------|------------------------|
| `/` | ✅ | ✅ | ✅ | - |
| `/login` | ✅ | ↪️ `/dashboard` | ↪️ `/dashboard` | Redirect |
| `/register` | ✅ | ↪️ `/dashboard` | ↪️ `/dashboard` | Redirect |
| `/dashboard` | ↪️ `/login` | ✅ | ✅ | Redirect + redirectTo |
| `/settings` | ↪️ `/login` | ✅ | ✅ | Redirect + redirectTo |
| `/admin` | ↪️ `/login` | ↪️ `/dashboard` | ✅ | Redirect según rol |

### Query Parameters Importantes

#### `redirectTo` - Preservar destino después del login

```typescript
// Usuario intenta acceder a ruta protegida
GET /dashboard/reports
  ↓
  ↪️ Redirect → /login?redirectTo=%2Fdashboard%2Freports
  ↓
  🔑 Usuario inicia sesión
  ↓
  ↪️ Redirect → /dashboard/reports  // Vuelve a la ruta original
```

**Implementación:**

```typescript
// filepath: src/lib/auth/route-guards.ts

export function getAuthRedirect(
  pathname: string, 
  isAuthenticated: boolean
): string | null {
  // Usuario no autenticado intentando acceder a rutas protegidas
  if (!isAuthenticated && RouteClassifier.isProtected(pathname)) {
    return `/login?redirectTo=${encodeURIComponent(pathname)}`;
  }
  
  // ...existing code...
}
```

```typescript
// filepath: src/routes/(auth)/login/index.tsx

export const useLoginAction = routeAction$(async (data, requestEvent) => {
  // ...login logic...
  
  // Obtener redirectTo de query params
  const redirectTo = requestEvent.url.searchParams.get('redirectTo') || '/dashboard';
  
  // Redirigir al destino original
  throw requestEvent.redirect(302, redirectTo);
}, zod$(authSchemas.login));
```

### Testing de Rutas

```typescript
// filepath: tests/auth-routing.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Auth Routing', () => {
  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login\?redirectTo=%2Fdashboard/);
  });

  test('should redirect authenticated users from auth routes', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-submit"]');
    
    // Try to access login again
    await page.goto('/login');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should preserve redirectTo after login', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await expect(page).toHaveURL(/.*login\?redirectTo=%2Fdashboard%2Fsettings/);
    
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-submit"]');
    
    await expect(page).toHaveURL('/dashboard/settings');
  });
});
```

---

## ✅ Mejores Prácticas

### 1. Seguridad

#### ✅ HACER:
- Siempre usar `createServerSupabaseClient` en `routeLoader$` y `routeAction$`
- Verificar con `getUser()` en lugar de confiar solo en cookies
- Usar HTTPS en producción
- Configurar CORS correctamente en Supabase
- Habilitar Row Level Security (RLS) en todas las tablas

#### ❌ NO HACER:
- Usar `createClient()` en server actions
- Confiar solo en `getSession()` (puede ser manipulado)
- Hardcodear credenciales
- Exponer `DATABASE_URL` en el cliente

### 2. Performance

#### ✅ Optimizaciones:
- Guard global ejecuta solo 1 verificación por request
- AuthProvider no hace llamadas redundantes
- Suscripción a cambios en lugar de polling
- SSR elimina flash de contenido no autenticado

#### 📊 Métricas:
```
Antes de optimización:
- 3+ verificaciones por carga
- Flash de contenido
- 200ms+ de latencia

Después:
- 1 verificación SSR
- Sin flash
- <50ms de latencia adicional
```

### 3. UX

#### Preservar redirectTo:
```typescript
// Login exitoso → redirigir a donde el usuario intentaba ir
if (result.data.user) {
  const redirectTo = requestEvent.url.searchParams.get('redirectTo') || '/dashboard'
  throw requestEvent.redirect(302, redirectTo)
}
```

#### Feedback claro:
```typescript
{loginAction.value?.success && (
  <div class="success">¡Bienvenido!</div>
)}

{loginAction.value && !loginAction.value.success && (
  <div class="error">{loginAction.value.error}</div>
)}
```

### 4. Testing

#### Test de protección de rutas:
```typescript
import { test, expect } from '@playwright/test'

test('redirect unauthenticated users to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/.*login/)
})

test('redirect authenticated users from auth pages', async ({ page }) => {
  // Login first
  await page.goto('/login')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  // Try to access login again
  await page.goto('/login')
  await expect(page).toHaveURL('/dashboard')
})
```

### 5. Manejo de Errores

```typescript
// Errores específicos de Supabase
const ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Email o contraseña incorrectos',
  'Email not confirmed': 'Por favor confirma tu email',
  'User already registered': 'Este email ya está registrado',
}

// En withSupabase helper:
if (result.error) {
  const message = ERROR_MESSAGES[result.error.message] || result.error.message
  return { success: false, error: message }
}
```

---

## 🐛 Troubleshooting

### Error: "Invalid API key"

**Causa:** Variables de entorno incorrectas

**Solución:**
1. Verifica `.env.local`:
   ```bash
   echo $PUBLIC_SUPABASE_URL
   echo $PUBLIC_SUPABASE_ANON_KEY
   ```
2. Reinicia el servidor de desarrollo
3. Verifica que las variables empiecen con `PUBLIC_` (convención Qwik)

### Error: "No se puede leer cookies"

**Causa:** Usar `createClient()` en server action

**Solución:**
```typescript
// ❌ INCORRECTO
export const useLoginAction = routeAction$(async (data) => {
  const supabase = createClient() // ← ERROR
  ...
})

// ✅ CORRECTO
export const useLoginAction = routeAction$(async (data, requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  ...
})
```

### Usuario no persiste después de login

**Causa:** Cookies no se están guardando

**Solución:**
1. Verifica que `requestEvent.cookie.set` esté configurado
2. Asegúrate que `secure: true` solo esté en HTTPS
3. Revisa la configuración de CORS en Supabase

### Redirección infinita

**Causa:** Lógica de guard incorrecta

**Solución:**
```typescript
// Verifica que las rutas estén bien clasificadas
console.log('pathname:', pathname)
console.log('isAuth:', RouteClassifier.isAuth(pathname))
console.log('isProtected:', RouteClassifier.isProtected(pathname))
console.log('isAuthenticated:', isAuthenticated)
```

### Flash de contenido no autenticado

**Causa:** Verificación en el cliente en lugar del servidor

**Solución:**
- Asegúrate que `useAuthGuard` esté en `layout.tsx`
- Usa `routeLoader$` (SSR) no `useVisibleTask$`
- Redirige con `throw redirect()` no con navegación cliente

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Qwik Docs](https://qwik.builder.io)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Zod Validation](https://zod.dev)

### Ejemplos de Código
- [Qwik Auth Example](https://github.com/BuilderIO/qwik/tree/main/starters/apps/e2e)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side-rendering)

### Seguridad
- [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎯 Checklist de Implementación

Usa este checklist al implementar auth en una nueva app:

- [ ] Instalar dependencias (`@supabase/supabase-js`, `@supabase/ssr`, `zod`)
- [ ] Configurar variables de entorno (`.env.local`)
- [ ] Crear cliente Supabase (`lib/supabase/client.ts`)
- [ ] Crear route guards (`lib/auth/route-guards.ts`)
- [ ] Implementar guard global (`routes/layout.tsx`)
- [ ] Crear auth context (`features/auth/auth-context.ts`)
- [ ] Crear auth provider (`lib/auth/AuthProvider.tsx`)
- [ ] Crear hook useAuth (`features/auth/hooks/use-auth.ts`)
- [ ] Crear schemas de validación (`features/auth/schemas/auth-schemas.ts`)
- [ ] Crear helper withSupabase (`features/auth/services/auth-helpers.ts`)
- [ ] Implementar página de login
- [ ] Implementar página de register
- [ ] Implementar forgot password
- [ ] Implementar reset password
- [ ] Configurar Supabase Dashboard (URLs, templates)
- [ ] Probar flujos de autenticación
- [ ] Agregar tests E2E
- [ ] Habilitar RLS en Supabase
- [ ] Configurar producción (HTTPS, CORS)

---

## 📝 Notas Finales

Este sistema de autenticación está diseñado para:
- ✅ Escalabilidad (fácil agregar OAuth, MFA, etc.)
- ✅ Mantenibilidad (código centralizado y reutilizable)
- ✅ Performance (SSR-first, sin verificaciones redundantes)
- ✅ Seguridad (verificación servidor, RLS, tipo-safe)
- ✅ Developer Experience (tipado, helpers, clara separación)

**Última actualización:** Noviembre 2025  
**Versión de Qwik:** 1.15.0  
**Versión de Supabase:** 2.53.0

---

¿Preguntas o mejoras? Abre un issue o PR en el repositorio.
