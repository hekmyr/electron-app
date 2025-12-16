# Logix - Logisitcs management software

A desktop application built with Electron and Angular for managing customers and addresses.

## Prerequisites

- Node.js
- Docker
- Docker Compose

## Setup & Run

1. **Start the database**
   ```bash
   cd desktop
   docker compose up -d
   ```

2. **Generate prisma files**
   ```bash
   npx prisma generate
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the application**
   ```bash
   npm run start:desktop
   ```

## Project files

```
.
├── README.md # Project documentation
├── desktop # Electron application (Main process)
│   ├── compose.yaml # Docker Compose configuration for the database
│   ├── package.json # Desktop workspace dependencies
│   ├── prisma # Database ORM configuration
│   ├── src # Electron source code
│   └── tsconfig.json
├── docs # Project documentation and diagrams
│   ├── components.md
│   ├── pages.mmd
│   └── schema.mmd
├── frontend # Angular application (Renderer process)
│   ├── angular.json # Angular CLI configuration
│   ├── components.json
│   ├── libs # Shared UI libraries and components
│   ├── package.json # Frontend workspace dependencies
│   ├── public
│   ├── src # Angular source code
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   └── tsconfig.spec.json
├── package-lock.json
├── package.json # Root configuration and scripts
├── scripts
│   └── init.sql # Database initialization script
└── shared # Shared code between Desktop and Frontend
    ├── dto # Data Transfer Objects
    ├── errors.ts
    ├── helper.ts
    ├── services # Shared service interfaces
    └── types # Shared TypeScript types
```
