# PARTE 16: ESTRATEGIAS DE TESTING

Esta sección describe un enfoque completo para las pruebas en Qwik, cubriendo desde las pruebas unitarias hasta las de extremo a extremo (E2E), con el objetivo de garantizar la robustez, calidad y fiabilidad de la aplicación.

---
## 16.1 Patrones de Tests Unitarios

- **Herramienta**: **Vitest**. Es el framework de testing unitario que el CLI de Qwik configura por defecto. Es rápido, compatible con la sintaxis de Jest y se integra perfectamente con Vite.
- **Objetivo**: Probar la **lógica de negocio pura** de forma aislada. [cite_start]Esto incluye funciones de utilidad, algoritmos, y cualquier código que no dependa del DOM o del ciclo de vida de los componentes de Qwik. [cite: 4433-4435]
- **Mecanismo**:
    1.  Crea un archivo de prueba con el sufijo `.spec.ts` junto al archivo de código que quieres probar (colocación).
    2.  Importa la función a probar.
    3.  Utiliza las APIs de Vitest (`describe`, `it`, `expect`) para definir los casos de prueba y las aserciones.
- **Ejemplo**:
    ```ts
    // src/lib/utils/calculator.ts
    export function add(a: number, b: number): number {
      return a + b;
    }

    // src/lib/utils/calculator.spec.ts
    import { describe, it, expect } from 'vitest';
    import { add } from './calculator';

    describe('add', () => {
      it('should add two numbers correctly', () => {
        expect(add(2, 3)).toBe(5);
      });
    });
    ```
- **Ventaja**: Son los tests más rápidos de ejecutar y proporcionan un feedback inmediato durante el desarrollo. Forman la base de la pirámide de testing.

---
## 16.2 Tests de Integración (Componentes)

- **Herramienta**: **Cypress Component Testing** o **Playwright Component Testing**. El CLI de Qwik facilita la instalación de Cypress (`pnpm run qwik add cypress`).
- [cite_start]**Objetivo**: Probar un componente o un pequeño grupo de componentes en **aislamiento**, verificando que renderizan correctamente y que su interactividad interna funciona como se espera. [cite: 4472]
- **Mecanismo**:
    1.  El framework de testing "monta" el componente en un navegador real, sin necesidad de levantar toda la aplicación.
    2.  Se interactúa con el componente a través de comandos que simulan las acciones del usuario (`click`, `type`).
    3.  Se realizan aserciones sobre el estado del DOM para verificar el resultado.
- **Ejemplo**:
    ```tsx
    // src/components/counter/counter.cy.tsx
    import { Counter } from './counter';

    it('should increment the count on click', () => {
      cy.mount(<Counter />);
      
      cy.get('[data-testid="count"]').should('have.text', '0');
      cy.get('[data-testid="increment-button"]').click();
      cy.get('[data-testid="count"]').should('have.text', '1');
    });
    ```
- **Ventaja**: Es el equilibrio perfecto entre la velocidad de los tests unitarios y la confianza de los tests E2E. Permite probar la UI de forma aislada y robusta.

---
## 16.3 Tests E2E con Cypress

- **Herramienta**: Cypress (en modo E2E) o Playwright.
- [cite_start]**Objetivo**: Probar **flujos de usuario críticos** a través de la aplicación completa, tal como lo haría un usuario final. [cite: 4488-4490]
- **Mecanismo**:
    1.  El test levanta la aplicación completa en un servidor de desarrollo.
    2.  El framework de testing abre un navegador y navega a la URL de la aplicación (`cy.visit('/')`).
    3.  El script de test simula un flujo de usuario completo, interactuando con diferentes páginas y componentes.
- **Ejemplo de Flujo (Login)**:
    ```ts
    it('should allow a user to log in successfully', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('user@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
      cy.get('h1').should('contain.text', 'Welcome, user!');
    });
    ```
- **Ventaja**: Proporciona el máximo nivel de confianza de que la aplicación funciona correctamente de principio a fin. Deben reservarse para los "caminos felices" más importantes debido a su lentitud y fragilidad.

---
## 16.4 Tests de Regresión Visual

- **Herramienta**: Servicios como **Percy** o **Chromatic**, o plugins de Cypress como `cypress-image-snapshot`.
- [cite_start]**Objetivo**: Detectar **cambios visuales no deseados** en la UI. [cite: 4459-4460]
- **Mecanismo**:
    1.  En la primera ejecución del test, se toma una "instantánea" (screenshot) de un componente o página y se guarda como la línea base (`baseline`).
    2.  En ejecuciones posteriores, se toma una nueva instantánea y se compara a nivel de píxeles con la línea base.
    3.  Si se detectan diferencias, el test falla y un revisor humano debe aprobar el cambio (si es intencional) o corregir la regresión.
- **Ventaja**: Captura errores de CSS y de layout que los tests funcionales no pueden detectar, asegurando la consistencia visual de la aplicación.

---
## 16.5 Tests de Accesibilidad (a11y)

- **Herramienta**: **`cypress-axe`**. Es un plugin para Cypress que integra el motor de accesibilidad **`axe-core`** de Deque.
- [cite_start]**Objetivo**: Automatizar la detección de violaciones de las **WCAG (Web Content Accessibility Guidelines)** directamente en la suite de tests. [cite: 4505, 4508]
- **Mecanismo**:
    1.  Una vez configurado, se añade el comando `cy.checkA11y()` en los tests de componente o E2E.
    2.  Este comando escanea el estado actual del DOM en el navegador.
    3.  El test falla si se encuentra alguna violación, reportando el problema específico, el elemento afectado y un enlace a la documentación sobre cómo solucionarlo.
- **Ejemplo**:
    ```ts
    it('should have no accessibility violations on the main page', () => {
      cy.visit('/');
      cy.injectAxe(); // Inyecta el motor axe en la página
      cy.checkA11y(); // Realiza la auditoría
    });
    ```
- **Ventaja**: Integra la accesibilidad como parte del proceso de desarrollo diario, en lugar de ser una auditoría tardía, garantizando aplicaciones más inclusivas.

---
## 16.6 Tests de Rendimiento

- **Herramienta**: **Lighthouse CI**. Es un conjunto de herramientas para ejecutar auditorías de Google Lighthouse de forma programática en un entorno de integración continua.
- **Objetivo**: Prevenir **regresiones de rendimiento** antes de que lleguen a producción.
- **Mecanismo**:
    1.  La pipeline de CI/CD se configura para ejecutar Lighthouse CI en cada Pull Request o `merge`.
    2.  La herramienta compila la aplicación en modo de producción, la levanta en un servidor y ejecuta una auditoría de Lighthouse contra ella.
    3.  Se pueden establecer **presupuestos de rendimiento (`performance budgets`)**. Por ejemplo, se puede configurar la pipeline para que falle si la puntuación de rendimiento baja de 95, si el LCP supera los 2 segundos o si el TBT supera los 50ms.
- **Ventaja**: Actúa como un "guardián" del rendimiento, asegurando que los cambios en el código no impacten negativamente en los Core Web Vitals y la experiencia del usuario.

---
## 16.7 Resumen de Mejores Prácticas de Testing

- **Seguir la Pirámide de Testing**: La mayoría de los tests deben ser unitarios (rápidos y baratos). Un número menor deben ser de componente/integración. Un número muy pequeño deben ser E2E (lentos y caros).
- **Colocación de los Tests**: Los archivos de test deben vivir en el mismo directorio que el código fuente que están probando. Esto mejora la localización y el mantenimiento.
- **Usar Atributos de Datos para Selectores**: **Nunca** uses clases de CSS, IDs o etiquetas HTML como selectores en tus tests, ya que son frágiles y propensos a cambiar. Utiliza un atributo `data-testid` dedicado en tu JSX para crear un "contrato" estable con tus tests.
    ```tsx
    // Componente
    <button data-testid="login-submit-button">Login</button>

    // Test
    cy.get('[data-testid="login-submit-button"]').click();
    ```
- **Integración Continua (CI)**: Toda la suite de tests (unitarios, componente, E2E) debe ejecutarse automáticamente en una pipeline de CI en cada `commit` o Pull Request.
- **Testear el Comportamiento, no la Implementación**: Los tests deben verificar **lo que el usuario ve y puede hacer**, no los detalles internos de cómo funciona un componente. Un buen test sobrevive a una refactorización del código que no cambia el comportamiento final.