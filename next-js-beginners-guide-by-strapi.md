Don't let the simplicity fool you. In this tutorial, we will cover the following topics.

Next.js App Router
Dynamic Routing
Styling with Tailwind CSS
Creating Pages
Integrating Strapi 5 with Next.js
Custom Components in Next.js
Custom Components in Strapi
Populate and Filtering in Strapi
Populating Dynamic Zone Fields
Rendering Dynamic Zone Fields
If you prefer to read instead of watch the video, I will walk you through the steps I took following the tutorial.

But I would recommend doing both. In my tutorial, I used TypesScript and took a different approach when rendering Strapi's dynamic zone.

As a bonus, we used Strapi's Block Editor, and I showed you how to render the text blocks and the image.

Create a new Next.js Project
Let's get started!

First, choose a directory to set up your project. I will name my project directory brad.


mkdir brad
cd brad
After changing into the directory, we will create a new Next.js app by running the following command.


npx create-next-app@latest
You can learn more about getting started with Next.js here

We will be prompted with the following options: here is what I chose.


➜  brad git:(main) ✗ npx create-next-app@latest
✔ What is your project named? … client
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … No
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
Creating a new Next.js app in /Users/paulbratslavsky/Desktop/work/tutorials-and-posts/brad/client.
Now that we have our project set up, we can start running the development server.


cd client
yarn dev
You can navigate to the following URL to view the app: http://localhost:3000. You should see the following screen:

001-nextjs-home.png

Nice! We have a basic Next.js app setup and running.

Setting Up Our Next.js UI and Layout.
In this section, we will set up our Next.js UI and Layout. Once we are done, we should have something that looks like this:

002-next-js-ui.gif

Building the Header Component
To get started, we will create a new folder in the src/app directory and name it components. Inside this folder, we will create a new file and name it header.tsx. This file will contain our header component.

Inside the header.tsx file, let's start by adding the following code:


import Link from "next/link";
import NavLink from "./nav-link";

const links = [
  { href: "/", label: "Home" },
  { href: "/our-team", label: "Our Team" },
  { href: "/about-us", label: "About Us" },
];

export default function Header() {
  return (
    <header className="bg-white/50">
      <nav className="container mx-auto flex justify-between items-center py-4">
        <Link href="/">Our Cool Project</Link>

        <ul className="flex gap-4">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </ul>
      </nav>
    </header>
  );
}
The above code renders our Header component. It creates a header element with a nav element. The nav element contains a Link component for the logo and a ul element with NavLink components for the navigation links.

We are iterating over the links array to create a NavLink component for each link. The NavLink component is a custom component that we will make in the next section. It is responsible for rendering an active link when the current path matches the href of the link.

Building the NavLink Component
Inside the components folder, we will create a new file and name it nav-link.tsx. This file will contain our NavLink component.

Let's start by adding the following code:


"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import path from "path";

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: Readonly<NavLinkProps>) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        className={cn(
          isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
        )}
      >
        {children}
      </Link>
    </li>
  );
}
Nice! We have a NavLink component that renders a link active when the current path matches the link's href.

Building the Footer Component
We will create a new file in the components folder and name it footer.tsx. This file will contain our Footer component.

Let's start by adding the following code:


export default function Footer() {
  return (
    <footer className="bg-white/50">
      <div className="container mx-auto flex justify-center items-center py-4">
        <div>&copy; {new Date().getFullYear()} Our Company Name</div>
      </div>
    </footer>
  );
}
Now, we have a Footer component that renders a footer with a copyright notice.

Building the Layout Component
Let's update our layout.tsx file to include our Header and Footer components. The layout.tsx file is responsible for rendering the layout of our app. It is the root component that wraps around our entire app.

Let's start by updating the layout.tsx file with the following code:


import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import Footer from "@/app/components/footer";
import Header from "@/app/components/header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-gray-200 min-h-screen grid grid-rows-[auto_1fr_auto]">
          <Header />
          <main className="container mx-auto bg-white/50 rounded-xl py-7 px-8 m-6 overflow-hidden">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
We now have a Layout component responsible for rendering our app's layout. It includes our Header and Footer components.

Create Pages Routes
In our project, we will have the following pages:

Home
Our Team
About Us
Let's start by creating routes for the pages above.

Create Home Page
We already have a page.tsx file in the app folder. This file is our Home page.

Let's update the page.tsx file with the following code:


export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
Nice! We have a Home page.

Create Our Team Page
Now, let's create our Our Team page. We will create a new folder in the app folder and name it our-team. We will create a new file and name it page.tsx inside this folder. This file will contain the Our Team page.

Let's start by adding the following code:


export default function OurTeam() {
  return (
    <div>
      <h1>Our Team</h1>
    </div>
  );
}
Create About Us Page
Finally, let's create our About Us page. We will create a new folder in the app folder and name it about-us. We will create a new file and name it page.tsx inside this folder. This file will contain our About Us page.

Let's start by adding the following code:


export default function AboutUs() {
  return (
    <div>
      <h1>About Us</h1>
    </div>
  );
}
Nice, now we have all of our basic pages set up.

In the next section, we will start to set up our Strapi backend.

Getting Started with Strapi 5
Strapi is an open-source headless content management system (CMS) that allows you to create, manage, and serve content through a flexible API.

003-strapi.png

We are going to use Strapi to power the backend of our application, enabling non-developers or non-programmers to easily contribute and manage website content, such as team member profiles.

004-strapi-api.gif

By integrating Strapi with Next.js, we can dynamically fetch and display this content on the frontend, allowing for a seamless and interactive user experience. Strapi simplifies data handling and offers a user-friendly admin interface for content management.

Install Strapi 5
We can get started by running the following command at the root of our project:


npx create-strapi-app@latest server
We will be prompted with the following options: here is what I chose.


 Strapi   v5.0.2 🚀 Let's create your new project


We can't find any auth credentials in your Strapi config.

Create a free account on Strapi Cloud and benefit from:

- ✦ Blazing-fast ✦ deployment for your projects
- ✦ Exclusive ✦ access to resources to make your project successful
- An ✦ Awesome ✦ community and full enjoyment of Strapi's ecosystem

Start your 14-day free trial now!


? Please log in or sign up.
  Login/Sign up
❯ Skip
For this tutorial, we will choose to skip the login step.

After we hit enter, we will see the following options: here is what I chose.


? Please log in or sign up. Skip
? Do you want to use the default database (sqlite) ? Yes
? Start with an example structure & data? No
? Start with Typescript? Yes
? Install dependencies with npm? Yes
? Initialize a git repository? Yes

 Strapi   Creating a new application at /Users/paulbratslavsky/Desktop/work/tutorials-and-posts/brad/server
Once everything is set up, we can start the Strapi server by running the following command:


cd server
yarn develop
We should be greeted with the following screen: create your first Strapi Admin User.

005-strapi-admin-user.png

After successfully creating the user, you should be redirected to the Strapi Welcome screen.

006-strapi-welcome.png

In this tutorial, we are primarily focusing on collection types, which are essential for structuring our data in a way that is easily accessible and manageable.

Collection types in Strapi define a group of similar data entries. For instance, in our case, we will create a collection type called Team Members. This collection will allow us to manage individual profiles for each team member, including fields such as their name, description, photograph, and URL-friendly slug.

The use of collection types is beneficial because it provides a structured format for data, making it straightforward to add, edit, or remove entries as needed. Each team member's data can be easily retrieved via API endpoints, enabling our frontend to dynamically display the information without hardcoding it.

Building Our First Collection Type In Strapi 5
We will create a new collection type called Team Member.

007-strapi-collection-type.png

Once you click on "Continue," you will be redirected to the following screen:

008-strapi-collection-type-fields.png

Now, let's start by adding the following fields to our collection type:

Field Name	Field Type	Additional Info
name	Text	Short text input
description	Text	Long text input
photo	Media	Single media
slug	UID	Reference name
Once you have added all the fields, click "Save" to save the collection type.

009-strapi-collection-type-fields.png

Now that we have our collection type, we can start adding data. Go ahead and add your first team member.

010-adding-team-member-data.gif

Nice! We have added our first team member.

Configuring Strapi API Permissions
Now that we have our team member data in place let's see how we can access it via the Strapi API.

But first, let's give our API appropriate permission to access our team member data.

We can do this in the Settings section of Strapi.

011-strapi-settings.png

We will navigate to the Users & Permissions plugin. Once in the Users & Permissions plugin, we will navigate to the Roles section, select the Public role, and click on the Team Members permission.

We will check find and findOne. This will give our API the necessary permissions to fetch and display our team member data.

We should be able to request the following URL to fetch our team member data:


http://localhost:1337/api/team-members
See the following response:


{
  "data": [
    {
      "id": 2,
      "documentId": "ybk38754pitymo4wxcn3mjct",
      "name": "Sarah",
      "description": "Hello I am Sarah.",
      "slug": "sarah",
      "createdAt": "2024-10-03T17:50:37.403Z",
      "updatedAt": "2024-10-03T17:50:37.403Z",
      "publishedAt": "2024-10-03T17:50:37.411Z",
      "locale": null
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
You will notice that we are not yet seeing the photo data in the response. This is because we need to tell Strapi to include the photo field in the response using our populate and filtering flags.

This is something we will do as we start to build our frontend.

How To Fetch Data In Next.js
Now that we have our Strapi backend, let's start building our frontend. In this section, we will fetch our team member data in Next.js.

With Next.js Server Components, we can fetch data directly from our components.

Let's see how we can accomplish this within our Our Team page.

Fetch Team Members from the Strapi Backend
Let's start by updating our our-team/page.tsx file with the following code:


async function getTeamMembers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/team-members";

  const url = new URL(path, baseUrl);

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch team members");

  const data = await res.json();
  console.log(data);

  return data;
}

export default async function OurTeam() {
  const teamMembers = await getTeamMembers();
  console.log(teamMembers);

  return (
    <div>
      <h1>Our Team</h1>
      <pre>{JSON.stringify(teamMembers, null, 2)} </pre>
    </div>
  );
}
This will fetch our team member data from our Strapi backend and display it in the browser.

Populate the photo Field
Now, let's update this to populate our photo field.

You can learn more about Strapi's Populate and Filtering here, but I will walk you through the steps here.

We will start by constructing the query object using Strapi's Query Builder that you can find here.

Here is the basic our query will look like:

012-strapi-query.png

Go ahead and copy the Query String URL and make a request to the following URL in your browser:

http://localhost:1337/api/team-members?populate[photo][fields][0]=alternativeText&populate[photo][fields][1]=name&populate[photo][fields][2]=url

You should see the following response:


{
  "data": [
    {
      "id": 2,
      "documentId": "ybk38754pitymo4wxcn3mjct",
      "name": "Sarah",
      "description": "Hello I am Sarah.",
      "slug": "sarah",
      "createdAt": "2024-10-03T17:50:37.403Z",
      "updatedAt": "2024-10-03T17:50:37.403Z",
      "publishedAt": "2024-10-03T17:50:37.411Z",
      "locale": null,
      "photo": {
        "id": 1,
        "documentId": "e2zyo9559mmgj3tu3f4olngz",
        "alternativeText": null,
        "name": "computer-working.jpg",
        "url": "/uploads/computer_working_3ec59d6554.jpg"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
Notice how we now see the photo data in the response.

To recap, in our collection type, we added the following fields:

name
description
slug
photo
The fields name, description, and slug are all that I would call top-level fields. That is because they do not have any relationships with other entities.

Since photo relates to another entity or image, we must populate it.

As we did above, use Strapi's Query Builder. Where we passed the following to the query:


{
  populate: {
    photo: {
      fields: ['alternativeText', 'name', 'url']
    }
  },
}
Update Our Team Page
Now, let's update our Our Team page.tsx file to display and utilize the populate logic that we learned about above.

To accomplish this, we will install a new package called qs, which will help us construct our query string.

You can install the package by running the following command:


yarn add qs
yarn add @types/qs
You can learn more about the qs package here.

Let's start by updating our getTeamMembers function to utilize the qs package.

First, we will import the qs package at the top of the file.


import qs from "qs";
Then, we will update our getTeamMembers function to utilize the qs package.


async function getTeamMembers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/team-members";

  const url = new URL(path, baseUrl);

  url.search = qs.stringify({
    populate: {
      photo: {
        fields: ["alternativeText", "name", "url"],
      },
    },
  });

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch team members");

  const data = await res.json();
  console.log(data);

  return data;
}
The complete code for our Our Team page should now look like this:


import qs from "qs";

async function getTeamMembers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/team-members";

  const url = new URL(path, baseUrl);

  url.search = qs.stringify({
    populate: {
      photo: {
        fields: ["alternativeText", "name", "url"],
      },
    },
  });

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch team members");

  const data = await res.json();
  console.log(data);

  return data;
}

export default async function OurTeam() {
  const teamMembers = await getTeamMembers();
  console.log(teamMembers);

  return (
    <div>
      <h1>Our Team</h1>
      <pre>{JSON.stringify(teamMembers, null, 2)} </pre>
    </div>
  );
}
In the next section, we will build our frontend to display our team members.

Building Our Team Member Card Component
In this section, we will start building the Team Member Card component, which will display a single team member's profile.

Inside our Our Team page.tsx file, we will create a new component named TeamMemberCard. This component will display a single team member profile.

Let's start by adding the following code:


interface TeamMemberProps {
  id: number;
  documentId: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  photo: {
    id: number;
    documentId: string;
    alternativeText: string;
    name: string;
    url: string;
  };
}

function TeamMemberCard({
  name,
  description,
  photo,
  slug,
}: Readonly<TeamMemberProps>) {
  const imageUrl = `${
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337"
  }${photo.url}`;
  return (
    <Link
      href={`/our-team/${slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Image
        src={imageUrl}
        alt={photo.alternativeText || name}
        width={500}
        height={500}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
This component will be responsible for displaying a single team member profile.

And update our Our Team component to utilize our TeamMemberCard component.


export default async function OurTeam() {
  const teamMembers = await getTeamMembers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.data.map((member: TeamMemberProps) => (
          <TeamMemberCard key={member.documentId} {...member} />
        ))}
      </div>
    </div>
  );
}
The complete code for our Our Team page should now look like this:


import qs from "qs";
import Image from "next/image";

async function getTeamMembers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/team-members";

  const url = new URL(path, baseUrl);

  url.search = qs.stringify({
    populate: {
      photo: {
        fields: ["alternativeText", "name", "url"],
      },
    },
  });

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch team members");

  const data = await res.json();
  console.log(data);

  return data;
}

interface TeamMemberProps {
  id: number;
  documentId: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  photo: {
    id: number;
    documentId: string;
    alternativeText: string;
    name: string;
    url: string;
  };
}

function TeamMemberCard({
  name,
  description,
  photo,
  slug,
}: Readonly<TeamMemberProps>) {
  const imageUrl = `${
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337"
  }${photo.url}`;
  return (
    <Link
      href={`/our-team/${slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Image
        src={imageUrl}
        alt={photo.alternativeText || name}
        width={500}
        height={500}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

export default async function OurTeam() {
  const teamMembers = await getTeamMembers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.data.map((member: TeamMemberProps) => (
          <TeamMemberCard key={member.documentId} {...member} />
        ))}
      </div>
    </div>
  );
}
If we navigate to our Our Team page, we will see the following error:

013-our-team-page-error.png

To fix this error, we need to update our next.config. JMS file to include our Strapi server as a remote pattern.


/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
    ],
  },
};

export default nextConfig;
Now restart your development server and navigate to our Our Team page, and we should see the following:

014-our-team-page.png

Nice. Now that we can display our team members, let's build our Team Member Detail page. But before that, let's learn about Strapi's Components and Dynamic Zones.

Managing Content in Strapi with Components and Dynamic Zones
This section will start by learning about Strapi's Components and Dynamic Zones.

Components are reusable building blocks that can be used to build pages, and dynamic zones are special components that can be used to build pages.

Create the Testimonial Component
We will start by creating a new Testimonial component.

015-strapi-components.png

I will name it testimonial and create a blocks category.

Now, click the "Continue" button and add our first fields.

I am going to add the following fields:

Field Name	Field Type	Additional Info
authorName	Text	Short text input
quote	Text	Long text input
photo	Media	Single media
Here is what the final fields should look like:

016-strapi-testimonial-component.png

Create the Spoiler Component
Now let's create another component; we will name it spoiler.

I am going to add the following fields:

Field Name	Field Type	Additional Info
title	Text	Short text input
content	Text	Long text input
Here is what the final fields should look like:

017-strapi-spoiler-component.png

Creatte RichText Component
And finally, let's create one more component; we will name it richText.

I am going to add the following field:

Field Name	Field Type	Additional Info
content	Rich Text	Rich text input
Here is what the final fields should look like:
019-strapi-content-component.png

Building Dynamic Zones in Strapi
Nice! Now that our components are created let's start building our dynamic zones.

Let's navigate to our Team Member collection type and click "Add another field to this type".

020-strapi-dynamic-zone-1.png

We will scroll down and find Dynamic Zone and add it to our collection type.

021-strapi-dynamic-zone-2.png

Let's name it blocks and click on Add the component to the zone.

022-strapi-dynamic-zone-3.png

I will add our Testimonial, Spoiler, and Rich Text components that we created earlier and click on Finish. You should see the following screen:

023-strapi-dynamic-zone-4.png

Don't forget to click on Save to save the dynamic zone.

Now, let's go ahead and add some data to our Team Member collection type.

025-strapi-team-member-data.gif

Excellent; let's see how we can fetch this data in our Next.js application.

But first, let's revisit our populate logic. We already did some of this when we built our Our Team page.

However, now that we use dynamic zones, we need to update our populate logic to include our blocks field. For this, we will use the on flag.

You can learn more about Strapi's on flag here.

026-strapi-populate-dynamic-zone.png

Here is the example query we would use to populate the above dynamic zone example:


{
  populate: {
    blocks: { // asking to populate the blocks dynamic zone
      on: { // using a detailed population strategy to explicitly define what you want
        'blocks.related-articles': {
          populate: {
           'articles': {
             populate: ['image']
           }
         }
        },
        'blocks.cta-command-line': {
          populate: '*'
        }
      },
    },
  },
}
We will use similar populate logic as the example above to populate our blocks dynamic zone.

Populating Our Dynamic Zone

Looking at our Team Member collection, we see that we have our blocks dynamic zone field.

027-strapi-team-member-collection.png

Using the on flag, we can target the blocks field. We can also see that our Testimonial component has a photo field related to our Media content type. So, we will populate the fields we need using the fields flag.

028-strapi-populate-dynamic-zone-2.png

Here is what the populate logic will look like:


{
  populate: {
    photo: {
      fields: ['alternativeText', 'name', 'url']
    },
    blocks: {
      on: {
        'blocks.testimonial': {
          populate: {
            photo: {
              fields: ['alternativeText', 'name', 'url']
            }
          }
        }
      }
    }
  },
}
We can request the following URL with the above populate logic included in the query string, and we should see the following response:

http://localhost:1337/api/team-members?populate[photo][fields][0]=alternativeText&populate[photo][fields][1]=name&populate[photo][fields][2]=url&populate[blocks][on][blocks.testimonial][populate][photo][fields][0]=alternativeText&populate[blocks][on][blocks.testimonial][populate][photo][fields][1]=name&populate[blocks][on][blocks.testimonial][populate][photo][fields][2]=url


{
  "data": [
    {
      "id": 4,
      "documentId": "ybk38754pitymo4wxcn3mjct",
      "name": "Sarah",
      "description": "Hello I am Sarah.",
      "slug": "sarah",
      "createdAt": "2024-10-03T17:50:37.403Z",
      "updatedAt": "2024-10-03T21:17:22.740Z",
      "publishedAt": "2024-10-03T21:17:22.751Z",
      "locale": null,
      "photo": {
        "id": 1,
        "documentId": "e2zyo9559mmgj3tu3f4olngz",
        "alternativeText": null,
        "name": "computer-working.jpg",
        "url": "/uploads/computer_working_3ec59d6554.jpg"
      },
      "blocks": [
        {
          "__component": "blocks.testimonial",
          "id": 3,
          "authorName": "Sarah",
          "quote": "Strapi 5 is awesome.",
          "photo": {
            "id": 1,
            "documentId": "e2zyo9559mmgj3tu3f4olngz",
            "alternativeText": null,
            "name": "computer-working.jpg",
            "url": "/uploads/computer_working_3ec59d6554.jpg"
          }
        }
      ]
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
Nice! Notice we can see our Testimonial component data in the response.

The last item we need to solve before implementing our Team Member Detail page is to ensure we know how to fetch a single team member via the slug field.

Let's update our query from above to include the filters flag. Here is what the updated query should look like:


{
  populate: {
    photo: {
      fields: ['alternativeText', 'name', 'url']
    },
    blocks: {
      on: {
        'blocks.testimonial': {
          populate: {
            photo: {
              fields: ['alternativeText', 'name', 'url']
            }
          }
        },
      }
    }
  },
  filters: {
    slug: {
      $eq: "sarah" // This is the slug for our team member
    }
  }
}
This will allow us to fetch the data for the team member we want.

And finally, let's update our query to populate the rest of our blocks in our dynamic zone.

Here is the final query we will use:


{
  populate: {
    photo: {
      fields: ['alternativeText', 'name', 'url']
    },
    blocks: {
      on: {
        'blocks.testimonial': {
          populate: {
            photo: {
              fields: ['alternativeText', 'name', 'url']
            }
          }
        },
        'blocks.spoiler': {
          populate: true
        },
        'blocks.rich-text': {
          populate: true
        }
      }
    }
  },
  filters: {
    slug: {
      $eq: "sarah" // This is the slug for our team member
    }
  }
}
And here is the response we should see:

Notice how we now see our testimonial, spoiler, and rich-text components in the response.

Finally, let's start working out the Team Member Detail page.

Building The Team Member Detail Page
In our Next.js project, we will start by creating a new file in our app/team-member folder and naming it [slug]. Inside, let's add page.tsx.

By naming our folder [slug] it will turn our normal route into a dynamic route; you can learn more about dynamic routes here.

Let's add the following code to our [slug]/page.tsx file:


export default function TeamMemberDetail() {
  return (
    <div>
      <h1>Team Member Detail</h1>
    </div>
  );
}
Now, when we click on any of the team members in our Our Team page, we should see our Team Member Detail page.

030-team-member-detail-page.png

How To Get Our Slugs From The Params In Next.js
Now, let's look at how we can access our parameters to get our slug, which we can use to fetch our team member data.

In our [slug]/page.tsx component, we can access our slug by accessing the params object.

We will start by adding the following code to our component:


export default function TeamMemberDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) <p>No member found</p>;

  return (
    <div>
      <h1>Team Member Detail</h1>
      <p>{slug}</p>
    </div>
  );
}
When we navigate to our Team Member Detail page, we should see our team member's name.

031-team-member-detail-page-2.gif

Before styling our page, let's start by fetching data from our team members.

Let's create a new function to fetch our team member data. We will name it getTeamMember and add it to our [slug]/page.tsx file.

Here is what the code should look like:


import qs from "qs";

async function getTeamMember(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/team-members";

  const url = new URL(path, baseUrl);

  url.search = qs.stringify({
    populate: {
      photo: {
        fields: ["alternativeText", "name", "url"],
      },
      blocks: {
        on: {
          "blocks.testimonial": {
            populate: {
              photo: {
                fields: ["alternativeText", "name", "url"],
              },
            },
          },
          "blocks.spoiler": {
            populate: true,
          },
          "blocks.rich-text": {
            populate: true,
          },
        },
      },
    },
    filters: {
      slug: {
        $eq: slug, // This is the slug for our team member
      },
    },
  });

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch team members");

  const data = await res.json();
  const teamMember = data?.data[0];
  console.dir(teamMember, { depth: null });
  return teamMember;
}

export default async function TeamMemberDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) <p>No member found</p>;

  const teamMember = await getTeamMember(slug);

  return (
    <div>
      <h1>Team Member Detail</h1>
      <p>{slug}</p>
      <pre>{JSON.stringify(teamMember, null, 2)}</pre>
    </div>
  );
}
In the code above, we use the getTeamMember function to fetch data for our team members. We pass in our slug as an argument to the function, and then return the team member data to our component.

Notice how we pass our search query to url.search based on the populate logic we created earlier.

We also use the pre tag to display our team member data in a readable format.

032-team-member-detail-page-3.png

Let's add basic styling to our Team Member Detail page.

We will add the following code to our [slug]/page.tsx file:


import qs from "qs";

import { BlockRenderer, TeamPageBlock } from "@/app/components/blocks";

async function getTeamMember(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/team-members";

  const url = new URL(path, baseUrl);

  url.search = qs.stringify({
    populate: {
      photo: {
        fields: ["alternativeText", "name", "url"],
      },
      blocks: {
        on: {
          "blocks.testimonial": {
            populate: {
              photo: {
                fields: ["alternativeText", "name", "url"],
              },
            },
          },
          "blocks.spoiler": {
            populate: true,
          },
          "blocks.rich-text": {
            populate: true,
          },
        },
      },
    },
    filters: {
      slug: {
        $eq: slug, // This is the slug for our team member
      },
    },
  });

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch team members");

  const data = await res.json();
  const teamMember = data?.data[0];
  console.dir(teamMember, { depth: null });
  return teamMember;
}

interface UserProfile {
  id: number;
  documentId: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  photo: {
    id: number;
    alternativeText: string;
    name: string;
    url: string;
  };
  blocks: TeamPageBlock[];
}

export default async function TeamMemberDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) return <p>No member found</p>;

  const teamMember = (await getTeamMember(slug)) as UserProfile;

  return (
    <div>
      {teamMember.blocks.map((block: TeamPageBlock) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
Create Other Blocks
For the above code to work, we must create our new BlockRenderer component and all the other components we use on our Team Member Detail page.

Let's do that now.

Let's create a new folder in our app/components folder and name it blocks; let's create a new file and name it index.tsx.

Now, let's create the following components in our blocks folder:

spoiler-block.tsx
testimonial-block.tsx
rich-text-block.tsx
Spoiler Block
Here is what the spoiler-block.tsx file should look like:


"use client";

import { useState } from "react";

export interface SpoilerBlock {
  __component: "blocks.spoiler";
  id: number;
  title: string;
  content: string;
}

export function SpoilerBlock({ block }: { block: SpoilerBlock }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full mb-4 rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out">
      <button
        className={`w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 ease-in-out ${
          isExpanded ? "bg-gray-200" : ""
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="text-lg font-semibold text-gray-800">
          {block.title}
        </span>
        <span
          className={`text-2xl text-gray-600 transition-transform duration-300 ease-in-out ${
            isExpanded ? "transform rotate-180" : ""
          }`}
        >
          {isExpanded ? "−" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px]" : "max-h-0"
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="p-4 bg-white text-gray-700 leading-relaxed">
          {block.content}
        </div>
      </div>
    </div>
  );
}
Testimonial Block
Here is what the testimonial-block.tsx file should look like:


import Image from "next/image";

export interface TestimonialBlock {
  __component: "blocks.testimonial";
  id: number;
  authorName: string;
  quote: string;
  photo: {
    id: number;
    documentId: string;
    alternativeText: string | null;
    name: string;
    url: string;
  };
}

export function TestimonialBlock({ block }: { block: TestimonialBlock }) {
  const imageUrl = `${
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337"
  }${block?.photo?.url}`;

  return (
    <figure className="relative bg-gray-100 rounded-lg border border-gray-200 overflow-hidden my-6">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="relative h-64 md:h-full col-span-1">
          <Image
            src={imageUrl}
            alt={block.photo.alternativeText || block.authorName}
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-center"
          />
        </div>
        <div className="p-8 col-span-2 flex flex-col justify-center">
          <blockquote className="relative">
            <svg
              className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-gray-300 opacity-50"
              fill="currentColor"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="relative text-xl font-medium text-gray-900 mb-4">
              {block.quote}
            </p>
          </blockquote>
          <figcaption className="font-semibold text-indigo-600 mt-2">
            {block.authorName}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
Rich Text Block
Here is what the rich-text-block.tsx file should look like:


"use client";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import Image from "next/image";

export interface RichTextBlock {
  __component: "blocks.rich-text";
  id: number;
  content: BlocksContent;
}

// This renderer is using Strapi's Rich Text renderer.
// https://github.com/strapi/blocks-react-renderer

export function RichTextBlock({ block }: { block: RichTextBlock }) {
  return (
    <div className="richtext">
      <BlocksRenderer
        content={block.content}
        blocks={{
          image: ({ image }) => {
            console.log("image", image);
            if (!image) return null;
            return (
              <div className="my-4 flex justify-center">
                <Image
                  src={image.url}
                  width={image.width || 800}
                  height={image.height || 600}
                  alt={image.alternativeText || ""}
                  className="rounded-lg shadow-md h-[300px] w-full object-cover"
                />
              </div>
            );
          },
        }}
      />
    </div>
  );
}
This component is using Strapi's Rich Text renderer. You can learn more about it here;

To style our Rich Text component, we use Tailwind CSS. Here is what I added in the global.css file:


/* Rich Text Block Start */

.richtext h1,
.richtext h2,
.richtext h3,
.richtext h4,
.richtext h5,
.richtext h6 {
  @apply font-bold leading-tight;
}

.richtext h1 {
  @apply text-4xl mb-6 text-gray-900 dark:text-gray-100;
}

.richtext h2 {
  @apply text-3xl mb-4 text-gray-800 dark:text-gray-200;
}

.richtext h3 {
  @apply text-2xl mb-3 text-gray-700 dark:text-gray-300;
}

.richtext h4 {
  @apply text-xl mb-2 text-gray-600 dark:text-gray-400;
}

.richtext h5 {
  @apply text-lg mb-2 text-gray-600 dark:text-gray-400;
}

.richtext h6 {
  @apply text-base mb-2 text-gray-600 dark:text-gray-400;
}

.richtext p {
  @apply mb-4 text-gray-700 dark:text-gray-300 leading-relaxed;
}

.richtext blockquote {
  @apply border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 italic my-8 p-4 rounded-r-lg;
}

.richtext a {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}

.richtext ul,
.richtext ol {
  @apply mb-4 pl-8;
}

.richtext ul {
  @apply list-disc;
}

.richtext ol {
  @apply list-decimal;
}

/* Rich Text Block End */
Nice, now that we have all of our components, let's add the following code in our components/blocks/index.tsx file:


import { RichTextBlock } from "./rich-text-block";
import { TestimonialBlock } from "./testimonial-block";
import { SpoilerBlock } from "./spoiler-block";

type TeamPageBlock = SpoilerBlock | TestimonialBlock | RichTextBlock;

const blocks: Record<
  TeamPageBlock["__component"],
  React.ComponentType<{ block: TeamPageBlock }>
> = {
  "blocks.spoiler": ({ block }: { block: TeamPageBlock }) => (
    <SpoilerBlock block={block as SpoilerBlock} />
  ),
  "blocks.testimonial": ({ block }: { block: TeamPageBlock }) => (
    <TestimonialBlock block={block as TestimonialBlock} />
  ),
  "blocks.rich-text": ({ block }: { block: TeamPageBlock }) => (
    <RichTextBlock block={block as RichTextBlock} />
  ),
};

function BlockRenderer({ block }: { block: TeamPageBlock }) {
  const BlockComponent = blocks[block.__component];
  return BlockComponent ? <BlockComponent block={block} /> : null;
}

export { BlockRenderer };
export type { TeamPageBlock };
Key Components
Block Type Definitions (TeamPageBlock)
The TeamPageBlock type is a union of three block types: SpoilerBlock, TestimonialBlock, and RichTextBlock. Each block represents a distinct type of content that can be displayed.

Each block component is imported and can be rendered based on the block data type.

Blocks Record (blocks):
The blocks object maps a block's __component field (which is a string identifier like blocks.spoiler, blocks.testimonial, or blocks.rich-text) to the corresponding React component that should handle that block type.

For example:
When the block's __component is blocks.spoiler, it renders the SpoilerBlock component.

Each block type is cast to the correct type using TypeScript's as keyword (block as SpoilerBlock) to ensure the correct component is used with the correct block data.

BlockRenderer Function:
The BlockRenderer component takes a TeamPageBlock object as a prop and renders the appropriate component based on the block's __component field.

Inside this function, blocks[block.__component] retrieves the correct component for the given block. If a matching component is found, it is rendered; otherwise, null is returned (indicating no content is rendered for unrecognized block types).

How the BlockRenderer Works
When BlockRenderer is called with a block, it looks up the block.__component in the blocks object to find the corresponding React component.

It then renders the component, passing the block data to it.

The specific component (e.g., SpoilerBlock, TestimonialBlock, or RichTextBlock) knows how to handle and render that particular block's data.

Example Flow:
A TeamPageBlock (e.g., a TestimonialBlock) is passed to BlockRenderer.
BlockRenderer checks the block's __component field (e.g., blocks.testimonial).

It finds the corresponding component (TestimonialBlock) in the blocks object.

It renders the TestimonialBlock component, passing the block as a prop and displaying the block content.

This pattern is useful for rendering dynamic content in which blocks are of different types and each type has its own specific rendering logic.

Nice. Now that we have all our components, let's add some data for our team members in Strapi's admin panel. Then, check out our locally running Next.js app to see our new team member page.

2024-10-04_13-14-39 (1).gif

Conclusion
This tutorial covered building a dynamic website using Next.js 14 and Strapi 5, and we explored the frontend and backend aspects, making it accessible for beginners.

Topics included:

Creating and styling components.
Integrating Strapi as a headless CMS.
Building a dynamic website using Next.js 14 and Strapi 5.
Key concepts covered were:

Next.js project setup: Using TypeScript, Tailwind CSS, and the App Router.
Creating pages such as "Home," "Our Team," and "About Us."
Strapi integration: Configuring Strapi to manage backend data, creating collection types (e.g., team members), and building reusable components with Dynamic Zones in Strapi.
Fetching data: from Strapi's API: Using Next.js server components to pull team member data dynamically.
Rendering dynamic content: Implementing a block-based content system, allowing for flexible, reusable components (e.g., SpoilerBlock, TestimonialBlock, RichTextBlock) that handle different content types.
I hope you enjoyed this tutorial. A huge thank you to Brad from LearnWebCode for creating the video tutorial I used to write this blog post. Make sure to check out his video.

You can find the code for this tutorial here.

If you have any questions or feedback, please leave a comment below. Or join us on Strapi's Discord here for our "Strapi Open Office Hours" Monday - Friday.

Morning Session:
4 AM CST (9:00 AM GMT)

Afternoon Session:
12:30 PM CST (6:30 PM GMT)