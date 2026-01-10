# React CLI Starter

A React CLI tool that helps you build and structure your projects in seconds, with pre-configured setups based on the tools you select below.

---

## Features

| Category | Options |
| :--- | :--- |
| **Styling** | Tailwind CSS, SCSS, Standard CSS |
| **UI Components** | shadcn |
| **Routing** | React Router, TanStack Router (soon) |
| **Data Fetching** | TanStack Query (React Query) |
| **State Management** | Zustand (soon), Redux (soon) |

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

---

##  Usage

Run the following command in your terminal to start the interactive setup:

```bash
react-cli
```


## 📂 Project Structure

* `cli/` - Logic for the CLI.
* `templates/` - Pre-defined boilerplates and configurations.
* `dist/` - Compiled JavaScript.
