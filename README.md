# **Meet Haruhi** [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/R6R3E3NZ0)

The open-source anime streaming service made with NextJS and TailwindCSS. It lets you search, watch animes without any ads with a beautiful ui with Anilist Integration so you can watch anime without interruptions. It can be self hosted or deployed online.

## How to use
Haruhi can either be self hosted or use my hosted version at [https://haruhi.flamindemigod.com](https://haruhi.flamindemigod.com)


# Hosting with Vercel [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fandradesavio9073%2Fharuhi&env=NEXT_PUBLIC_SERVER,NEXT_PUBLIC_ANILIST,ANILIST_SECRET_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE,NEXT_PUBLIC_MEDIA_PROXY&envDescription=Various%20things%20required%20for%20stuff%20in%20haruhi%20to%20work%20properly&envLink=https%3A%2F%2Fgithub.com%2Fandradesavio9073%2Fharuhi%2Fblob%2Fmaster%2FREADME.md)

Before doing anything in terms of hosting with Vercel. You need to get various api keys to add to environment variables.

## 1. Anilist API keys.
> You need these to be able to interact with the anilist backend

- [Create a Anilist Account](https://anilist.co/signup)
- Head to the [Anilist Developer Page](https://anilist.co/settings/developer)
- Create a New Client
- Set a Name for the Application
- Your Redirect URL needs to be in the form `${your_application_url}/api/login`. This will the be callback for the login function. For now it can be whatever. but remember to set it up after hosting it the site.
- Hit Save. and Copy the ID and Secret. You will need these for the environment variables.

## 2. Supabase API keys
> Supabase does 2 key things. Provide a table to store CSRF Tokens. and a fully implemented Websockets api to enable the Watch Together Functionality.

- [Sign in to Supabase](https://supabase.com/dashboard/sign-in)
- Create a new Project and fill in all the details.
- Jump into your project 

>Create the table and all RLS policies with a SQL Query
- Head to the SQL Editor
- Create a New Query
- and paste and run the code below to generate the table and its RLS Policies
``` sql
CREATE TABLE users (
  id bigint PRIMARY KEY,
  sessionId UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  lastUpdatedAt TIMESTAMPTZ DEFAULT NOW(),
  userName TEXT
);

-- Deny all read access
CREATE POLICY deny_read_users ON users FOR SELECT USING (false);

-- Deny all write access
CREATE POLICY deny_write_users ON users FOR ALL TO PUBLIC USING (false);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

<details>
<summary>Create the table manually (Just use the code. Save yourself some pain)</summary>
<pre>
Open the table editor.
Create a new table and call it `users`
Setup the columns for the table.

    id: int8 (Primary Key)
    sessionId: uuid
    created_at: timestamptz (defaults to now())
    lastUpdatedAt: timestamptz (defaults to now())
    userName: text
Enable RLS
</pre>
</details>

- Go to the Project settings
- Select the API Tab
- Copy Down the Project URL and Both Project API Keys (anon and service_role)

## Cors Proxy
> This part is kinda weird because Haruhi is using a custom Cors Proxy for this setup. It's not well documented and I dont have plans of documenting it because of how specific it is to my setup. But incase you want to try and figure out how it works and tailor it to your needs then the repo link is down below.
- https://github.com/andradesavio9073/M3U8-Proxy
> While this project was originally a M3U8-Proxy i've added support for image proxying too among other things. And changes to the setup would require changes to the frontend to accomodate for it.
- After setting up the Cors Proxy you need to copy down its address.

## Environment Variables

```sh
NEXT_PUBLIC_SERVER= #Your Application Address (Frontend)
NEXT_PUBLIC_ANILIST= #Your Anilist Application ID
ANILIST_SECRET_KEY= #Your Anilist Application Secret
NEXT_PUBLIC_SUPABASE_URL= #Your Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= #Your Supabase Project Anon Key
SUPABASE_SERVICE_ROLE = #Your Supabase Project Service Key
NEXT_PUBLIC_MEDIA_PROXY= #Your CORS Proxy Address
```

When you deploy to Vercel you won't know what the address will be. So add a random one for the start. and then go to settings after the project is created and add the domain vercel gives you. Also make sure to update Anilist's Application callback so login works properly.