<div align="center">

<pre>
    O N U C A LL
</pre>

<br>

**Tu Agente IA de Voz 24/7. Construido con Qwik, Bun y Supabase.**

<br>

<p>
  <img alt="Estado de la Build" src="https://img.shields.io/github/actions/workflow/status/[TU_USUARIO]/[TU_REPO]/.github/workflows/ci.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=Build">
  <img alt="Versión de Qwik" src="https://img.shields.io/badge/Qwik-v1.5+-50.32.F7?style=for-the-badge&logo=qwik&logoColor=white">
  <img alt="Hecho con Bun" src="https://img.shields.io/badge/Hecho_con-Bun-black?style=for-the-badge&logo=bun">
  <img alt="Tailwind v4" src="https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img alt="Licencia" src="https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge">
</p>

</div>

---

## 🤖 ¿Qué es Onucall?

**Onucall** es un servicio SaaS (Software as a Service) que proporciona un **agente comercial IA por voz** ultra-realista, disponible 24/7.

Su misión es ayudar a negocios (Concesionarios, Inmobiliarias, Servicios Técnicos, etc.) a **nunca perder una oportunidad de venta**. La IA se encarga de:

- **Atender llamadas** al instante, 24/7.
- **Resolver dudas** sobre productos o servicios.
- **Cualificar leads** de forma inteligente.
- **Agendar citas** y demostraciones directamente en el calendario del equipo.

Este proyecto es el frontend de la aplicación, construido con Qwik para un rendimiento instantáneo.

## 🚀 Stack Tecnológico Principal

Esta aplicación está construida con un stack moderno enfocado en el rendimiento y la experiencia del desarrollador (DX).

| Categoría     | Tecnología                                      | Razón (Filosofía del Proyecto)                                               |
| :------------ | :---------------------------------------------- | :--------------------------------------------------------------------------- |
| **Runtime**   | [**Bun**](https://bun.sh/)                      | Velocidad extrema para instalación, testing y ejecución.                     |
| **Framework** | [**Qwik**](https://qwik.dev/)                   | Carga instantánea (Resumibilidad). Cero JS por defecto.                      |
| **Estilos**   | [**Tailwind CSS v4**](https://tailwindcss.com/) | Arquitectura "Zero-JS" (`@theme`) para un theming limpio y rápido.           |
| **UI Lógica** | [**Qwik-UI (Headless)**](https://qwikui.com/)   | Componentes accesibles (a11y) nativos de Qwik, sin estilos.                  |
| **Animación** | [**Motion One**](https://motion.dev/)           | Librería de animación ligera y performante, integrada con `useVisibleTask$`. |
| **Backend**   | [**Supabase**](https://supabase.com/)           | Autenticación, Base de Datos (Postgres) y Triggers SQL.                      |
| **ORM**       | [**Drizzle**](https://orm.drizzle.team/)        | ORM ligero y typesafe para interactuar con Supabase.                         |
| **IA Voz**    | [**Retell AI**](https://www.retell.ai/)         | (Referencia) El motor de IA conversacional por voz.                          |

## ⚡ Guía de Inicio Rápido

Este proyecto utiliza **Bun** como gestor de paquetes y runtime.

### 1. Clonar el Repositorio

```bash
git clone [https://github.com/](https://github.com/)[TU_USUARIO]/onucall-qwik.git
cd onucall-qwik
```

### 2. Instalar Dependencias

Se utiliza `bun install`.

```bash
bun install
```

### 3. Configurar Variables de Entorno

Copia el archivo `.env.example` a un nuevo archivo llamado `.env` y rellena las variables necesarias. Como mínimo, necesitarás las claves de **Supabase**.

```bash
cp .env.example .env
```

```env
# src/lib/supabase/client.ts
VITE_SUPABASE_URL="TU_URL_DE_SUPABASE"
VITE_SUPABASE_ANON_KEY="TU_ANON_KEY_DE_SUPABASE"

# (Otras claves de API, ej. Retell AI)
...
```

### 4. Ejecutar el Servidor de Desarrollo

```bash
bun run dev
```

Tu sitio estará disponible en `http://localhost:5173/`.

## 📜 Referencia de Comandos (Bun)

Todos los scripts están definidos en `package.json` y se ejecutan con `bun run`.

| Comando            | Descripción                                                                           |
| :----------------- | :------------------------------------------------------------------------------------ |
| `bun install`      | Instala todas las dependencias (más rápido que pnpm/npm).                             |
| `bun run dev`      | Inicia el servidor de desarrollo de Qwik City.                                        |
| `bun run build`    | Genera el build de producción (cliente y servidor).                                   |
| `bun run preview`  | Previsualiza el build de producción localmente.                                       |
| `bun run lint`     | Ejecuta ESLint para verificar la calidad del código.                                  |
| `bun run fmt`      | Formatea todo el código usando Prettier.                                              |
| `bun run qwik add` | Inicia el CLI de Qwik para añadir integraciones (ej. `bun run qwik add vercel-edge`). |
| `bun add [pkg]`    | Añade una nueva dependencia.                                                          |
| `bun remove [pkg]` | Elimina una dependencia.                                                              |

## 🏛️ Arquitectura y Guías del Proyecto

Este repositorio no es solo código; es una **base de conocimiento** que define cómo construimos. Para entender las decisiones de arquitectura, consulta las siguientes guías canónicas:

- **`ARQUITECTUR_FOLDER.md`**: Define la estructura de carpetas (Rutas, Componentes, Lib).
- **`QUALITY_STANDARDS.md`**: Define qué significa "calidad" (Performance, Robustez, Accesibilidad).
- **`UX_GUIDE.md`**: Principios de UX/UI para la landing page y la aplicación.
- **`TAILWIND_QWIK_GUIDE.md`**: Cómo usamos Tailwind CSS v4 con Qwik (Theming, `@theme`).
- **`MOTION_GUIDE.md`**: Patrones para usar Motion One en Qwik (Animación).
- **`BUN_SETUP.md`**: Guía de referencia para usar Bun en este proyecto.
- **`AUTH_IMPLEMENT_V2.md`**: Arquitectura de autenticación SSR con Supabase y Qwik.
