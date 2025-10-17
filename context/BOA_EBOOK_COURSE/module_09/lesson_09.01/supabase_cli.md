---
title: Supabase CLI
description: Supabase CLI an handy tool to improve consistency across environments.
useMdx: true
code: https://gitlab.com/fullstackio/books/newline-course-apps/giorgio-boa-qwik-in-action-app/-/tree/main/module_09
---

# Supabase CLI

In the previous chapter, the Supabase table was manually defined within the cloud dashboard to verify the reading and integration with Supabase. However, for the subsequent steps of the application, the most appropriate method to carry out this kind of procedure will be used. In everyday development, a local environment is needed that allows the writing and testing of code by simulating the production or staging environment as closely as possible. In the short term, manually modifying and creating the various data tables is not a good practice because it is prone to errors. If a column needs to be added to the table, it is unthinkable to delegate the activity to a person. With a thousand steps and tasks to perform, the risk of error is too high, and the changes made to the database would not be versioned. Let's imagine a new feature needs to be added to the user profile, such as showing the profile photo within the personal area. The front end will need all the data to display the image and ensure that it is correctly visible in all resolutions. This work is purely related to the Qwik code, but the image information from the database is needed. Therefore, along with this functionality, this new field on the Supabase table is also needed. Ideally, the database should be modified only when the functionality is available. So, remember to update the database only when the functionality is ready and released. If it's an addition of a column, it's a trivial activity. But what if the user table data needs to be changed to split the user name into two separate fields, first name, and last name? If the code expects a single field and the data is modified, the application will have problems because it will be inconsistent. Here, using an automated and versioned migration system saves a lot of problems and makes it easier to release features.

Managing the entire process with Supabase is very simple because the tool's CLI is available, which allows all operations to be performed very quickly and securely.

You can find the full code for this module in the following Replit:

<ReplitEmbed src="https://replit.com/@newlineauthors/module09" />

To use the Supabase CLI, install the dependency within the project with the following command:

```shell
// Supabase CLI as dev dependency via pnpm:
pnpm install -D supabase
```

Inside the package.json, a dedicated script for Supabase can be created so it can be used like this: `pnpm supabase <command>`:

FILE: `package.json`

```json
  "scripts": {
    [...]
    "supabase": "supabase"
  },
```

So far, so good. Now, first of all, execute the following command to initialize the Supabase database locally.

```shell
pnpm supabase init

# Supabase init steps
#
# pnpm supabase init
# Generate VS Code workspace settings? [y/N] y
# Open the qwik-e-commerce.code-workspace file in VS Code.
# Finished supabase init.
```

Now, there is a new Supabase folder in the project. Then, link the local project with the Supabase instance present on their cloud platform. Using these commands, execute the project linking process, where `$PROJECT_ID` is the project ID that can be found in the URL `https://supabase.com/dashboard/project/<project-id>`

```shell
pnpm supabase login
pnpm supabase link --project-ref $PROJECT_ID
```

Once the project is connected, install [Docker](https://docs.docker.com/desktop/) locally to manage the local development stack.

> **Docker**: it is a tool that allows us to create and manage virtual environments that perform better than the Virtual Machines seen in the previous chapters. It is a more optimized approach because they do not have a graphical interface; you can only interact with the terminal. To fully understand Docker, we would need a dedicated book; we just need to know that Supabase needs an environment where we can install and manage our database, and it is synchronized with the Supabase cloud.

Once this tool has been installed, use the following command to create the local Docker environment that will host the local data.

```shell
pnpm supabase start
```

Finally, to synchronize the local database with the remote one, the one that has already been created in the previous chapters, execute this command:

```shell
pnpm supabase db pull
```

Excellent! Now everything is configured and synchronized locally, and it's time to create the table to host the products that will be shown in the e-commerce.

## Switch to the Local Supabase Instance

Once the `pnpm supabase start` command process is finished, new API KEYs will be provided to access the local database instead of pointing to the remote one present in Supabase Cloud. Create a `.env.local` file in the root of the project to work locally in total freedom, disconnected from the main database. To retrieve this information at a later time, use the `pnpm supabase status` command, which will show these values again.

```shell
pnpm supabase status

#Output
#
# API URL: http://127.0.0.1:54321
# [...]
# anon key: XXXX
# [...]
```

Take these values and insert them into the file, as shown below.

FILE: `.env.local`

```typescript
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
