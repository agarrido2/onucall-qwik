---
title: Summary Chapter 8
description: Wrap up of Create an e-commerce module.
code: https://gitlab.com/fullstackio/books/newline-course-apps/giorgio-boa-qwik-in-action-app/-/tree/main/module_08
---

# Summary

During this chapter, a lot of ground was covered. The discussion began by exploring how to architect applications, what elements to consider, how to manage deadlines effectively, and how to view the deadline as a constraint without ignoring its existence. It's important for you to lay all the variables on the table, understand what they are, and prioritize them to avoid promising outcomes that can't be achieved due to constraints. If you're working with a tight deadline, it's better to use tools that provide more security and allow you to deliver value in the shortest time possible. However, it's been learned that sticking to what's always been used isn't a good practice and doesn't allow for approaching application development with an open mind. It's worth noting that it's not always necessary to write code to complete a task.

To illustrate this point, consider an example. Suppose a manager needs to export data from a database table. After discussing it with the team, it's realized the task is quite demanding. So, a crucial question is asked: How often will this export be needed? The answer is just once. In this case, the task was solved without writing any scheduled data export code. A simple automatic extraction in CSV format was enough to achieve the desired result. Some strategies for communicating effectively with managers and persuading non-technical people to consider your needs were also shared.

In addition to functional constraints, there are also non-functional ones. Some examples were provided to clarify that not only the technical aspects need to be considered but also some metrics that don't strictly pertain to the code. This approach helps you work more efficiently and organize your tasks better. The reasons why Supabase is an excellent choice for the application you want to create were then explored. By examining its features, you can see that it's not an inferior alternative to a physically installed database, but rather an optimal solution for managing your data in the Cloud. The first table was created in a straightforward manner and this data was read via the Qwik application.

The Supabase SDK makes everything quite simple. It was learned that creating an authentication system from scratch is not easy, with data security being the most challenging aspect. Therefore, reliance on services that offer this as a product is recommended. These products use the JWT token, a complex yet simple and ingenious system for managing client authentication. The token is encrypted with a secret, allowing you to verify that the communication between the client and server is secure. You can also include some extra information in the token. Once the token is obtained after login, it's ready to use in all HTTP calls.

The JWT process can be likened to hotel check-in. You can dine at the hotel restaurant without being guests or staying overnight, but if you want to access certain areas like the spa, gym, or a room, you need to authenticate at the reception and receive the hotel room key, which is your JWT token.

Finally, authentication within the application was developed by creating the Sign-up, Sign-in, and Homepage pages. The homepage displays different content based on whether the user is authenticated or not. These pages execute the logic on the backend side, which allows for easy use of API keys. If support for authentication with another vendor was desired, it wouldn't be a problem because the method of the SDK used would just need to be changed. Therefore, supporting authentication via Google is not an issue.

In the next chapter, you will add products to the database and display them in your application. You will also add a search bar to make it easier to find the products to buy.
