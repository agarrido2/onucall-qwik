# Guía de Estilo y UX/UI para IA (Versión Definitiva 2025)

**Propósito**: Este documento establece los principios y directivas para la generación de interfaces de usuario (UI) y experiencias de usuario (UX) de alta calidad. El objetivo es que la IA pueda crear diseños visualmente atractivos, intuitivos y efectivos, tanto para páginas de marketing (Landing Pages) como para aplicaciones funcionales (Web Apps), alineados con las tendencias de 2025.

---
## PARTE 1.0: TONO DE MARCA Y PERSONALIDAD

Antes de cualquier diseño, se debe entender el tono de la marca. El tono de Onucall es **profesional, tecnológico y confiable**, pero también **accesible y humano**. El diseño debe sentirse como un producto de alta gama (similar a Apple o Stripe), evitando elementos caricaturescos. La confianza es el pilar principal.

---
## PARTE 1.1: PRINCIPIOS FUNDAMENTALES DE DISEÑO Y UX

Estos son los pilares que deben sustentar CUALQUIER interfaz generada.

### 1.1.1 Claridad y Simplicidad (Menos es Más)
La interfaz debe ser auto-explicativa. El usuario nunca debe tener que preguntarse qué hacer a continuación.
* **Jerarquía Visual**: Guía el ojo del usuario. Los elementos más importantes deben ser más grandes, tener más contraste o estar ubicados en la parte superior. Usa el tamaño de la fuente, el peso y el color para crear una jerarquía clara.
* **Espacio en Blanco (Whitespace)**: No sobrecargues la pantalla. El espacio en blanco es crucial para reducir la carga cognitiva, agrupar elementos relacionados y mejorar la legibilidad.
* **Bento Grids para Complejidad**: Para secciones con múltiples características o beneficios, utiliza un **Bento Grid** (cuadrícula de cajas de diferentes tamaños). Es una tendencia clave para presentar información compleja de forma limpia, organizada y visualmente atractiva.
* **Directiva de Espaciado**: Todas las separaciones y paddings deben seguir una **cuadrícula base de 4px o 8px**. En Tailwind, esto significa usar utilidades proporcionales (ej. `p-2`, `p-4`, `p-6`, `p-8`, `gap-4`, `gap-8`) y evitar valores arbitrarios.

### 1.1.2 Consistencia
Los elementos que se ven iguales deben comportarse igual.
* **Lenguaje de Diseño Unificado**: Usa los mismos estilos para botones, inputs, colores y tipografía en toda la aplicación.
* **Patrones de Interfaz**: Sigue patrones de UI establecidos que los usuarios ya conocen (ej. un icono de engranaje para la configuración).
* **Estrategia Visual**: Priorizar **visuales de producto limpios** (ej. capturas de pantalla del dashboard) e **iconografía SVG minimalista**. Evitar el uso de fotos de stock genéricas de personas. Para los testimonios, se usarán fotos de retrato profesionales de los clientes.

### 1.1.3 Feedback y Dinamismo
La interfaz debe comunicar el resultado de las acciones y sentirse viva.
* **Estados de los Elementos**: Los botones deben tener estados visuales claros: `default`, `hover`, `focus`, `active`, `disabled`.
* **Micro-interacciones Significativas y Físicas**:
    * **Animaciones basadas en el scroll (Scrollytelling)**: Elementos que aparecen, se mueven o se transforman a medida que el usuario avanza por la página, contando una historia de forma progresiva.
    * **Efectos de física sutil**: Botones que reaccionan como si tuvieran peso, elementos que "rebotan" ligeramente al aparecer. Esto hace que la interfaz se sienta más real y satisfactoria.
* **Carga y Errores**: Muestra siempre indicadores de carga (spinners, skeletons) para operaciones asíncronas y mensajes de error claros y constructivos.

### 1.1.4 Accesibilidad (a11y) por Defecto
El diseño debe ser usable por el mayor número de personas posible.
* **Contraste de Color**: Asegúrate de que el contraste entre el texto y el fondo cumpla con las directrices de la WCAG (mínimo 4.5:1 para texto normal).
* **HTML Semántico**: Usa las etiquetas HTML correctas (`<nav>`, `<main>`, `<button>`).
* **Navegación por Teclado**: Todos los elementos interactivos deben ser accesibles y operables con el teclado.

### 1.1.5 Performance como Experiencia de Usuario
La velocidad de carga no es un aspecto técnico, es un pilar de la UX.
* **Arranque Instantáneo**: Una landing page lenta genera desconfianza y frustración. La IA debe priorizar la optimización de imágenes, la carga perezosa (`lazy loading`) y el uso de tecnologías eficientes (como Qwik) para garantizar una carga casi instantánea.

---
## PARTE 2: ARQUITECTURA DE LANDING PAGES DE ALTA CONVERSIÓN (2025)

El objetivo de una landing page es **contar una historia memorable y guiar al usuario hacia una única acción (CTA)**.

### 2.1 Hero
**Objetivo**: Captar la atención en menos de 3 segundos y comunicar la propuesta de valor.
* **Título (H1)**: Claro, conciso y centrado en el beneficio. "¿Qué problema resuelves?".
* **Subtítulo (H2/p)**: Expande el título, explicando brevemente cómo lo haces o para quién es.
* **Visual Principal**: Priorizar una de estas opciones de alto impacto:
    * **Elementos 3D Interactivos**: Objetos 3D sutiles (creados con Spline o Three.js) que reaccionan al movimiento del ratón.
    * **Tipografía Cinética**: El propio titular como elemento visual principal, con animaciones de entrada sutiles.
* **CTA Primario**: Un botón con un texto claro y orientado a la acción (ej. "Empieza Gratis"). Debe ser el elemento con mayor contraste visual.
* **Tendencias Visuales**: Fondos con **gradientes de malla (Mesh Gradients)** animados lentamente, **Glassmorphism** para paneles superpuestos y un fuerte énfasis en la **tipografía audaz y expresiva**.

### 2.2 Pain (Dolor)
**Objetivo**: Hacer que el usuario se sienta comprendido, validando el problema que tiene.
* **Título**: Una pregunta o afirmación que resuene con su punto de dolor (ej. "¿Cansado de perder tiempo en...?").
* **Contenido**: 2-3 bloques cortos con iconos para listar los problemas específicos que el producto soluciona.

### 2.3 Beneficios
**Objetivo**: Mostrar la "tierra prometida". No listes características, describe los resultados.
* **Estructura**: Implementar un **Bento Grid**. Permite jerarquizar visualmente el beneficio más importante en una caja más grande y los secundarios en cajas más pequeñas.
* **Contenido por Beneficio**: Icono + Título del Beneficio + Descripción corta.

### 2.4 Cómo Funciona
**Objetivo**: Reducir la fricción y mostrar que el proceso es simple.
* **Estructura**: Presentar los pasos (ej. 3-4 pasos) a través de un **'scrollytelling' interactivo**. A medida que el usuario hace scroll, cada paso se revela con una animación o una ilustración que cambia.

### 2.5 Métricas (Prueba Social Cuantitativa)
**Objetivo**: Generar confianza a través de datos y números.
* **Estructura**: Una barra simple con 2-4 métricas clave.
* **Contenido**: Números grandes y llamativos con una descripción corta debajo (ej. "+200% ROI", "10,000+ Usuarios Felices").

### 2.6 Testimonios (Prueba Social Cualitativa)
**Objetivo**: Generar confianza a través de la experiencia de otros, priorizando la autenticidad.
* **Formato**:
    * **Vídeo-Testimonios**: Integrar vídeos cortos (30-60 segundos) de clientes reales.
    * **Prueba Social Dinámica**: Incrustar menciones positivas de redes sociales (LinkedIn, Twitter/X) en tiempo real.

### 2.7 FAQ (Preguntas Frecuentes)
**Objetivo**: Resolver las últimas dudas y objeciones del usuario.
* **Estructura**: Un componente de tipo "acordeón", donde cada pregunta se puede expandir para ver la respuesta.

### 2.8 CTA (Llamada a la Acción) Final
**Objetivo**: Realizar la conversión final.
* **Estructura**: Una sección simple y muy enfocada, con un fondo de alto contraste.
* **Contenido**: Un título que reitere la propuesta de valor, un subtítulo que cree urgencia o elimine el riesgo (ej. "Sin necesidad de tarjeta de crédito"), y el mismo botón de CTA primario que en el Hero.

---
## PARTE 3: DISEÑO DE APLICACIONES WEB: FUNCIONALIDAD Y EFICACIA

El objetivo de una aplicación web es **permitir al usuario completar tareas de la forma más eficiente posible**.

### 3.1 Layout y Navegación
* **Estructura predecible**: Generalmente, un layout de 2 columnas es el más efectivo:
    * **Barra Lateral (Sidebar)**: Navegación principal, fija y siempre visible.
    * **Área de Contenido Principal**: Donde el usuario realiza su trabajo.
* **Consistencia**: La navegación principal y las acciones globales deben estar siempre en el mismo lugar.

### 3.2 Formularios
* **Claridad**: Cada campo debe tener una etiqueta (`<label>`) clara y siempre visible. Evita usar `placeholders` como etiquetas.
* **Agrupación Lógica**: Agrupa los campos relacionados en secciones (`<fieldset>`).
* **Feedback**: Muestra la validación en tiempo real (después de que el usuario abandone el campo) y mensajes de error específicos. El botón de envío debe estar deshabilitado hasta que el formulario sea válido.
* **Botones**: La acción primaria (ej. "Guardar") debe tener mayor peso visual que la secundaria (ej. "Cancelar").

### 3.3 Tablas y Listas de Datos
* **Legibilidad**: Suficiente espacio entre filas. Usar un ligero color de fondo en las filas al hacer `hover`.
* **Acciones Claras**: Usar iconos reconocibles para acciones por fila (editar, eliminar).
* **Escalabilidad**: Para tablas con muchos datos, implementa paginación, filtros y una función de búsqueda.

### 3.4 Dashboards
* **Priorización**: Muestra la información más importante y accionable en la parte superior.
* **Visualización de Datos**: Usa gráficos y visualizaciones simples. Cada tarjeta del dashboard debe responder a una única pregunta clave del usuario.

### 3.5 Modales y Notificaciones
* **Modales**: Úsalos con moderación para acciones que requieran el foco completo del usuario (ej. una confirmación de eliminación). Deben ser fáciles de cerrar.
* **Notificaciones (Toasts)**: Para feedback no bloqueante (ej. "Perfil guardado con éxito"), usa notificaciones que aparecen brevemente y desaparecen solas.