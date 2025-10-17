---
title: Cloud solutions
description: Cloud solution are a good alternative for a low cost pipeline and host. Nowadays these kind of services are so smart and great, you should try them.
---

# Cloud Solutions

Cloud solutions platforms are a recent development in the evolution of the web. Many companies have emerged to address the complexities of deploying applications. As seen in previous sections, numerous factors are at play to make an application accessible to everyone via the web. These platforms automate all the necessary steps, saving valuable time to focus on application development and implementing new features for the business. Deploying to these platforms is very straightforward. From the list of integrations available for Qwik, one can choose the one that allows deployment to Vercel. By typing `pnpm qwik add vercel-edge` in the terminal, this output will be received:

```shell
◇  👻  Ready? Add vercel-edge to your app?
│
│  🐬 Modify
│     - package.json
│     - .gitignore
│     - README.md
│
│  🌟 Create
│     - vercel.json
│     - src/entry.vercel-edge.tsx
│     - adapters/vercel-edge/vite.config.ts
│
│  💾 Install pnpm dependency:
│     - vercel
│
│  📜 New pnpm script:
│     - pnpm build.server
│     - pnpm deploy
│
◇  🟣  Next Steps  ───────────────────────────────────────────────────╮
│                                                                     │
│  Now you can build and deploy to Vercel with:                       │
│                                                                     │
│  - pnpm run build: production build for Vercel                      │
│  - pnpm run deploy: it will use the Vercel CLI to deploy your site  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────╯
```

As with the previous integration, some configuration files are automatically added to the application, dependencies are installed, and two extra scripts are added. Now, the `build` script can be run to package everything for publishing the production application. All that's left is to run the `deploy` script, which will use the Vercel CLI to operate.

> Obviously, to deploy with Vercel, you need to have a working account.

```shell
Vercel CLI
? Set up and deploy “~/qwik-app”? [Y/n] y
? Which scope do you want to deploy to? giorgioboa
? Link to existing project? [y/N] n
? What’s your project’s name? qwik-app
? In which directory is your code located? ./
Local settings detected in vercel.json:
Auto-detected Project Settings (Qwik):
- Build Command: vite build
- Development Command: vite --port $PORT
- Install Command: `yarn install`, `pnpm install`, `npm install`, or `bun install`
- Output Directory: dist
🔗  Linked to giorgioboa/qwik-app (created .vercel)
🔍  Inspect: https://vercel.com/giorgioboa/qwik-app/xxxx [1s]
✅  Production: https://xxx.vercel.app [43s]
```

As can be seen, some questions will be asked, but subsequent deployments will start immediately without requiring further information. At the end of the process, the public address of the application will be displayed. That's the advantage of these modern platforms - having an application up and running is fantastic. The ability to deploy with a terminal command is truly remarkable.

Platforms such as Vercel, Netlify, and Cloudflare, to name a few, go even further. It's possible to connect pipelines directly to a GitHub repository to carry out automatic deployment every time something changes in the code and, consequently, in the GitHub repository. Environment variables can be declared to parameterize the code and centralize constants such as private keys or external URLs. It's also possible to create different environments to verify developments in the classic staging environment. This allows deployment in various instances, providing maximum flexibility and agility.

Through the dashboard, the various applications that have been published can be monitored, traffic can be analyzed, and the storage used can be assessed. Some providers also provide a history of all the operations carried out to keep everything under control. Vercel offers a unique feature that allows the purchase of a public domain directly through their platform to be associated with the application. If there are no preferences, their convenient service can be used to avoid finding the best supplier from which to purchase the domain.

In the monitoring pages, there's also a section regarding the Core Web Vitals, the famous metrics that have been discussed in previous chapters. Thanks to this tool, the app's progress can always be well-informed, and there will be no excuses for not monitoring these important parameters.

All these services and features are immediately available, thanks to the platform. Otherwise, everything would have to be implemented manually in a customized way. Creating these solutions from scratch may be considered challenging and not without costs. It's important to weigh the pros and cons of the various solutions and then decide on the one that best suits the needs.

For example, an external service like `Sentry` could be used if there was a desire to implement a monitoring system. This service offers the ability to collect application logs and any errors through a quick and easy SDK. This paid service guarantees reliability and resilience and offers the assurance of always being available to receive events, logs, or errors from the application.

Here, too, payment for an external service is still required, and therefore, in terms of costs, the situation needs to be assessed on this occasion as well.
