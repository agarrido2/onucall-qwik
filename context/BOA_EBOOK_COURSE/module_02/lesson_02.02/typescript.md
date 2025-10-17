---
title: TypeScript
description: Overview of TypeScript. TypeScript introduced types into an untyped language like Javascript to ensure code consistency.
---

# TypeScript

TypeScript merits a separate paragraph due to its arrival in 2012, revolutionizing front-end application development. The official website states: "TypeScript is JavaScript with type syntax." This sentence alone provides significant insight. Developed by Microsoft and the same creator of C#, Anders Hejlsberg, TypeScript introduced types into an untyped language like Javascript to ensure code consistency.

JavaScript is a language interpreted by the browser, and any syntax or logic errors are discovered in the browser when the code is executed. This means that errors only surface when a feature is in use. For example, consider a button that saves a user profile. The saving code is only executed after pressing the "save user" button, and only then is the mistake discovered. With TypeScript, however, code verification shifts to the build phase because TypeScript files are compiled into JavaScript files during this phase. It's important to remember that only JavaScript can be read by the browser, serving as the common language. Therefore, TypeScript essentially provides a compiled language. In the given example, any error on the "save user" button would be identified during the compilation phase, even before deploying the application. This approach significantly reduces the errors that reach the end user.

It's worth noting that JavaScript purists didn't immediately embrace TypeScript. Despite initial resistance, it has become an indispensable language with each new release. Its simplicity and efficiency have led to its incorporation into many modern tools, and the most popular frameworks now support TypeScript by default.

Additionally, it's important to note that not all modern constructs offered by TypeScript are supported by browsers. However, TypeScript allows the freedom to write modern code, and during the build phase, it translates the code into fully functional JavaScript.
