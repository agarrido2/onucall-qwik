---
title: Middleware
description: Qwik Middleware an easy and clever way to expose your RESTful APIs or GraphQL APIs.
---

# Middleware

For instance, to expose RESTful APIs or GraphQL APIs, the middleware server that Qwik City provides can be utilized. This feature proves beneficial for centralizing authentication, security, logging, and many other logics. Middleware comprises a set of functions that are called in a specific order. If the `index.tsx` has a default export component, then the HTTP request will return the component. When visiting a specific route of the application, since the default component is exported, this is returned and displays the requested page as if it were the last step of the chain.

This example shows a simple `onRequest` middleware function that logs all requests because `onRequest` intercepts all HTTP methods.

File: `src/routes/layout.tsx`

```typescript
export const onRequest: RequestHandler = async ({
  next,
  url,
}) => {
  console.log("Before request", url);
  await next();
  console.log("After request", url);
};
```

To intercept a specific HTTP method, one of these variations can be used. If both `onRequest` and `onGet` are used, for example, both will execute, but `onRequest` will execute before `onGet` in the chain.

```typescript
// Called only with a specific HTTP method
export const onGet: RequestHandler = async (requestEvent) => { ... }
export const onPost: RequestHandler = async (requestEvent) => { ... }
export const onPut: RequestHandler = async (requestEvent) => { ... }
export const onPatch: RequestHandler = async (requestEvent) => { ... }
export const onDelete: RequestHandler = async (requestEvent) => { ... }
```

Creating a rest API that returns a JSON based on some backend logic is straightforward. The `json(status, object)` method can be called. The json() method will automatically set the Content-Type header to `application/json; charset=utf-8` and JSON stringify the data.

```typescript
export const onGet: RequestHandler = async ({ json }) => {
    /// your backend logic (e.g., read from the Database)
  json(200, <your_response_object_here>);
};
```

Here, the `json` method is taken from the parameters, but there are many other parameters that can be used. The most useful and interesting ones that will also be used in the subsequent chapters are listed below.

- **sharedMap**: Use sharedMap as a means to share data between middleware functions. The sharedMap is scoped to the HTTP request. A common use case is to use sharedMap to store user details so that other middleware functions can use it.

```typescript
export const onGet: RequestHandler = async ({ headers, json }) => {
    // read
    sharedMap.get('user') as User;
    // write
    sharedMap.set('user', user);
    [...]
};
```

- **headers**: Use headers to set response headers associated with the current request. (For reading request headers, see request.headers.) Middleware can manually add response headers to the response using the headers property.

```typescript
export const onGet: RequestHandler = async ({ headers, json }) => {
    headers.set('X-SRF-TOKEN', Math.random().toString(36).replace('0.', ''));
    [...]
};
```

- **cookie**: Use cookie to set and retrieve cookie information for a request. Middleware can manually read and set cookies using the cookie function. This might be useful for setting a session cookie, such as a JWT token, or a cookie to track a user.

```typescript
export const onGet: RequestHandler = async ({ cookie, json }) => {
    // read
    cookie.get('COOKIE_KEY')?.number() || 0;
    // write
    cookie.set('COOKIE_KEY', count);
    [...]
};
```

- **env**: Retrieve environmental property in a platform-independent way.

```typescript
export const onGet: RequestHandler = async ({ env, json }) => {
    env.get('ENV_VARIABLE_KEY_HERE'),
    [...]
};
```

- **redirect()**: Redirect to a new URL. Note the importance of throwing to prevent other middleware functions from running. The redirect() method will automatically set the Location header to the redirect URL.

```typescript
export const onGet: RequestHandler = async ({
  redirect,
  url,
}) => {
  throw redirect(
    308,
    new URL("redirect_url", url).toString(),
  );
};
```

Other parameters can be exploited, such as `URL`, `basePathname`, `params`, or `query`, which are self-explanatory, plus others that will not be used during these chapters but are available in the official documentation.

## Plugins

Special files in the `src/routes` directory named `plugin.ts` or `plugin@<name>.ts` can be created to manage incoming requests. These files have the peculiarity that they can manage requests with maximum precedence, even before layouts. Multiple plugin.ts files, each with a different name `@<name>`, can be had, and the execution order of the various files is based on the alphabetical order of the files (`plugin.ts` will always be first). However, naming the various files is very useful for quick identification.
