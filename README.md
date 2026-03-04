# basic-rolebase-authentication-express-mongodb

A simple Express & MongoDB authentication example with role-based structure.  
The codebase demonstrates user registration, login, JWT‑based auth, and cookie support.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (LTS) or [Bun](https://bun.com) installed globally
- A running **MongoDB** instance (local or cloud)
- An empty `.env` file in the project root with the values listed below

### Environment Variables

Create a `.env` file containing:

```
MONGO_URI=mongodb://localhost:27017/your-db-name
JWT_SECRET=someVerySecretString
JWT_EXPIRES_IN=1d          # or any valid jwt expires format
NODE_ENV=development       # set to "production" in production
```

### Install dependencies

```bash
# using bun
bun install

# or using npm/yarn
npm install
# yarn install
```

### Running the server

```bash
# development mode (restarts on changes)
npm run dev        # this actually runs: nodemon --exec bun index.js
# or directly with bun
bun run index.js
```

The API listens on port **5000** by default.

---

## 🧩 API Endpoints

| Method | Path                 | Description                  | Auth required |
| ------ | -------------------- | ---------------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user          | no            |
| POST   | `/api/auth/login`    | Log in and set auth cookie   | no            |
| POST   | `/api/auth/logout`   | Clear auth cookie            | no            |
| GET    | `/api/me`            | Get current user (protected) | yes           |

> Protected routes expect an HTTP-only cookie named `token` returned by the
> login/registration endpoints. You can also supply `Authorization: Bearer <token>`
> by uncommenting the relevant lines in `middleware/auth.js`.

---

## 🛠 Project Structure

```
config/        # database connection
controllers/   # route handlers (authController.js)
middleware/    # auth middleware (JWT verification)
/models/        # Mongoose schemas (User.js)
routes/         # express routers
/utils/         # helpers (token, cookies)
```

---

## 📦 Branches

This repository uses `main` as the primary branch. The `tonmoy` branch contains
the working code that has now been merged into `main`.

---

Feel free to clone, modify, and extend! Contributions welcome.  
Happy coding! 🎉
