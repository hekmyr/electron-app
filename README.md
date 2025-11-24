# Electron App - School Project

A desktop application built with Electron and Angular for managing customers and addresses.

## Prerequisites

- Node.js
- Docker
- Docker Compose

## Setup & Run

1. **Start the database**
   ```bash
   cd frontend
   docker compose up -d
   ```

2. **Run database migrations**
   ```bash
   npx prisma db push
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the application**
   ```bash
   npm run start:desktop
   ```
