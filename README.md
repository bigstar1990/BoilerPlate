# Table of Contents

- [Ovenplate](#ovenplate)
- [Stack](#stack)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
    - [1. IDE & Extensions](#ide--extensions)
    - [2. Docker](#docker)
    - [3. Bun](#bun)
  - [Use this template](#use-this-template)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Development](#development)
  - [Production](#production)
- [License](#license)

# Ovenplate

> If they don't have bread, let them eat buns. - Marie Antoinette

This is a template for Next.js with Bun. It's a full-featured stack for building web applications with a focus on developer experience and production readiness.
[for all documentation](https://github.com/bamiot/ovenplate/wiki)

# Stack

- [Bun 1.x](https://bun.sh/) - Js/Ts runtime, test runner, package manager, and more.
- [Next.js 14](https://nextjs.org/) - Fullstack React framework.
- [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) - fully customizable, low-level CSS framework. with a small selection of pre-installed components
- [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation. see usage on [shadcn docs](https://ui.shadcn.com/docs/components/form)
- [Zustand](https://github.com/pmndrs/zustand?tab=readme-ov-file) - State management.

# Features

- [**Zero Configuration**](https://github.com/bamiot/ovenplate/wiki/Configuration): No need to configure anything, just start coding.
- in [TypeScript](https://www.typescriptlang.org/docs/).
- [**ESLint**](https://eslint.org/) & [**Prettier**](https://prettier.io/): Linting and formatting on save.
- built-in [Dark Mode](https://github.com/Bamiot/Ovenplate/wiki/Configuration#themes--dark-mode).
- built-in [localization](https://github.com/Bamiot/Ovenplate/wiki/Configuration#localization) support.
- pre-configured for [production deployment](https://github.com/Bamiot/Ovenplate/wiki/Configuration#deployment) with Docker.

see all features and doccumentation on the [wiki](https://github.com/bamiot/ovenplate/wiki)

# Installation

## Prerequisites

### 1. IDE & Extensions

I strongly recommend using [Visual Studio Code](https://code.visualstudio.com/) (or fork) with the following extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Lintter.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatter.

and suggest the following extensions for better development experience:

- [Console Ninja](https://marketplace.visualstudio.com/items?itemName=WallabyJs.console-ninja) - show log in the editos aside of targeted code.
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - IntelliSense with Tailwind CSS.
- [Tailwind Fold](https://marketplace.visualstudio.com/items?itemName=stivo.tailwind-fold) - able to fold tailwind classes. better for readability.
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) - Special icons for files and folders. improve readability.

> Note: VSCode will prompt you to install these extensions when you open the project.

### 2. Docker

For production deployment, you need to have [Docker](https://www.docker.com/) installed.

### 3. Bun

This stack use Bun if you don't have it installed yet, you can install it in one command line. Refere to [Bun Installation](https://bun.sh/docs/installation).

## Use this template

Click on the "Use this template" button to create a new repository.

# Getting Started

1. Use this template to create a new repository.
2. Clone the repository to your local machine.
3. Install dependencies: `bun install`
4. rename `.env.example` to `.env.local` for private environment variables.
5. Start the development server: `bun run dev`

# Usage

## Development

```bash
bun run dev
```

## Production

```bash
docker compose up
```

or

for begginer i suggest [Portainer](https://www.portainer.io/) to deploy the stack with a simple UI.

# License

[the Unlicense](https://unlicense.org/) - public domain
