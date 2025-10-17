---
title: Technological spike
description: In this lesson you will learn the trade offs of technical decisions. I share with you some tips and tricks.
code: https://gitlab.com/fullstackio/books/newline-course-apps/giorgio-boa-qwik-in-action-app/-/tree/main/module_08
---

# Technological Spike

A technological spike, in the context of software development, is a minimal initial implementation of the architecture. This procedure allows you to validate and reduce the uncertainty of a system's various functions by evaluating different options. These assessments usually occur within a well-timed period, which can range from a few hours to several days of investigation. In an agile context, it typically never exceeds a sprint. However, if the time is insufficient, you can allocate more time in the next iteration.

Imagine needing to choose the frontend framework for your architecture. First, you need to compile a list of desired features:

- Ready for production
- Integrates well with your services (authentication, infrastructure)
- Intuitive to use
- Has supporting libraries
- Strong community

During your sprint, take time to analyze the various frameworks in detail. This activity isn't necessarily limited to coding but can also include a technical analysis with the recovery of data and metrics to compare the various tools. Once you have the data, share your results for each framework with the team. It's advisable to share these results while also making your idea clear to stimulate a productive discussion. Allocate some predefined time to skim the solutions and narrow down to a few options, for example, two or three frameworks out of the five or six analyzed. The entire team must be aligned and involved in this decision to prevent the person presenting the data from feeling pressured by such an important decision.

With this data, create a basic application with the frameworks that the team has screened. It's crucial that this activity isn't performed solely by the person who extracted the metrics; rather, the entire team should participate. This is a good opportunity to exchange knowledge within the team and help make the most shared decision possible.

The result of this step will be a winner among the compared frameworks, and you can then validate your choice with your managers. As previously mentioned, managers and C-level executives have different parameters compared to the purely technical aspect. Therefore, it would be beneficial to emphasize that a framework allows you to develop faster because it's easy to use, well-integrated, and feature-rich.

If you were to present Qwik to one of your managers, avoid delving into the fact that it sends zero JavaScript by default and uses a service worker. Instead, emphasize that with Qwik, your SEO will be 100%, reducing the need for an external agency to optimize these metrics. This will benefit your budget due to significant cost savings. You could also highlight that the end user will be more satisfied with the user experience and spend more time in your application, giving you an edge over your competitors. Another aspect to consider is the development time of various functions. Thanks to a fabulous DX, you will be more productive with Qwik and save days of work. Given the time, you could develop the same functionality with the frameworks passed from the first skimming done by the team. This would allow you to present data like: "With Qwik, this simple functionality took me two hours less than this other framework. With Qwik, we will save a lot of money."

This verification method also helps reduce uncertainty and allows you to start developments more confidently or better estimate future developments. If you were to evaluate a new functionality that you have no idea how to handle, this type of spike approach is an excellent way to clarify your ideas.

## Non-functional Requirements

You have now discussed the process that can help you decide how to design your application. The example was based on frontend frameworks, but the same approach can be used for choosing the database or any other decision you need to make. By performing the technological spike, there's a risk of focusing only on functional aspects, but you must also consider the non-functional aspects that your domain requires you to guarantee.

Non-Functional Requirements (NFR) are the key ingredient for making informed decisions. Here are some examples:

- **Availability**: What are the operational requirements? Does it need to run 24/7?
- **Scalability**: As needs grow, can the system handle them? For physical installations, this includes spare hardware or space to install it in the future.
- **Supportability**: Is support provided internally, or is remote accessibility required for external resources?
- **Security**: What are the security requirements, both for the physical installation and from an IT perspective?
- **Readability**: The ease with which you can understand the flow and operation of your codebase.

Imagine having this non-functional requirement to meet: "Any team member must be able to read the source code to be able to develop new features".

Readability is crucial because it prevents development blockages. If you don't understand a part of the code, an algorithm, or a procedure, you are effectively tying yourself to the person who wrote it. If this person is no longer part of the company, you are stuck until you understand how it works. Moreover, code that is not very readable also slows down developments and facilitates the introduction of bugs because there is a higher probability of introducing side effects precisely because you do not know the entire codebase well, and perhaps you have underestimated specific cases.

So, if you have readability as a non-functional requirement, keep in mind that you need to use a language that favors this activity. By choosing TypeScript, you have greater readability than other languages, and you can also make it a rule to comment on the code to clarify why certain choices have been made.

While comments in the code can become obsolete quickly, and they are more "code" to maintain and align, they make sense if a certain architectural choice requires an explanation. For example, suppose you perform a workaround for a bug that doesn't depend on you, but on a library you use. In that case, it's good to indicate why the fix was introduced and perhaps also attach an article or issue that provides evidence of the problem. This will document the code because anyone looking at the fix will understand why it was done. Another good practice if you want to encourage knowledge exchange within the team is reviewing PRs. When implementing a feature, conduct a collaborative review of the changes. This serves two purposes: exchanging information and preventing potential bugs through code review.

So, by keeping in mind the requirements of your application, whether functional or non-functional, you can organize, choose, and implement your work in the best possible way.
