---
title: Technical requirements to start a new Qwik application
description: Qwik CLI and amazing tool to have a great Developer Experience with Qwik.
---

# Technical Requirements to Start a New Qwik Application

Now that the reasons for Qwik's uniqueness and the benefits it offers have been explained let's delve into the technical requirements for setting up a Qwik application on a workstation.

Getting started with Qwik is a straightforward process. The following tools are necessary:

- Node.js v20.12.2 or higher
- A preferred IDE (VSCode is recommended)

Since Qwik is built on TypeScript, familiarity with this language is essential. TypeScript enhances JavaScript with types and various other features. To gain a deeper understanding of TypeScript, reading ["Beginners Guide to TypeScript"](https://www.newline.co/beginners-guide-to-typescript) by Christian Santos is recommended.

> You can use JavaScript for your Qwik application, but TypeScript is the preferred way.

## Creating a New Project with Qwik CLI

In the past, structuring a web application involved writing everything from scratch and struggling to find the correct configuration for different libraries. Fortunately, this has changed, and it is now expected for every tool to have a command line interface (CLI) feature.

Creating a Qwik application is a simple process. The Qwik CLI needs to be executed in the shell. Qwik supports various package managers, allowing you to choose your preferred one and run one of the following commands:

```shell
npm create qwik@latest
# or
pnpm create qwik@latest
# or
yarn create qwik
# or
bun create qwik@latest
```

The Qwik CLI will provide guidance through an interactive menu. It will prompt you to specify the folder where you want to create the application, select one of the available starters (Empty App, Basic App, etc.), and decide whether to install the dependencies and initialize a git repository. Once these steps are completed, you will be ready to proceed.

The installed packages will include `Qwik`, the framework with its primitives and logic, and `Qwik City`, the library responsible for managing routing, middleware, and more. Both packages are maintained and managed by the Qwik team.

While it is possible to use Qwik without Qwik City and manually handle routing, it is not the most efficient approach. It is recommended to follow the standard approach and utilize Qwik City.

By default, the project is configured with Prettier and some `npm scripts` for code formatting using the default settings. The same applies to ESLint, which is configured with recommended settings for TypeScript and a special plugin called `eslint-plugin-qwik`, developed and maintained by the Qwik team. This plugin enables you to standardize the syntax of your application according to official rules, ensuring that you can utilize Qwik to its full potential. It provides warnings to assist you in resolving any issues and standardizing your code in the most effective manner.

## npm vs pnpm

When dependencies are installed in our projects using `npm`, a `node_modules` folder is created for each project. These folders can occupy a significant amount of disk space, potentially reducing the available free space. There are npm packages available, such as [npkill](https://www.npmjs.com/package/npkill), that allow you to remove these folders from various projects via the command line, freeing up space.

However, with the introduction of `pnpm`, this issue can be permanently resolved. pnpm takes a different approach by creating the `node_modules` folder during dependency installation. Instead of downloading the necessary files within the project, it downloads the dependencies into a global cache. Within the project, it establishes symbolic links between folders to reference the dependencies. If a dependency already exists in the local directory, it will not be downloaded again.

For instance, if we download the latest version of TypeScript, it will be downloaded into the global cache. If another project requires the same version of TypeScript, it will reuse the package from the cache. This simple management technique saves disk space and download time, as we often work on similar projects with the same technologies, resulting in dependencies that are already present in our system. Even if we delete the `node_modules` folder and reinstall everything, no downloads will be performed because the dependencies are already available in the global cache.

## Understanding the Directory Structure

Qwik supports files that return JSX (such as .tsx) as well as files that allow you to write Markdown (such as .md and .mdx). Markdown is a markup language with plain text syntax that can be converted to HTML and other formats. It is commonly used for formatting README files, writing forum messages, and creating formatted text using a simple text editor. It is also convenient for creating documentation pages due to its simplicity.

A typical Qwik project created using the CLI has the following structure:

```
qwik-app
├── README.md
├── package.json
├── public
│   └── favicon.svg
├── src
│   ├── components
│   │   └── router-head
│   │       └── router-head.tsx
│   ├── entry.dev.tsx
│   ├── entry.preview.tsx
│   ├── entry.ssr.tsx
│   ├── global.css
│   ├── root.tsx
│   └── routes
│       ├── users
│       │   ├── users.css
│       │   └── index.tsx
│       ├── index.tsx
│       ├── layout.tsx
│       └── service-worker.ts
├── tsconfig.json
└── vite.config.ts
```

### public/

This folder contains the static files of our application, such as images, fonts, icons, etc. During the build process, these files are copied to the `/dist` directory and served at the root URL path. For example, the file `public/favicon.svg` will be served at the address `https://my-website.com/favicon.svg`.

### src/routes/

This is a special folder that Qwik City uses to create routing paths. Folders and files within this directory have special meanings based on naming conventions.

- **routing paths based logic**: the logic that is considered to base the routing of our application is quite linear without fortunately too many exceptions. Each nested folder generates a new application route, so let's imagine that we have an `orders` folder inside the `src/routes/` folder, this folder will be considered as a new URL path available in our application. If we create an `index.tsx` file with a Qwik component inside the folder, this will be rendered to us when we query the URL `https://my-website.com/orders/`. Our homepage is a special case because it does not contain paths, in fact, the index.tsx present inside the `src/routes` folder is our homepage. Here are some examples to give you an idea:
- https://my-website.com/ -> src/routes/index.tsx
- https://my-website.com/orders -> src/routes/orders/index.tsx
- https://my-website.com/orders/detail/ -> src/routes/orders/detail/index.tsx

  Managing parameters within the URL is also possible. For example, to view a specific order, the URL would typically be something like `https://my-website.com/orders/123/`, where `123` is the identifier of the order. To handle this, a folder `src/routes/orders/[id]/` can be declared with an `index.tsx` file inside. In this file, the parameters from the URL can be accessed using the `useLocation().params.id` API.

  Additionally, URLs like `https://my-website.com/shop/clothes/t-shirts/` can be achieved. To accomplish this, a folder `src/routes/[...shop]` can be defined using naming conventions. In this example, `shop` is the string parameter accessible as `useLocation().params.shop` in our component, and it captures all the path after `/shop`.

- **layout.tsx**: Layout is an important concept in Qwik City as it relates to routing. In most applications, a fixed structure is required on all pages, such as a header and a footer. This can be achieved by declaring a `layout.tsx` file inside the `src/routes` folder. This file contains a special syntax that will now be analyzed.

  FILE: `src/routes/layout.tsx`

```typescript
export default component$(() => {
  return (
    <div>
      <Header />
      <Slot />
      <Footer />
    </div>
  );
});

```

In addition to the `Header` and `Footer` components, there is a special component called `<Slot />`. This component instructs the framework to replace `<Slot />` with the content of our page. For example, if we are on the homepage, it will replace `<Slot />` with the component present in the `src/routes/index.tsx` file. Based on the requested URL, it will follow the logic described earlier.

Additional layouts within the header and footer are also possible. For example, a side menu can be included only in the admin section. A `layout.tsx` file can be created inside nested subfolders, such as `/src/routes/admin/layout.tsx` to achieve this. This additional layout will be included within the layout that contains the header and footer. Finally, the page (the `index.tsx` file) will be rendered inside the layout present in the admin folder.

If a specific layout is not desired for a particular page, named layouts can be used. By giving a layout a name, such as `layout-special.tsx`, a special layout can be declared that can be used by pages instead of inheriting the default layout. To activate the special layout, a file of this type can be defined: `src/routes/contact/index@special.tsx`. By using `@<name>` in the file name, the framework is instructed to use the layout with the same name. This provides the flexibility to manage different cases as needed.

The `src/routes/404.tsx` file is used to handle undefined routes in our application, such as `https://my-website.com/not-existing-route/`. When a route is not defined, the 404 page is used to show the user a service page. 404 pages can also be nested like layouts, and the more specific 404 page is used when an undefined route is encountered. For example, if a 404.tsx file is inserted into the `src/routes/user` folder, it will be used for the URL `https://my-website.com/user/not-existing-route`, instead of the generic 404 page.

It is also possible to declare a folder and bypass the routing logic using the `(myFolder)` annotation with round brackets. This allows the creation of a folder where files can be inserted without being subject to the routing logic. This folder is ignored by Qwik City and serves as a logical grouping of project files. For example, if the structure is `src/routes/orders/(myFolder)/[id]/detail/index.tsx`, the URL to view the page will be `https://my-website.com/orders/123/detail`. The `(myFolder)` folder is ignored and only serves developers to logically group project files.

### src/components/

This directory conventionally hosts the components of our web application. However, a different folder can be chosen if desired.

### src/entry.\*.tsx

- `entry.dev.tsx`
  This file is the development entry point using only client-side modules, without SSR.
- `entry.preview.tsx`
  This file is the bundle entry point for `preview` and it serves your app's built-in production mode.
- `entry.ssr.tsx`
  The application is rendered server side and this file is the entry point to start the Server Side Rendering (SSR) process.

### src/global.css

This file is used for global CSS styles. Global styles can be defined in this file.

### tsconfig.json

This file contains the TypeScript compiler configuration. It is present because the project is written in TypeScript and contains the necessary compiler options.

### vite.config.ts

Qwik uses Vite to build the project, and this file contains the Vite configuration. The default Qwik project includes some Vite plugins used during the compilation and build phases:

- `tsconfigPaths()`: This plugin is used to load modules whose location is specified in the paths section of tsconfig.json.
- `qwikCity()` and `qwikVite()`: These plugins, developed by the Qwik team, are important for using the Qwik Resumability approach.

> As developers we write the code with the best possible Developer Experience (DX) and the Vite plugins created by the Qwik team can optimize the code for us, obviously without changing the behavior, but only using the new Qwik mental model.
