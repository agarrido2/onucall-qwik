---
title: Summary Chapter 3
description: Wrap up of Code extraction module.
---

# Summary

This chapter is packed with new concepts. It begins by discussing a problem that plagues many web applications. Upon inspecting the results, it becomes apparent that JavaScript is the root of the issues. Unfortunately, it's not possible to simply do away with it. The chapter then proceeds to analyze, step by step, how Qwik manages to outperform other frameworks without resorting to unusual mechanisms. Instead, it uses a well-thought-out process to address the issues that other frameworks struggle with. The chapter delves into step-by-step debugging, and it's hoped that navigating the code broadens the understanding and provides a more detailed insight into how the framework operates behind the scenes. Some highly advanced mechanisms for code extraction are explored to comprehend how to segment code during the build phase. The solution continues to be refined, delving deeper and deeper until the optimal solution used by Qwik is approached.

A Qwik component is examined in detail, and how it's possible to write code on both the client and server-side in a seamless and enjoyable manner is discussed. In the final part of the chapter, different template systems are compared, focusing on the same example but implemented in different frameworks. React mirrors Qwik, while Vue.js begins to show a more pronounced difference, largely because its framework template involves using layers to separate logic, template, and style. Angular, in contrast, ensures a clear separation of file responsibility by default, using a different file for each layer (logic, template, and style). This highlights that not all frameworks are created equal.

In the next chapter, an exploration of how to start developing with Qwik will be undertaken. The project configuration will be examined, and the unique features of the framework will be delved into.

## Links

- [Code extraction article](https://www.builder.io/blog/wtf-is-code-extraction#export-extraction)
