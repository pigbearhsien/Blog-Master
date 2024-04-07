![image](https://github.com/pigbearhsien/blog-master/blob/main/public/Demo.jpeg)

<h1 align="center">Blog Master</h1>
<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#project-structure"><strong>Project Structure</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#contact-me"><strong>Contact Me</strong></a> 
</p>
<br/>

## **Introduction**

Blog Master is an application integrated with the GitHub API to allow you to view, create, edit, and close issues, effectively using GitHub issues as your own blogging platform. See <a href="#installation"><strong>Installation</strong></a> to get started right away.

## Demo

Visit the website: https://blog-master-alpha.vercel.app/

## Features

**1. Easily Manage Your Issue:** Sign in to GitHub with just one click, and effortlessly track your issues (blog posts) across your repositories.

**2. Block-Based Text Editor**: A familiar, Notion-style, rich text editor that enables you to create beautiful blog posts.

**3. Search for Others’ Issues:** Explore and discover issues posted by other users within the platform.

## Project Structure

1. Directory Structure

   ```bash
   .
   ├── app
   │   ├── [owner]
   │   │   ├── error.tsx
   │   │   ├── issue
   │   │   │   ├── [number]
   │   │   │   │   ├── edit
   │   │   │   │   │   └── page.tsx
   │   │   │   │   ├── loading.tsx
   │   │   │   │   └── page.tsx
   │   │   │   ├── loading.tsx
   │   │   │   ├── new
   │   │   │   │   ├── loading.tsx
   │   │   │   │   └── page.tsx
   │   │   │   └── page.tsx
   │   │   ├── layout.tsx
   │   │   └── page.tsx
   │   ├── api
   │   │   └── auth
   │   │       └── [...nextauth]
   │   │           └── route.ts
   │   ├── icon.ico
   │   ├── layout.tsx
   │   ├── opengraph-image.png
   │   ├── page.tsx
   │   └── robots.ts
   ├── components
   │   ├── <custom-component>.tsx
   │   └── ui
   │       └── <ui-component>.tsx
   ├── lib
   │   ├── auth.ts
   │   ├── context
   │   │   └── client-provider.tsx
   │   ├── github-api.ts
   │   ├── hooks
   │   │   └── useOwnerAndRepo.tsx
   │   ├── types
   │   │   ├── next-auth.d.ts
   │   │   └── types.ts
   │   └── utils.ts
   ├── public
   │   └── <photo>.png
   ├── styles
   │   └── <styles>.css
   ├── package.json
   └── README.md
   ```

2. App Router

   `/` :

   - The welcome page that allows users to sign in with GitHub or search for other users. For signed-in users, this page will redirect them directly to their `/[owner]/issue` page.

   `/[owner]/issue` :

   - The left side displays information about the owner and all their repositories that are public and able to create issue. When users switch between different repositories, the currently viewed repository is stored in the path query, e.g. `?repo=reposirory-name`. On the right side of the page, issues created under the current repository are listed. Initially, only ten issues are loaded, and when the page is scrolled to the bottom, an additional ten are loaded until no more issues are available.
   - When a user clicks on a issue from the list, they will be directed to the page of the issue at `/[owner]/issue/[number]`, where the number corresponds to the issue's number.
   - For signed-in users, they can click the "Your Issues" button in the header to access their own page (the [owner] is themselves). In their own page, a "New Issue" button will appear, enabling users to create a new issue. Also, each listed issue will have a dots icon on the right side, allowing users to select options for editing or deleting the issue.

   `/[owner]/issue/[number]` :

   - The issue page, which converts the Markdown content fetched from the GitHub API and renders it.
   - Users can click the comments icon to see all comments related to the issue.
   - For signed-in users, there will be a dots icon, allowing users to select options for editing or deleting the issue.

   `/[owner]/issue/[number]/edit` :

   - The issue editing page requires users to input a title and a body with a minimum of 30 characters.
   - When the user clicks the 'Save' button, the body content will be converted into Markdown format and updated the respective issue via the GitHub API.

   `/[owner]/issue/new` :

   - The page to create a new issue which requires users to input a title and a body with a minimum of 30 characters.
   - When the user clicks the 'Save' button, the body content will be converted into Markdown format and then used to create a new issue via the GitHub API.

3. The GitHub REST API that I used (Base URL: `https://api.github.com`)

   `/users/{owner}` (GET): Get publicly available information about the user

   `/users/{owner}/repos` (GET): Get all public repositories that can create issues for the user

   `/repos/{owner}/{repo}/issues` (GET): Get all open issues in a repository

   `/repos/{owner}/{repo}/issues/{issue_number}` (GET): Get an Issue

   `/repos/{owner}/{repo}/issues/{issue_number}/comments` (GET): Get all comments on an issue

   `/repos/{owner}/{repo}/issues` (POST): Create an issue

   `/repos/{owner}/{repo}/issues/{issue_number}` (PATCH): Update / Close an issue.

4. For more technical details, check out "[My Blog about Blog Master](https://blog-master-alpha.vercel.app/pigbearhsien/issue?repo=blog-master)".

## Installation

**1. Download Repo.**

```
$ git clone https://github.com/pigbearhsien/blog-master.git
$ cd blog-master
$ npm install
```

**2. Create `.env.local` file and set up the environment variables in the file.**

```
$ cp .env.example .env
```

```
NEXTAUTH_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

- To generate `NEXTAUTH_SECRET`, you can run `openssl rand -base64 32` on the command line to quickly create a good value.
- To get `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, you can follow the instructions [here](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app) to create an OAuth App.

**3. Run `npm run dev` to start the development server.**

**4. Visit `http://localhost:3000` to view your application.**

## Tech Stack

Blog Master is built on the following stack:

- [Next.js](https://nextjs.org/) - frontend framework
- [TypeScript](https://www.typescriptlang.org/) – language
- [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps) – authentication
- [GitHub API](https://docs.github.com/en/rest) – backend
- [TailwindCSS](https://tailwindcss.com/) - styling
- [Shadcn/ui](https://ui.shadcn.com/) - components
- [BlockNote](https://www.blocknotejs.org/) - text editor
- [Vercel](https://vercel.com/) - deployment

## Contact Me

- Email: sally920611@gmail.com
- Facebook: [https://www.facebook.com/hsieh.sally.7/](https://www.facebook.com/hsieh.sally.7/)
