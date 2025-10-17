---
title: Summary Chapter 7
description: Wrap up of Style and Data module.
---

# Summary

In this chapter, many points have been covered, starting with an analysis of how to maximize the application flow analysis. It's crucial for you to interview the end users of your solution because, as a developer, your job is to solve problems. Some useful tricks have been shared to reduce uncertainty when implementing new projects or features.

Continuing in the chapter, a deep dive was taken into the various CSS writing methods available in Qwik. Specifically, the strengths and weaknesses of these methods were examined. After this comparison, the focus shifted to Tailwind, the tool you will use in the application you'll develop in the subsequent chapters.

Some tricks that are used daily to optimize the use of Tailwind have been shared. If a common thread were to be found among these tips, it would be their focus on creating a Tailwind-styled application that is readable and maintainable in the medium to long term.

It was discovered that integrating Tailwind with Qwik is straightforward, thanks to the Qwik CLI. Exploration was also done on how to create a library of components, the benefits of this approach, and why you should consider using this design method for your applications. The advantages are numerous. Having your style and well-defined graphic rules will make your applications unique and will help grow and consolidate your brand identity.

Next, you learned how to manage data within a Qwik application. While creating beautiful applications is important, they must also be functional. To make them interactive, you need to understand how to manage the application state.

The chapter began by examining how to manage a local state in your components using `useSignal` and `useStore`. You also saw how the Qwik optimizer serializes state data into your initial HTML. Then, you learned how to share a global state between multiple components with `useContext`. This method allows you to avoid passing properties back and forth between your components and provides an easy solution to a problem that is difficult to solve in other frameworks.

You delved into how Qwik manages the DOM update behind the scenes with signals and vDOM. At the end of the chapter, you learned how to read data on the server side via `routeLoader$` and on the client side via `useVisibleTask$` to render them in your application.

If you need to modify data and make calls, you can use `routeAction$` or `globalAction$`. Of course, you can always call your API for data modification via fetch.

In the next chapter, you will start building your e-commerce site with Qwik and the help of Supabase, a truly remarkable edge database.
