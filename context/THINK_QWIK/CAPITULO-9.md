# PARTE 9: FORMULARIOS Y VALIDACIÓN

Esta sección cubre el manejo de formularios en Qwik City, un sistema diseñado desde cero para ser robusto, seguro y funcionar con y sin JavaScript, siguiendo el principio de mejora progresiva.

---
## 9.1 Componente `<Form>` vs Formularios HTML

- **Formulario HTML (`<form>`)**: Es la base. Funciona sin JavaScript y su envío (`submit`) siempre provoca una recarga de página completa.
- **Componente `<Form>` de Qwik City**:
    - **Definición**: Un componente de alto nivel que envuelve el elemento `<form>` nativo del navegador.
    - **Comportamiento (Mejora Progresiva)**:
        1.  **Sin JavaScript**: Se renderiza y se comporta **exactamente como un `<form>` nativo**. La funcionalidad es 100% preservada.
        2.  **Con JavaScript**: El componente intercepta el evento `submit`. En lugar de dejar que el navegador recargue la página, realiza una petición `fetch` asíncrona al servidor. Al recibir la respuesta, actualiza el estado de la aplicación y el DOM sin una recarga completa, proporcionando una experiencia de usuario fluida (SPA-like).
    - **Conclusión**: El desarrollador escribe el código una sola vez, y Qwik City se encarga de que funcione en ambos escenarios.

---
## 9.2 `routeAction$()` para el Manejo de Formularios

- **Definición**: Es el **endpoint del lado del servidor** que procesa los datos enviados por un componente `<Form>`. Todo el código dentro de un `routeAction$` se ejecuta **exclusivamente en el servidor**.
- **Mecanismo**:
    1.  **Declaración**: Se declara la acción y se exporta. El primer argumento de la función son los datos del formulario ya parseados. El segundo es el `RequestEvent`.
        ```tsx
        export const useAddTask = routeAction$(async (data, { cookie, redirect }) => {
          // 1. Validar datos
          // 2. Ejecutar lógica de negocio (ej. guardar en DB)
          // 3. Devolver un resultado o redirigir
          return { success: true };
        });
        ```
    2.  **Vinculación**: En el componente, se invoca el hook de la acción y se pasa al prop `action` del componente `<Form>`.
        ```tsx
        const addTaskAction = useAddTask();

        <Form action={addTaskAction}>
          <input name="taskName" />
          <button type="submit">Add</button>
        </Form>
        ```
- **Flujo de Datos de Retorno**: El valor devuelto por la acción en el servidor se convierte en el `.value` del hook de la acción en el cliente. Esto permite a la UI reaccionar al resultado de la operación.
    ```tsx
    {addTaskAction.value?.success && <p>Task added!</p>}
    ```

---
## 9.3 Integración de Validación con Zod

Qwik City tiene una integración de primera clase con **Zod**, la librería de validación de esquemas para TypeScript.

- **Mecanismo**: La validación se define pasándole un esquema de Zod como segundo argumento a `routeAction$`, utilizando el helper `zod$()`.
    ```tsx
    import { zod$ } from '@builder.io/qwik-city';
    import { z } from 'zod';

    export const useRegisterUser = routeAction$(
      async (data) => {
        // Este código SÓLO se ejecuta si la validación pasa.
        const newUser = await db.createUser(data);
        return { success: true, userId: newUser.id };
      },
      // El esquema de validación de Zod
      zod$({
        email: z.string().email(),
        password: z.string().min(8),
      })
    );
    ```
- **Validación Automática**: El servidor ejecuta esta validación **antes** de ejecutar la lógica principal de la acción. Si la validación falla:
    1.  La lógica principal de la acción **no se ejecuta**.
    2.  El servidor responde automáticamente con un estado HTTP `400 Bad Request`.
    3.  El hook de la acción en el cliente se poblará con un objeto de error detallado en su propiedad `.fail`.
- **Feedback en la UI**: El objeto de error permite mostrar mensajes de error específicos para cada campo de forma sencilla.
    ```tsx
    const registerAction = useRegisterUser();

    <input name="email" />
    {registerAction.fail?.fieldErrors?.email && (
      <p class="error">{registerAction.fail.fieldErrors.email}</p>
    )}
    ```

---
## 9.4 Patrones de Mejora Progresiva

La combinación de `<Form>`, `routeAction$` y la validación con `zod$` crea un patrón de mejora progresiva robusto y automático.

- **Escenario 1 (JavaScript Deshabilitado)**:
    1.  El usuario envía el formulario.
    2.  El navegador realiza una petición `POST` de página completa.
    3.  El servidor ejecuta la validación de Zod. Si falla, **vuelve a renderizar la misma página**, pasando los errores para que se muestren en el HTML.
    4.  El flujo es funcional, seguro y estándar.

- **Escenario 2 (JavaScript Habilitado)**:
    1.  El usuario envía el formulario.
    2.  Qwik intercepta el envío y realiza una petición `fetch` asíncrona.
    3.  El servidor ejecuta la validación. Si falla, devuelve una respuesta JSON con los errores.
    4.  Qwik recibe el JSON y actualiza la propiedad `.fail` del hook, lo que provoca una actualización granular del DOM para mostrar los errores, **sin recargar la página**.

El desarrollador solo define la lógica una vez y Qwik City gestiona ambos escenarios de forma transparente.

---
## 9.5 Subida de Archivos y Formularios Multipart

Qwik City maneja de forma nativa la subida de archivos a través de formularios `multipart/form-data`.

- **Mecanismo**:
    1.  **En el Componente**: Se debe añadir el atributo `enctype="multipart/form-data"` al componente `<Form>`. El input del archivo es un `<input type="file" name="avatar">` estándar.
    2.  **En el `routeAction$`**: Qwik City parsea automáticamente el formulario. El archivo subido estará disponible en el primer argumento de la acción como un objeto `File` estándar (o un `File[]` si el input es `multiple`).
- **Procesamiento en el Servidor**:
    ```ts
    export const useUploadProfilePic = routeAction$(async (data) => {
      const { avatar } = data; // avatar es un objeto 'File'

      if (avatar instanceof File) {
        // Lógica para procesar el archivo:
        // - Validar tipo, tamaño, etc.
        // - Hacer stream a un servicio de almacenamiento (S3, GCS, etc.)
        // - Guardar la URL resultante en la base de datos.
        const storageUrl = await uploadToCloud(avatar);
        await db.updateUser({ avatarUrl: storageUrl });
        return { success: true, url: storageUrl };
      }
      return { success: false, error: 'No file uploaded' };
    });
    ```

---
## 9.6 Manejo de Errores y Feedback al Usuario

El hook devuelto por `routeAction$` es un objeto reactivo que contiene todo el estado del ciclo de vida del envío del formulario, permitiendo un feedback rico y granular en la UI.

- **Estado Pendiente (`Pending`)**:
    - **Propiedad**: `action.isRunning` (un `Signal<boolean>`).
    - **Uso**: Es `true` mientras la petición `fetch` al servidor está en curso. Ideal para deshabilitar el botón de envío y mostrar un spinner para prevenir envíos duplicados.
        ```tsx
        <button type="submit" disabled={action.isRunning}>
          {action.isRunning ? 'Guardando...' : 'Guardar'}
        </button>
        ```

- **Estado de Error (`Failure`)**:
    - **Propiedad**: `action.fail`.
    - **Uso**: Contiene los errores si la validación de Zod falla o si se lanza un error desde el servidor.
        - `action.fail.fieldErrors`: Objeto que mapea los nombres de los campos a sus errores de validación.
        - `action.fail.message`: Un mensaje de error general para el formulario.

- **Estado de Éxito (`Success`)**:
    - **Propiedad**: `action.value`.
    - **Uso**: Contiene el objeto que la lógica principal de la acción retornó exitosamente. Es `undefined` hasta que haya un primer envío exitoso. Se usa para mostrar mensajes de éxito o los datos recién creados.

---
## 9.7 Envío de Formularios sin JavaScript

Este es un pilar de la mejora progresiva en Qwik City y funciona automáticamente.

- **Mecanismo**: Si JavaScript está deshabilitado o no se carga, el componente `<Form>` se renderiza como un `<form>` HTML nativo.
    - Al hacer `submit`, el navegador realiza una petición `POST` estándar, recargando la página.
    - El `routeAction$` en el servidor se ejecuta de la misma manera.
    - Si hay un error de validación, el servidor **vuelve a renderizar la página del formulario**, y la propiedad `action.fail` ya viene poblada desde el servidor, por lo que los mensajes de error se muestran directamente en el HTML inicial.
    - Si la acción es exitosa y redirige, el navegador sigue la redirección `3xx` del servidor.
- **Beneficio**: La funcionalidad crítica de mutación de datos de la aplicación siempre está disponible para todos los usuarios.

---
## 9.8 Flujos de Trabajo con Formularios Complejos

- **Formularios Multi-paso**:
    - **Patrón**: Gestionar el estado de todos los pasos en un `useStore()`. Renderizar condicionalmente los campos de cada paso. Utilizar un único componente `<Form>` que envuelva todo el flujo y un `routeAction$` que reciba los datos combinados del `Store` en el paso final. Los botones "Siguiente/Anterior" simplemente modifican el estado del paso actual en el `Store`.

- **Envío Programático**:
    - **API**: El hook de la acción expone un método `.submit()`.
    - **Uso**: Permite disparar la acción desde fuera de un botón `type="submit"`, por ejemplo, desde un `onClick$` en cualquier otro elemento, un atajo de teclado, o al seleccionar un valor en un `dropdown`.
        ```tsx
        <button onClick$={() => myAction.submit({ name: 'Dato Programático' })}>
          Enviar sin Formulario
        </button>
        ```

- **Acciones sin `<Form>`**: El método `.submit()` es ideal para acciones que no se sienten como un formulario tradicional, como un botón de "like", "eliminar", o "añadir al carrito", donde no hay campos de entrada del usuario. Esto permite mantener toda la lógica de mutación dentro del patrón seguro de `routeAction$`.