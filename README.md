# @aditokmo/react-setup-cli 🚀

[![npm version](https://img.shields.io/npm/v/@aditokmo/create-react-project?color=blue)](https://www.npmjs.com/package/@aditokmo/create-react-project)

A React CLI built on top of Vite that helps you build and structure projects in seconds. It eliminates manual setup by configuring your favorite tools into a **clean, modular architecture** automatically.

**Note:** This package is a CLI tool. Do not install it with `npm i`. Instead check `Quick Start` down below.

<br>

## Quick Start

Run the following command in your terminal to start CLI

```bash
# Using PNPM
pnpm create @aditokmo/react-project

# Using NPM
npm create @aditokmo/react-project

# Using Yarn
yarn create @aditokmo/react-project
```

<br>

## How it saves your time

- **Minimal Installation:** No more manual `npm install` for 10 different packages. The CLI detects your package manager and handles everything.
- **Architecture:** Instead of losing time on folder structure, you get a structure that is ready for large-scale production.
- **Smart Boilerplate Injection:** It doesn't just create files, it also wires them following best practices from documentation.

<br>

## Use Cases when this CLI is useful:

- **Starting a Professional Project:** When you need a project that follows "Clean Architecture" and industry standards from the very first commit.
- **Focusing on a Specific Feature:** When you want to test a new library or a specific piece of logic, but you need a proper environment to do it. This CLI lets you focus on what you are testing instead of wasting time on a setup.
- **Prototyping & MVP:** When you have a startup idea and want to to build actual features right away without sacrificing code quality.
- **Hackathons:** When every second counts. You can get all your configuration and setup ready before the competition start.

<br>

## About Arhitecture

### Folder Structure

- **Feature-Based**: This architecture uses a modular approach to help you build large-scale projects. Instead of mixing all components and hooks into global folders, everything is grouped by domain, such as Auth or Dashboard. This method makes it much easier to navigate the codebase and ensures your project remains maintainable as it grows.

- **Pages**: Comming soon

### Client State Management

- **Zustand** is currently the only option in CLI for global state management. It is the most popular and easiest-to-use library today. I believe Redux is overkill for most modern projects. Most "global state" is now handled as server-state by TanStack Query. Global state should be reserved for things like authentication and UI stuff, and Zustand handles this perfectly with zero boilerplate.

### Server State Management

- **TanStack Query** is integrated to handle server-state management. It is optional, but if selected, the CLI automatically wires up the necessary providers and configurations so you can start fetching data immediately. If you select to not use react query, you still get a traditional boilerplate for manual data handling.

### Axios

The CLI generates a pre-configured Axios client that serves as your central API bridge. It includes ready-to-use interceptors for handling authorization tokens and global error responses, saving you from writing the same repetitive setup every time. Axios is set by default beacause it is better choice then fetch, Axios is more user-friendly, has better error handling out of the box, and is overall a safer and more robust choice for production apps.

### Styling

You can choose between **CSS**, **SCSS**, or **TailwindCSS**. While I personally recommend Tailwind for modern and faster development, the CLI ensures that regardless of your choice, the project is configured with a global styles directory and a consistent entry point. If you select TailwindCSS you will also have option to use Shadcn/UI, and with that you will have option to choose components that you want to install instead of doing it manually.

### Routing

- **React Router** is the industry standard that most developers are familiar with.

- **TanStack Router** is included for those who want a fully type-safe routing experience with built-in data loading capabilities. 

Whichever you choose, the CLI doesn't just install the library it will generate a `routes/` directory system to help you easily separate your public pages from protected pages.

### Package Manager Detection

To make the workflow even smoother, the tool has an automatic package manager detector. It identifies whether you are using **npm**, **pnpm**, or **yarn** based on the command you used to execute the CLI, and it handles all installations using your preferred package manager to ensure consistency and avoid conflicts.

<br>

## Folder Structure

**Note**: This is the complete folder structure. The actual folders generated will depend on the libraries and options you select during the setup process.

### Feature-Based (modules)

```text
src/
├── api/                # Global API client & Axios config
├── components/         # Shared UI components
├── hooks/              # Global reusable custom hooks
├── providers/          # Providers (React Query, Tanstack Router)
├── routes/             # Route definitions
├── styles/             # Styles (Tailwind, CSS, SCSS)
├── layout/             # Layout to split protected and unprotected routes
│   ├── MainLayout.tsx
│   ├── AuthLayout.tsx
├── modules/            # Feature-based modules (The core of your app)
|   ├── common/         # Shared components & pages (404 Page, Navbar, Sidebar)
│   │   ├── pages/
│   │   └── components/
│   └── auth/           # Example: Auth module
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── types/
├── store/              # Global State Managemenet (Zustand)
│   ├── useAuthStore.ts
│   └── useThemeStore.ts
└── utils/              # Helper functions
```

<br>

## Features

| Category             | Options                                 |
| :------------------- | :-------------------------------------- |
| **Folder Structure** | Feature-based                           |
| **Modules**          | Common, Auth                            |
| **Routing**          | React Router, TanStack Router           |
| **Data Fetching**    | TanStack Query (React Query) & Axios    |
| **State Management** | Zustand                                 |
| **Form**             | React Hook Form, TanStack Form          |
| **Schema**           | Zod, Yup                                |
| **Styling**          | CSS, SCSS, Tailwind CSS                 |
| **UI Components**    | Shadcn                                  |
| **Icons**            | React Icons, Font Awesome               |
| **Toast**            | React Toastify, React Hot Toast, Sonner |
| **Custom Hooks**     |                                         |
| **Helpers**          |                                         |

<br>

## Future of CLI


- Options to choose between React, Next.js and TanStack Start
- Testing tools
- i18next pre-setup.
- Supabase & Firebase integration templates
- Global custom hooks & helper functions
- Pre-commit linters
- Github Action workflow
- TanStack Table (if your app has some kind of tables)

<br>
