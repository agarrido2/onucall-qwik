---
title: Getting started with Qwik
description: Let's see together the fundamentals of Qwik. In this lesson you will compare Webpack and Vite.
---

# Getting started with Qwik

Before beginning the process of building a Qwik application and analyzing its configuration in detail, several concepts need to be introduced to ensure everyone is on the same page. It's important to understand how the process of creating an application works behind the scenes. For developers, it involves writing a normal application, but the heavy lifting is done in the build phase by looking for the `$` markers and extracting the code present in the application to isolate it into small bundles. Modern code is written with the best possible language and updated tools that allow for avoiding writing raw JavaScript code. Even for the style part, raw CSS is no longer used, but always try to find a way to speed up and make writing code enjoyable. Therefore, on the one hand, TypeScript is used for the code part and other modes for the style part, e.g., SCSS or CSS in JS.

Furthermore, when the code is stripped, the application is divided into multiple files for readability and good practice reasons. Importing from external libraries is also done to take advantage of the functionality they provide without having to reimplement the functionality from scratch. Imagine having to create an application that shows the stock market performance of the Dow Jones index in real-time with interactive graphs. A library is needed that allows for creating these graphs without much effort. If it didn't exist, it would be necessary to sit down and think about how to create these components and how to handle real-time updating with measurable variability per second. It's certainly much easier to choose the right library for your needs and take advantage of the graphics that are made available.

As good front-end developers, it is known that the browser only digests three ingredients: HTML, CSS, and JavaScript. The recipe is quite simple, but who is the chef who transforms modern and complex code into those three basic ingredients that the browser recognizes? The chef in question is called a "Bundler".

## webpack

Webpack has been the reference `bundler` for front-end applications for years. Indeed, when it came out with a stable version, it was immediately adopted by many because it solved a series of configuration problems. Back then, setting up a development environment was a pain. Gulp, Grunt, and Browserify are just some of the tools that were used simultaneously in the project pipelines. If these names are recognized because they, too, were fought with, sympathy is extended. But if it's the first time these names have been heard, envy is extended because it means being of the new generation.

The role of the bundler is to take all of the code and combine it into one large file, which the browser can then use to load the application. This file contains the code plus any third-party dependencies that have been imported, which sometimes might have addictions and so on. So, at the end of the process, there are static files: HTML, CSS, and Javascript. But the big problem is that this process slows down more and more as the application grows in size. This slowness is not only noticeable during the production build phase but also on a day-to-day basis. Therefore, every time a file is saved and even the smallest of changes is made, a build will be started, which will take time, and therefore there will be a wait. Working this way is very frustrating because, on the one hand, there is a need to produce code to complete tasks, but it can't be done because of these constant slowdowns. Luckily, in 2020, Evan You, the creator of Vue.js, created Vite, a bundler that, thanks to a new way of processing files, solves the problems that Webpack brought with it. Now, all frameworks are based on Vite, and Qwik is no different. Vite was chosen for its speed, but how is it different from Webpack?

## Vite

As mentioned, Vite was invented by the creator of Vue.js and became popular because it allows for an optimal experience for developers due to its way of processing files. In fact, in 2020, browsers offered broad support for modules, and ES modules were introduced. This feature allows developers to import and export code from different files in the browser. Vite uses native modules in the browser to load and process only the code needed to request resources. Part of this process is delegated behind the scenes to Rollup.

This means there's no need to reload the entire application when a change is made, and there is no interruption to the development cycle. Thanks to Hot Module Replacement (HMR), modified modules can be replaced. While some bundlers support HMR, Vite's approach is faster, using native ESMs, so only a limited part of the dependency chain is invalidated. This means that HMR times do not increase as the complexity of the application increases.

Additionally, Vite automatically divides the pieces, determining what needs to be loaded and when. Let's imagine this code and see what Vite allows to be done. Normally, a module is imported at the beginning of the file, like the code in the following example.

```typescript
import myFunction from "...";

const myEvent = async () => {
  myFunction();
};
```

But if there's a desire to do lazy loading of this module, a dynamic import can be performed (see example below), and Vite will create a separate file that will be downloaded when and if the `myEvent` event is executed.

```typescript
const myEvent = async () => {
  const myFunction = await import("...");
};
```

So, thanks to this approach, it can be said to import a series of files only if the user is logged in; otherwise, don't import anything. Thanks to these tools, it is possible to optimize the code.

## Vite Plugins

Vite offers an integration system to extend the build process with extra operations that are wanted to be performed. Creating a plugin for Vite is very simple. First, Vite needs to be configured and the plugin added to the plugin property. A plugin is a simple function that can receive various options as parameters and perform operations. It can attach to different Hooks. They won't all be listed because the Vite documentation can be referred to, which is well done. A basic plugin will be created to understand how it works.

```typescript
import { PluginOption, defineConfig } from "vite";

const myPlugin = () => {
  const screwPlugin: PluginOption = {
    name: "vite-plugin-base",
    apply: "build",
    buildStart: () => {
      console.log("buildStart: do things");
    },
    closeBundle: () => {
      console.log("closeBundle: do things");
    },
  };
  return vitePlugin;
};

export default defineConfig(() => {
  return {
    plugins: [myPlugin()],
  };
});
```

In this example, a synchronous function has been created, but nothing prevents also being able to declare something asynchronous. With this function, the `buildStart` and `closeBundle` events are listened to, and something is printed to the console. With a custom Vite plugin, everything is possible: creating files, making HTTP calls, logic during the creation phase, and more. The most frequent use case, however, is the transformation of the files of the project. For example, a particular extension can be intercepted to add a comment in the first part of the file or, more simply, modify the imports and the structure of the file to create dynamic imports on the fly and tell Vite to generate independent files. This use case seems to fit Qwik and its mental model.
