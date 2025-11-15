## Briefing del Producto: Onucall

**Producto:** Onucall es un servicio SaaS que proporciona un **agente IA de voz 24/7** (y futuramente multicanal por WhatsApp, etc.). Su función es gestionar las llamadas de clientes para resolver dudas, cualificar leads y agendar citas.

**Público Objetivo (Sectores):**

- Concesionarios (coches, motos, bicis)
- Retail y Distribuidoras
- Inmobiliarias
- Alquiladoras (maquinaria, vehículos)
- Servicios Técnicos (reparaciones, fontaneros)
- Despachos Profesionales (abogados, gestorías)

**Problema Principal:** Ayuda a los negocios a dejar de perder ventas por llamadas no atendidas y a reducir el tiempo que el personal gasta en consultas repetitivas.

**Diferenciadores Clave:**

1.  **Demo Interactiva Gratuita:** El usuario puede probar una llamada telefónica real con la IA desde la landing page (`#demo`).
2.  **Onboarding 100% Online:** El cliente puede suscribirse y configurar su agente sin necesidad de hablar con ventas (`#pricing`, `#final-cta`).
3.  **Transparencia**: La landing page mostrará cómo funciona el dashboard de gestión para eliminar la desconfianza.

**Instrucción de Contenido:**
El contenido textual (copy) para cada sección de la landing page (Hero, Pain Points, Historias de Elena y Carlos, FAQ, etc.) debe tomarse **exactamente** del siguiente documento:

---

# Estructura de la landing page (LANDING_PROMPT.md)

### 1. Componente: `Header` (Cabecera Flotante)

- **ID**: `#header`
- **Objetivo Principal**: Proporcionar una navegación clara y persistente que refleje el enfoque en la venta de productos y la facilidad de uso.
- **Comportamiento**: Flotante (`sticky`), se mantiene visible en la parte superior de la página al hacer scroll.
- **Contenido y Elementos**:
  - **Zona Izquierda**:
    - **Logo de "onucall"**: Actúa como enlace a la parte superior de la página (`/`).
  - **Zona Central (Navegación Principal)**:
    - `Características` (enlaza a `#features`)
    - `¿Es para ti?` (enlaza a `#foryou`)
    - **`Casos de Uso` (Menú Desplegable)**: Al pasar el cursor, se despliega un submenú:
      - `Las historias de Elena y Carlos` (enlaza a `#stories`)
      - `Pruébalo tú mismo` (enlaza a `#demo`)
      - `Qué opinan de Onucall` (enlaza a `#opinion`)
    - `Preguntas y Respuestas` (enlaza a `#faq`)
    - `Precios` (enlaza a `#pricing`)
    - `Nosotros` (enlaza a `#about`)
  - **Zona Derecha (Acciones)**:
    - **Botón Secundario**: "Iniciar Sesión".
    - **Botón Primario (CTA)**: "Empieza Gratis".

### 2. Componente: `HeroSection` (Sección Principal)

- **ID**: `#hero`
- **Objetivo Principal**: Capturar la atención del visitante en menos de 3 segundos, comunicar la propuesta de valor principal (enfocada en negocios de productos) y dirigirlo a la acción más importante.
- **Layout**: Dos columnas en escritorio (texto a la izquierda, imagen a la derecha), que se apilan en vertical en dispositivos móviles. Ocupa el 100% de la altura de la ventana (`min-h-screen`).
- **Contenido y Elementos**:
  - **Columna de Texto**:
    - **Titular (`<h1>`)**: "El mejor empleado digital al servicio de tu cliente 24/7." (Texto ajustado para reflejar el rol de asesor de productos).
    - **Subtítulo (`<p>`)**: "Atiende dudas técnicas sobre tus productos, cualifica leads y agenda visitas de venta con voz profesional — configúralo en minutos, sin complicaciones.."
    - **Botón de Acción Principal (`<Button>`)**: "Comienza Gratis".
    - **Botón secundario (`<Button>`)**: "Ver Demostración".
  - **Columna Visual**:
    - Una imagen o ilustración de alta calidad que represente de forma conceptual la idea de un dashboard de gestion de llamada y citas (`hero-image.png`).
  - **Barra de Tecnologías (en la parte inferior de la sección)**:
    - **Objetivo**: Mostrar las tecnologías clave de forma sutil para no distraer del mensaje principal.
    - **Layout**: Un `div` con un título centrado y una fila (`flex row`) de logos.
    - **Título**: Un texto pequeño y con color semitransparente como "Construido con las mejores tecnologías:".
    - **Logos**: Una lista de los iconos de las siguientes tecnologías, presentados de forma limpia y uniforme (por ejemplo, en escala de grises para no romper la paleta de colores):
      - Qwik
      - Supabase
      - Drizzle
      - Retell AI
      - Zadarma
      - n8n
      - OVH

### 3. Componente: `DemoSection` (Pruébalo tú mismo)

- **ID**: `#demo` (coincide con el enlace del menú desplegable "Pruébalo tú mismo")
- **Objetivo Principal**: Proporcionar una prueba de valor inmediata ("Aha! moment") y tangible. Eliminar el escepticismo demostrando la calidad y naturalidad del agente de IA, validando su capacidad de interactuar sobre un producto específico.
- **Layout**: Una sección visualmente atractiva, con un título claro y el formulario como elemento central.
- **Contenido y Elementos**:
  - **Título (`<h2>`)**: "Escúchalo tú mismo. Recibe una llamada de nuestro agente comercial AI."
  - **Subtítulo/Descripción**: "Selecciona el tipo de producto sobre el que quieres que el agente te asesore y descubre cómo onucall convierte tus llamadas."
  - **Formulario**:
    - Campo de texto: "Nombre".
    - Campo de texto: "Email".
    - Campo de texto: "Número de Teléfono" (con validación de formato y prefijo de país).
    - **Selector de Tipo de Producto**: Un menú desplegable o botones de radio donde el usuario selecciona una categoría de producto sobre la cual quiere que la IA le asesore en la demo (ej. "Coches", "Componentes Informáticos", "Muebles", "Productos de Belleza"). Esto simula la funcionalidad clave.
    - **Botón de Envío**: "Recibir mi Llamada Demo".
  - **Flujo de Usuario Esperado**:
    1.  El usuario rellena el formulario y elige una categoría de producto.
    2.  (Opcional, pero recomendado para seguridad/spam) Se le podría pedir verificar su email o número con un código SMS/email.
    3.  El sistema inicia una llamada telefónica real al número proporcionado por el usuario.
    4.  El agente de IA de "onucall" saluda y simula una conversación de consulta o asesoramiento **sobre el tipo de producto elegido**, demostrando sus capacidades de venta y resolución de dudas.
    5.  (Post-llamada) Se podría ofrecer un resumen de la conversación o un enlace a un dashboard de prueba.

### 4. Componente: `PainPointsSection` (Sección "¿Es para ti?")

- **ID**: `#foryou` (coincide con el enlace del menú)
- **Objetivo Principal**: Lograr que el visitante (propietario de un negocio de productos) se sienta completamente comprendido y que el contenido resuene con sus frustraciones diarias. Actúa como un filtro de cualificación para el público objetivo.
- **Layout**: Una serie de tarjetas o ítems de lista concisos, presentados en un diseño de cuadrícula (`grid`) que sea fácil de escanear. Cada ítem incluirá un icono representativo y una pregunta o afirmación.
- **Contenido y Elementos**:
  - **Título (`<h2>`)**: "¿Eres dueño de una tienda, distribuidora, concesionario o vendes algo?"
  - **Lista de Puntos de Dolor (enfocados en productos)**:
    - **Ítem 1**: "¿Cansado de que el teléfono te interrumpa con preguntas sobre el stock o especificaciones de un producto mientras atiendes a un cliente en persona?"
      - _Icono sugerido_: Caja de producto con teléfono vibrando.
    - **Ítem 2**: "¿Te preocupa cuántas ventas pierdes al día por no poder asesorar inmediatamente a cada cliente que llama interesado en tus productos?"
      - _Icono sugerido_: Carrito de compra con signo de interrogación.
    - **Ítem 3**: "¿Sientes que tu equipo pierde tiempo valioso respondiendo preguntas repetitivas sobre productos en lugar de centrarse en cerrar ventas complejas?"
      - _Icono sugerido_: Persona respondiendo a múltiples llamadas.
    - **Ítem 4**: "¿El coste de contratar a un equipo comercial para cubrir todas las horas y responder a todas las consultas te parece inasumible?"
      - _Icono sugerido_: Símbolo de dinero / balanza.

### 5. Componente: `StoriesTabs` (Las historias de Elena y Carlos)

- **ID**: `#stories` (coincide con el enlace del menú desplegable)
- **Objetivo Principal**: Crear una conexión emocional profunda a través de historias con las que el visitante (dueño de un negocio de productos) pueda identificarse. Demostrar la transformación de "dolor" a "solución" de forma narrativa.
- **Layout**: Un componente interactivo de pestañas (`Tabs`) que permita al usuario cambiar entre las diferentes historias de cliente.
- **Contenido y Elementos**:
  - **Título (`<h2>`)**: "Creado para negocios de productos como el tuyo"
  - **Pestaña 1 (Activa por defecto): "Elena | Distribuidora de Componentes"**:
    - **Subtítulo/Problema**: "El estrés de las llamadas perdidas y las oportunidades de venta evaporadas."
    - **El Antes (Párrafo de Dolor)**: Describe el día a día caótico de Elena, detallando cómo las constantes interrupciones telefónicas con preguntas sobre especificaciones de productos le impedían centrarse en los clientes presentes y cómo las llamadas perdidas representaban una fuga constante de ingresos.
    - **El Después (Párrafo de Solución)**: Narra cómo, tras implementar "onucall", Elena ha recuperado el control. Se destaca cómo el agente de IA gestiona el 95% de las consultas iniciales sobre su catálogo de productos, cualifica a los clientes potenciales y agenda llamadas para ella, permitiéndole dedicarse a cerrar ventas importantes. Se puede incluir una cita ficticia: _"Onucall no es una herramienta, es mi empleado más rentable. Conoce mi inventario mejor que nadie."_
  - **Pestaña 2: "Carlos | Concesionario de Coches"**:
    - **Subtítulo/Problema**: "Un equipo de ventas desbordado y clientes impacientes en la exposición."
    - **El Antes (Párrafo de Dolor)**: Explica cómo su mejor vendedor pasaba horas al día al teléfono respondiendo preguntas básicas sobre modelos de coches y equipamiento, lo que generaba tiempos de espera y frustración en los clientes que estaban físicamente en el concesionario.
    - **El Después (Párrafo de Solución)**: Muestra cómo el agente de IA de "onucall" se encarga ahora de toda la gestión de citas para pruebas de conducción y de las preguntas frecuentes sobre los vehículos 24/7, liberando a su equipo de ventas para que se centren exclusivamente en la atención presencial y en el cierre de ventas.

### 6. Componente: `OpinionSection` (Qué opinan de Onucall)

- **ID**: `#opinion` (coincide con el enlace del menú desplegable)
- **Objetivo Principal**: Generar prueba social y confianza mostrando testimonios reales o realistas de clientes satisfechos. Esto ayuda a validar las afirmaciones hechas en el resto de la página, enfocándose en negocios de productos.
- **Layout**: Una sección con un carrusel de tarjetas o una cuadrícula de testimonios. Cada testimonio debe ser visualmente atractivo y fácil de leer.
- **Contenido y Elementos**:
  - **Título (`<h2>`)**: "Lo que dicen los dueños de negocios como tú"
  - **Testimonio 1**:
    - **Cita Destacada**: _"Ha cambiado las reglas del juego para nosotros. El agente conoce nuestro catálogo de impresoras mejor que algunos empleados. Hemos aumentado las solicitudes de presupuesto en un 30%."_
    - **Autoridad**: "Marcos Vega, Gerente de 'TecnoDistribución'".
    - **(Opcional)**: Foto del cliente o logo de su empresa.
  - **Testimonio 2**:
    - **Cita Destacada**: _"Estaba perdiendo clientes que llamaban para preguntar por modelos de zapatillas mientras atendía en la tienda. Ahora Onucall gestiona todas esas consultas y yo me centro en la venta presencial."_
    - **Autoridad**: "Laura Jiménez, Propietaria de 'Urban Step'".
    - **(Opcional)**: Foto del cliente o logo de su empresa.
  - **Testimonio 3**:
    - **Cita Destacada**: _"La mejor inversión que he hecho. Simple de configurar y el impacto fue inmediato. Mis clientes valoran poder llamar a cualquier hora para preguntar por los componentes."_
    - **Autoridad**: "Ana Torres, Fundadora de 'PC-Componentes Online'".
    - **(Opcional)**: Foto del cliente o logo de su empresa.

### 7. Componente: `FeaturesSection` (Sección de Características)

- **ID**: `#features` (coincide con el enlace del menú)
- **Objetivo Principal**: Justificar lógicamente la compra detallando los beneficios y capacidades del servicio, con un énfasis especial en la facilidad de onboarding y el enfoque en productos.
- **Layout**: Una cuadrícula (`grid`) responsive. Se podría dividir en dos subsecciones: una para las características del agente y otra para la facilidad de la plataforma.
- **Contenido y Elementos**:
  - **Título (`<h2>`)**: "Un agente comercial experto y una plataforma insultantemente fácil de usar"
  - **Subsección 1: Características del Agente IA**
    - **Característica 1**:
      - **Icono**: "24/7" .
      - **Título**: **Asesor de Productos 24/7**.
      - **Descripción Breve**: "Tu negocio siempre abierto. Nuestro agente de IA atiende y asesora a clientes sobre tus productos fuera de tu horario comercial, fines de semana y festivos."
    - **Característica 2**:
      - **Icono**: "file-text" .
      - **Título**: **Transcripciones y Datos de Venta**.
      - **Descripción Breve**: "Revisa cada conversación. Todas las llamadas son transcritas y almacenadas para que puedas analizar qué productos interesan más y qué dudas tienen tus clientes."
    - **Característica 3**:
      - **Icono**: "calendar" .
      - **Título**: **Agendamiento de Citas Comerciales**.
      - **Descripción Breve**: "Deja que nuestro agente agende demostraciones o citas con tu equipo de ventas directamente en tu calendario, sin intervención manual."
  - **Subsección 2: Facilidad de la Plataforma**
    - **Característica 4**:
      - **Icono**: "rocket" .
      - **Título**: **Lanzamiento en Menos de 5 Minutos**.
      - **Descripción Breve**: "Date de alta, responde unas preguntas sobre tu negocio, sube tu catálogo de productos (¡o conecta tu tienda online!) y tu agente estará listo para atender llamadas. Sin conocimientos técnicos."
    - **Característica 5**:
      - **Icono**: "book" .
      - **Título**: **Gestión Sencilla de Productos**.
      - **Descripción Breve**: "Añade, edita o elimina productos de la base de conocimiento de tu agente de IA desde un panel de control intuitivo y fácil de usar."
    - **Característica 6**:
      - **Icono**: "bar-chart" .
      - **Título**: **Informes Claros y Accionables**.
      - **Descripción Breve**: "Entiende de un vistazo qué está pasando. Recibe informes sobre el número de llamadas, los productos más consultados y los leads generados."

### 8. Componente: `FAQSection` (Preguntas y Respuestas)

- **ID**: `#faq` (coincide con el nuevo enlace del menú)
- **Objetivo Principal**: Resolver dudas comunes de forma proactiva, eliminando barreras y objeciones a la compra. Debe reforzar la facilidad de uso y la seguridad de la plataforma.
- **Layout**: Un componente de tipo "acordeón". Cada pregunta es un encabezado en el que se puede hacer clic para revelar la respuesta, manteniendo la sección limpia y organizada.
- **Contenido y Elementos**:
  - **Título (`<h2>`)**: "Resolvemos tus dudas"
  - **Acordeón de Preguntas**:
    - **Pregunta 1**: "¿Es difícil configurar el agente de IA? No tengo conocimientos técnicos."
      - **Respuesta**: "¡Para nada! Hemos diseñado el proceso para que sea increíblemente sencillo. Si sabes rellenar un formulario, sabes configurar Onucall. En menos de 5 minutos, estarás listo para recibir llamadas. Nosotros nos encargamos de toda la complejidad técnica."
    - **Pregunta 2**: "¿Cómo 'aprende' el agente sobre mis productos?"
      - **Respuesta**: "Es muy fácil. Puedes subir un fichero (como un CSV o un Excel) con la información de tu catálogo, o conectar directamente tu tienda online (compatible con Shopify, WooCommerce, etc.). El agente procesa esta información y la usa para responder a las preguntas de tus clientes."
    - **Pregunta 3**: "¿Qué pasa si una llamada es muy compleja para el agente?"
      - **Respuesta**: "Nuestro agente está entrenado para reconocer cuándo una conversación requiere intervención humana. En esos casos, puede tomar nota y asegurar al cliente que un experto humano le devolverá la llamada, o incluso intentar transferir la llamada a un número que tú especifiques."
    - **Pregunta 4**: "¿Mis datos y los de mis clientes están seguros?"
      - **Respuesta**: "La seguridad es nuestra máxima prioridad. Todas las conversaciones y datos se gestionan bajo estrictos protocolos de seguridad y encriptación. Cumplimos con todas las normativas de protección de datos."

### 9. Componente: `PricingSection` (Sección de Precios)

- **ID**: `#pricing` (coincide con el enlace del menú)
- **Objetivo Principal**: Presentar los planes de suscripción de manera clara, simple y transparente, ayudando al usuario a auto-seleccionar la opción que mejor se adapte a sus necesidades y volumen de productos.
- **Layout**: Una sección con un título y 2 o 3 tarjetas de precios una al lado de la otra. Una de las tarjetas (normalmente la del medio) debe estar destacada como "La más popular".
- **Contenido y Elementos**:
  - **Título (`<h2>`)**: "Un plan para cada tamaño de catálogo"
  - **Tarjeta de Precios 1 (Ej: "Starter")**:
    - **Nombre del Plan**: "Starter"
    - **Precio**: "49€ / mes"
    - **Descripción Breve**: "Perfecto para tiendas y negocios con un catálogo pequeño."
    - **Lista de Características**:
      - `✓` Hasta 100 llamadas/mes
      - `✓` Gestión de hasta 50 productos
      - `✓` 1 Agente de IA
      - `✓` Transcripciones
      - `✓` Soporte por email
    - **Botón CTA**: "Empezar ahora"
  - **Tarjeta de Precios 2 (Destacada - Ej: "Business")**:
    - **Nombre del Plan**: "Business"
    - **Etiqueta Destacada**: "Más Popular"
    - **Precio**: "99€ / mes"
    - **Descripción Breve**: "Ideal para PYMES en crecimiento con catálogos más amplios."
    - **Lista de Características**:
      - `✓` Hasta 500 llamadas/mes
      - `✓` Gestión de hasta 500 productos
      - `✓` 3 Agentes de IA
      - `✓` Todo lo de Starter +
      - `✓` Agendamiento de Citas
      - `✓` Soporte Prioritario
    - **Botón CTA**: "Empezar ahora" (con estilo primario)
  - **Tarjeta de Precios 3 (Ej: "Enterprise")**:
    - **Nombre del Plan**: "Enterprise"
    - **Precio**: "Contactar"
    - **Descripción Breve**: "Soluciones a medida para grandes volúmenes y catálogos."
    - **Lista de Características**:
      - `✓` Llamadas ilimitadas
      - `✓` Productos ilimitados
      - `✓` Todo lo de Business +
      - `✓` Integración directa con eCommerce/CRM
      - `✓` Manager de cuenta dedicado
    - **Botón CTA**: "Contactar con Ventas"

### 10. Componente: `AboutUsSection` (Sección "Nosotros")

- **ID**: `#about` (coincide con el enlace del menú)
- **Objetivo Principal**: Generar confianza y mostrar el lado humano de la empresa, conectando con la misión de apoyar a las PYMES que venden productos.
- **Layout**: Una sección de contenido centrada, con un texto conciso y posiblemente una imagen del equipo o del fundador para añadir un toque personal.
- **Contenido y Elementos**:
  - **Título (`<h2>`)**: "Nuestra misión es potenciar a los vendedores"
  - **Párrafo (`<p>`)**: Un texto breve y sincero sobre por qué se creó "onucall". Debe enfocarse en la pasión por ayudar a negocios como el de "Elena" o "Carlos" a competir en igualdad de condiciones en un mundo digital, utilizando la tecnología no como una barrera, sino como un aliado comercial. Se puede mencionar el compromiso con la simplicidad y el soporte cercano.
  - **(Opcional)**: Fotos del equipo o del fundador con una breve biografía para humanizar la marca.

---

### 11. Componente: `FinalCTASection` (Sección de Llamada a la Acción Final)

- **ID**: `#final-cta`
- **Objetivo Principal**: Actuar como el último y más contundente empujón para la conversión. Capturar a los usuarios que han recorrido toda la página y están altamente interesados, reafirmando el beneficio principal y eliminando cualquier fricción final para empezar.
- **Layout**: Una sección visualmente simple pero impactante. Para que destaque, debería usar un fondo de color sólido o un degradado sutil utilizando uno de los colores primarios de la marca (ej. `primary-indigo`), con texto en color de alto contraste (blanco o casi blanco).
- **Contenido y Elementos**:
  - **Título (`<h2>`)**: Un titular directo, enérgico y orientado a la acción. Debe ser más grande y llamativo que otros `<h2>` de la página.
    - **Texto Sugerido**: "¿Listo para convertir cada llamada en una venta?"
  - **Subtítulo (`<p>`)**: Una o dos frases que resuman la facilidad y el bajo riesgo de empezar, abordando posibles dudas de última hora.
    - **Texto Sugerido**: "Empieza en menos de 5 minutos. Sin contratos a largo plazo ni permanencia. Cancela en cualquier momento si no estás satisfecho."
  - **Botón de Acción (`<Button>`)**: El botón de "Empieza Gratis" más grande y prominente de toda la página. Debe ser visualmente idéntico al del `HeroSection` para mantener la consistencia del CTA principal.

### 12. Componente: `Footer` (Pie de Página)

- **ID**: `#footer`
- **Objetivo Principal**: Proporcionar acceso a información secundaria, legal y de contacto, cerrando la página de manera profesional.
- **Layout**: Una sección final con varias columnas para organizar la información de manera clara.
- **Contenido y Elementos**:
  - **Columna 1**:
    - **Logo de "onucall"**.
    - **Slogan o Misión Breve**: "Tu mejor agente comercial, 24/7."
    - **Iconos de Redes Sociales**: Enlaces a los perfiles de la empresa.
  - **Columna 2 (Navegación)**:
    - Repetición de los enlaces principales del header para facilitar la navegación: "Características", "¿Es para ti?", "Casos de Uso", etc.
  - **Columna 3 (Legal)**:
    - Enlaces a "Política de Privacidad", "Términos de Servicio", "Política de Cookies".
  - **Barra Inferior**:
    - **Información de copyright**: `© {año actual} onucall. Todos los derechos reservados.`
