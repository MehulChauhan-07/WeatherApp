# Weather App Backend

A Node.js backend server for a weather application with user authentication and location management.

## Features

- User authentication (register/login) with JWT
- Save and manage favorite locations
- Real-time weather data from OpenWeatherMap API
- Protected routes for user data
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenWeatherMap API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/weather-app
   JWT_SECRET=your_jwt_secret_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user

### Locations (Protected)

- `GET /api/locations` - Get user's saved locations
- `POST /api/locations` - Save a new location
- `DELETE /api/locations/:id` - Delete a location

### Weather

- `GET /api/weather?city=CityName` - Get weather by city name
- `GET /api/weather?lat=latitude&lon=longitude` - Get weather by coordinates

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error
