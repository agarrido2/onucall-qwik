---
title: SEO
description: In this lesson you will learn the pillars of SEO. You will lean few new terms and metrics that can help you to measure your application.
---

# SEO

SEO stands for Search Engine Optimization and is a set of best practices to ensure that a site is well-indexed by search engines. This optimization will bring advantages in terms of traffic, and therefore, the business will also benefit significantly. This chapter will explore some best practices to ensure the application is perfectly configured for excellent SEO.

It's important to understand that search engines scan web pages to index websites and ensure that the result of a search is as accurate as possible. This scan has a limited time for each site, and therefore, the more useful information that can be provided in this short time, the better it is for the site/application. The architectures seen in the previous chapters, Server Side Generation and Server Side Rendering, can be used to provide a quality result in the shortest possible time. These two approaches guarantee the return of an HTML page containing crawlable content to the search engine crawler. So, if these technologies are used, a good start is ensured.

The fundamental aspect of obtaining a good ranking is to have interesting content or provide a useful and frequently used service. The more visitors a site receives, the more the search engine will consider it an interesting result to show. It is not only necessary that the content attracts users, but visitors must also spend time within the application.

## Bounce rate

A first metric to consider and constantly monitor is the `bounce rate` because it indicates how much people appreciate or, more importantly, don't appreciate the application or the user experience.
This metric measures how many people visit a single page on the application or site and don't interact with the page before leaving.
According to Google, [GA4](https://support.google.com/analytics/answer/10089681)’s engaged sessions meet at least one of the following conditions:

- Lasts longer than 10 seconds
- Has a conversion event
- Has 2+ page views

So, for example, it measures users who leave an e-commerce site without purchasing something or interacting (e.g., clicking a link).
The contents can certainly influence this metric, but it could also depend on the application's loading time, which is too slow, and therefore, the user prefers to choose one of the competitors. Fortunately, with the use of Qwik, any slowness problems can be avoided.

A high `bounce rate` value means that the user's overall session duration is short. On the other hand, a low value means that they spend time on the page and interact with it.
It should be noted that a high value cannot always be considered negative; it all depends on what type of application is in use. For example, if the application provides news or other content that involves sessions from a single page, it is perfectly normal to have a high bounce rate value. If this is not the case, then this high value is a bad thing.
A bounce rate of 35% or less is good, while a bounce rate of 60% or more is high, and therefore, there is room for improvement and encouragement for users to stay more in the application.

To calculate this value, [Google Analytics](https://support.google.com/analytics/answer/10089681) can be used.

## Dwell time

By measuring the time that users spend on a page before returning to the Search Engine Results Pages (SERP) we can obtain what is defined as "Dwell time".
How long does the user stay on a page before moving away? This metric answers exactly this question.
Let's say you are looking for how to integrate Google Maps with Qwik, and from the search results, you click on one of the first results. It's a page full of advertisements, so you go back to the SERP after only 5 seconds; the Dwell time is, therefore, 5 seconds.
You click on another article, and it is well-written, pleasant to read, and very useful. You spend several minutes reading the detailed description; in this case, the Dwell time is much higher.

On the other hand, users may find the information they need at the top of the page and quickly return to the SERP, so a shorter dwell time does not necessarily indicate lower content quality or user dissatisfaction.
The algorithms that calculate the ranking are not public; therefore, the best practices are the result of the experience that various experts have shared. Given the statement made earlier, Dwell time is probably not a ranking factor, at least not a direct one.
However, dwell time can still provide insights into user behavior. If users tend to stay on the pages longer, it could mean they find the content engaging, and shorter stays could mean there are underlying issues causing users to bounce off the pages.

## Semantic HTML

It is known for sure that if websites are difficult to read, they are ignored by search engines because they prefer those that have been updated with modern HTML features. Therefore, sites built a long time ago are disadvantaged.
One of the characteristics of modern websites is the use of HTML5, which has very specific semantics that search engine crawlers prefer because it is more understandable by better defining the different sections and layout of the web pages.

Let's take this example of a non-semantic HTML <body\> tag.

```typescript
<body>
    <div>Header</div>
    <div>Main content</div>
    <div>Footer</div>
</body>
```

Instead of using <div\> for the various sections, it is more appropriate to use what HTML5 makes available, e.g., the related <header\>, <footer\>, and <main\> tags.

```typescript
<body>
    <header>header</header>
    <main>main content</main>
    <footer>footer</footer>
</body>
```

By doing this, the different sections in the HTML page have been correctly represented. They are more descriptive tags than <div\> tags, which make them difficult to read by search engines but also by screen readers. In fact, by using the correct semantics, the site also becomes more accessible, and this also helps the application to be better.

For navigation, however, the <nav\> tag can be used, which contains the links that create the menu.
Let's see an example:

```typescript
<header>
    <img src='logo.png' alt='logo' />
    <nav>
        <a href='one.html'>Page One</a>
        <a href='two.html'>Page Two</a>
    </nav>
</header>
```

Here, it can be seen that the <nav\> tag has been used for the menu, and this is correct. The `alt` attribute has also been used for the image, which improves the accessibility of the page because screen readers can recognize the attribute and help the user.

The main content should be inserted inside the <main\> tag, and inside it, <article\> and <section\> can be used to respect the semantics.

Here is an example of correct semantics:

```typescript
<main>
    <article>
        <h1>[...]</h1>
        <section>
            <h2>[...]</h1>
            <p>[...]</p>
        </section>
        <section>
            <h2>[...]</h1>
            <p>[...]</p>
        </section>
    </article>
</main>
```

The <article\> tag is a standalone section on the page and can contain several <section\> tags within it.

<section\> although similar to <div\> can enclose logical groups of related content.

There are many other semantic tags in HTML5. The list shown here is intended to be indicative and certainly does not cover all possible tags. For that, the official HTML documentation can be referred to. The important thing to understand is that if the correct HTML tags are used, the application can be analyzed better by search engines and will, therefore, be indexed better. Furthermore, thanks to the use of the correct syntax, inclusive and accessible applications can be created to reach all users without distinction.

## Link dofollow vs nofollow

Let's start by saying that this attribute is invisible to the end user; nothing changes in visual and behavioral terms. However, the situation changes for search engine bots; by default, a link has the implicit `dofollow` attribute.
It has been seen that the search engine crawler is in a hurry, and therefore, the aim is to make it crawl the application in the shortest possible time and in the best possible way. Here, the links on the pages have a further configuration to help this scan. The normal behavior of the bot that crawls the pages would be to follow all the links on the page and take the information obtained into consideration for the ranking factor.

Let's imagine there is a recipe blog, and on one page, a specific recipe is being explained. A certain step of the recipe is very complex, and it has been explained several times in the blog, so instead of explaining it again each time, a specific post for this step has been created, and in each recipe, the link to it is put. This is useful for the end user; if they already know the step because they are an expert, they can skip the description of the procedure. If they feel unsure, then they can go and see how this particular procedure is performed. This is a link for the search engine crawler, and as default behavior, it follows it. If there are several pages linking to this particular passage, that page will gain scores in terms of credibility and indexing. It then happens that since the description is particularly valid and accurate, another very authoritative site inserts a link to the page in one of its articles, so a backlink has been received, and this gives credibility to the search engine logic. The more famous the site that mentions it, the more consideration will be acquired. By observing how many incoming links a page has and from which sites, the search engine will make a reason, such as if many people and sites link to that particular page, it must necessarily be a good page!

In the past, the logic was much more basic; it was enough to receive backlinks, and the more that was had, the more popular the page was. Soon, to hack the system, fake sites were built just to create backlinks to their main sites and to distort indexing and position themselves in a better position in search results. Today, this is no longer the case; this practice has been blocked.
It is precisely to counter this practice, which involved sending spam with links to blogs and external sites, that the `nofollow` attribute was introduced to stop these bad practices in their tracks.
In practice, with this attribute, the crawler is being told not to give weight to the link, not to follow it, and therefore, in short, to ignore it.

Imagine that comments can be inserted in the recipe blog. To increase user engagement, the risk is taken that someone inserts a link to the site to increase its visibility. So, by automatically adding this `nofollow` attribute to all the links in the comments, wrong information can be avoided being given to the search engine. As managers of the blog, it will be their responsibility to check the various comments, but in the meantime, a big problem has been blocked.
What is being inserted with `nofollow` is, however, a suggestion that is being given to the search engine, and it is not known for sure whether it will then follow the link and consider it. This is because the operating algorithms are secret.
Google added two new attributes in 2019, `rel=”ugc”` and `rel=”sponsored”`, which complement the `nofollow` attribute. With `rel=”ugc”`, it is being said that they are links created by users over which there is no control, as in the example of the comments in the recipe blog.
With `rel=”sponsored”`, it is explicitly being said that the link is sponsored or paid for.

In general, if there is no desire to be associated with the link on the page, the `nofollow` attribute must be used, and the two new attributes just seen can also be specified. For all other cases, there is `dofollow`, which is not an existing value for the `rel` attribute, but it is simply the default value for links.
In practice, by not specifying anything for the links, it is being said that the link is considered useful for the user, but also for the search engine to strengthen the positioning of the linked content because quality feedback is transferred to the linked site.
One might think of inserting `nofollow` everywhere, but this would go against the principles of the web, where links are part of the ecosystem itself. So, this attribute must be carefully measured to avoid being penalized and only used when the source is not certain, or there is no control over the users who post the content.
