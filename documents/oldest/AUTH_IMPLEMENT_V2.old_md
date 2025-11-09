# 🤖 Manual de Implementación de Autenticación: Versión Sincronizada con la Arquitectura Canónica

**Propósito**: Este documento detalla la implementación completa y exhaustiva de un sistema de autenticación robusto, siguiendo la arquitectura estricta definida en `ARQUITECTURA_FOLDER.md` para un proyecto **Qwik + Supabase**.

## ⚙️ Instalaciones Necesarias

Para replicar el sistema de autenticación y validación, necesitarás las siguientes librerías:

```bash
# Gestor de dependencias recomendado para Qwik
pnpm install @supabase/ssr @supabase/supabase-js zod
```

* **`@supabase/ssr`**: Librería oficial de Supabase para manejar la autenticación en entornos de renderizado en el servidor (SSR).
* **`@supabase/supabase-js`**: El cliente JavaScript isomorfo principal de Supabase.
* **`zod`**: Validador de esquemas para los datos de los formularios.

---

## 1. Visión General y Estructura de Ficheros

El sistema sigue una separación estricta de responsabilidades. La lógica de negocio (lib) está completamente desacoplada de la presentación (routes).

### Árbol de Ficheros de Autenticación (Alineado con la Arquitectura Maestra)

```
src/
├── lib/
│   ├── auth/
│   │   └── AuthProvider.tsx      # ✅ Componente lógico que gestiona y provee el estado de sesión.
│   │
│   ├── contexts/
│   │   └── auth.context.ts       #  Definición del `createContextId` para la autenticación.
│   │
│   ├── schemas/
│   │   └── auth.schema.ts        # 🛡️ Schemas de validación Zod (ahora centralizados).
│   │
│   └── supabase/
│       └── client.ts             # ✅ Define los clientes de Supabase (servidor/navegador).
│
└── routes/
    ├── (auth)/                   # 📂 Grupo de rutas para páginas de autenticación.
    │   ├── login/
    │   │   └── index.tsx         # 🔑 Página de login. Orquesta la UI y consume la lógica.
    │   └── layout.tsx            #    Layout simple para los formularios de auth.
    │
    ├── (app)/                    # 🔒 Grupo de rutas PROTEGIDAS que requieren autenticación.
    │   └── layout.tsx            # 💂‍♂️ Auth Guard y layout principal del dashboard.
    │
    └── layout.tsx                # 🚪 Layout raíz que contiene el <AuthProvider> global.
```

---

## 2. Configuración de Clientes Supabase (lib/supabase)

La base de la interacción con Supabase se centraliza en un único fichero, como manda la arquitectura. Se utiliza la versión más moderna y recomendada que aprovecha las utilidades nativas de Qwik City para la gestión de cookies.

**Lógica Clave:**
* **`createServerSupabaseClient`**: Se usa en el **backend** (`routeLoader$`, `routeAction$`). Es **esencial** pasarle el `requestEvent` para que pueda leer y escribir las cookies de sesión de forma segura.
* **`createClient`**: Se usa en el **frontend** (dentro de `useVisibleTask$`, `onClick$`, etc.).

### Código Fuente

```typescript
// RUTA: src/lib/supabase/client.ts

import { createBrowserClient, createServerClient } from '@supabase/ssr'
import type { RequestEventCommon } from '@builder.io/qwik-city'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno requeridas para Supabase.')
}

/**
 * Crea un cliente de Supabase para ser usado en el NAVEGADOR.
 */
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Crea un cliente de Supabase para ser usado en el SERVIDOR.
 * Es crucial para SSR y server actions, ya que maneja las cookies
 * a través del `requestEvent`.
 */
export const createServerSupabaseClient = (requestEvent: RequestEventCommon) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => {
        return requestEvent.cookie.getAll()
      },
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          requestEvent.cookie.set(name, value, options)
        )
      },
    },
  })
}
```

---
---

## 3. Protección de Rutas y Gestión de Sesión

La protección de rutas y la gestión de redirecciones se dividen lógicamente entre el layout del grupo `(app)` y el layout raíz para una máxima claridad y eficiencia, tal como lo dicta la arquitectura.

### 3.1. Auth Guard para Rutas Privadas (en `(app)/layout.tsx`)

Se implementa en el layout del grupo de rutas protegido. Su única responsabilidad es la seguridad: si no hay sesión, expulsa al usuario.

**Lógica Clave:**
* `useAuthGuard` es un `routeLoader$` que se ejecuta en el servidor para **cualquier ruta** dentro del grupo `(app)`.
* Protege automáticamente todas las rutas anidadas (ej: `/dashboard`, `/settings`, etc.) sin necesidad de helpers manuales.
* Si el usuario no está autenticado, lo redirige al login **antes** de renderizar nada.

```typescript
// RUTA: src/routes/(app)/layout.tsx

import { component$, Slot } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import { createServerSupabaseClient } from "~/lib/supabase/client"
import { AppLayout } from '~/components/layout/AppLayout' // Suponiendo un layout visual para el dashboard

/**
 * Este routeLoader$ actúa como el "Auth Guard" para TODAS las rutas
 * anidadas dentro del grupo (app).
 */
export const useAuthGuard = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { session } } = await supabase.auth.getSession()

  // Lógica de protección: si no hay sesión, se redirige al login.
  if (!session) {
    const loginUrl = `/login?redirectTo=${encodeURIComponent(requestEvent.url.pathname)}`
    throw requestEvent.redirect(302, loginUrl)
  }

  // Si hay sesión, se retorna el usuario para que esté disponible en los componentes.
  return { user: session.user }
})

// Layout para la sección privada de la aplicación.
export default component$(() => {
  const userData = useAuthGuard()
  
  // AppLayout sería el componente visual con Sidebar, Header, etc.
  return (
    <AppLayout user={userData.value.user}>
      <Slot />
    </AppLayout>
  )
})
```

### 3.2 Gestión de Sesión y Proveedor en el Layout Raíz
El layout raíz (src/routes/layout.tsx) orquesta los proveedores globales y gestiona la redirección de usuarios que ya están autenticados.
**Lógica Clave:**
* **`useInitialAuthLoader`** carga el estado inicial del usuario desde el servidor para evitar parpadeos y pasarlo al **`AuthProvider`**.
* Se renderiza el **`<AuthProvider>`** para que toda la aplicación tenga acceso al contexto de autenticación
* **`onGet`** (middleware) se encarga de redirigir a los usuarios ya logueados si intentan acceder a `/login` o `/register`.

### Código Fuente
```typescript
// RUTA: src/routes/layout.tsx

import { component$, Slot } from "@builder.io/qwik"
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city"
import { AuthProvider } from "~/lib/auth/AuthProvider" 
import { createServerSupabaseClient } from "~/lib/supabase/client" 

// Carga inicial del usuario para el AuthProvider.
export const useInitialAuthLoader = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { session } } = await supabase.auth.getSession()
  return { user: session?.user ?? null }
})

// Middleware para redirigir a usuarios autenticados fuera de las páginas de auth.
export const onGet: RequestHandler = async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { session } } = await supabase.auth.getSession()
  
  const isAuthPage = requestEvent.url.pathname.startsWith('/login') || requestEvent.url.pathname.startsWith('/register')

  if (session && isAuthPage) {
    const redirectTo = requestEvent.url.searchParams.get('redirectTo') || '/dashboard';
    throw requestEvent.redirect(302, redirectTo)
  }
}

// Layout raíz que envuelve toda la aplicación.
export default component$(() => {
  const authState = useInitialAuthLoader()
  
  return (
    <AuthProvider user={authState.value.user}>
      <Slot />
    </AuthProvider>
  )
})
```
---

## 4. Acciones de Formulario Completas (Lógica en el Servidor)

La página de login (`src/routes/(auth)/login/index.tsx`) contiene el formulario completo y las acciones del servidor para manejar el inicio de sesión con Email/Contraseña y Google OAuth.

**Lógica Clave:**
* Las `routeAction$` se ejecutan **100% en el servidor**, protegiendo la lógica sensible.
* Se usa `zod$` para validar los datos, importando el schema desde su ubicación centralizada (`src/lib/schemas/auth.schema.ts`).
* La UI del formulario es completa y maneja los estados de carga y error.

### Código Fuente

```typescript
// RUTA: src/routes/(auth)/login/index.tsx

import { component$, useSignal } from '@builder.io/qwik'
import { type DocumentHead, routeAction$, Form, zod$, Link } from '@builder.io/qwik-city'
import { createServerSupabaseClient } from '~/lib/supabase/client' 
import { authSchema } from '~/lib/schemas/auth.schema'

/**
 * routeAction$ para manejar el inicio de sesión con Google (OAuth).
 */
export const useGoogleLoginAction = routeAction$(async (_, requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  const redirectToPath = requestEvent.url.searchParams.get('redirectTo') || '/dashboard'
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${requestEvent.url.origin}${redirectToPath}`,
    },
  })

  if (error) {
    return requestEvent.fail(400, { formErrors: [error.message] })
  }

  if (data.url) {
    throw requestEvent.redirect(302, data.url)
  }

  return requestEvent.fail(500, { formErrors: ['No se pudo iniciar sesión con Google.'] })
})

/**
 * routeAction$ para manejar el inicio de sesión con email y contraseña.
 */
export const useLoginAction = routeAction$(async (values, requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })

  if (error) {
    return requestEvent.fail(400, { formErrors: [error.message] })
  }

  const redirectTo = requestEvent.url.searchParams.get('redirectTo') || '/dashboard';
  throw requestEvent.redirect(302, redirectTo)
}, zod$(authSchema.login))

// Componente de la página de Login.
export default component$(() => {
  const loginAction = useLoginAction()
  const googleLoginAction = useGoogleLoginAction()
  
  const showPassword = useSignal(false)
  
  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 class="text-2xl font-semibold text-center text-gray-900">Sign In</h2>
        <p class="mt-1 text-center text-sm text-gray-500">Accede a tu panel de control.</p>

        <div class="mt-6">
          <Form action={googleLoginAction}>
            <button 
              type="submit" 
              class="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={googleLoginAction.isRunning}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="h-5 w-5">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.486-11.022-8.224l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.37,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              {googleLoginAction.isRunning ? 'Conectando...' : 'Sign in with Google'}
            </button>
          </Form>
        </div>
        {googleLoginAction.value?.formErrors && (
          <div class="mt-4 text-sm text-red-600"><p>{googleLoginAction.value.formErrors[0]}</p></div>
        )}

        <div class="my-6 flex items-center gap-4"><div class="h-px flex-1 bg-gray-200" /><span class="text-xs text-gray-400">OR</span><div class="h-px flex-1 bg-gray-200" /></div>

        <Form action={loginAction} class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" required class={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${loginAction.value?.fieldErrors?.email ? 'border-red-500' : 'border-gray-300'}`} />
            {loginAction.value?.fieldErrors?.email && <p class="mt-1 text-sm text-red-600">{loginAction.value.fieldErrors.email[0]}</p>}
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="relative mt-1">
              <input id="password" name="password" type={showPassword.value ? 'text' : 'password'} required class={`block w-full rounded-md border px-3 py-2 pr-10 text-sm ${loginAction.value?.fieldErrors?.password ? 'border-red-500' : 'border-gray-300'}`} />
              <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400" onClick$={() => (showPassword.value = !showPassword.value)}>
                {/* SVG para mostrar/ocultar contraseña */}
              </button>
            </div>
            {loginAction.value?.fieldErrors?.password && <p class="mt-1 text-sm text-red-600">{loginAction.value.fieldErrors.password[0]}</p>}
          </div>
          {loginAction.value?.formErrors && (
            <div class="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {loginAction.value.formErrors.map(e => <p key={e}>{e}</p>)}
            </div>
          )}
          <button type="submit" disabled={loginAction.isRunning} class="w-full rounded-md bg-gray-800 text-white py-2.5 text-sm font-medium disabled:opacity-50">
            {loginAction.isRunning ? 'Iniciando sesión…' : 'SIGN IN'}
          </button>
        </Form>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Login - Mi App',
}

```
---

## 5. Gestión de Estado Global en el Cliente (`AuthProvider`)

El `AuthProvider` mantiene la sesión sincronizada en el navegador y la provee al resto de la aplicación a través de un contexto.

**Lógica Clave:**
* Recibe el estado inicial del `useInitialAuthLoader` del layout raíz.
* Usa `useVisibleTask$` para suscribirse a `onAuthStateChange` de Supabase, reaccionando a cambios de sesión en tiempo real.

### Código Fuente

```typescript
// RUTA: src/lib/auth/AuthProvider.tsx

import { component$, Slot, useContextProvider, $, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { useNavigate } from "@builder.io/qwik-city"
import { isBrowser } from "@builder.io/qwik/build"
import { createClient } from "~/lib/supabase/client" 
import { AuthContext, type AuthContextValue } from "~/lib/contexts/auth.context" 
import type { User } from "@supabase/supabase-js"

interface AuthProviderProps {
  user: User | null
}

export const AuthProvider = component$<AuthProviderProps>((props) => {
  const nav = useNavigate()
  const currentUser = useSignal<User | null>(props.user || null)

  const logout = $(async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (!error) {
      currentUser.value = null
      nav('/')
    }
  })

  useVisibleTask$(({ cleanup }) => {
    if (!isBrowser) return
    
    const supabase = createClient()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (currentUser.value?.id !== session?.user?.id) {
        currentUser.value = session?.user ?? null
      }
    })

    cleanup(() => subscription.unsubscribe())
  }, { strategy: 'document-ready' })

  const contextValue: AuthContextValue = {
    user: currentUser.value,
    isAuthenticated: !!currentUser.value,
    logout,
  }

  useContextProvider(AuthContext, contextValue)
  
  return <Slot />
})
```

## 6. Helpers y Piezas Reutilizables

Para mantener el código limpio, reutilizable y fácil de mantener (`DRY`), se utilizan funciones de ayuda que abstraen la lógica común. 

### Schemas de Validación (Zod)

Define las reglas de validación para los formularios de autenticación. Centralizar los esquemas asegura que la validación sea consistente en toda la aplicación.

```typescript
// RUTA: src/lib/schemas/auth.schema.ts

import { z } from 'zod'

export const authSchema = {
  login: z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  }),
  register: z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  }),
}
```

### Definición del Contexto

Este fichero define la "forma" (`shape`) del contexto de autenticación utilizando `createContextId`. Desacopla la definición del contexto de su implementación en el `AuthProvider`.

```typescript
// RUTA: src/lib/contexts/auth.context.ts

import { createContextId, type QRL } from '@builder.io/qwik'
import type { User } from '@supabase/supabase-js'

/**
 * Define la estructura de datos que contendrá nuestro contexto de autenticación.
 */
export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  logout: QRL<() => Promise<void>>
}

/**
 * Se crea un identificador único para el contexto.
 * Es crucial para que Qwik pueda localizar y gestionar el estado del contexto
 * de forma eficiente y segura a través de los límites de serialización.
 */
export const AuthContext = createContextId<AuthContextValue>('auth.context')
```

### Helpers para Acciones del Servidor

Estos helpers son funciones de orden superior (`higher-order functions`) que envuelven las `routeAction$` para reducir el código repetitivo y estandarizar el manejo de errores.

```typescript
// RUTA: src/lib/auth/helpers.ts

import type { RequestEventAction } from "@builder.io/qwik-city";
import { createServerSupabaseClient } from "./client";

/**
 * "withSupabase" es un helper que inyecta una instancia del cliente de Supabase
 * para el servidor en cualquier función que lo necesite, eliminando la necesidad
 * de crearlo manualmente en cada `routeAction$`.
 */
export const withSupabase = <T extends any[], R>(
  handler: (supabase: ReturnType<typeof createServerSupabaseClient>, ...args: T) => Promise<R>
) => {
  return async (requestEvent: RequestEventAction, ...args: T): Promise<R> => {
    const supabase = createServerSupabaseClient(requestEvent);
    return await handler(supabase, ...args);
  };
};

/**
 * "createAuthAction" es una factory function que estandariza el manejo de errores
 * y el formato de la respuesta para todas las acciones de autenticación.
 */
export const createAuthAction = <TData, TResult>(
  handler: (supabase: ReturnType<typeof createServerSupabaseClient>, data: TData) => Promise<TResult>
) => {
  return withSupabase(async (supabase, data: TData) => {
    try {
      const result = await handler(supabase, data);
      
      // Estandariza la respuesta de error si la operación de Supabase falla.
      if (result && typeof result === 'object' && 'error' in result && result.error) {
        return {
          success: false,
          error: (result.error as any).message || 'Error de autenticación',
        };
      }
      
      // Estandariza la respuesta de éxito.
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Auth action error:', error);
      // Estandariza la respuesta para errores inesperados.
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      };
    }
  });
};
```
---

## 7. Sincronización con la Base de Datos (Backend SQL)

Esta parte es crucial para mantener un perfil de usuario propio (`public.user`) sincronizado con el sistema de autenticación de Supabase (`auth.users`). Se realiza directamente en la base de datos mediante funciones y triggers de PostgreSQL, asegurando que los datos estén siempre consistentes sin intervención de la aplicación frontend.

**Lógica Clave:**
* **Tabla `public.user`**: Almacena datos adicionales del usuario (nombre, rol, etc.) que no pertenecen al esquema de `auth.users`.
* **`handle_new_auth_user`**: Una función SQL que se dispara cuando un nuevo usuario se registra en `auth.users`. Su trabajo es crear un registro correspondiente en la tabla `public.user`.
* **`handle_auth_user_update`**: Una función SQL que se dispara cuando un usuario de `auth.users` se actualiza. Específicamente, detecta cuándo el usuario ha confirmado su email para marcar el perfil en `public.user` como `is_active = TRUE`.

### Código Fuente

```sql
-- RUTA: documents/supabase_doc/USER_AUTHENTICATION_SUPA.md

# USER_AUTHENTICATION_SUPA

-- =================================================================
-- Tabla `user`
-- Almacena el perfil público y extendido de los usuarios.
-- =================================================================
CREATE TABLE public.user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  -- Este campo es clave para saber si un usuario ha completado el registro.
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  -- Relación con la tabla de autenticación de Supabase.
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'user'
);

---

-- =================================================================
-- Función: handle_new_auth_user
-- Se ejecuta cuando se crea un nuevo usuario en `auth.users`.
-- =================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserta una nueva fila en `public.user` con los datos del nuevo usuario de `auth`.
  INSERT INTO public.user (
    id,
    email,
    full_name,
    is_active,
    created_at,
    updated_at,
    auth_user_id,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    '', -- El nombre completo se puede dejar vacío para que el usuario lo complete después.
    -- El usuario solo está activo si su email ya viene confirmado.
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
    NOW(),
    NOW(),
    NEW.id,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

---

-- =================================================================
-- Trigger: on_auth_user_created
-- Dispara la función `handle_new_auth_user` después de cada `INSERT`.
-- =================================================================
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

---

-- =================================================================
-- Función: handle_auth_user_update
-- Se ejecuta cuando se actualiza un usuario en `auth.users`.
-- =================================================================
CREATE OR REPLACE FUNCTION public.handle_auth_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Se enfoca en el momento en que un usuario confirma su email.
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    -- Actualiza la tabla `public.user` para marcar al usuario como activo.
    UPDATE public.user
    SET is_active = TRUE, updated_at = NOW()
    WHERE auth_user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

---

-- =================================================================
-- Trigger: on_auth_user_updated
-- Dispara la función `handle_auth_user_update` después de cada `UPDATE`.
-- =================================================================
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_auth_user_update();

```