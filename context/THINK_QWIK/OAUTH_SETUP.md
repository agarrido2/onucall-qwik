# 🔐 Configuración de OAuth en Supabase

> Guía paso a paso para configurar Google y GitHub OAuth en tu proyecto Supabase.

## � Estado de Implementación

| Provider | Estado | Código | Configuración | Notas |
|----------|--------|--------|---------------|-------|
| 🔵 Google | ✅ ACTIVO | Implementado | ⏳ Pendiente | Prioridad alta - configurar pronto |
| ⚫ GitHub | ⏸️ FUTURO | No implementado | Pendiente | Implementar cuando producto esté muy avanzado |

> **Última actualización**: 9 de noviembre de 2025

---

## �📋 Tabla de Contenidos

- [Estado de Implementación](#estado-de-implementación)
- [Configuración en Supabase Dashboard](#configuración-en-supabase-dashboard)
- [Configurar Google OAuth](#configurar-google-oauth)
- [Configurar GitHub OAuth (Futuro)](#configurar-github-oauth-implementación-futura)
- [Probar la Integración](#probar-la-integración)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Configuración en Supabase Dashboard

### Paso 1: Acceder a Configuración de Auth

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Authentication** → **Providers**
3. Busca los providers que quieres habilitar (Google, GitHub)

### Paso 2: Configurar URLs de Callback

En **Authentication** → **URL Configuration**, configura:

**Site URL:**
```
http://localhost:5173  (desarrollo)
https://tu-dominio.com (producción)
```

**Redirect URLs:** (añade AMBAS)
```
http://localhost:5173/auth/callback
https://tu-dominio.com/auth/callback
```

---

## 🔵 Configurar Google OAuth (✅ CÓDIGO LISTO - ⏳ CONFIGURACIÓN PENDIENTE)

> ✅ **ESTADO**: Código implementado y funcionando en la aplicación.  
> ⏳ **PENDIENTE**: Configuración en Google Cloud Console (tarea prioritaria).

### Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Navega a **APIs & Services** → **Credentials**

### Paso 2: Configurar OAuth Consent Screen

1. Click en **OAuth consent screen**
2. Selecciona **External** (para permitir cualquier usuario de Google)
3. Rellena la información básica:
   - **App name**: OnuCall (o el nombre de tu app)
   - **User support email**: tu email
   - **Developer contact information**: tu email
4. Click **Save and Continue**
5. En **Scopes**, añade:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
6. Click **Save and Continue**
7. En **Test users** (opcional en desarrollo), añade emails de prueba
8. Click **Save and Continue**

### Paso 3: Crear OAuth Client ID

1. Ve a **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Selecciona **Web application**
4. Rellena:
   - **Name**: OnuCall Web Client
   - **Authorized JavaScript origins** (⚠️ Google NO permite localhost aquí):
     ```
     https://uyradeufmhqymutizwvt.supabase.co
     ```
   - **Authorized redirect URIs** (✅ Aquí SÍ puedes usar localhost):
     ```
     https://uyradeufmhqymutizwvt.supabase.co/auth/v1/callback
     http://localhost:5173/auth/callback
     ```
5. Click **Create**
6. **COPIA** el **Client ID** y **Client Secret** (los necesitarás ahora)

> **⚠️ IMPORTANTE - Por Qué Esta Configuración:**
> 
> - **JavaScript origins**: Solo Supabase, porque Google redirige allí primero (no acepta localhost)
> - **Redirect URIs**: Ambos (Supabase + localhost), porque el callback final SÍ vuelve a tu localhost
> 
> **Flujo real**: localhost → Supabase → Google → Supabase → localhost
> 
> Google nunca ve tu localhost en los "origins", solo en el redirect final (que sí está permitido).

### Paso 4: Configurar en Supabase

1. Ve a Supabase Dashboard → **Authentication** → **Providers**
2. Busca **Google** y actívalo
3. Pega:
   - **Client ID**: (el que copiaste de Google)
   - **Client Secret**: (el que copiaste de Google)
4. Click **Save**

✅ **Google OAuth está configurado!**

---

## ⚫ Configurar GitHub OAuth (⏸️ IMPLEMENTACIÓN FUTURA)

> ⚠️ **ESTADO**: Esta funcionalidad está **PLANIFICADA** pero **NO IMPLEMENTADA**.
> 
> **Razón**: Priorización - se implementará cuando el producto esté muy avanzado.
> 
> **Para implementar cuando llegue el momento**:
> 1. Actualizar `src/routes/api/auth/oauth/index.ts` para aceptar `provider === 'github'`
> 2. Añadir botón de GitHub en `src/features/auth/components/OAuthButtons.tsx`
> 3. Actualizar tipos TypeScript de `'google'` a `'google' | 'github'`
> 4. Seguir los pasos de configuración a continuación
> 5. Actualizar el estado en la tabla al inicio de este documento

---

**Pasos de configuración (listos para usar cuando lo necesites):**

### Paso 1: Crear OAuth App en GitHub

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Rellena:
   - **Application name**: OnuCall
   - **Homepage URL**: `http://localhost:5173` (o tu dominio)
   - **Authorization callback URL**:
     ```
     https://uyradeufmhqymutizwvt.supabase.co/auth/v1/callback
     ```
4. Click **Register application**

### Paso 2: Generar Client Secret

1. En la página de tu OAuth App, click **Generate a new client secret**
2. **COPIA** el **Client ID** y **Client Secret** inmediatamente

### Paso 3: Configurar en Supabase

1. Ve a Supabase Dashboard → **Authentication** → **Providers**
2. Busca **GitHub** y actívalo
3. Pega:
   - **Client ID**: (el que copiaste de GitHub)
   - **Client Secret**: (el que copiaste de GitHub)
4. Click **Save**

✅ **GitHub OAuth está configurado!**

---

## 🧪 Probar la Integración

### Desarrollo Local

1. Asegúrate de que tu servidor está corriendo:
   ```bash
   bun run dev
   ```

2. Ve a `http://localhost:5173/login`

3. Deberías ver los botones de **Continuar con Google** y **Continuar con GitHub**

4. Click en uno de los botones:
   - Te redirigirá a la página de autorización del provider
   - Autoriza la aplicación
   - Serás redirigido de vuelta a `/dashboard`
   - Tu sesión estará activa

### Verificar Sesión

En el dashboard, deberías ver tu email e ID de usuario. Verifica que:
- ✅ El email coincide con tu cuenta de Google/GitHub
- ✅ Puedes hacer logout
- ✅ Puedes volver a hacer login con el mismo provider

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Causa**: La URL de callback no está autorizada en el provider.

**Solución**:
1. Verifica que la URL de callback en Google/GitHub sea EXACTAMENTE:
   ```
   https://uyradeufmhqymutizwvt.supabase.co/auth/v1/callback
   ```
2. NO uses `http://` (debe ser `https://`)
3. NO añadas rutas adicionales (debe terminar en `/callback`)

### Error: "Invalid client ID or secret"

**Causa**: Credenciales incorrectas o expiradas.

**Solución**:
1. Regenera el Client Secret en el provider
2. Actualiza las credenciales en Supabase
3. Guarda los cambios

### Error: "Email address already registered"

**Causa**: Ya existe una cuenta con ese email (creada por otro método).

**Solución**:
1. Si creaste la cuenta con email/password, usa ese método para login
2. Si quieres vincular el provider, necesitas implementar account linking (feature avanzada)
3. Alternativamente, usa otro email para probar

### El botón no hace nada

**Causa**: Posible error de JavaScript o configuración.

**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores de red o JavaScript
3. Verifica que el endpoint `/api/auth/oauth` responde correctamente:
   ```bash
   curl -X POST http://localhost:5173/api/auth/oauth \
     -d "provider=google"
   ```

### Redirige a callback pero no crea sesión

**Causa**: Error en el intercambio de código por sesión.

**Solución**:
1. Verifica que `exchangeCodeForSession` esté configurado correctamente en `/auth/callback`
2. Comprueba los logs del servidor para ver errores de Supabase
3. Verifica que las cookies estén habilitadas en el navegador

---

## 📚 Referencias

- [Supabase Auth - OAuth](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [GitHub OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [GUIDE_AUTH_SUPA_QWIK.md](./GUIDE_AUTH_SUPA_QWIK.md) - Implementación completa en Qwik

---

## ✅ Checklist de Configuración

Antes de pasar a producción, asegúrate de:

- [ ] Google OAuth configurado en Google Cloud Console
- [ ] GitHub OAuth configurado en GitHub Developer Settings
- [ ] Ambos providers activados en Supabase
- [ ] Client IDs y Secrets correctos en Supabase
- [ ] URLs de callback configuradas en ambos providers
- [ ] Site URL y Redirect URLs configuradas en Supabase
- [ ] Probado login con Google en desarrollo
- [ ] Probado login con GitHub en desarrollo
- [ ] Actualizado dominio de producción en todos los lugares
- [ ] Probado logout y re-login

**Estado actual**: OAuth implementado en código, pendiente configuración manual en Supabase Dashboard.
