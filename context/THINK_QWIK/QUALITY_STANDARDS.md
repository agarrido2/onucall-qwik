# Estándares de Calidad - Qwik OnuCall

**Propósito**: Este documento define criterios medibles y objetivos para los 5 pilares de calidad que todo código debe cumplir: **Performante**, **Idiomático**, **Robusto**, **Accesible** y **Seguro**.

---

## 1. PERFORMANTE

### Métricas Cuantificables

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| **Bundle inicial JS** | < 1KB (ideal Qwik) | Vite build analysis |
| **Time to Interactive (TTI)** | < 3s | Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse |
| **First Input Delay (FID)** | < 100ms | Lighthouse |
| **Hydration** | **CERO** (resumability) | N/A (arquitectura) |

### Checklist de Verificación

- ✅ Usa `routeLoader$` para datos de servidor (SSR)
- ✅ Lazy loading de imágenes con `loading="lazy"` o `@unpic/qwik`
- ✅ Componentes pesados cargados on-demand (code splitting automático de Qwik)
- ✅ Evita `useVisibleTask$` a menos que sea absolutamente necesario (hidratación)
- ✅ Usa `useTask$` para efectos reactivos (no hidrata)
- ✅ Prefiere `useSignal()` sobre `useStore()` para valores primitivos

### Ejemplos

**✅ CORRECTO:**
```typescript
// routeLoader$ para datos SSR (cero JS en cliente)
export const useUserData = routeLoader$(async () => {
  return await fetchUserData();
});

export default component$(() => {
  const userData = useUserData();
  return <div>{userData.value.name}</div>;
});
```

**❌ INCORRECTO:**
```typescript
// useVisibleTask$ innecesario (hidrata en cliente)
export default component$(() => {
  const userData = useSignal(null);
  
  useVisibleTask$(async () => {
    userData.value = await fetchUserData(); // 🔴 Hidrata!
  });
  
  return <div>{userData.value?.name}</div>;
});
```

---

## 2. IDIOMÁTICO (Qwik)

### Patrones Correctos

| Patrón | Descripción |
|--------|-------------|
| `component$()` | Siempre usa `component$()` en lugar de `function()` |
| `useSignal()` | Estado reactivo para primitivos |
| `useStore()` | Estado reactivo para objetos/arrays |
| `useTask$()` | Efectos reactivos (reemplaza `useEffect`) |
| `routeLoader$` | Carga de datos server-side |
| `routeAction$` | Mutaciones server-side |
| `server$` | RPC functions para lógica de servidor |
| Suffix `$` | En funciones serializables |
| JSX | Sintaxis de template |

### Anti-patrones a Evitar

- ❌ `useEffect` (es de React, usa `useTask$` o `useVisibleTask$`)
- ❌ `useState` (es de React, usa `useSignal` o `useStore`)
- ❌ Hidratación innecesaria (evita `useVisibleTask$` si no es crítico)
- ❌ Inline event handlers sin `$`: `onClick={() => ...}` (debe ser `onClick$={...}`)
- ❌ Props no serializables (funciones sin `$`, clases, etc.)

### Ejemplos

**✅ CORRECTO:**
```typescript
export default component$(() => {
  const count = useSignal(0);
  
  const increment = $(() => {
    count.value++;
  });
  
  return <button onClick$={increment}>Count: {count.value}</button>;
});
```

**❌ INCORRECTO:**
```typescript
// Anti-patrón: Mezclando React con Qwik
export default component$(() => {
  const [count, setCount] = useState(0); // 🔴 React hook!
  
  useEffect(() => { // 🔴 React hook!
    console.log(count);
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>; // 🔴 Sin $
});
```

---

## 3. ROBUSTO

### Checklist Mínimo (No Negociable)

- ✅ **TypeScript strict mode** habilitado (`strict: true` en tsconfig.json)
- ✅ **Validación de inputs** de usuario con Zod
- ✅ **Manejo de estados de error** (UI muestra mensajes de error)
- ✅ **Estados de carga** (spinners, skeletons para async operations)
- ✅ **Fallbacks** para datos opcionales (`?.` optional chaining, `??` nullish coalescing)
- ✅ **Try-catch** en operaciones async críticas
- ✅ **Manejo de edge cases**: Array vacío, null, undefined, errores de red

### Nice to Have

- Error boundaries (Qwik ErrorBoundary)
- Retry logic en peticiones críticas (exponential backoff)
- Logging estructurado de errores (ej. Sentry)
- Tests unitarios para lógica crítica

### Ejemplos

**✅ CORRECTO:**
```typescript
import { z } from 'zod';
import { routeAction$, zod$ } from '@builder.io/qwik-city';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const useLoginAction = routeAction$(async (data) => {
  try {
    const user = await loginUser(data.email, data.password);
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    };
  }
}, zod$(loginSchema)); // ✅ Validación server-side con Zod

export default component$(() => {
  const loginAction = useLoginAction();
  
  return (
    <form action={loginAction}>
      {loginAction.value?.success === false && (
        <div role="alert">{loginAction.value.error}</div> // ✅ Error handling
      )}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={loginAction.isRunning}>
        {loginAction.isRunning ? 'Logging in...' : 'Login'} // ✅ Loading state
      </button>
    </form>
  );
});
```

**❌ INCORRECTO:**
```typescript
// Sin validación, sin error handling, sin loading state
export default component$(() => {
  return (
    <form action="/api/login"> {/* 🔴 Sin validación */}
      <input name="email" /> {/* 🔴 Sin type ni required */}
      <input name="password" />
      <button>Login</button> {/* 🔴 Sin loading state */}
    </form>
    {/* 🔴 Sin manejo de errores */}
  );
});
```

---

## 4. ACCESIBLE (a11y)

### Estándar: WCAG 2.1 AA

### Checklist Obligatorio

- ✅ **HTML semántico**: `<button>`, `<nav>`, `<main>`, `<article>`, `<header>`, `<footer>`
- ✅ **Contraste de color**: Mínimo 4.5:1 para texto normal, 3:1 para texto grande
- ✅ **Alt text**: Todas las imágenes con `alt` descriptivo (no "imagen", describe el contenido)
- ✅ **ARIA labels**: Botones-icono con `aria-label`, elementos interactivos con labels
- ✅ **Navegación por teclado**: Tab, Enter, Escape funcionan correctamente
- ✅ **Focus visible**: Outline claro en elementos interactivos (no `outline: none` sin alternativa)
- ✅ **Labels en inputs**: Asociados correctamente (`<label for="id">` o `<label><input></label>`)
- ✅ **Roles ARIA**: Correctos para widgets personalizados (ej. `role="dialog"` en modales)

### Herramientas de Validación

- **Lighthouse**: Accessibility score > 90
- **axe DevTools**: 0 violaciones críticas
- **Manual**: Navegar con teclado únicamente (Tab, Enter, Escape)
- **Screen reader**: VoiceOver (macOS) o NVDA (Windows)

### Ejemplos

**✅ CORRECTO:**
```typescript
export default component$(() => {
  return (
    <>
      {/* Botón semántico con texto */}
      <button onClick$={() => handleClick()}>
        Guardar Cambios
      </button>
      
      {/* Botón-icono con aria-label */}
      <button aria-label="Cerrar modal" onClick$={() => closeModal()}>
        <IconClose />
      </button>
      
      {/* Input con label asociado */}
      <label for="email">Email</label>
      <input id="email" type="email" required />
      
      {/* Navegación semántica */}
      <nav aria-label="Navegación principal">
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/about">Nosotros</a></li>
        </ul>
      </nav>
    </>
  );
});
```

**❌ INCORRECTO:**
```typescript
export default component$(() => {
  return (
    <>
      {/* 🔴 Div clickable sin rol ni semantica */}
      <div onClick$={() => handleClick()}>
        Guardar
      </div>
      
      {/* 🔴 Botón-icono sin label */}
      <button onClick$={() => closeModal()}>
        <IconClose />
      </button>
      
      {/* 🔴 Input sin label */}
      <input type="email" placeholder="Email" />
      
      {/* 🔴 Navegación sin semántica */}
      <div class="menu">
        <div onClick$={() => navigate('/')}>Inicio</div>
        <div onClick$={() => navigate('/about')}>Nosotros</div>
      </div>
    </>
  );
});
```

---

## 5. SEGURO

### Checklist Obligatorio

- ✅ **Sanitización de inputs**: Prevenir XSS (nunca usar HTML no sanitizado)
- ✅ **Validación server-side**: NUNCA confiar solo en validación client-side
- ✅ **CSRF protection**: Tokens en formularios (Qwik City lo incluye por defecto)
- ✅ **Content Security Policy (CSP)**: Configurado en producción
- ✅ **HTTPS**: Obligatorio en producción
- ✅ **No exponer secrets**: API keys, tokens solo en servidor (`.env.local`, nunca en código)
- ✅ **Validación con Zod**: En `routeAction$` y `server$` para mutaciones

### Anti-patrones a Evitar

- ❌ `dangerouslySetInnerHTML` sin sanitización (Qwik usa `dangerouslySetInnerHTML`)
- ❌ `eval()` o `new Function()` con user input
- ❌ API keys hardcodeadas en código frontend
- ❌ Validación solo en frontend (siempre validar en servidor)
- ❌ SQL injection (usa ORMs como Drizzle, nunca raw queries con concatenación)

### Ejemplos

**✅ CORRECTO:**
```typescript
import { z } from 'zod';
import { routeAction$, zod$ } from '@builder.io/qwik-city';

const commentSchema = z.object({
  text: z.string().min(1).max(500),
  authorId: z.string().uuid(),
});

// ✅ Validación server-side con Zod
export const useCreateComment = routeAction$(async (data, { env }) => {
  // ✅ Acceso a secrets desde env del servidor
  const apiKey = env.get('API_KEY');
  
  try {
    // ✅ Drizzle protege contra SQL injection
    const comment = await db.insert(comments).values({
      text: data.text, // ✅ Ya validado por Zod
      authorId: data.authorId,
    });
    
    return { success: true, comment };
  } catch (error) {
    return { success: false, error: 'Failed to create comment' };
  }
}, zod$(commentSchema));

export default component$(() => {
  const createComment = useCreateComment();
  
  return (
    <form action={createComment}>
      {/* ✅ CSRF token automático en Qwik City */}
      <textarea name="text" required maxLength={500} />
      <button type="submit">Post Comment</button>
    </form>
  );
});
```

**❌ INCORRECTO:**
```typescript
// 🔴 Sin validación server-side
export const useCreateComment = routeAction$(async (data) => {
  // 🔴 No valida los datos
  const comment = await db.query(
    `INSERT INTO comments (text) VALUES ('${data.text}')` // 🔴 SQL injection!
  );
  return { success: true };
});

// 🔴 API key expuesta en frontend
const API_KEY = 'sk-1234567890abcdef'; // 🔴 Nunca en código!

export default component$(() => {
  return (
    <form>
      {/* 🔴 Sin validación, sin CSRF */}
      <textarea name="text" />
      <button onClick$={async () => {
        // 🔴 Lógica de mutación en cliente
        await fetch('/api/comments', {
          method: 'POST',
          headers: { 'X-API-Key': API_KEY }, // 🔴 Secret expuesto!
        });
      }}>Post</button>
    </form>
  );
});
```

---

## PROTOCOLO DE VALIDACIÓN

### Código Crítico (Validación Automática)

Para los siguientes tipos de código, el agente debe proporcionar un **Checklist de Calidad** al finalizar:

- **Formularios** (inputs de usuario)
- **Autenticación** (login, register, password reset)
- **Manejo de datos** (`routeLoader$`, `routeAction$`, `server$`)
- **Componentes con estado complejo** (múltiples useStore/useSignal)

**Formato de validación:**
```
🔍 VALIDACIÓN DE CALIDAD

✅ Performante: 
  - [Métrica cumplida]
  
✅ Idiomático:
  - [Patrón aplicado]
  
✅ Robusto:
  - [Checklist cumplida]
  
✅ Accesible:
  - [Estándar cumplido]
  
✅ Seguro:
  - [Protección implementada]

[CITE: QUALITY_STANDARDS.md]
```

### Código No Crítico (Sin Validación Explícita)

Para componentes simples (ej. botón estático, card de presentación), el agente aplica los estándares pero **no genera** checklist explícito para evitar ruido.

---

## REFERENCIAS

- [Qwik Docs - Best Practices](https://qwik.builder.io/docs/advanced/best-practices/)
- [Web Vitals - Google](https://web.dev/vitals/)
- [WCAG 2.1 - W3C](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
