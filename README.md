# React CLI Setup

A React CLI built with Vite that helps you build and structure your projects in seconds, with pre-configured setups based on the tools you select below.

## What it does

* **Automated Installation:** Installs all selected libraries (listed below) for you.
* **Structuring:** Automatically generates a scalable folder structure based on your choices.
* **Boilerplate Injection:** Pre-configures Providers, Router paths, etc., so you can start coding features immediately

---

## Features

| Category | Options |
| :--- | :--- |
| **Folder Structure** | Feature-based |
| **Modules** | Common, Auth |
| **Routing** | React Router, TanStack Router |
| **Data Fetching** | TanStack Query (React Query) & Axios |
| **State Management** | Zustand |
| **Form** | React Hook Form, TanStack Form |
| **Schema** | Zod, Yup |
| **Styling** | CSS, SCSS, Tailwind CSS |
| **UI Components** | Shadcn |
| **Icons** | React Icons, Font Awesome |
| **Toast** | React Toastify, React Hot Toast, Sonner |
| **Custom Hooks** |  |

---

##  Usage

Run the following command in your terminal to start CLI

```bash
# Using NPM
npx @aditokmo/react-cli-setup

# Using PNPM
pnpm dlx @aditokmo/react-cli-setup

# Using Yarn
yarn dlx @aditokmo/react-cli-setup
```
---

## Local Setup

To do your own changes and use this CLI locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aditokmo/react-cli.git
   cd react-cli

2. **Install dependencies:**
   ```bash
   pnpm install

3. **Build the project:**
   ```bash
   pnpm run build

4. **Link globally:**
   ```bash
   pnpm link --global

5. **Run command in your terminal to start CLI locally:**
```bash
react-cli-setup
```

---


## Project Structure

* `cli/` - Logic for the CLI.
* `templates/` - Pre-defined boilerplates and configurations.
