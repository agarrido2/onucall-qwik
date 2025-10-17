---
title: Sitemap and robots files
description: In this lesson you will learn the some new things about SEO and crawler.
---

# Sitemap and robots files

This file is a special document that assists search engines in gaining an overview of all the pages available on a given site, along with its general structure. If an application has many pages (over 200), it is advisable to have this specific file.
In this file, it's only necessary to list the indexable pages, and additional information, such as the date of the last update of a page, can also be inserted. This file essentially says: "Hello search engine, instead of investing precious time manually scanning the various links and finding out which ones have changed since the last encounter, here is a list of them, so less work is required, and the process can go faster."

The Sitemap is designed for search engines and uses the XML format.
Here's an example:

```XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.my-app.com/</loc>
    <lastmod>YYYY-MM-DD</lastmod>
  </url>
  <url>
    <loc>https://www.my-app.com/contacts.html</loc>
    <lastmod>YYYY-MM-DD</lastmod>
  </url>
  <url>
    <loc>https://www.my-app.com/about.html</loc>
    <lastmod>YYYY-MM-DD</lastmod>
  </url>
</urlset>
```

The first part defines the v.1.0 standard and character encoding, while `urlset` contains all the URLs included in the sitemap and describes which version of the XML Sitemap is being used.
Each URL defines the location and the date of the last modification; the latter can have different formats:

- **Complete dates**: YYYY-MM-DD
- **Complete date plus hours and minutes**: YYYY-MM-DDThh:mmTZD
- **Complete date plus hours, minutes, and seconds**: YYYY-MM-DDThh:mm:ssTZD
- **Complete date plus hours, minutes, seconds, and a decimal fraction of a second**: YYYY-MM-DDThh:mm:ss.sTZD

In the past, it was possible to define the priority and frequency with which the change was expected for that specific URL, but as of today, support for these two extra properties has been removed.

The Sitemap must be served on the site in the main directory `https://www.my-app.com/sitemap.xml` precisely by convention and to facilitate identification by search engines.
Keeping the Sitemap updated ensures that an accurate picture of the site is always available, so it should be generated whenever something changes in the structure, for example, the removal of a page. If the `lastmod` attribute is used, then it's important to update it correctly so that the modified contents are highlighted.
Another aspect not to be overlooked is to refer to the XML Sitemap in the `robots.txt` file.

## robots.txt

The `robots.txt` file is a text file that specifies which contents can be scanned and which cannot.
This file may seem very similar to the previous one, but there is a significant difference. The `sitemap.xml` shows search engines the general structure of the application, while `robots.txt` declares what should be excluded from the indexing.
This file saves the search engine time and prevents the site from being overloaded with requests.
It is composed of one or more rules that grant or limit access to specific content.

However, this does not guarantee blocking the indexing of the page itself; it is merely a suggestion. The `noindex` attribute within the page's metadata must be used to block indexing by search engines.

Let's see an example:

```typescript
[...]
<head>
  [...]
  <meta name="robots" content="noindex">
  [...]
</head>
[...]
```

By doing this, the page can be excluded from the Search Engine Results Pages (SERP).
This `robots.txt` must be served on the site in the main directory `https://www.my-app.com/robots.txt` precisely by convention and to facilitate identification by search engines.

Let's see an example file:

```txt
User-agent: *
# Directories
Disallow: */profiles/
Disallow: */scripts/
Disallow: */includes/
# Disallow users paths
Disallow: /users*

# Sitemap details
Sitemap: https://www.my-app.com/sitemap.xml
```

The available fields are:

- **User-Agent**: this field is used to specify the name of the crawler that must comply with the restrictions, with \* the rules apply to all search engines.
- **Disallow**: with this term, the pages of the site that must not be scanned during indexing can be indicated. As in the example, a specific path or URL can be defined. Furthermore, for each User-Agent, one or more entries can be defined. As mentioned in the previous paragraph, it is necessary to indicate the path that leads to the sitemap.xml file, which, by standard, is in the main directory.
