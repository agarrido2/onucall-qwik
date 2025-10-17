---
title: Progressive Web App
description: Progressive Web App approach can be an alternative to the stores. You can publish you application with a lot of benefit with PWA.
---

# Progressive Web App (PWA)

Nowadays, real data collected in the field confirms that more than 65% of individuals connect to the web via mobile devices. However, another fact that warrants further consideration is that 73% of purchases for luxury goods, pharmaceuticals, cosmetics, and much more are made via mobile. Therefore, ensuring an optimal user experience for mobile is essential for business success and can make a significant difference compared to competitors.

Once an application is publicly available, it likely has a public address that uses the `https` protocol. This protocol guarantees that the application uses secure internet communication. Using this protocol also indirectly enables support for the Progressive Web App (PWA) mode, which improves the experience of users who use the mobile application.

PWAs are a hybrid between web applications and mobile apps. This technology uses the browser and does not require installation via the app store, which is why it is often preferred over native apps. Users start using the web app via the internet, and when they decide that it is useful, they can install it among the icons of the mobile phone by pressing a button. Data shows that, apart from the famous apps already pre-loaded on mobile phones (such as WhatsApp, Facebook, YouTube, etc.), people tend not to install new apps, especially if they are not already famous. Consider Amazon, for example. Initially, individuals buy two or three products from the web application, and only when they find it useful do they decide to install the mobile app. Numerous advantages are present in web applications in all respects.

- **Look and feel**: As with native apps, an icon on the homepage and on the application menu of the device, which is highly customizable, is present. Thanks to a very granular configuration, it is possible to define many features that bring the user experience and graphic perception of a native application closer.
- **Easy to update**: Like a normal web application, to release an update, it will be sufficient to deploy changes, and they will immediately be available to the end user. There is no need for versioning; for example, when going through the stores of smartphones, the user will simply see the updated application.
- **Universal codebase**: With this approach, it is not necessary to have dedicated development teams. Usually, when wanting to create native applications for iOS and Android, separate codebases are needed to manage the two developments. This approach quickly turns into a problem because the codebases, if not managed diligently, will begin to be misaligned, both in terms of logic and in terms of graphic appearance. Imagine implementing access to the camera in the two code bases, clearly being two different languages. There will be two implementations, and the same will happen for the graphics part. Having the two pixel-perfect solutions will be impossible, and there will always be differences. Over the years, hybrid approaches have emerged to address challenges on both iOS and Android using a unified code base. While effective in resolving previous issues, it requires an additional code base to implement the web application alongside the existing one.
- **No alley**: Native applications, as well as those downloadable from app stores, are subject to fees, especially if they generate income. Typically, stores impose a 30% commission on app purchases, which, though high, is currently unavoidable. The PWA (Progressive Web App) approach provides an alternative, circumventing the entire store system. Additionally, when publishing an app through traditional channels, it must undergo checks by store managers to ensure compliance with predefined rules. However, with the PWA approach, these checks become unnecessary, as the application can be installed directly from the browser.
- **Offline support**: In fact, thanks to the service worker, full support so as not to depend entirely on the internet in case of poor connectivity is provided.

There are also downsides to using PWAs that need to be taken into consideration. Native applications usually consume less battery than their PWA counterparts. This is because a PWA is embedded within a browser instance. The second negative aspect is being inside the browser; full access to the native APIs of the device is not available and will always be limited by the use of those provided by the web browser. Today, it is possible to do many things with the browser API, and interesting features are released with each new version. The capabilities of PWAs can be checked at this site `https://web.dev/learn/pwa/capabilities`, and thanks to this overview, the best choice for a specific use case can be understood.

There is not much to configure to prepare a Qwik application to also be a PWA. A configured service worker is already present thanks to the mental model of Resumability. The presence of this file is an essential condition for creating a PWA. The `manifest.json` file is also necessary to best configure everything, but already in the starter offered by the Qwik CLI, this file is present and functioning. It just needs to be modified to add the missing properties to support PWA.

Here is an example:

```json
{
  "$schema": "https://json.schemastore.org/web-manifest-combined.json",
  "name": "qwik-project-name",
  "short_name": "Welcome to Qwik",
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#1D4ED8",
  "background_color": "#fff",
  "description": "A Qwik project app.",
  "icons": [
    {
      "src": "logo-512-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "logo-192-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "logo-144-144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "logo-96-96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "logo-72-72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "logo-48-48.png",
      "sizes": "48x48",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

This file is analyzed in detail. There are some obvious properties which are `name`, `short_name`, and `description`, but others are more specific.

- **start_url**: The start_url is mandatory and indicates to the browser the starting page of the application so our user will always start from the page we have defined. start_url should direct the user directly to the app's homepage.
- **display**: The browser UI can be customized to display when the app launches. For example, the address bar and browser UI elements can be hidden. Our applications can also be launched on the full screen. The display property has these values:
  - fullscreen: Opens the application occupies the entire available viewing area.
  - standalone: it runs in its browser window and hides standard UI elements like the address bar.
  - minimal-ui: The application looks like a standalone app. The user has a minimal set of UI elements to control navigation (such as back and reload).
  - browser: A standard browser experience.
- **theme_color**: Set the color of the toolbar, and a color for the light and dark theme can be defined.
- **background_color**: This is used on the splash screen when the application is first launched.
- **icons**: A set of icons to use on the home screen when launching apps can be defined. Each icon must include `src`, a `sizes` property, and the image type. Finally, there is the `purpose` property, which defines the purpose of the image. The scope can have one or more of the following values, separated by spaces: `monochrome`, `maskable`, and `any`, and are intended to help provide information on what to do if the user uses different icon themes. An icon of at least 192x192 pixels and an icon of 512x512 pixels must be provided. If only these two icon sizes are provided, the others will be automatically resized to fit the device. For a pixel-perfect result, it is advisable to define them as in the example with 48 dp increments.

Thanks to the fact that the application uses `https`, a service worker, and the manifest, it is ready to try this possibility. The install button will already be visible in the browser. By pressing it, the application can be added to a mobile device as if it were a native application. Several use cases support the fact that it makes sense to invest in PWAs. The most famous are Uber, Starbucks, Pinterest, and Spotify, just to name a few. If these large companies have based their business on this method, then it makes sense to do a test to see if it can be successful. After all, thanks to Qwik, it requires zero effort.
