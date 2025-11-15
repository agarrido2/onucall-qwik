# TODO - OnuCall Project

Registro de tareas pendientes organizadas por área funcional.

---

## 🎨 Landing Page

### SEO y Metadatos

- [ ] **Crear imagen Open Graph (OG)**
  - Diseñar y crear `public/og-image.png` (1200x630px)
  - Incluir: logo, tagline "El mejor empleado digital 24/7", branding OnuCall
  - Usar en metadatos para compartir en redes sociales
  - [CITE: SEO_A11Y_GUIDE.md - Regla 3.4]

- [ ] **Implementar Schema.org para FAQ**
  - Añadir datos estructurados JSON-LD de tipo `FAQPage` en `DocumentHead`
  - Incluir las 4 preguntas de `FAQSection`
  - Mejora SEO y habilita rich snippets en Google
  - [CITE: SEO_A11Y_GUIDE.md - Regla 3.6]

- [ ] **Implementar Schema.org para Pricing**
  - Añadir datos estructurados JSON-LD de tipo `Product/Offer`
  - Incluir los 3 planes: Starter (49€), Business (99€), Enterprise (custom)
  - Mejora visibilidad en resultados de búsqueda
  - [CITE: SEO_A11Y_GUIDE.md - Regla 3.6]

### Contenido y Diseño

- [ ] **Reemplazar placeholder del Hero**
  - Sustituir el placeholder actual por imagen real del dashboard
  - Usar patrón `import DashboardImg from '~/assets/images/dashboard.png?jsx'`
  - O componente `<Image>` de `@unpic/qwik` si es dinámica
  - [CITE: SEO_A11Y_GUIDE.md - Regla 4.1]

---

## 🔐 Autenticación

### OAuth Google

- [ ] **Configuración Google Cloud Console**
  - Completar setup de credenciales OAuth 2.0
  - Configurar Authorized redirect URIs
  - Obtener Client ID y Client Secret para producción
  - Actualizar variables de entorno en `.env`
  - [CITE: AUTH/OAUTH_SETUP.md - Sección Google OAuth]

### OAuth GitHub (Implementación Futura)

- [ ] **Añadir GitHub OAuth Provider (cuando producto esté muy avanzado)**
  - Actualizar validación en `src/routes/api/auth/oauth/index.ts` para aceptar `'github'`
  - Añadir botón de GitHub en `src/features/auth/components/OAuthButtons.tsx`
  - Actualizar tipos TypeScript de `'google'` a `'google' | 'github'`
  - Crear OAuth App en GitHub Developer Settings
  - Configurar en Supabase Dashboard
  - Testing del flujo completo OAuth
  - Actualizar estado en `OAUTH_SETUP.md` tabla de implementación
  - [CITE: AUTH/OAUTH_SETUP.md - Sección GitHub OAuth]
  - [CITE: AUTH/PROVIDERS/SUPABASE.md - Roadmap de OAuth Providers]

### Flujos de Usuario

- [ ] **Verificación de Email (#4)**
  - Implementar sistema de verificación de correo electrónico
  - Email de bienvenida con enlace de confirmación
  - Página de confirmación exitosa/fallida
  - Resend de email si expira el token
  - [CITE: AUTH/PROVIDERS/SUPABASE.md]

---

## 👤 Gestión de Usuario

### Perfil

- [ ] **Página de Perfil (#3)**
  - Crear ruta `/profile` o `/dashboard/profile`
  - Formulario de edición de datos: nombre, email, avatar
  - Subida de avatar (integrar con Supabase Storage)
  - Validación con Zod
  - [CITE: QUALITY_STANDARDS.md]

---

## 🔒 Seguridad y Permisos

### RBAC (Role-Based Access Control)

- [ ] **Sistema de Roles (#5)**
  - Definir roles: `admin`, `user`, `viewer` (o según necesidades)
  - Tabla `user_roles` en base de datos (Drizzle schema)
  - Middleware de protección de rutas por rol
  - Componente `<ProtectedRoute>` o similar
  - [CITE: ARQUITECTURA_FOLDER.md]

---

## 🧪 Testing

### Tests End-to-End

- [ ] **Tests E2E con Playwright (#6)**
  - Setup de Playwright en el proyecto
  - Tests para flujo de registro/login
  - Tests para navegación de landing page
  - Tests para formulario de demo
  - CI/CD integration (GitHub Actions)
  - [CITE: QUALITY_STANDARDS.md]

---

## 📚 Documentación

### Actualización de Docs

- [ ] **Documentar cambios recientes (#7)**
  - Actualizar README.md con setup actual
  - Documentar estructura de carpetas final
  - Guía de contribución (CONTRIBUTING.md)
  - Changelog con versiones y cambios
  - [CITE: ARQUITECTURA_FOLDER.md]

---

## ⚡ Optimizaciones y Performance

### Fuentes

- [ ] **Auto-alojar fuentes (opcional)**
  - Si usas Google Fonts, migrar a fuentes locales
  - Crear carpeta `public/fonts/`
  - Usar `font-display: swap` en CSS
  - [CITE: SEO_A11Y_GUIDE.md - Regla 4.2]

### Analytics

- [ ] **Implementar Analytics con Partytown (post-launch)**
  - Integrar Google Analytics 4
  - Usar Partytown para mover script a Web Worker
  - Proteger Core Web Vitals (INP)
  - [CITE: SEO_A11Y_GUIDE.md - Regla 4.5]

---

## 🚀 Deployment

### Pre-Launch Checklist

- [ ] **Verificar configuración de producción**
  - Variables de entorno en servidor
  - URLs de OAuth actualizadas
  - Supabase proyecto de producción configurado
  - Dominio `onucall.com` en metadatos y sitemap
  - Certificado SSL activo

- [ ] **Testing en producción**
  - Smoke tests de rutas principales
  - Verificar `/robots.txt` accesible
  - Verificar `/sitemap.xml` generado correctamente
  - Validar Open Graph con Facebook Debugger
  - Lighthouse audit (Performance, SEO, A11y > 90)

---

## 📝 Notas

### Convenciones

- Las referencias `[CITE: archivo.md]` apuntan a la documentación canónica en `context/THINK_QWIK/`
- Los números `(#N)` corresponden a IDs de issues/tasks previas del proyecto
- Prioridad implícita: tareas sin checkbox vacío `[ ]` = pendiente, con `[x]` = completada

### Última actualización

**Fecha**: 9 de noviembre de 2025  
**Autor**: Qwik City Guru (AI Agent)
