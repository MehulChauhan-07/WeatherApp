# ⛅ WeatherApp

A full-stack weather tracking application with a **React/Vite/TypeScript frontend** and an **Express/MongoDB backend**.

> 🌤️ Get real-time weather by city, manage search history, and explore admin-level insights!

---

## 📑 Table of Contents

- [🌟 Features](#-features)
- [🚀 Getting Started](#-getting-started)
  - [📦 Prerequisites](#-prerequisites)
  - [📥 Installation](#-installation)
  - [🔐 Environment Variables](#-environment-variables)
  - [▶️ Running the Application](#-running-the-application)
- [🛠️ Backend API Endpoints](#-backend-api-endpoints)
  - [🔐 Authentication](#authentication)
  - [🌦️ Weather](#weather)
  - [🧑‍💼 Admin](#admin)

---

## 🌟 Features

- 🔐 User Authentication (Register/Login)
- 🌇 Fetch current weather by city (via OpenWeatherMap API)
- 💾 Save and view user-specific weather search history
- 🗑️ Delete individual search records
- 🧑‍💼 Admin Dashboard:
  - View & manage all users
  - Toggle user roles (Admin/User)
  - Delete users or history entries
  - View application-wide statistics
- 💅 Modern UI with Tailwind CSS, ShadCN UI, Lucide Icons, and Framer Motion
- 📱 Responsive Design

---

## 🚀 Getting Started

Follow the instructions below to run the project locally for development/testing.

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) installed and running
- API key from [OpenWeatherMap](https://openweathermap.org/api)

---

### 📥 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/mehulchauhan-07/weatherapp.git
   cd weatherapp
   ```

2. **Install frontend dependencies**:

   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd ../backend
   npm install
   ```

---

### 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=<Your MongoDB connection string>
JWT_SECRET=<Strong secret string>
WEATHER_API_KEY=<Your OpenWeatherMap API key>
PORT=5000
```

---

### ▶️ Running the Application

1. **Start the backend server**:

   ```bash
   cd backend
   npm start       # or use: npm run dev (if using nodemon)
   ```

2. **Start the frontend server**:

   ```bash
   cd ../frontend
   npm run dev
   ```

3. Open your browser at: `http://localhost:5173`

---

## 🛠️ Backend API Endpoints

The backend API is served at `http://localhost:5000`.

---

### 🔐 Authentication

#### `POST /api/users/register`

- **Description:** Register a new user.
- **Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

#### `POST /api/users/login`

- **Description:** Login a user.
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### `GET /api/users/profile`

- **Description:** Get current user profile.
- **Access:** Private (JWT required)

#### `PATCH /api/users/profile`

- **Description:** Update profile info (partial updates).
- **Body (any field optional):**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

---

### 🌦️ Weather

#### `GET /api/weather?city={city}`

- **Description:** Fetch weather data and log to user history.
- **Query Param:** `city` (required)

#### `GET /api/weather/history`

- **Description:** Get logged-in user's search history.
- **Query Params (optional):**
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)

#### `DELETE /api/weather/history/:id`

- **Description:** Delete a specific weather history record.

---

### 🧑‍💼 Admin

> All admin routes require valid JWT and `isAdmin: true`

#### `GET /api/users/admin/users`

- View all users.

#### `GET /api/users/admin/users/:userId`

- View user by ID.

#### `PATCH /api/users/admin/users/:userId/admin`

- Toggle admin status.
- **Body:**
  ```json
  {
    "isAdmin": true
  }
  ```

#### `DELETE /api/users/admin/users/:userId`

- Delete user by ID.

#### `GET /api/weather/history/all`

- Get full history from all users.
- Supports pagination via `page` and `limit`.

#### `DELETE /api/users/admin/users/:userId/history`

- Delete all history for a user.

#### `GET /api/users/admin/stats`

- View overall app stats: total users, searches, etc.

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for more info.

---

## 📬 Contact

For issues, questions, or collaboration, please reach out via GitHub or open an issue.

---

> 🌐 _Stay informed. Stay prepared. With WeatherApp, weather data is always at your fingertips!_
