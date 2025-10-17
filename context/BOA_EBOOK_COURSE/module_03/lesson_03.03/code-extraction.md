---
title: Code Extraction
description: Code Extraction is a topic hard to master, you will understand how it works with different approaches.
---

# Code Extraction

The client and server represent two very different worlds. In the code executed by the server, access to the browser APIs is not possible, and in the client one, reading files, for example, is not feasible. Therefore, a method to distinguish the two codebases and produce bundles for these two very different worlds is necessary.

> The process of separating your code and packaging the server and client parts is called code extraction.

When applications that take advantage of server-side rendering are written, server code and client code are usually mixed in the same file. This method helps to keep track of the work, prevents the proliferation of imports in the files, and guarantees a better developer experience. Therefore, the framework defines naming conventions to instruct the server on the code that is reserved for the client and what is instead for the server.

```typescript
export default function Page({ data }) {
  // Render data
}

// Server only code
export async function getServerSideProps() {
  // Pass data to the page component via props
  return { props: { data } };
}
```

A clear example of a naming convention is the code typically written with [NextJS](https://nextjs.org/).
Most of the frameworks offering SSR/SSG have a naming convention mechanism, and NextJS is just one of many.
The `getServerSideProps` function runs only on the server, while the default exported component runs on the client and in the server for the first render.
Three different strategies will be presented, starting with the most basic to the most advanced one.

## Export extraction

Export extraction is a way to divide server code from the client bundle by relying on the bundle tree-shaker behavior.

> `bundle tree-shaking` is a term commonly used in the JavaScript context for dead-code elimination. It relies on the static structure of ES2015 module syntax, e.g., import and export.

```typescript
export default function Page() {
  // Client code
  // Is imported from other locations in the codebase
}

export const wellKnownServerFunction = () => {
  // Server code
  // There is NO reference to `wellKnownServerFunction` in the client code
};
```

The bundling process traverses the references starting at a root method recursively, and the tree-shaking behavior will do the heavy lifting work. If the code is not reachable, it is removed, and only the used code is placed in the bundle.
The Page component is used in the client and will be present in the client bundle. `myServerCode` is removed instead because there is no reference to it in the client code.
Assuming that `wellKnownServerFunction` is a name that the framework expects, this function can be called using reflection into the server code.
So, tree-shaking helps to divide the codebase. If this behavior is ON, the result is the client bundle; otherwise, it is (OFF), and all the code that is used on the server will be present.

Export extraction is nice, but there are some drawbacks:

- `wellKnownServerFunction` is a special code reserved only for the framework; it can't be called from the client code
- only one server function per file can be included
- this approach is not type-safe; look at the example; nothing prevents this

```typescript
export default function Page({data}: WRONG_TYPE_HERE) => {
  return <span>{data}<span>
}

export const wellKnownServerFunction = () => {
  return someData;
}
```

## Function extraction

Indeed, the example just seen could be written in this way to guarantee the correctness of the types.

```typescript
export const myDataLoader = () => {
  // SERVER CODE
  return readDataFromDatabase();
}

export default function Page() => {
  // No need for manual flow typing. This can't be incorrect.
  const data = myDataLoader();
  return <span>{data}<span>
}
```

Unfortunately, this code breaks the tree-shaking behavior.
In the client code, there is a server function, and it can't be called because this code will blow up.
The export extraction approach could be used, but a way to separate the server and client code is needed to solve this problem. A marker function can be used!

> A marker function is a way to mark up a piece of code for future transformations.

The previous example can be modified with a marker function called `SERVER()`

```typescript
export const myDataLoader = SERVER(() => {
  // Server code
  return readDataFromDatabase();
});

export default function Page() => {
  // No need for manual flow typing. This can't be incorrect.
  const data = myDataLoader();
  return <span>{data}<span>
}
```

Now the `SERVER()` function wraps the server code, an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) transform that looks for `SERVER()` functions and changes the code can be used.
The example will be translated like this:

```typescript
/*#__PURE__*/ SERVER_REGISTER('UNIQUE_ID', () => {
  return readDataFromDatabase();
});

export const myDataLoader = SERVER_PROXY('UNIQUE_ID');

export default function Page() => {
  const data = myDataLoader();
  return <span>{data}<span>
}
```

The AST transformation changed these things:

- `SERVER()` code is moved into a new top-level location.<br></br>
  With this move, the code is tree-shakable because there is no direct call to it.

- `SERVER_REGISTER()` is used to wrap the `SERVER()` code.<br></br>
  In this way, the framework links the moved function with `SERVER_REGISTER()` and its `UNIQUE_ID`.

- AST added a /_#**PURE**_/ annotation to `SERVER_REGISTER()`.<br></br>
  /\*#**PURE**\_/ annotation is essential because the bundler doesn't include this code. In this way, server code can be removed from the client bundle.

- The call to the `SERVER()` function is transformed to `SERVER_PROXY()` with its `UNIQUE_ID`.<br></br>
  `SERVER_PROXY()` acts as a bridge between server and client worlds.

So far, so good. The server code can now be called from the client, and a type-safe flow is achieved.

> Our AST transform to only recognize `SERVER()`, but no one forbids us to say:
> "Please AST do the code transformation for me whenever you find a function suffixed with `$` (as in\_\_\_$())"

## Lazy load code

If a function that lazy loads code is desired, this solution needs to be improved.

Let's take this example:

```typescript
import {lazyLoad$} from 'my-cool-framework';
import {invokeLazyCode} from 'someplace';

export function() {
  return (
    <button onClick={async () => lazyLoad$(() => invokeLazyCode())}>
     click
   </button>
  );
}
```

The tree-shaker, after the AST transformation, will remove the code inside `lazyLoad$()`; a few things in the approach need to be changed.
The code can be moved to a separate file instead of transforming it as /_#**PURE**_/ for tree-shaking.

FILE: `file_with_unique_id.js`

```typescript
import { invokeLazyCode } from "someplace";

export const id123 = () => invokeLazyCode();
```

FILE: original file

```typescript
import {lazyProxy} from 'my-cool-framework';

export function() {
  return (
    <button onClick={async () => lazyProxy('./file_with_unique_id.js', 'id123')}>
     click
   </button>
  );
}
```

With this approach, /_#**PURE**_/ annotation is not needed at all, and the `lazyProxy()` function can load the code because it's in a different file.
Now, the runtime can load the function on the server if needed, so the `__Register()` function transformation can be removed.

## Closure extraction

Marker functions are awesome, but there is a limitation; let's take this example.

```typescript
import {lazyLoad$} from 'my-cool-framework';
import {invokeLazyCode} from 'someplace';

export function() {
  // useStore declares a scoped state
  const [state] = useStore();
  return (
    <button onClick={async () => lazyLoad$(() => invokeLazyCode(state))}>
     click
   </button>
  );
}
```

The problem is that the `lazy$(() => invokeLazyCode(state))` closes over the state. So when it gets extracted into a new file, it creates an unresolved reference.

```typescript
import {inovkeLayzCode} from 'someplace';

export id123 = () => invokeLazyCode(state); // ERROR: `state` undefined
```

Hold on, this problem can be solved!
Let's have a look at this AST transformation.

FILE: `file_with_unique_id.js`

```typescript
import { invokeLazyCode } from "someplace";
import { lazyLexicalScope } from "my-cool-framework";

export const id123 = () => {
  const [state] = lazyLexicalScope(); // <==== IMPORTANT BIT
  invokeLazyCode(state);
};
```

FILE: original file

```typescript
import {lazyProxy} from 'my-cool-framework';

export function() {
  return (
    <button onClick={async () => lazyProxy('./file_with_unique_id.js', 'id123', [state])}>
     click
   </button>
  );
}
```

The compiler extracts the closure and takes note of the parameters; the `lazyProxy()` call has missing variables in the same order. e.g., [state]
On the other side, `lazyLexicalScope()` restores the variables needed from the closure.

> Thanks to the previous changes, we can refer to variables from a different location, and we can now lazy load closures!

Server/client code is already being mixed into a single file in existing technologies using the export extraction model, but the solutions are limited. The new frontier of technologies allows the code to be mixed even more through function extraction and closure extraction.

## The Qwik solution

So far, so good; lots of new concepts have been seen, and it's likely that the code will need to be reread more than a few times to understand all the steps. Well, then, let's take the last example regarding "Closure extraction". Qwik takes this concept to the extreme and can perform lazy loading, lazy execution, and server/client code-mixing with a truly sensational developer experience.

Let's look at this example:

```typescript
export const useMyData = routeLoader$(() => {
  // ALWAYS RUNS ON SERVER
  console.log('SERVER', 'fetch data');
  return { msg: 'hello world' };
});

export default component$(() => {
  // RUNS ON SERVER OR CLIENT AS NEEDED
  const data = useMyData();
  return (
    <>
      <div>{data.value.msg}</div>
      <button
        onClick$={async () => {
          // Always RUNS ALWAYS ON CLIENT
          const timestamp = Date.now();
          const value = await server$(() => {
            // ALWAYS RUNS ON SERVER
            console.log('SERVER', timestamp);
            return 'OK';
          });
          console.log('CLIENT', value);
        }}
      >
        click
      </button>
    </>
  );
});
```

Here is a real Qwik component, `component$`, `server$`, `routeLoader$`, and `onClick$` can be seen; these are just some of the APIs made available by the framework which, in fact, with the `$` symbol is a marker to be able to extract the various functions during the build phase and benefit from code extraction. The various APIs will be detailed in the next chapters, although thanks to the comments, it's clear what the various functions do. Obviously, behind the scenes, the framework makes sure that the server-related code remains protected to safeguard API keys, secrets, and everything that is executed on the server side. It should be noted that if desired, it is also possible to separate the server functions from the client ones to keep the two worlds separate.
