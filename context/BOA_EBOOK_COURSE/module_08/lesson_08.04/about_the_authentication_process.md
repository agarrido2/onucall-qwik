---
title: Let's talk about the Authentication process
description: A custom authentication is too complex and risky to implement from scratch. Let's use the Supabase auth to optimize our goals.
code: https://gitlab.com/fullstackio/books/newline-course-apps/giorgio-boa-qwik-in-action-app/-/tree/main/module_08
---

# Exploring the Authentication Process

Authentication is a fundamental part of every highly dynamic and personalized web application. Authentication refers to the process that identifies a specific user, allowing you to read, write, update, or delete any protected content, depending on your level of authorization. A typical example is a social network, where each user can create personal posts only after authentication, and fortunately, it's not possible to create content on behalf of third parties. This allows for personalizing the experience of using the application for each user and enables you to save configurations and link them to your user profile. Imagine having to save your preference for a dark or light theme; managing authentication makes this possible.

## The Authentication Process is Not as Simple as It Seems

The first thing to ask yourself is whether it makes sense to use an external service for authentication or if you should have full control over the process and manage the entire flow with your service. The custom approach has some complexities that are worth considering. First, you have to think about how to safely save your data to prevent external attacks from reading this valuable information. Then, you have to consider the entire flow in its entirety. It's not just about a simple login; there are other features, such as password recovery and many more.

Imagine that initially, your application allows you to log in with an email and password, but subsequently, you're asked to allow authentication via Google. With a custom solution, you would have to invest some effort to cover this functionality. What if you were then asked to log in to Facebook, too? This would be additional unplanned work at the start of the estimates. The possibility of logging in with different providers is the basis of external services, not to mention the sending of emails and notifications that are necessary for a flow of this type. Do you want to reinvent the wheel and create your own service for sending and translating messages? These problems make it clear why the use of an external service now seems like a solution to at least be carefully considered. In fact, for your e-commerce with Qwik, Supabase Auth will be used.

## JWT Token

In the past, web-side authentication was based on the concept of server-side sessions. The process began by filling out a form to log in; the user entered the username and password and sent them to the server. The credentials were checked on the server, and if they were correct, a session ID was created and saved in memory, which was then used to exchange requests between the client and server. This approach, although used for years, is vulnerable to external attacks.

Furthermore, modern applications are designed to run on the cloud to scale horizontally, and this session approach saved on a single instance does not lend itself to these scalability needs. This old approach has been replaced by a more modern one, which is based on JWT tokens. In this new mode, the user sends his username and password to the server. After verifying their validity, the server creates a JWT token that can be used in subsequent calls. The client saves this token in the cookies because it is a safe place after saving it on the browser side, and in future requests, it will be added to the call headers.

The server now only has the task of reading the JWT token from the HTTP call headers, and therefore, there is no need for any search in the local memory of the server instance. It is an atomic operation that, as mentioned, lends itself to a distributed system in the Cloud.

You can think of this process as when you check in at a hotel. You present yourself at the reception, providing your data (your credentials), and once everything is verified, you're given the room key. This key is effectively your JWT token, allowing you to access reserved areas such as the gym, the spa, and finally, your room, which can be compared to the reserved area of your application. It should be noted that with the room key, you cannot access the rooms of other hotel guests, and once your stay is over, it will no longer be valid. Just like the room key, the JWT token also has an expiration mechanism, and once it expires, it will no longer allow you to be authenticated. You will need to log in again with your credentials. It may have happened to you that you logged in to your favorite social media and then never logged in again for months, if not years. This can happen because, through a refresh token, which is exchanged with the server, you have the possibility on the client side to extend the expiration of the token itself and allow you to have very long sessions without logging in again with the username and password.

But let's look in detail at how a JWT token is constructed.

```typescript
// JWT Encoded

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

// JWT Decoded

// Header: algorithm & token type

{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload

{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}

// Verify signature

HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

You can see that the encoded JWT token is constructed in three parts separated by `.` and looks like the following `xxxxx.yyyyy.zzzzz`.

Once these three parts have been decoded, you can read their contents. They contain very precise data and are respectively:

- **header**: Here, you can see two properties: the token type, which is JWT, and the signature algorithm used (HMAC SHA256 or RSA).
- **payload**: The second part of the token is the payload and generally contains the user and some information that you want to pass; for example, you can use the token to save the user role or its permissions. It also contains the expiration time and other data relating to the token issuer. The information in the payload is readable by anyone, so it's a good idea not to put any secret data inside unless it's encrypted.
- **signature**: The third part of the signature is created with the encoded header, the encoded payload, a secret, and the algorithm specified in the header and signed. This part is very important because it is used to check if the message has been modified fraudulently. If this part does not match, then there has been tampering with the package. If a private key was used for the signature, then it is also possible to check whether the sender of the JWT is correct or not.

This JWT token is effectively a message that is passed back and forth in HTTP calls and, by its nature, is very simple to use. Nowadays, all authentication methods are based on this system, and even the system that you are going to use is based on this procedure and exchange of information. In fact, Supabase, being a modern system based on the Cloud, is certainly no different.

## Supabase Auth is Really Good

Once the Supabase account and the `qwik-e-commerce` project are created, you can move on to the authentication part. Once you enter your project, check that in the `Authentication/Providers` section the email provider is enabled.

![auth_providers](./public/assets/1_auth_providers.png)

On the application side, you will create two routes, `sign-in` and `sign-up`, inside the `routes` folder. Here is a detail of the structure that you will find in the project.

```shell
qwik-e-commerce
├── src
│  └── routes
│  ├── sign-in
│  │   └── index.tsx
│  ├── sign-up
│  │   └── index.tsx
```

### Create Supabase Client

Before defining the various routes, let's create the method that creates the Supabase client with the two environment variables created previously.

FILE: `src/utils/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Sign Up

You define the `sign-up` route; this specific page is used to register as a user in the application.

FILE: `src/routes/sign-up/index.tsx`

```typescript
import { supabaseClient } from "~/utils/supabase";

export default component$(() => {
  const emailSig = useSignal("");
  const passwordSig = useSignal("");
  const messageSig = useSignal("");
  return (
    <div>
      <label for="email" class="...">
        Your email
      </label>
      <input
        type="email"
        id="email"
        value={emailSig.value}
        onInput$={(_, el) => {
          emailSig.value = el.value;
        }}
      />

      <label for="password" class="...">
        Password
      </label>
      <input
        type="password"
        id="password"
        bind:value={passwordSig}
      />

      {!!messageSig.value && <div>{messageSig.value}</div>}

      <button
        onClick$={async () => {
          const { error } =
            await supabaseClient.auth.signUp({
              email: emailSig.value,
              password: passwordSig.value,
            });
          messageSig.value = error
            ? "Error"
            : "Success. Please check your email/spam folder";
        }}
      >
        Sign up
      </button>
    </div>
  );
});
```

Two inputs, `email` and `password`, are created for entry, and several `useSignal$` to manage the state of the component. In the first input, you defined the value of the input `value={emailSig.value}` and you subscribed to its change to update the internal status relating to the email `onChange$={(event) => { emailSig. value = event.target.value; }}`.

For the second input, that of the password, you used a special Qwik `bind:value` syntax, which allows you to write less code and guarantees a truly rewarding Developer Experience.
Finally, you have the button that executes the call to Supabase, which requests user registration. In this call, you pass `email` plus `password`, and you will update the message based on Supabase's response.

Following registration, an email is sent with a link to confirm registration. In this phase, the user status is `Waiting for verification..`, but as soon as you press the link received via email, you will be redirected to your app, and the user status will be confirmed.
The code is executed on the client side, but it is possible to perform the operations on the server side. In fact, for the `sign-in` route, the operation will be performed via `routeAction$` and, therefore, on the server side.

### Sign In

FILE: `src/routes/sign-in/index.tsx`

```typescript
import { supabaseClient } from "~/utils/supabase";

export const useSignInAction = routeAction$(
  async ({ email, password }, requestEv) => {
    const { data } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
    if (data.session) {
      requestEv.cookie.set(
        "supabase_access_token",
        data.session.access_token,
        {
          path: "/",
        }
      );
      throw requestEv.redirect(308, "/");
    }
    return { success: false };
  },
  zod$({
    email: z.string(),
    password: z.string(),
  })
);

export default component$(() => {
  const signInAction = useSignInAction();
  return (
    <Form action={signInAction}>
      <div>
        <label for="email">Your email</label>
        <input type="email" name="email" id="email" />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
        />
      </div>
      <button type="submit">Sign in</button>
    </Form>
  );
});
```

Here, with the `Form` component, you send the data inserted in the `email` and `password` inputs and use them on the server side to log in with the `signInWithPassword` method of Supabase. If the credentials are correct, the operation will be successful. Here, you take the `access_token` from the user session and save it in the cookies. It is important to note that you are going to set the `path` option to be able to read the cookie in the whole application. Finally, you perform a redirect to the homepage of your app.

### Homepage

FILE: `src/routes/index.tsx`

```typescript
import { supabaseClient } from "~/utils/supabase";

export const useUser = routeLoader$(async (requestEv) => {
  const supabaseAccessToken = requestEv.cookie.get(
    "supabase_access_token"
  );
  if (!supabaseAccessToken) {
    return null;
  }
  const { data, error } = await supabaseClient.auth.getUser(
    supabaseAccessToken.value
  );
  return error ? null : data.user;
});

export default component$(() => {
  const userSig = useUser();
  return (
    <h1>
      Welcome{" "}
      {userSig.value ? userSig.value.email : "guest"} 👋
    </h1>
  );
});
```

Here is the homepage; for now, it is very simple, but on the server side, you are going to use the cookie to recover the user, and if the operation is successful, you are going to display the user's email on the page. Here, you have customized the homepage based on whether the user is logged in or not.

Now you have everything configured correctly. To perform the complete tour, you can start from the `sign-up` page and enter your email and password. Once you have entered this data and pressed the button to confirm, you can move to the `sign-in` page to log in to the application. In fact, by entering the email and password used for registration, you will be redirected from the main screen, where you will see a personalized message with your email.
