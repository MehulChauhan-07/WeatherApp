# WeatherApp

This is a full-stack weather application with a React/Vite/TypeScript frontend and an Express backend.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Backend API Endpoints](#backend-api-endpoints)
  - [Authentication](#authentication)
  - [Weather](#weather)
  - [Admin](#admin)

## Features

- User Authentication (Register, Login)
- Fetch current weather by city
- Save user's weather search history
- User-specific weather history page with deletion
- Admin Dashboard:
  - View all users
  - Change user roles (Admin/User)
  - Delete users
  - View all weather search history
  - Delete individual history entries (Admin)
  - View application statistics
- Modern UI/UX with Tailwind CSS, Shadcn UI, Lucide Icons, and Framer Motion
- Responsive Design

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm installed.
- MongoDB installed and running.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd WeatherApp
   ```

2. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:

   ```bash
   cd ../backend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
MONGO_URI=<Your MongoDB Connection String>
JWT_SECRET=<A strong random string for JWT>
WEATHER_API_KEY=<Your OpenWeatherMap API Key>
PORT=5000 # Or your desired port
```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm start # or npm run dev if using nodemon
   ```

2. Start the frontend development server:

   ```bash
   cd ../frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Backend API Endpoints

The backend API runs on `http://localhost:5000` (or your specified port).

### Authentication

- **`POST /api/users`**

  - **Description:** Register a new user.
  - **Access:** Public
  - **Request Body:**
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```

- **`POST /api/users/login`**

  - **Description:** Authenticate and login a user.
  - **Access:** Public
  - **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

- **`GET /api/users/profile`**

  - **Description:** Get user profile data.
  - **Access:** Private (requires JWT in Authorization header)

- **`PATCH /api/users/profile`**
  - **Description:** Update user profile data.
  - **Access:** Private (requires JWT in Authorization header)
  - **Request Body:** (fields are optional)
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```

### Weather

- **`GET /api/weather`**

  - **Description:** Get current weather by city and save to history.
  - **Access:** Private (requires JWT in Authorization header)
  - **Query Parameters:**
    - `city`: The name of the city (required)

- **`GET /api/weather/history`**

  - **Description:** Get the logged-in user's weather search history.
  - **Access:** Private (requires JWT in Authorization header)
  - **Query Parameters:** (optional, for pagination)
    - `page`: Page number (default: 1)
    - `limit`: Number of items per page (default: 10)

- **`DELETE /api/weather/history/:id`**
  - **Description:** Delete a specific weather history entry for the logged-in user.
  - **Access:** Private (requires JWT in Authorization header)
  - **URL Parameters:**
    - `id`: The ID of the history entry to delete

### Admin

- **`GET /api/users/admin/users`**

  - **Description:** Get a list of all users.
  - **Access:** Private/Admin (requires JWT and admin role)

- **`GET /api/users/admin/users/:userId`**

  - **Description:** Get a specific user by ID.
  - **Access:** Private/Admin (requires JWT and admin role)
  - **URL Parameters:**
    - `userId`: The ID of the user to fetch

- **`PATCH /api/users/admin/users/:userId/admin`**

  - **Description:** Toggle the admin status of a user.
  - **Access:** Private/Admin (requires JWT and admin role)
  - **URL Parameters:**
    - `userId`: The ID of the user to update
  - **Request Body:**
    ```json
    {
      "isAdmin": "boolean"
    }
    ```

- **`DELETE /api/users/admin/users/:userId`**

  - **Description:** Delete a user by ID.
  - **Access:** Private/Admin (requires JWT and admin role)
  - **URL Parameters:**
    - `userId`: The ID of the user to delete

- **`GET /api/weather/history/all`**

  - **Description:** Get all users' weather search history.
  - **Access:** Private/Admin (requires JWT and admin role)
  - **Query Parameters:** (optional, for pagination)
    - `page`: Page number (default: 1)
    - `limit`: Number of items per page (default: 10)

- **`DELETE /api/users/admin/history/:id`**

  - **Description:** Delete a specific history entry by ID (Admin).
  - **Access:** Private/Admin (requires JWT and admin role)
  - **URL Parameters:**
    - `id`: The ID of the history entry to delete

- **`GET /api/users/admin/stats`**
  - **Description:** Get application statistics (e.g., total users, total searches).
  - **Access:** Private/Admin (requires JWT and admin role)
