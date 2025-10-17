---
title: Partytown
description: Partytown an amazing library to execute third scripts in the service worker.
---

# Partytown

To analyze metrics related to SEO, external services loaded on the page are typically utilized, the most notable of which is [Google Analytics](https://support.google.com/analytics/answer/10089681). Besides these scripts for analyzing SEO-related metrics, other scripts can be inserted to help track events on the page. For instance, consider a scenario where there's a need to monitor how many users interact with a specific banner or button. With these third-party scripts, the necessary code can be inserted into the application, collect the events, and then analyze the collected data to make considerations and adjustments.

These are just examples of third-party scripts that can be inserted into the page. Everything seems perfect and simple to implement. However, these scripts, which are loaded when the application starts, slow down the rendering of the page and negatively impact its performance. As discussed in depth in previous chapters, downloading and executing JavaScript code upfront inevitably slows down the application.

Third-party scripts have many downsides:

- They send too many network requests. When rendering a page it is very important to limit the number of network calls because the more we make, the more we slow down the loading process.
- They send too much JavaScript. This can block the DOM construction because the main thread is busy. The result is a delay in the speed at which pages can be rendered.
- Parsing and running CPU-intensive scripts can delay user interaction and drain battery life.
- They often have insufficient HTTP caching, which forces resources to be frequently retrieved from the network.
- They use legacy APIs (e.g., document.write()), which are known to be detrimental to user experience.
- Third-party scripts also often use embedding techniques that can block window.onload, even if the embedding uses asynchronous or deferred.

Almost all public sites nowadays run third-party scripts, but how can this problem be solved? [Partytown](https://partytown.builder.io/) is a library that aims to definitively resolve the overhead caused by the download and execution of these scripts by the browser.

What Partytown does is move the loading of third-party scripts to a separate service worker to help speed up sites by dedicating the main thread to code and offloading third-party scripts to a web worker. Additionally, Partytown can create a third-party script sandbox that limits third-party script access to the main thread.

Without Partytown, code and third-party code compete for main thread resources, but with Partytown, performance is significantly better.

![Partytown](./public/assets/Partytown.png)

Image from https://partytown.builder.io/

Let's see how a third-party script can be incorporated to utilize Partytown. To use Partytown, the developer must decide which scripts they want to move to the web worker using an opt-in approach. This means that other scripts would remain unchanged. To activate Partytown, it is necessary to insert the `type="text/partytown"` attribute into the scripts that the library should manage. This `type="text/partytown"` attribute does two things:

- It prevents the main thread from executing the script because it is not a known type and is therefore ignored by the browser.
- It provides a selector for Partytown to query, for example, document.querySelectorAll('script[type="text/partytown"]')

```shell
- <script>...</script>
+ <script type="text/partytown">...</script>
```

The web worker is provided with scripts to execute within the worker thread. The web worker creates JavaScript proxies to replicate and forward calls to main thread APIs (such as DOM operations). The service operator intercepts requests and can then communicate asynchronously with the main thread. This mechanism allows the application to be relieved from managing third-party scripts and enables it to have amazing performance. One nice thing is that it works with practically all modern frameworks because it is just using JavaScript code and nothing else.
