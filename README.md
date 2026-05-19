ShortyURL — URL Shortener Service
A full-stack web application designed for instantaneous shortening of long URL addresses. The project was initially designed following the MVC (Model-View-Controller) architectural pattern and has been successfully migrated to a modern, reactive component-based SPA (Single Page Application) stack.

🛠 Technology Stack
Frontend
Vue 3 (Composition API using <script setup>) — Reactive frontend framework.

Vue Router — Client-side routing for Single Page Application navigation.

Vite — High-performance frontend build tool and dev server.

Bootstrap 5 & Bootstrap Icons — Fully responsive styling and modern iconography.

Backend
Node.js — JavaScript runtime environment.

Express — Minimalist web framework for building RESTful APIs.

SQLite3 — Lightweight, file-based relational database (stored in shorty.db).

Bcrypt — Secure, salted hashing mechanism for user passwords.

JSON Web Tokens (JWT) — Stateless user authentication using access tokens.

Cookie-Parser — Middleware for handling and reading secure HTTP cookies on the server.

🚀 Key Features & Business Logic
Dynamic User Limits (Guest vs. Authenticated):

Guest (Unauthenticated): Restricted to a maximum of 5 shortened links. These temporary limits are safely managed via the server's In-Memory storage. Once the limit is reached, the submission form dynamically locks, requesting the user to register.

Registered User: Enjoys unlimited URL shortening. All generated links are strictly linked to their unique userId inside the SQLite relational database.

Comprehensive URL CRUD Operations: Seamlessly create, read, update original target URLs, and delete records.

Smart Server-Side Pagination: Links are paginated in batches of 5 items per page directly on the backend using optimized database LIMIT and OFFSET queries. Includes frontend route safeguarding to prevent empty pages when the final item on a page is deleted.

Cookie-Based Authentication: The secure accessToken is stored natively within the browser's cookies (SameSite=Lax). On every page load, the global Header component dispatches a silent background request to /api/auth/me to synchronize session states.

Redirection Routing Engine: When navigating to a short URL format (e.g., http://localhost:4000/r/{short_code}), the backend captures the parameter, checks database/guest states, and executes a native server-side redirect (res.redirect) to the original website.

📁 Project Directory Structure
Plaintext
lab/
├── backend/
│   ├── db.js               # SQLite setup, database connections, and schema initialization (users, links)
│   ├── index.js            # Express app initialization, CORS policies, Middlewares, and REST API routes
│   ├── package.json        # Backend dependencies (express, cors, bcrypt, jsonwebtoken, cookie-parser)
│   └── shorty.db           # SQLite database binary file
│
├── frontend/
│   ├── src/
│   │   ├── assets/         # App logo and static media assets
│   │   ├── components/
│   │   │   ├── layout/     # Reusable global layout files (TheNavbar.vue, TheFooter.vue)
│   │   │   ├── auth/       # Modular UI form cards (RegisterCard.vue, LoginCard.vue)
│   │   │   ├── main/       # Core app modules (UrlTable.vue data table, UrlEditModal.vue modal popup)
|   |   |   └── ui/         # Input,radio selector ui component
│   │   ├── views/          # Route-level page components (HomeView, LoginView, RegisterView, ProfileView, AboutView)
│   │   ├── router/         # Vue Router configurations and client-side page routing
│   │   ├── App.vue         # Main entry component layout
│   │   └── main.js         # Frontend initialization entry point
│   ├── vite.config.js      # Vite compilation, environment configurations, and proxy settings
│   └── package.json        # Frontend dependencies (vue, vue-router, bootstrap)
💻 Installation & Local Setup
1. Backend Server Setup
⚠️ Important Note for macOS Users: Before launching the backend server, make sure to disable the native AirPlay Receiver system setting on your Mac (System Settings -> General -> AirDrop & AirPlay). It is known to conflict with and block standard local ports like 3000 or 5000.

Open your terminal, navigate to the backend folder, install dependencies, and spin up the server:

Bash
cd backend
npm install
node index.js
The server will bind to port 4000 (or your designated testing port). Your terminal output should display:

Plaintext
=== ShortyURL BACKEND RUNNING ON PORT 4000 ===
Successfully connected to SQLite Database (shorty.db)
2. Frontend Client Setup
Open a separate terminal window, navigate into the frontend folder, install dependencies, and launch the Vite build engine:

Bash
cd frontend
npm install
npm run dev
The client application will successfully spin up on your local hosting port: http://localhost:5173/.

📡 API Specification (Server Routes)
Authentication Endpoint Grid
POST /api/auth/register — Registers a new user (handles email deduplication, data validations, and password hashing via bcrypt).

POST /api/auth/login — Autenticates an existing user (compares bcrypt hashes, signs, and dispatches a secure JWT cookie).

GET /api/auth/me — Fetches active user data (name, email, sex, dob) by parsing and validating the incoming JWT cookie.

URL Management Endpoint Grid
GET /api/links?page=1 — Fetches current paginated links (5 rows per batch). Transparently scales output depending on guest or authenticated token structures.

POST /api/links — Shortens a long URL into an alphanumeric 6-character unique key (Max 5 items for guests, unlimited for accounts).

PUT /api/links/:id — Edits and overwrites the destination long URL for a specific record.

DELETE /api/links/:id — Destroys and cleans a URL mapping either from the database or from active guest memory structures.

Server Routing Redirect Engine
GET /r/:code — Catches short alphanumeric link extensions, resolves them against tracking indices, and triggers an absolute browser-level HTTP redirect to the original target destination.