---
title: Creating an e-commerce with Qwik and Supabase
description: In this lesson you will learn how architect a modern frontend end application.
code: https://gitlab.com/fullstackio/books/newline-course-apps/giorgio-boa-qwik-in-action-app/-/tree/main/module_08
---

# Let's Architect Your App

Creating a new application is always a lot of fun because it's one of those moments where imagination can run wild and thoughts about what technologies can be used and how to implement the solutions can be explored. It's usually a great moment of discussion with the team and it is precisely in these moments that a lot of experience is gained. Junior developers have the opportunity to learn new techniques, but even more senior developers find themselves looking around and evaluating whether the technology they've always used is still the one to use.
Design meetings are usually organized to discuss the requests together, fully understand the application domain, and try to eliminate any design doubts as much as possible. Each developer will pay particular attention to their area of expertise, so the designer will be more attentive to graphics and user experience while the developers will already be projected to think about how to save data and which algorithms to use to create the best application. As explained in the previous chapters, it is important to clearly understand the functional requirements of the application, what features need to be implemented, and what flow the users will follow to perform the operations. When these decisions are made, also keep in mind the deadline that the project imposes. Let's imagine having to create an application for a fair, the application will be used to allow participants to register for the event, receive a confirmation notification, and receive the ticket via email. Furthermore, there will also be the possibility of displaying a QR code that will allow participants to access the event. In these few lines, a whole series of requirements that are necessary otherwise the application would not make sense have been listed. However, it is implicitly saying that the deadline cannot be changed because if the application is not ready for the event then it can be said that the project has failed.
If the job was commissioned to be done in a few weeks, it would be a challenging situation. In this very delicate situation, there is an alternative.

## Trade-off Sliders

This exercise can be used whenever a new feature or entire application is to be implemented.
This exercise is based on a very simple concept, these four elements are compared:

- **budget**: This is a very delicate topic but in practice, this metric wants to indicate how important it is to stay within the set budget or whether there is room for maneuver.
- **quality**: This element aims to indicate the quality of the application understood as the fact that it is tested correctly and is as free from logic bugs as possible, but also how graphically perfect and free of imperfections it is.
- **scope**: Here an aspect more regarding the features that are included in the application is defined. This tells how important it is that all the required features are present.
- **deadline**: As seen previously this metric is quite obvious. How important is it to deliver the work to the expected deadline? What happens if it is exceeded?

Meet together with all the people who will work on the project and the stakeholders to promote maximum alignment. Together, try to give priority to the elements seen previously, try to give them an order, from the most important to the least important.
This exercise will lead to some very interesting discussions. Is it more important to arrive at the deadline on time or is it more important that all the features are present as required?

Taking the example from before: "The QR code is not displayed in the application, but only the email with the ticket, can the delivery of the application be moved?"
This type of discussion is very constructive and allows the guiding rules that must guide decisions during the design and architecture of the application to be drawn up.
For example, if quality is first and scope last, it is being said that it is necessary to be sure to have a well-tested application with an architecture that scales and is rock-solid. This is the basic rule that must guide the developments, the effort for each functionality must also include the time to write the tests and verify that everything works as required. This attitude will depend on the features present in the application or the fact that the rock-solid architecture may require some extra budget to ground.

It seems like a very simple exercise but in the end, it often happens that everything is important, in fact, managers often struggle to give order to these elements. Looking at each other and saying that a certain feature can be eliminated to reach the expected deadline puts everyone in the same boat and promotes alignment.
If you want to try this exercise too, you can follow the instructions on the [Atlassian](https://www.atlassian.com/team-playbook/plays/trade-offs).

## Golden Hammer

It is clear that if the deadline cannot be changed, the best thing to do is to use tools where there is full knowledge and a feeling of productivity and confidence in being able to estimate and deliver the work with certainty. Using the technologies that are felt confident or strong about, without considering anything else, is usually considered an anti-pattern, however, a non-modifiable deadline is a sufficient restriction to adopt this approach.
Many times, however, for no apparent reason, this phrase has been heard: "Let's do what we have always done".
This way of thinking is also called: "Golden Hammer" and is a very dangerous anti-pattern, now it will be explained why.
This way of doing things can refer to a tool, language, database, or platform that developers feel comfortable and productive with, so they are tempted to use it for whatever problem arises, even if thinking about it wouldn't be the right choice.

> As the saying goes: "If all you have is a hammer, everything will look like a nail."

Perhaps there was satisfaction with a low-code platform in the past and since there is experience with it, it is wanted to be used for the new application. However, it was not taken into account that the business requires a high level of customization, and therefore the choice did not benefit either the result or the end customer.

How can this anti-pattern be avoided?

Evidence and numbers are the best weapon to prove, for example, that in a specific domain Tool A is better than Tool B and it is necessary to be able to convince the people making the decisions why Tool B is a better choice.
Experience and use cases deserve a separate chapter because a lot depends on the people that need to be convinced. If they are not technical they will hardly take into consideration metrics based on technical aspects. Unfortunately, the right chord based on the people being dealt with needs to be struck, because perhaps underlining that one solution would cost more rather than another has more appeal.
If a serverless approach on the Cloud was to be used, the decision-makers could be provided with the numbers and the economic savings that could be achieved if it were used compared to a more classic server architecture.
One way to obtain this useful data is to use the “technological spike methodology”.
