---
title: Core Web Vitals
description: Core Web Vitals are so important for own application. You will learn in detail all the metrics.
---

# Core Web Vitals

In 2020, Google announced the introduction of a series of metrics that evaluate the user experience of a website and are considered essential for a good user experience and a more pleasant web, the Web Vitals. Google is actively committed to making the usability of websites simpler and more effective with the aim of facilitating users' browsing experience and providing answers quickly and clearly. The Web Vitals are standard metrics for measuring these aspects. Among these are three considered most important, which together form the `Core Web Vitals (CWV)`, which measure the loading speed, the page's response times, and the layout's stability. These metrics are important because they are integrated with SEO through a set of specific UX indicators that actively contribute to the ranking of the web application. Here are the metrics in question:

- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Interaction to Next Paint (INP)\*

\*Interaction to Next Paint replaced First Input Delay (FID) in March 2024

Let's discover these metrics in detail and explore some tricks for optimizing them.

### Largest Contentful Paint (LCP)

The LCP metric indicates the rendering time of the largest element visible within the screen when loading the site and measures the performance of the loading. What matters is what appears in the opening viewport of the site, while everything "below the fold" is not considered. This metric assumes that the largest visible object in the window is the main content and penalizes invasive content such as very large headlines, huge opening images, videos, banner ads, and pop-ups. Note that the download time is not considered but the amount of space that the object uses in the user's window. So, all elements of type `<img>`, `<svg>`, `<video>`, or blocks that contain informative texts for the page are important. Therefore, as a general rule, it is important not to place videos or images "above the fold" that are too large to avoid being penalized. This metric is expressed in seconds and should be considered in this way:

- < 2.5 sec. -> Good
- < 4.0 sec. -> Needs Improvement
- \> 4.0 sec. -> Poor

If images are intended to be shown in the viewport of the page, it is important to use the right formats to load the images. Using WebP, which is a modern format, provides superior image compression, allowing for the reduction of image size (e.g., SVGs, PNGs) to make loading faster. Furthermore, CDNs can be used to host images, improving response times and this metric. Additionally, external image resizing services allow for on-the-fly formatting and requesting the most suitable size for the user's resolution.

Here is an example:

https://`your-image-resizing-provider/your-image.ext`?w=1000&h=600&format=webp.

By doing so, the image can be obtained from the cache and resized and formatted if necessary. If the format and size already exist in the provider's cache, the response will be immediately returned without any computation.

### Cumulative Layout Shift (CLS)

Cumulative Layout Shift measures the displacement of visible elements and layout changes that occur suddenly during the entire duration of the page visit, causing a shift after loading the site area due to scaling, with a disturbing effect. So, imagine having an advertising banner that appears on the homepage after a few seconds, moving the layout of the page, which negatively impacts the CLS metric. It must be said that this metric is the result of very complex calculations, but fortunately, the Qwik team is very thoughtful about these metrics because they know that they are very important. In fact, they have developed Vite plugins to make our lives easier. There is a specific check for CLS that visually warns us on our page of movements that will penalize us and create a bad result for this specific metric. There is an out-of-the-box optimization to ensure that the right attributes are assigned (e.g., srcset) to optimize loading and possibly perform lazy loading to obtain excellent performance with images.

The solution integrated by Qwik is based on the `vite-imagetools` library, so it is not necessary to install additional packages or components in the application. This integration allows any local image to be imported into the code, and it will automatically be converted into multiple WebP images, one for each breakpoint (200px, 400px, 600px, 800px, 1200px), and processed to reduce its size. The application will contain an `<img>` element at the end of the process, and through the srcset attribute, the image origin is set for different solutions, so the browser will load the image best suited to the user's resolution.

This integrated solution offers several advantages:

- No JavaScript is required in the client to perform these transformations
- Zero layout shifts (automatic width/height)
- Hashed, immutable cached images
- Automatic optimization of the .webp/.avif format
- Automated srcset generation
- Extensible (use any `<img>` attribute)

Let's see an example:

```typescript
// Add the ?jsx suffix at the end of the import
import Image from '[IMAGE_PATH]?jsx';

export default component$(() => {
  return (
    <div>
      // Use the image in the template as a component
      <Image />
    </div>
  );
});
```

This script will generate the following `<img>` element in the HTML page:

```typescript
<img
  decoding="async"
  loading="lazy"
  srcset="
    /@imagetools/141464b77ebd76570693f2e1a6b0364f4b4feea7 200w,
    /@imagetools/e70ec011d10add2ba28f9c6973b7dc0f11894307 400w,
    /@imagetools/1f0dd65f511ffd34415a391bf350e7934ce496a1 600w,
    /@imagetools/493154354e7e89c3f639c751e934d1be4fc05827 800w,
    /@imagetools/324867f8f1af03474a17a9d19035e28a4c241aa1 1200w"
  width="1200"
  height="1200"
>
```

Note that `decoding="async"` and `loading="lazy"` are the default.

- **decoding="async"**: indicates that the image will not block the rendering of the page while the image is being decoded. For further reference, please check the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding).
- **loading="lazy"**: allows the browser to delay the loading of an image until it is visible in the viewport, which helps improve page loading performance
- **srcset**: allows you to choose the most appropriate image based on the resolution and size of the device screen. Setting width and height attributes prevents layout reflow, which hurts the CLS score.

The default decoding and loading behavior can be changed by manually setting them, and the width and height can also be manually specified:

```typescript
// decoding and loading
<Image decoding="sync" loading="eager" />
// width & height
<Image decoding="sync" loading="eager" style={{ width: '300px', height: '200px'}}  />
```

There are also integrations for optimizing images loaded from external sources. There is the `qwik-image` package developed by Qwik and another package called `@unpic/qwik`. Both libraries offer the possibility to use external images and perform optimization via CDN services such as Cloudflare, Builder.io, and many others. As mentioned before, it is very important that the image already takes its place on the page to avoid annoying movements that penalize the user experience and the CLS. With [qwik-image](https://github.com/qwikifiers/qwik-image), a placeholder can be rendered behind the scenes, which will be replaced as soon as the image is loaded. This trick guarantees an optimal CLS result.

### First Input Delay (FID)

First, Input Delay is a very important metric that measures the time that passes between the user's iteration (e.g., click on a button or link) and the browser's response to this iteration. Some events are ignored in this calculation. For example, zooming or scrolling are not taken into account when calculating the FID. A good value for this metric is within 100 milliseconds, which means that users should be able to interact with the page immediately. This metric only takes into consideration the first input delay because, often, the first feedback received allows us to create an overall impression of the quality and reliability of navigation. The main problem that does not allow good results for this metric is loading too much JavaScript upfront. With Qwik, as analyzed in the previous chapters, all this is resolved by the framework thanks to Resumability, so an exceptional FID can be achieved. This metric has been replaced by `Interaction to Next Paint` in March 2024 because the latter is entirely effective.

### Interaction to Next Paint (INP)

This metric replaced the First Input Delay (FID) in the Core Web Vitals and evaluate responsiveness, recording the latency of all interactions throughout the page lifecycle. We can obtain this metric by measuring the time between the user's action (e.g., key press, click) and the subsequent interface update. The highest value that is recorded among all interactions is the one considered to record the INP value. As we can imagine, a low value indicates that our page is responsive and therefore always responds reliably. This is a metric that measures the entire process of our application. Measure all interactions, not just the first one the user performs. It's a well-rounded metric just like Cumulative Layout Shift (CLS). So by measuring this metric we try to highlight applications that have a very short time between interactions and subsequent rendering.

A good value for this metric is less than 200 milliseconds, but if it is more than 500 milliseconds, then it is a warning sign that something needs fixing. Since this metric measures the entire cycle of events that starts from the user's iteration to the user interface update, one of the tips that can be given to optimize this metric is to minimize the size of the DOM because a larger DOM requires more computation time. Furthermore, what is even more important is to measure which operations need to be optimized. If we know who our enemies are, we can defeat them better. Tools like [PageSpeed Insights](https://pagespeed.web.dev/) can be our friends in finding what to optimize.

## Other Web Vitals

There are other metrics that, although not considered core, can give us an indication of whether our application is good or whether it is possible to improve it. They are not to be absolutely optimized because they are not considered core metrics, but provided that this does not impede the ability to obtain good scores in the metrics that matter. Let's look at these other interesting parameters that help give us a complete picture.

### First Contentful Paint (FCP)

This metric measures the time from the page begins loading to when any part of the page's content is displayed on the screen. Any image, button, text, or HTML elements in general, as long as they are visible, are considered. This metric distinguishes from the LCP metric, which instead aims to measure when the main contents have been rendered on the page. A good score for this metric is 1.8 seconds or less. If the application is above this number, there is something to fix. To improve results on this metric, ensure that CSS is minified and all unused CSS is removed. Also, try to remove unused JavaScript. Pre-connecting to the origins that provide the resources requested on the page can also be helpful. Additionally, try to limit the size of the DOM and keep it as minimal as possible.

### Time to First Byte (TTFB)

This metric measures the time between requesting a resource and the first byte of a response begins to arrive. A good result for this metric is 0.8 seconds or less. This metric precedes the other analyses that are user-centric, and it measures the waiting time for requests to understand if the user will have to wait. Above 1.8 seconds, the result is considered poor, and in the middle, it needs improvement. Results can be improved by relying on CDNs for the distribution of the resources necessary for the application or by using frameworks that allow HTML streaming to the browser. Qwik is one of those frameworks that can render HTML chunks, so as soon as the browser receives the first block, it will immediately be shown on the page, even if the second block is still being received. This flow is called streaming.

### Total Blocking Time (TBT)

This metric measures the time when the browser's main thread gets blocked. Whenever an activity that takes more than 50 milliseconds occurs in the main thread, it is considered blocked because it effectively prevents the responsiveness of user input. Therefore, if a user interacts with the page in the middle of a long activity, the browser must wait for the activity to complete before it can respond. If the activity is long enough (anything over 50 ms), the user will likely notice the delay and perceive the page as slow or unstable. A good user experience can be appreciated if the Total Blocking Time is less than 200 milliseconds. To improve this metric, reduce JavaScript execution time, reduce third-party code, and minimize the work of the main thread.

### Time to Interactive (TTI)

This metric measures the time it takes for the page to become interactive to user input. If this metric is unsatisfactory, it indicates that something is not correctly working when interacting with a site. The TTI wait until the DOM construction is complete to consider the page interactive, meaning that it can only be measured after the DOMContentLoadedEnd event. To improve this metric, eliminate any unnecessary scripts in the application or perform asynchronous execution of some elements to free the browser.
