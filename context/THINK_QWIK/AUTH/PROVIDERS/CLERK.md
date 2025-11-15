# ✨ Implementación de Auth con Clerk en Qwik

> **📘 PREREQUISITO**: Lee primero [GUIDE_AUTH_QWIK.md](../GUIDE_AUTH_QWIK.md) para entender los patrones universales de auth en Qwik.

---

## 📊 Estado: 💭 CONSIDERADO

Esta guía se creará si el proyecto requiere Clerk para casos de uso donde la UX del onboarding es crítica (SaaS B2C).

---

## 🎯 ¿Cuándo Usar Clerk?

Clerk es ideal para:

### ✅ Casos de Uso Recomendados
- **SaaS B2C con onboarding complejo**: Sign-up flows de múltiples pasos
- **UX premium out-of-the-box**: Componentes pre-diseñados y responsive
- **User Management Dashboard**: Admin panel para gestionar usuarios
- **Social Login prioritario**: Google, GitHub, Discord, Twitter, etc.
- **Webhooks avanzados**: Sincronización automática con tu DB

### ⚠️ NO Recomendado Para
- **Apps que requieren PostgreSQL directo**: Clerk no incluye base de datos propia
- **Budget limitado**: Free tier de 10k users, pero features clave son de pago
- **Customización extrema**: Clerk tiene su propio estilo y flujos

---

## 💰 Pricing Comparison

| Tier | MAUs | Precio | Features |
|------|------|--------|----------|
| **Free** | 10,000 | $0 | Social login, email/password |
| **Pro** | 10,000 + extra | $25/mes | Organizations, multi-tenancy |
| **Enterprise** | Custom | Custom | SLA, SSO, SCIM |

**Extra users**: $0.02/MAU (mensual activo)

**vs Supabase**: 50k users gratis (ganador en pricing)  
**vs Firebase**: Ilimitado gratis  
**vs Auth0**: 7k users gratis (Clerk gana)

---

## 📚 Roadmap de Implementación (Si se necesita)

### Fase 1: Evaluación
- [ ] Justificar por qué Clerk vs Supabase (actual)
- [ ] Evaluar si el premium pricing vale la pena para el proyecto
- [ ] Confirmar integración con base de datos externa (Drizzle + Postgres)

### Fase 2: Setup
- [ ] Crear aplicación en Clerk Dashboard
- [ ] Instalar `@clerk/clerk-react` (adaptar a Qwik)
- [ ] Configurar API keys
- [ ] Implementar `<ClerkProvider>` en layout

### Fase 3: Implementación
- [ ] Sign-up/Sign-in con componentes de Clerk
- [ ] User profile management
- [ ] Protección de rutas con middleware
- [ ] Webhooks para sincronizar con Postgres

### Fase 4: Advanced Features (Si aplica)
- [ ] Organizations (multi-tenancy)
- [ ] Roles y permisos
- [ ] Session management
- [ ] Custom domains

---

## 🔗 Recursos Oficiales

- [Clerk Docs](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview) - Adaptable a Qwik
- [Clerk Backend API](https://clerk.com/docs/references/backend/overview)
- [Clerk Webhooks](https://clerk.com/docs/integration/webhooks)

---

## 💡 Ventajas de Clerk vs Otros Providers

| Aspecto | Clerk | Supabase | Firebase | Auth0 |
|---------|-------|----------|----------|-------|
| **UX out-of-the-box** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Onboarding flows** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Database incluida** | ❌ | ✅ Postgres | ✅ Firestore | ❌ |
| **Free tier** | 10k users | 50k users | Ilimitado | 7k users |
| **Pricing transparente** | ✅ | ✅ | ✅ | ⚠️ |
| **Self-hosting** | ❌ | ✅ | ❌ | ❌ |
| **Customización** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Clerk brilla en**: UX, onboarding, developer experience  
**Supabase brilla en**: Open source, database, pricing, self-hosting  
**Firebase brilla en**: Ecosistema Google, simplicidad  
**Auth0 brilla en**: Enterprise features, compliance

---

## 🤔 ¿Por Qué NO Usamos Clerk Actualmente?

En este proyecto usamos **Supabase** por:

1. **Database incluida**: PostgreSQL + Drizzle ORM (stack del proyecto)
2. **Pricing**: 50k users gratis vs 10k de Clerk
3. **Open source**: Opción de self-hosting en futuro
4. **Control total**: Customización sin límites

**Clerk sería mejor si**:
- Priorizáramos UX de onboarding sobre todo lo demás
- El proyecto fuera SaaS B2C con múltiples planes de subscripción
- Necesitáramos organizations y multi-tenancy desde día 1

---

## 🤝 ¿Quieres Migrar a Clerk?

Si consideras que Clerk es mejor para tu caso de uso, abre un issue en GitHub con:

1. **Justificación**: ¿Qué problema resuelve Clerk que Supabase no?
2. **Trade-offs**: ¿Estás OK con perder database incluida?
3. **Budget**: ¿Aprobado el costo potencial de usuarios extra?
4. **Timeline**: ¿Cuándo necesitas la migración?

Evaluaremos la propuesta y planificaremos la migración si tiene sentido.

---

**Última actualización**: 15 de noviembre de 2025
