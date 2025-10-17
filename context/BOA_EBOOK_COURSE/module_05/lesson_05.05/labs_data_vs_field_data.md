---
title: Labs data vs Field data
description: Core Web Vitals Labs Data vs Field Data. These two information are so different, let's figure out the peculiarity of those.
---

# Labs Data vs Field Data

The performance of a web app can be measured using various tools. These tools can be differentiated into two types based on the data they extract:

- **Labs data**: This data is excellent for debugging during daily development as it offers immediate feedback and is collected in a controlled environment. When measuring web performance with laboratory tools, the website is loaded into a remote device, and a good connection speed and the metrics mentioned above are measured, among other things. Labs data is useful for reproducing and debugging potential performance issues, but it doesn't provide real data about users.

- **Field data**: Also known as RUM (Real User Monitoring) data, field data is the collection of real user information. It helps understand what real-world users are actually experiencing on an application and often brings to light problems that are difficult to capture in a laboratory setting. The results can be influenced by many external factors, which have no possibility of being measured in local tests. For example, different network conditions, data received from different devices, and different geographical locations, in short, a whole series of variables that are often outside of direct control.

> Search engines use field data for ranking and to analyze the user experience on our application, so although lab data is important in day-by-day development, the real ones make the difference.

### Why can Labs Data and Field Data be Different?

It is normal to obtain different values when comparing these data because real data measures data from various sources in different scenarios and is, therefore, more heterogeneous. Field data comes from real users, while lab data comes from a fairly powerful machine with a good connection somewhere in the world. Normally, some discrepancies in the metrics might be observed. As seen earlier, there may be users browsing a web application on different devices, and with both fast and slow network connections, and the field data reflects this. Real data might reveal a problem, but lab data does not show anything to improve, which can create confusion.

Labs Data vs Field Data

- Simulated and artificial instead of real users
- One generic network connection instead of several network connections
- A single device is chosen instead of several devices
- A single default location instead of different geographic locations

### How to Collect Labs Data and Field Data

The best way to monitor an application is to use [Lighthouse](https://developer.chrome.com/docs/lighthouse/) or [PageSpeed Insights](https://pagespeed.web.dev/). These tools provide a quick test to extract lab data to get a quick overview of performance. PageSpeed Insights also collects real user data in the first upper section. But how is this data collected? Measurement is based on users who have opted-in to browsing history sync, have not set a sync passphrase, and have enabled usage statistics reporting. If all these configurations are set, then the user will submit their data to feed this metric. This means that the user must visit the site using Chrome and have the correct configuration to send their real data. So, if there are visitors to an application, these metrics may not necessarily be available as a result.

PageSpeed Insights also differentiates the results between Mobile and Desktop, so the mobile part may be populated while the Desktop part does not have enough data to provide a result. All this data is stored on the Chrome User Experience Report (CrUX) and is accessible through various tools and APIs. It is important to note that it only provides information about users using Chrome and not other browsers.
