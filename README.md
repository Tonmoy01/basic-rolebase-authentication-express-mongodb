# basic-rolebase-authentication-express-mongodb

A comprehensive Express.js & MongoDB authentication system with role-based access control.  
Includes user registration, login/logout, password reset via email, JWT authentication, and admin/user role separation.

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

# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com   # or your SMTP provider
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourapp.com
APP_URL=http://localhost:3000   # frontend URL for password reset links
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

### Authentication Routes (`/api/auth`)

| Method | Path                     | Description                | Auth required |
| ------ | ------------------------ | -------------------------- | ------------- |
| POST   | `/register`              | Register a new user        | no            |
| POST   | `/login`                 | Log in and set auth cookie | no            |
| POST   | `/logout`                | Clear auth cookie          | no            |
| POST   | `/forgot-password`       | Send password reset email  | no            |
| POST   | `/reset-password/:token` | Reset password with token  | no            |

### User Routes (`/api/user`)

| Method | Path  | Description                            | Auth required |
| ------ | ----- | -------------------------------------- | ------------- |
| GET    | `/me` | Get current authenticated user profile | yes           |

### Admin Routes (`/api/admin`)

| Method | Path         | Description            | Auth required | Role       |
| ------ | ------------ | ---------------------- | ------------- | ---------- |
| GET    | `/dashboard` | Access admin dashboard | yes           | admin only |

> **Authentication:** Protected routes expect an HTTP-only cookie named `token` set during login/registration.
> The `authorize` middleware enforces role-based access control (admin, user).

---

## ✨ Features

- **User Authentication** - Register, login, logout functionality
- **Password Reset** - Forgot password flow with email verification and token-based reset
- **Role-Based Access Control (RBAC)** - Admin and user roles with middleware authorization
- **JWT & HTTP-only Cookies** - Secure token management
- **Email Integration** - Nodemailer support for sending password reset emails
- **MongoDB Integration** - User data persistence with Mongoose
- **Password Security** - Bcryptjs for password hashing
- **Protected Routes** - Middleware to authenticate and authorize requests

---

## 🔎 Current status (what's implemented right now)

- User registration (`POST /api/auth/register`) with password hashing and creation of access + refresh tokens.
- User login (`POST /api/auth/login`) with access + refresh tokens, refresh token hashed and stored on user record, and HTTP-only cookies set.
- Token refresh endpoint (`POST /api/auth/refresh`) issues new access and refresh tokens when a valid refresh cookie is present.
- Logout flow clears refresh token server-side and client cookies (`POST /api/auth/logout`).
- Password reset flow: `POST /api/auth/forgot-password` sends an email with a reset link (uses Nodemailer), and `POST /api/auth/reset-password/:token` verifies token and updates password.
- Role-based access control with `authorize` middleware and admin-only routes (`/api/admin`).
- User profile route (`GET /api/user/me`) protected by JWT cookie authentication.
- Nodemailer mailer utility is present (`utils/mailer.js`) and environment variables for SMTP are documented.
- Branches: `main` and `tonmoy` exist; working changes are on `tonmoy` and have been synced to `main`.

## 🛠 Project Structure

```
config/              # Database connection configuration
controllers/         # Route handlers
  ├── authController.js       # Register, login, logout
  └── passwordController.js   # Forgot & reset password
middleware/          # Authentication & authorization
  └── auth.js                 # JWT verification & role-based access
models/              # Mongoose schemas
  └── User.js                 # User schema with role & password reset fields
routes/              # Express routers
  ├── authRoutes.js           # Auth endpoints
  ├── adminRoutes.js          # Admin-only endpoints
  └── userRoutes.js           # User-protected endpoints
utils/               # Helper utilities
  ├── token.js                # JWT token generation
  ├── cookies.js              # HTTP-only cookie management
  └── mailer.js               # Email sending via Nodemailer
index.js             # Express app setup & server initialization
package.json         # Project dependencies
```

---

## 🧪 Testing the API

### 1. Register a user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John", "email":"john@example.com", "password":"securePass123"}'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com", "password":"securePass123"}'
```

This will set an HTTP-only `token` cookie.

### 3. Access protected route

```bash
curl -X GET http://localhost:5000/api/user/me \
  -H "Cookie: token=<your-jwt-token>"
```

### 4. Request password reset

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

_Note: Requires SMTP configuration in `.env`_

---

## 📦 Branches

This repository uses `main` as the primary branch. The `tonmoy` branch contains
the working code that has now been merged into `main`.

---

Feel free to clone, modify, and extend! Contributions welcome.  
Happy coding! 🎉
