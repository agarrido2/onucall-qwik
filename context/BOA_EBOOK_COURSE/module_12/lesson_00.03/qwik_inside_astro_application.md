---
title: Qwik inside Astro application
description: Qwik and Astro together, no problem, @qwikdev/astro is the library to solve your problems.
---

# Qwik inside Astro application

Just talking about Astro, if you are already using it, there is a library available that allows you to insert Qwik components into Astro, a framework created more than anything else to render static pages. Adding dynamism with Astro's API is very complex because you have to use vanilla JavaScript. Therefore, Qwik comes in handy because it is more fun and satisfying to write applications with Qwik.
There are two ways to add Qwik to Astro, the simplest is to run the following command:

```shell
pnpm astro add @qwikdev/astro
```

Once this is done you can use Qwik within Astro.

One of the main features of Astro is zero JavaScript at startup, because it handles static content, I would say it's too easy that way.
As mentioned before, to add interactivity easily, it interfaces with many frameworks as well as Qwik. But only with Qwik can we exploit the mental model of resumability, and therefore maintain the advantage of having zero JavaScript. With the other frameworks the JavaScript is downloaded to perform the hydration, so with the others, we lose the greatest benefit that Astro can give us.

## Migrating your application to Qwik

We have given a nice overview of how it is possible to migrate and merge multiple frameworks.
The best approach to refactoring your application is to proceed step by step, starting to create a Qwik application and replacing one page after another, let's start with the simplest one, and make sure to guarantee a graphic appearance equal to the application that we are going to replace. Let's make sure we can replicate all the integrations with external services to avoid having surprises (e.g., Identity provider) to avoid finding ourselves, after weeks of work with a complex integration that requires several days of work. It is better to solve the most important tasks first. So let's proceed step by step and, page after page, remove features from the old application to inject them into the new one. These are general recommendations valid for all types of refactorings because Qwik is a modern framework that can replicate all the APIs available in other frontend frameworks. It also offers unique features (e.g., micro-frontends without the need for external libraries and much more).

> Throughout this book, we have seen that Qwik uses JSX as template syntax. This can be useful in a possible refactoring from a React or Next.js application because it is simpler and faster; most of the time, it's a copy/paste activity.

But I realize that it may not be easy for you to go to your boss and say: "Qwik is fantastic, let's migrate all our applications to Qwik". Throughout the previous chapters, I have shared some tips on how to do it collaboratively together with the team and how to go and speak to your boss and try to strike the right chords. Sharing choices with the team will make everyone involved in the decision and will avoid unpleasant attacks from someone. You will surely discover that the other team members will also find Qwik truly sensational. On the business side, however, we must translate our findings to an economic or time aspect. Costs and times, in fact, are two very delicate issues for those who do business. I won't deny that if I had my own company, I would probably do the same. But there can be a thousand different variations or scenarios that perhaps do not allow you to use Qwik in everyday work, in fact, the decision often does not depend on us. To be a better developer and increase your knowledge, it is good to look around and understand that there is more than what you use every day at work. We cannot stop learning just because of these decisions; they do not depend on us, and we have no control over them. So go, try, experiment, and make your reasoning.
