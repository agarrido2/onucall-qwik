---
title: Deploy Qwik in production
description: There are many ways to deploy a Qwik application. You can have your own server and deploy your Qwik application easily with the Qwik CLI and integrations.
---

# Deploy Qwik to Production

Understanding the importance of a well-configured, high-performance, and searchable site is crucial. However, the most critical aspect for all users is the ability to publish an application on the web. This ensures that the application is accessible to everyone, including desktop users, mobile users, and many others. In the past, an on-premise solution was used to deploy applications. More recently, Virtual Private Servers (VPS) have been utilized, effectively offering a virtual server where an application can be hosted.

## VPS and Housing Solutions

As mentioned, this method of publishing applications was widely used in the past. For some companies, it is still the most appropriate way to publish their applications. It should be noted that with the advent of the Cloud, this type of solution is, in some opinions, outdated. However, the fact remains that having full control of the configuration and complete management of the operating system on which an application runs is an essential necessity for many.

Delving into what it means to have full control of the operating system, the `Virtual Private Server (VPS)` is a type of hosting that allows the purchase of a virtual server and access it with specific credentials to manage it. This gives the ability to install software and updates based on specific needs. An application can be installed to make it publicly accessible and available at any time.

The VPS approach offers full control and guarantees optimal performance based on the plan chosen to purchase. It is the responsibility of the user to select the most suitable size for the server. Here are some sample sizes for a popular VPS provider:

- **S Plan**: 1 vCore, 2 GB RAM, 40 GB SSD, 250 Mbps
- **M Plan**: 2 vCore, 4 GB RAM, 80 GB SSD, 500 Mbps
- **L Plan**: 4 vCore, 8 GB RAM, 160 GB SSD, 1 Gbps
- **XL Plan**: 8 vCore, 8 GB to 32 GB RAM, 160 GB SSD to 640 GB SSD, 2 Gbps

There are solutions for all needs, and plans can also be changed on the fly if necessary. Costs were deliberately not included because they change rapidly, and each seller has their dedicated offers.

Generally, the parameters to consider are mainly the allowed disk space, the amount of RAM, the type of processor, and the available bandwidth, both in terms of size and availability. These servers can be physically located around the world and can be physical or virtual. They are usually very powerful machines on which dozens or sometimes hundreds of virtual servers can be shared.

Personal space on the server is shared with other users. However, the various spaces are well isolated, so there is no perception of being on a shared server. Each user has their own space and full control of the machine. This is guaranteed because virtual machines are used, a technology that allows running a virtual instance and provides virtualized server resources on a physical server shared with other users.

Most of these VPS are instances with a Linux operating system because the graphical interface is unnecessary to make them work. To publish an application, creating a web server to expose it to the public will be enough. Sometimes, however, choosing Windows or macOS machines is also possible. But in general, the preferred distribution can be chosen for all solutions.

For example, a Linux server can be used to install a web server and publish a site. By doing so, not only which web server to use (for example, Apache or Nginx) can be chosen but also the technology, in this case, Qwik. Another advantage is that access to these instances is password-protected, preventing anyone from sabotaging the system. They always have guaranteed uptime and are often economical and functional solutions for small sites with limited visitors. However, databases can be configured and used, and usually, with the most complete plans, it is possible to activate automatic and recurring backups to protect data. However, there may be limitations on the installed software, so it is a good idea to check carefully and see what is possible in these instances.

These virtual machines are usually equipped with a public IP, which allows an application to always be reachable at the same address. It will be enough to register the domain chosen for the application to always be able to reach it. e.g., `https://www.my-website.com`. In general, however, it must always be considered that the physical server is shared with other service users. The alternative to having a server always active and functioning is housing.

The `housing` solution is very similar to the one seen previously, except that the server on which an application is run is owned by the user and is located in the supplier's data center. The supplier will offer connectivity, fire systems, UPS, and so on. Clearly, for both solutions, technicians are needed to install the various packages and maintain the system from a software point of view. This requires a significant amount of energy and time. The alternative is to use "managed" servers where all these activities will be taken care of by the supplier, who will then invoice the user.

These solutions are quite complex, and nowadays, there are better choices for deploying applications. This is especially true if a startup is involved or there is a need to validate a business idea or simply implement a side project.

## Deploy to Server

The numerous integrations present in Qwik can be taken advantage of to perform deployment on a server instance. These integrations can be used via the command present in Qwik. In fact, it is just necessary to move to the folder of the Qwik project and type from the terminal:

```shell
npm run qwik add
# or
pnpm qwik add
# or
yarn qwik add
# or
bun qwik add
```

Within a Qwik application, a list of integrations will be offered that allow the configuration of the deployment of an app very simply. In this list, various integrations can be found to be able to deploy on a server.

```shell
- Adapter: Node.js Server
- Adapter: Deno Server
- Adapter: Node.js Express Server
- Adapter: Node.js Fastify Server
```

Let's see together how to deploy with the `Fastify` web framework, which stands out for its simplicity and extreme speed, making it the point of reference.

> Using a framework instead of developing everything by hand guarantees us, first of all, that we are covered from the security point of view; furthermore, directly from the framework documentation, we can have the directives on how to develop with the best practices that allow us to create efficient code. Many organizations use `Fastify`, and the project is part of the OpenJS foundation and is included within the At-Large projects, which are those that are considered important for the general ecosystem. The OpenJS foundation aims to support the healthy growth of JavaScript and web technologies.

By selecting the `Adapter: Node.js Fastify Server` from the list seen above, an application will be configured automatically. Here's what will be seen in the terminal.

```shell
◇  👻  Ready? Add fastify to your app?
│
│  🐬 Modify
│     - package.json
│     - README.md
│
│  🌟 Create
│     - src/entry.fastify.tsx
│     - src/plugins/fastify-qwik.ts
│     - adapters/fastify/vite.config.ts
│
│  💾 Install pnpm dependencies:
│     - @fastify/compress
│     - @fastify/static
│     - fastify
│     - fastify-plugin
│
│  📜 New pnpm scripts:
│     - pnpm build.server
│     - pnpm serve
│
◇  🟣  Next Steps  ──────────────────────────────────────╮
│                                                        │
│  Now you can build a production-ready Fastify app:     │
│                                                        │
│  - pnpm run build: production build for Fastify        │
│  - pnpm run serve: runs the production server locally  │
│                                                        │
├────────────────────────────────────────────────────────╯
```

It can be read that dependencies will be automatically added to a project, some configuration files, and two extra scripts that will allow building a project using `Fastify`. Here, starting the `build` script will run the build in a project so it can then be moved and run on a server. The script `"serve" : "node server/entry.fastify"` can be analyzed, and it can be seen that to run an application in production, it will be sufficient to use Node.js and launch the `server/entry.fastify` file with `node`, which is produced by the build. Everything needed to run the application is inside the server folder. It can be moved to a server in VPS or Hosting, and the Fastify server can be run there. The only thing to remember is to install the dependencies required by the script to run correctly. In fact, the server imports Fastify, and if it hasn't been installed, the server won't start.

Once the Fastify server is up and running, the application will be available on port 3000 (the default one). All that needs to be done is to configure Apache or Nginx to serve the application to the public address of the domain. e.g., `https://www.my-website.com`. To handle multiple requests and take advantage of all the server's CPUs, the [Node.js cluster](https://nodejs.org/api/cluster.html#cluster) API can be used to run multiple Node.js instances that can distribute workloads across application threads with process isolation.

## Scalability with Clustering

Since Node.js uses a single thread to run a process, all requests are handled by a single CPU. This can lead to an overload of the single process, which can slow down performance if it handles too many requests. If the process crashes due to an error, users can no longer access the application. Fortunately, the [Node.js cluster](https://nodejs.org/api/cluster.html#cluster) can be taken advantage of, which allows scaling applications on the same machine and running them simultaneously. A load balancer is also provided behind the scenes to level the load evenly via the [`round-robin`](https://en.wikipedia.org/wiki/Round-robin_scheduling) algorithm. So if an instance crashes, users can be served by the other processes that are still available. Furthermore, the instance that crashed can be rerun to restore the situation to the optimal one.

It has been seen that it is possible to start the Fastify server thanks to the `node server/entry.fastify` command. So, in effect, the code that allows allocating a CPU to run that script is being executed. Let's try to use the Node.js cluster. Below an example will be seen that is not intended to cover all possible cases but simply to give an idea of how to best resolve the situation.

Here is an example:

FILE: `server/my_cluster.js`

```typescript
import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

// The total number of CPUs is 8
const cpuCount = os.cpus().length;
const __dirname = dirname(fileURLToPath(import.meta.url));
const entryPoint = "/entry.fastify";

// `setupPrimary` changes the default 'fork' behavior.
cluster.setupPrimary({ exec: __dirname + entryPoint });

for (let i = 0; i < cpuCount; i++) {
  // Starting worker
  cluster.fork();
}

cluster.on("exit", (worker, code, signal) => {
  // worker worker.process.pid has been killed
  // Starting another worker
  cluster.fork();
});
```

Let's analyze this file. `cluster` is being imported, and the number of CPUs is being obtained. In the machine where the script was run, there are eight of them. The file that allows starting the Fastify server, the famous file seen previously, is then defined. Using `setupPrimary`, the behavior of the `fork` command that will be used in the following lines is configured. In fact, for each CPU, `cluster.fork()` will be run, which allows starting an isolated server instance. Finally, the `exit` event is listened to restart a new instance and thus restore full functionality. It is clear that if the server fails due to a bug, continuously restarting the instances will not solve the problem.

To start this script, simply edit the `serve` script like this: `"serve": "node server/my_cluster"`. In this way, the desired result is achieved. It is obvious that having more instances allows for handling more requests. It would not make sense to insert benchmarks calculated on a local machine. It is obvious that one instance is less effective than eight. It should be pointed out that this solution is perfectly functional, but it is not ready for production, so it should still be refined as best as possible.

All this configuration requires time and technical skills, but it is excessive if simply having to validate an application or if a startup wants to start its own business. In recent years, a series of cloud web hosting services and automation platforms have been created that accelerate development productivity.
