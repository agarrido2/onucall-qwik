---
title: CSS and Built-In Styling Methods
description: CSS is so huge, there are a lot of ways to style your application with Qwik, let's see them together.
---

# CSS and Built-In Styling Methods

Once you know how your application will look graphically, you can stylize your app using CSS. CSS, which stands for Cascading Style Sheets, is a basic rule that tells the browser how to display HTML graphic content. CSS has evolved a lot in recent years; in fact, nowadays, you can use different tools that adapt to all personal needs and tastes.
Let's start by saying that Qwik does not force you towards a specific way of creating CSS for your application, but you can use practically any approach: CSS, Sass, CSS-in-JS, CSS modules, and many others.
In this chapter, you will look at these different approaches.

## CSS Modules

A CSS module is a CSS file in which all class names are scoped locally by default.
Since the syntax to be used is CSS. But Sass, Less, and more can also be used.

> Sass and Less are called "CSS preprocessors" and are an evolution of style sheets, which allow you to use features that would normally be exclusive to programming languages, such as the use of variables and functions. The purpose is to speed up code writing and improve its maintenance. Sass and Less are similar languages and do the same thing, but browsers only read CSS code, which is why Sass and Less files must then be converted ("compiled") into regular CSS files. Hence the term "CSS preprocessors".

Let's see an example:

FILE: `button.module.css`

```typescript
.button {
  color: black;
}
```

FILE: `button.tsx`

```typescript
import buttonStyle from './button.module.css';

export const Button = component$(() => {
    return <button class={buttonStyle.button}>My Button</button>;
});
```

From this example, you can see that `buttonStyle` was imported directly from the CSS file and that, then, thanks to the `buttonStyle.button` syntax, you were able to apply the style to your component.
This approach is certainly very good because it is based on the standard CSS syntax, and it is also possible to apply Sass, Less, and more. You also don't have to spend time adapting your CSS to the JS like with the CSS-in-JS technique.

## CSS-in-JS

CSS-in-JS, in a nutshell, is a different way to style your components through JavaScript or TypeScript.
In Qwik, you can use the `styled-vanilla-extract` library, which provides an extremely efficient CSS-in-JS solution without any runtime.
Starting to use this approach is very simple because, thanks to the Qwik CLI, you can type this command `pnpm qwik add styled-vanilla-extract` in your terminal, and the entire configuration process will happen automatically.
The dependencies will be added and installed to your project, and then you will be ready to build your components.

> The `styled-vanilla-extract` library needs a special Vite plugin, `vanillaExtractPlugin`; this configuration is added automatically by the Qwik CLI process.

Let's see an example:

FILE: `button.css.ts`

```typescript
import { style } from "styled-vanilla-extract/qwik";
export const button = style({ color: "black" });
```

FILE: `button.tsx`

```typescript
import { button } from './button.css';

export const Button = component$(() => {
    return <button class={button}>My Button</button>;
});
```

Here, you can see that in the style sheet (written in TypeScript), the `styled-vanilla-extract/qwik` library is imported to be able to exploit the style function. By importing the style file from your component, the style is obtained and applied to your button.
The positive things about this way of working are that the style is locally scoped, and there is no risk of clashing with class names or more specific selectors, as can happen with the classic CSS approach.

> Not all CSS-in-JS libraries are suitable for SSR and Qwik's way of compiling, and this approach must "serialize" your styles into plain CSS that can be inserted into the document. This is extra work for the browser, which can cause slowdowns in large applications. Luckily, you have `styled-vanilla-extract`, which works well with Qwik.

## useStyles$

The native Qwik API `useStyles$` allows for a more standard approach, enabling the import of the style sheet via classic import.

Let's see an example:

FILE: `button.css`

```typescript
.button {
    color: black;
}
```

FILE: `button.tsx`

```typescript
import buttonStyle from './button.css?inline';

export const Button = component$(() => {
    useStyles$(buttonStyle);
    return <button class='button'>My Button</button>;
});
```

You can see that here: the style sheet is going to be imported via `useStyles$` and included in the component. This import will only run when needed, and double loading it in case of SSR hydration will be avoided. By the way, if there was a global stylesheet, it could be loaded directly into the main component. The most observant will have noticed that in the import, there is the term `?inline`. This is very important because it allows Vite to import the CSS file as a string. Note that in the example, CSS was used, but nothing prevents the use of Sass or Less.

## useStylesScoped$

It is possible to use the native Qwik API `useStylesScoped$` to add an inline style inside the component, which allows you to define a style in a very simple way while remaining elegant.

Let's see an example:

FILE: `button.tsx`

```typescript
export const Button = component$(() => {
  useStylesScoped$(`
    .button {
      color: black;
    }
  `);
  return <button class='button'>My Button</button>;
});
```

You can see that directly inside the component, `useStylesScoped$` is used, and the style has been defined. This approach, although very fast and immediate, is less suitable for structured applications because, in my opinion, there is a risk of losing sight of the general context, and the IDE does not offer support with IntelliSense.
