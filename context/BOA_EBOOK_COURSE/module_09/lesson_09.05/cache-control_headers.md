---
title: Cache-control headers
description: Cache is really useful and in this lesson I will explain in the detail how it works. I will share my experience in this topic with some cool analogies.
code: https://gitlab.com/fullstackio/books/newline-course-apps/giorgio-boa-qwik-in-action-app/-/tree/main/module_09
---

# Cache-control headers

We have implemented our pages and I would say we have done a good job. Now once the site is online everyone will have the opportunity to see our products. It will happen that when a user requests a certain detail page for one of our articles, our server will execute the routeLoader$ to connect to Supabase and execute a query, with the resulting data it will generate the HTML which will then be returned to the browser. The user will then see the details of our product in the browser. However, this behavior is not optimized because, for each request from any user, our server performs the work of reading the data and generates the HTML to send to the browser. This becomes a problem because the more our server is busy and works, the more we are going to spend. The working time of our server and the cost of our infrastructure are two strongly linked things. The detail page of our products or the list of our items for sale are always the same, they do not change frequently, in fact, new products are added, but only once a month, and once we have published a new item and checked its description, we will no longer need to change the description because it always remains the same. There may be some changes in prices but it is something that does not happen frequently. In short, we are telling ourselves that if our server generates the page for each request, it will often generate the same page. To overcome this type of problem, CDNs are used.
By putting a CDN in place we can dramatically improve the response time and reduce our infrastructure and management costs.
Let's see how things change with a CDN in place. The first visitor requests a page, this request arrives at the CDN which checks whether it has the requested page in its cache. Being the first to request this page, the CDN does not have this resource so the request is passed to our server which downloads the data from Supabase, generates the HTML page, and responds to the CDN which will forward the response to the user who requested the page. However, if configured correctly, the CDN saves the HTML page in the cache and subsequent requests for that specific page will be satisfied with the page present in the cache to avoid reaching our server and reduce costs because we eliminate the server-side computation.
The first user had to wait for the execution of the entire roundtrip described above, but the second, third, millionth user will wait much less because he will receive the page present in the cache of our CDN.
Great problem solved, we create a page once and then always serve that to all users. But what happens if we want to change the prices of our items? If we have no way to invalidate the cache of our CDN we cannot show the user the new price, because the user will always see the page created by the famous first user who made the first request. Here, to solve this problem we can instruct the CDN with HTTP headers that are designed precisely for this reason.

> Using cache is a good practice, it is not suitable for all pages. If there are personalized pages per user, for example, profile pages or order history reserved for a user, it is not good practice to store them in the cache. On the other hand, it is very suitable for storing high-traffic pages such as the homepage or other pages that appear the same for everyone. This will help you achieve better performance but above all reduce costs.

With Qwik, we can define these headers within our internal pages.
Let's see an example:

FILE: `src/routes/detail/[slug]/index.tsx`

```typescript
export const onGet: RequestHandler = async ({
  cacheControl,
}) => {
  cacheControl({
    maxAge: 60, // In the standard HTTP is max-age
    sMaxAge: 60, // In the standard HTTP is s-maxage
    staleWhileRevalidate: 120, //In the standard HTTP is stale-while-revalidate
  });
};

// Our component and logic here
```

Thanks to `onGet` middleware we can respond to the request by also adding the Cache-control headers. Here we are defining very precise rules. With `maxAge: 60` we are saying: "Dear CDN this page that you are keeping in cache is valid from now and for the next 60 seconds, if you receive calls for the same page within 60 seconds you can use the copy you have in cache."
Let's analyze this scenario:

- CDN saves a `/abc` page in the cache
- the developer, update the information on the `/abc` page
- the CDN receives a request for the `/abc` page 50 seconds after it saved the page, in this case, the cached copy will be served
- 60 seconds have passed, the cache has expired for the `/abc` page and the new request, therefore, reaches our server to generate the newly updated page. This page will take the place of the previous one in our CDN cache.

Therefore the cache time is always respected and until the cache is invalidated, users will see outdated content. Nothing prevents us from putting logic inside our `onGet` and changing the value of `maxAge` according to a certain logic. This is a parameter that must be refined over time and we can vary it, not only based on our needs, but also on the context.
In fact `maxAge` is a cache that occurs on the browser side where we have no control to invalidate it, but there is another header called `sMaxAge` which is instead at the CDN level. If both parameters are present `sMaxAge` wins. Using a value on the CDN side allows us to purge this data. In the previous scenario, once we modified the data in the `/abc` page we had to wait for the cache to expire, using `sMaxAge` instead we can invalidate the cache in the CDN and so as soon as our content changes we can immediately serve an updated page. It requires more time because you have to perform a purge directly by querying the CDN, but if we can automate this procedure it is an optimal approach. So the strategy is to set a short `maxAge` because we have no control over the browser cache and set a longer `sMaxAge` where instead, through the possibility of performing an automated purge of our CDN cache, we have full control.
Let's analyze `staleWhileRevalidate: 120` which allows us to obtain this type of behavior. Let's imagine having a `maxAge` of 60 seconds and receiving a call after this time, say 65 seconds, in this case `staleWhileRevalidate` comes into play because it is inside the 120 seconds we defined. To respond to the request as soon as possible, the CDN responds with the copy it has in the cache even if it has expired. Behind the scenes, the CDN makes a call to our server to generate an updated version of our page to replace the old one that is in the cache. Without `staleWhileRevalidate`, the request arriving after 65 seconds would have made the entire round trip to our server and the user would not have received such a quick response. `staleWhileRevalidate` therefore defines the period during which even if the cache has expired, to provide a fast response, the cache resource is used and behind the scenes, as mentioned, the updated resource is requested to be used as a new cache in CDN.
I wanted to close this section with an analogy. Let's imagine we are managers of a bar and we want to improve the service at peak times. In the morning we know that many people are in a hurry and want to drink a coffee quickly and then go to work. It often happens that customers have to wait to receive their coffee because they all arrive at the same time and it takes time to prepare them all. Knowing that customers start arriving at around 8 in the morning, I prepare a coffee in advance (my cache), when the first request arrives I serve them the coffee immediately because I already have it ready. In the meantime, I'm already preparing another one, so the second customer will also receive their coffee very quickly. What happens though, if I prepare the coffee and within 60 seconds (my maxAge) no one comes to order, I can consider that the coffee is getting cold, it is no longer excellent, but thinking about it I can wait up to 120 seconds (my staleWhileRevalidate). If any customer orders coffee in this period (between 60-120 seconds) then I will serve the coffee I already have and prepare a new one for a future customer. However, if no one orders the coffee, I will be forced to throw it away because it is now cold and no longer good to be served (my cache is expired).
