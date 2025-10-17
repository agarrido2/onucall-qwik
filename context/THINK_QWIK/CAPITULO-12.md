# PARTE 12: STYLING Y CSS

Esta sección detalla los diferentes métodos y mejores prácticas para aplicar estilos en una aplicación Qwik, desde CSS tradicional hasta soluciones avanzadas, siempre con el rendimiento como prioridad.

---
## 12.1 Integración con CSS Modules

- **Definición**: Un método para aplicar estilos de forma local a un componente, donde los nombres de las clases se transforman en únicos para evitar colisiones globales.
- **Mecanismo**: Soportado de forma nativa por Vite.
    1.  Nombra tu archivo de estilos con el sufijo `.module.css` (ej. `componente.module.css`).
    2.  Importa el archivo en tu componente. La importación devuelve un objeto que mapea tus nombres de clase originales a los nombres con hash únicos.
    3.  Aplica las clases a través del objeto importado.
- **Ejemplo**:
    ```tsx
    // componente.module.css
    .title {
      color: blue;
    }

    // componente.tsx
    import { component$ } from '@builder.io/qwik';
    import styles from './componente.module.css';

    export default component$(() => {
      return <h1 class={styles.title}>Hello World</h1>;
      // El resultado en HTML será algo como: <h1 class="_title_l4k1a_1">...</h1>
    });
    ```
- **Ventaja**: Aislamiento de estilos simple y efectivo, basado en estándares.

---
## 12.2 Patrones de CSS-in-JS

- **Filosofía**: Para mantener el rendimiento de "cero JS", Qwik solo es compatible con librerías de CSS-in-JS de **cero-runtime**. Estas librerías extraen todos los estilos a archivos CSS estáticos durante el proceso de compilación, en lugar de generar estilos en el cliente.
- **Librería Recomendada**: **`styled-vanilla-extract`**. Es la solución oficial y recomendada.
- **Mecanismo**:
    1.  Los estilos se definen en archivos `.css.ts`, utilizando TypeScript para escribir CSS.
    2.  Durante la compilación, un plugin de Vite procesa estos archivos y genera el CSS estático correspondiente.
- **Ventaja**: Ofrece los beneficios de CSS-in-JS (colocación, tipado, uso de variables de TS) sin penalizar el rendimiento en tiempo de ejecución.

---
## 12.3 `useStyles()` y `useStylesScoped()`

Estos son los hooks nativos de Qwik para asociar estilos a un componente.

- **`useStyles$(styles)`**:
    - **Definición**: Un hook que instruye a Qwik para que incluya una cadena de texto de CSS en la página.
    - **Alcance**: **Global**. Los estilos **no son encapsulados** y pueden afectar a cualquier elemento de la página.
    - **Uso**: Típicamente se usa para registrar estilos de librerías de terceros que un componente necesita. Se combina con la importación `?inline` de Vite.
        ```tsx
        import styles from 'some-library/dist/styles.css?inline';

        export default component$(() => {
          useStyles$(styles);
          // ...
        });
        ```

- **`useStylesScoped$(styles)`**:
    - **Definición**: Es el hook **principal y recomendado** para los estilos de un componente.
    - **Alcance**: **Local (Scoped)**. Qwik aísla los estilos para que solo afecten al componente donde se declaran.
    - **Mecanismo**: Qwik añade un atributo único al elemento raíz del componente (ej. `data-q-abc-1`) y reescribe todos los selectores del CSS para que apunten a ese atributo (ej. `.mi-clase` se convierte en `.mi-clase[data-q-abc-1]`).
    - **Uso**:
        ```tsx
        import { component$, useStylesScoped$ } from '@builder.io/qwik';
        import styles from './componente.css?inline';

        export default component$(() => {
          useStylesScoped$(styles);
          return <div class="mi-clase">...</div>;
        });
        ```

---
## 12.4 Optimización de Tailwind CSS

- **Integración**: Qwik ofrece una integración oficial y automatizada a través del comando `pnpm run qwik add tailwind`.
- **Mecanismo de Optimización**:
    - **Purging (Purga)**: La integración configura `tailwind.config.js` para que **PurgeCSS** analice todos los archivos `.tsx` y `.ts`. En la `build` de producción, se eliminan todas las clases de utilidad de Tailwind que no se hayan utilizado, generando un archivo CSS final extremadamente pequeño.
    - **Sinergia con Qwik**: La combinación del mínimo JavaScript inicial de Qwik y el mínimo CSS final de Tailwind resulta en aplicaciones con un rendimiento de carga excepcionalmente alto.
- **Mejor Práctica**: Utilizar plugins como `prettier-plugin-tailwindcss` para ordenar automáticamente las clases en el HTML. Esto mejora drásticamente la legibilidad y mantenibilidad de los componentes con muchas clases de utilidad.

## 12.5 Estilizado Dinámico

Existen varios patrones para aplicar estilos que cambian en respuesta al estado de la aplicación. Qwik ofrece soluciones nativas y eficientes que evitan la necesidad de librerías externas como `clsx`.

### Clases Condicionales (Nativo de Qwik)

#### Sintaxis de Objeto (Método Recomendado)

* **Mecanismo**: El atributo `class` en Qwik acepta un objeto donde las claves son los nombres de las clases y los valores son expresiones booleanas. La clase solo se aplica si el valor es `true`. Es la forma más limpia, declarativa y legible de gestionar múltiples clases condicionales.

* **Ejemplo**:

    ```tsx
    const isActive = useSignal(false);
    const hasError = useSignal(true);

    <div class={{
      'bg-green-500': isActive.value,
      'text-white': isActive.value,
      'border-red-500': hasError.value && !isActive.value,
      'p-4 rounded-md': true // Clases incondicionales
    }}>
      Contenido Dinámico
    </div>
    ```

#### Sintaxis de Array y String

* **Mecanismo**: El atributo `class` también acepta un array de strings o `undefined`/`null`/`false` para no aplicar una clase. También se pueden usar template strings con operadores ternarios. Es útil para casos más simples.

* **Ejemplo (Array)**:

    ```tsx
    <div class={[
        'clase-base',
        isActive.value ? 'clase-activa' : 'clase-inactiva',
        hasError.value && 'clase-error'
    ]}>
      Contenido
    </div>
    ```

* **Ejemplo (String)**:

    ```tsx
    <div class={`clase-base ${isActive.value ? 'clase-activa' : ''}`}>
        Contenido
    </div>
    ```
### Estilos en Línea (`style`)

* **Mecanismo**: El atributo `style` se puede usar para estilos que dependen directamente de valores dinámicos (números, strings). Acepta tanto un objeto (camelCase) como una cadena de texto.

* **Ejemplo**:

    ```tsx
    const position = useSignal({ x: 10, y: 20 });
    <div style={{
      transform: `translate(${position.value.x}px, ${position.value.y}px)`,
      position: 'absolute'
    }}>
      Elemento Móvil
    </div>
    ```

### Propiedades Personalizadas de CSS (Variables - El Patrón más Performante)

* **Mecanismo**: Es el patrón más eficiente para estilizado dinámico. Se enlaza una variable de CSS a una señal usando el atributo `style`. El CSS estático utiliza esta variable.

* **Ventaja**: Cuando la señal cambia, Qwik solo actualiza la propiedad personalizada en el elemento del DOM. El navegador se encarga del resto (repintado), lo cual es más eficiente que el framework manipulando listas de clases.

* **Ejemplo**:

    ```tsx
    // componente.tsx
    const hue = useSignal(120); // Valor de color HSL
    <div class="mi-clase" style={{ '--highlight-color-hue': `${hue.value}deg` }}>...</div>

    // componente.css (scoped)
    .mi-clase {
      background-color: hsl(var(--highlight-color-hue, 120deg) 50% 50%);
      transition: background-color 0.3s ease;
    }
    ```
    

## 12.6 Gestión de Temas (Theming)

El patrón canónico para implementar temas (ej. modo claro/oscuro) combina `useContext`, una clase en el elemento `<html>` y propiedades personalizadas de CSS.

1.  **Estado Global del Tema**: Se crea un contexto (`ThemeContext`) para almacenar el estado del tema actual (`'light'` o `'dark'`) en un `Signal`.
2.  **Sincronización con el DOM**: Un `useTask$` en el layout raíz observa el `Signal` del tema. Cuando cambia, ejecuta un script en el cliente que añade o elimina una clase (ej. `dark`) en `document.documentElement`.
3.  **Definición de Colores con Variables CSS**: En un archivo CSS global, se definen todas las variables de color. El tema por defecto se define en `:root`, y las variantes para el modo oscuro se definen dentro de un selector `.dark`.
    ```css
    /* global.css */
    :root {
      --background-color: #ffffff;
      --text-color: #1a202c;
    }

    .dark {
      --background-color: #1a202c;
      --text-color: #ffffff;
    }

    body {
      background-color: var(--background-color);
      color: var(--text-color);
      transition: background-color 0.2s ease-in-out;
    }
    ```
4.  **Persistencia**: El estado del tema se persiste en `localStorage` utilizando el patrón de `useVisibleTask$` y `useTask$` visto en el capítulo 10.

---
## 12.7 Patrones para Librerías de Componentes

- **Componentes "Headless" (Sin Estilos)**:
    - **Filosofía**: Es la mejor práctica para crear librerías de componentes reutilizables y flexibles. Un componente *headless* proporciona toda la lógica, la gestión de estado y la accesibilidad (atributos ARIA, roles, manejo del foco), pero **no impone ningún estilo visual**.
    - **Beneficio**: El consumidor de la librería tiene control total sobre la apariencia, pudiendo aplicar su propio sistema de diseño (CSS tradicional, Tailwind, etc.) sin tener que luchar contra los estilos por defecto de la librería.

- **Estrategia de Estilizado**:
    - El componente *headless* expone sus diferentes partes a través de `props` (como `class` o `style`) o mediante una estructura de DOM predecible para que el consumidor pueda aplicar estilos.
    - La librería puede ofrecer opcionalmente **kits de estilos** como paquetes separados (ej. un paquete con estilos de Tailwind predefinidos para los componentes *headless*).

- **Ejemplo Canónico: Qwik UI**:
    - **`@qwik-ui/headless`**: Proporciona la lógica y accesibilidad de los componentes (Accordion, Tabs, etc.) sin ningún estilo.
    - **`@qwik-ui/tailwind`** (u otros): Paquetes que proporcionan una implementación visual ya estilizada de los componentes *headless*, listos para usar.