---
title: Why Qwik use JSX syntax
description: JSX syntax is the most famous one because of React, but what about the other frameworks, Vue, Angular?
---

# Why Qwik Uses JSX Syntax

If attention had been paid to the previous example, it would have been noticed that the procedure for writing a Qwik component is not at all different from that used to write a React, SolidJS, or Preact component. All these frameworks mentioned use JSX, and the Qwik team's choice to use the same system is driven by the desire to lower the learning curve of the framework and attract as many developers as possible.

This choice was made not only because most front-end developers know it but also because there are many tools and an ecosystem already available for this syntax. For example, consider the various linters for the code, the most famous of which is [Prettier](https://prettier.io/), which already offers support for JSX. There was no need to adapt or create extra features to support Qwik; it already worked by default because the syntax is the same as other frameworks that have already been widely adopted. Hence, if this syntax is already known, it will not be difficult to start writing the first component.

## But what is JSX?

JSX is an HTML-like syntax that was seen in the example of a real Qwik component, and it is very useful because it adds dynamic expressions that allow referencing variables and functions within the HTML using the `{ }` syntax. This allows writing HTML-like code inside JavaScript.

Here's an example:

```typescript
export default component$(() => {
    // Logic and style should be implemented here

    return (
        <button
            class='...'
            onClick$={() => {
                console.log('Hi!');
            }}
        >
            Greetings
        </button>
    );
});
```

In this example we have written HTML, we see the `<button>` element, and it is easy to understand that with this syntax we can create our Qwik application in a very similar way to what we could do by writing Standard HTML.
Like normal HTML elements, it is also possible to use standard HTML attributes in JSX, so we can use `class` to style our application, `aria-label` for accessibility or just to give another example we can use `disabled` to disable a particular button that we don't want the user to click.
But not all frameworks use JSX there are other templating systems in the frontend ecosystem and to make you understand what I'm talking about I want to give you some examples, React with JSX, Vue.js, and Angular with a different templating system.
Let's try to compare the same component seen before with Qwik but with the syntax of React, Vue.js, and Angular.

- React

Here is the example with React:

```typescript
export function App() {
	// your logic and style here

	return (
		<button
			className='...'
			onClick={() => {
				console.log('Hi!');
			}}
		>
			Greetings
		</button>
	);
}
```

Here is the component written in React. No, there was no mistake with the copy/paste; it's so similar to a Qwik component. The only differences that may be noticed are `className` instead of `class`, `onClick` instead of `onClick$`, and in the case of Qwik, there is the addition of `component$`. Having seen before that the `$` is the famous marker that makes it possible to divide the application into bundles, all this makes a lot of sense. It can be seen that refactoring from React to Qwik is very easy. It will take some practice, but all the React or Next.js APIs are also present in Qwik, with a different mental model and performance. So once it is understood which Qwik APIs to use to replace the existing ones, the game is done; all that remains is to have fun and appreciate the benefits that Qwik will provide.

- Vue.js

Here is the Vue.js example:

```JavaScript
<script setup >
  // Implement logic here
<script>

<template>
  <button class="..." @click="()=> console.log('Hi!')">
    Greetings
  </button>
</template>

<style>
  // Implement style here
</style>
```

This example recreates the same behavior, a button that prints `Hi!` in the browser console. In Vue.js, it is possible to declare the logic (script section), the template, the "HTML", and the style (style section) in the same file. As can be seen in this example, which is deliberately basic to only focus on the template differences, there is a more verbose file compared to the JSX syntax, but in any case, it can benefit from colocation because all the code relating to the component is in the same position. This helps the developer because there is no need to jump from one file to another to implement a feature or simply read the code. But if this type of approach is not preferred, in Vue.js there is the possibility of splitting the various sections seen previously into multiple files, and this is possible thanks to this system.

```typescript
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

So, those who prefer to have a clear separation between files can be satisfied. This approach, however, is not what the documentation proposes as the ideal choice, although all the functionality of the framework is guaranteed.

- Angular

Let's move on to Angular and see an example:

FILE: `app.component.ts`

```typescript
@Component({
  [...]
  templateUrl: "./app.component.html",
  // your style in this file
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  onClick() {
    console.log("Hi!");
  }
}
```

FILE: `app.component.html`

```HTML
<button (click)="onClick()">Greetings</button>
```

Here, too, the button that prints `Hi!` in the console was created. Unlike Qwik and Vue.js, in Angular, the approach that the official documentation sponsors is to have more files for greater separation of responsibilities and less code coupling. This means that it is not possible to insert the console.log into the template part directly; a function had to be created to perform this simple action to accommodate the separation of responsibility between UI and business logic that the framework imposes. Of course, being able to declare an inline function inside the HTML would have been useful in this case. But if it is looked at with a broader focus, it can be said that no Angular developer would ever expect to have an isolated function in the template but should immediately check the file that is responsible for the business logic. It can be seen that there is the logic file and the one relating to HTML; the snippet of the style file was omitted because it is not needed for reasoning purposes. If the template and style are preferred to be in the same file, the framework-specific syntax can be used to take advantage of colocation. Honestly, having all the code for a component inside the same file is preferred because it is remembered that in the past, one of the most expensive things during development was having to jump from one file to another to implement even the simplest of changes.
