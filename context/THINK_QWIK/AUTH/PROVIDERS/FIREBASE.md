# 🔥 Implementación de Auth con Firebase en Qwik

> **📘 PREREQUISITO**: Lee primero [GUIDE_AUTH_QWIK.md](../GUIDE_AUTH_QWIK.md) para entender los patrones universales de auth en Qwik.

---

## 📊 Estado: 📅 PLANIFICADO

Esta guía se creará cuando se implemente Firebase como provider alternativo de autenticación.

---

## 🎯 Roadmap de Implementación

### Fase 1: Setup Inicial
- [ ] Crear proyecto en Firebase Console
- [ ] Instalar `firebase` SDK y `@firebase/app-check` (opcional)
- [ ] Configurar variables de entorno
- [ ] Crear adaptador SSR para Qwik (similar a `createServerSupabaseClient`)

### Fase 2: Email/Password Auth
- [ ] Implementar `signInWithEmailAndPassword`
- [ ] Implementar `createUserWithEmailAndPassword`
- [ ] Manejo de cookies seguras (`httpOnly`)
- [ ] Integración con `routeAction$` y `routeLoader$`

### Fase 3: OAuth Providers
- [ ] Configurar Google OAuth en Firebase Console
- [ ] Configurar GitHub OAuth en Firebase Console
- [ ] Implementar flujo de OAuth con `signInWithPopup` o `signInWithRedirect`
- [ ] Callback handling

### Fase 4: Features Adicionales
- [ ] Email Verification
- [ ] Password Reset
- [ ] Multi-Factor Authentication (MFA)
- [ ] Phone Authentication (SMS)

### Fase 5: Testing y Documentación
- [ ] Tests unitarios para auth helpers
- [ ] Tests E2E para flujos de login/register
- [ ] Documentación de troubleshooting
- [ ] Comparativa con Supabase (pros/cons)

---

## 📚 Recursos de Referencia

Mientras se implementa, consulta estos recursos oficiales:

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firebase Auth for Web](https://firebase.google.com/docs/auth/web/start)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) - Para validación server-side
- [Best Practices for Firebase Auth](https://firebase.google.com/docs/auth/web/best-practices)

---

## 💡 Ventajas de Firebase vs Supabase

| Aspecto | Firebase | Supabase |
|---------|----------|----------|
| **Ecosistema** | ✅ Google Cloud completo | ✅ PostgreSQL nativo |
| **Realtime DB** | ✅ Firestore (NoSQL) | ✅ Postgres + Realtime |
| **Auth Providers** | ✅ Phone, Apple, Game Center | ✅ Magic Links, SAML |
| **Pricing** | ✅ Spark: gratis ilimitado | ✅ Free: 50k users |
| **Self-hosting** | ❌ No disponible | ✅ Docker disponible |
| **Analytics** | ✅ Google Analytics integrado | ⚠️ Requiere integración |
| **DX** | ✅ Excelente | ✅ Excelente |

**Cuándo elegir Firebase**:
- Necesitas integración profunda con Google Cloud
- Priorizas simplicidad de setup
- Necesitas Phone Authentication out-of-the-box
- Tu stack es NoSQL (Firestore)

**Cuándo elegir Supabase** (actual del proyecto):
- Necesitas PostgreSQL + Drizzle ORM
- Priorizas Row Level Security (RLS)
- Quieres opción de self-hosting
- Prefieres open source

---

## 🤝 ¿Quieres Contribuir?

Si tienes experiencia con Firebase + Qwik y quieres implementar esta guía:

1. Abre un issue en GitHub describiendo tu propuesta
2. Fork el repo y crea una rama `feature/firebase-auth`
3. Implementa siguiendo los patrones de [GUIDE_AUTH_QWIK.md](../GUIDE_AUTH_QWIK.md)
4. Documenta todo el proceso en este archivo
5. Abre un Pull Request

**Checklist para contribución**:
- [ ] Código funcional en `src/lib/firebase/`
- [ ] Examples en `src/routes/(auth)/`
- [ ] Tests E2E pasando
- [ ] Documentación completa con screenshots
- [ ] Tabla comparativa con Supabase actualizada

---

**Última actualización**: 15 de noviembre de 2025
