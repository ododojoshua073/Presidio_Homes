# Presidio Real Estate 🏡

Real Estate project — a simple real-estate listing app with a React/Vite frontend and Node/Express + Prisma backend. This README includes quick setup, development commands, structure, and deployment tips — with emojis for readability. ✨

## 🚀 Quick Overview

- **What it is:** A full-stack property listing app (client + server) built with React, Vite, Node, Express, Prisma, and Auth0 for authentication.
- **Client:** Located in `client/` — Vite + React app, UI components, pages, and utilities.
- **Server:** Located in `server/` — Express API, controllers, Prisma ORM, and Auth0 configuration.

## ⚙️ Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: Prisma (see [server/prisma/schema.prisma](server/prisma/schema.prisma))
- Auth: Auth0 (see [server/config/auth0Config.js](server/config/auth0Config.js))
- Deployment: Vercel (configs present: `client/vercel.json`, `server/vercel.json`)

## 📁 Repository Structure

- `client/` — frontend app (Vite)
- `server/` — backend API, routes, controllers, Prisma
- `server/prisma/` — Prisma schema and migrations

## 🛠️ Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- A database supported by Prisma (or use SQLite during local development)
- Auth0 account (if you want to use Auth0 auth)

## 🏁 Local Setup

1. Clone the repo and open the project folder.

2. Install dependencies for both apps:

   - Server:

     ```bash
     cd server
     npm install
     ```

   - Client:
     ```bash
     cd ../client
     npm install
     ```

3. Configure environment variables for the server. Create a `.env` file in `server/` with keys similar to:

   - `DATABASE_URL` — Prisma database connection string
   - `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_AUDIENCE` — for Auth0
   - `SESSION_SECRET` — server session secret

4. Run Prisma migrations (from `server/`):

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the backend and frontend in separate terminals:

   - Server (from `server/`):

     ```bash
     npm run dev   # or `node index.js` depending on scripts
     ```

   - Client (from `client/`):
     ```bash
     npm run dev
     ```

6. Visit the app in your browser (default Vite port is `http://localhost:5173`).

## 🔧 Development Notes

- API controllers are in `server/controllers/` (see `resdCntrl.js`, `userCntrl.js`).
- Routes live in `server/routes/` (`residencyRoute.js`, `userRoute.js`).
- Frontend pages and components are in `client/src/pages/` and `client/src/components/`.
- Geo features and maps are implemented in `client/src/components/Map/` and `GeoCoderMarker` components.

## 📦 Deployment

- Both `client` and `server` contain `vercel.json` files for easy Vercel deployment.
- For production, set the environment variables in Vercel (Auth0 keys, `DATABASE_URL`, etc.).

## 🤝 Contributing

Feel free to open PRs or issues. Small steps to contribute:

1. Fork the repo
2. Create a feature branch
3. Add tests (if applicable)
4. Open a PR with a clear description

## 📝 Notes & References

- Prisma schema: [server/prisma/schema.prisma](server/prisma/schema.prisma)
- Auth0 config: [server/config/auth0Config.js](server/config/auth0Config.js)
- Server entry: [server/index.js](server/index.js)
- Client entry: [client/src/main.jsx](client/src/main.jsx)

## 📬 Contact

If you want help or improvements, open an issue or message the me. Happy hacking! 🛠️✨


