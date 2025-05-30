import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTemperatureHigh, FaWind, FaTint } from "react-icons/fa";

interface WeatherPageProps {
  darkMode: boolean;
}

interface WeatherData {
  location: {
    city: string;
    country: string;
  };
  weather: {
    condition: string;
    description: string;
    temperature: {
      current: number;
      feels_like: number;
      min: number;
      max: number;
    };
    humidity: number;
    wind: {
      speed: number;
      direction: number;
    };
  };
}

const WeatherPage: React.FC<WeatherPageProps> = ({ darkMode }) => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to search for weather");
        navigate("/login");
        return;
      }

      const response = await axios.get<WeatherData>(
        `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setWeatherData(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(
            error.response?.data?.message || "Error fetching weather data"
          );
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Weather Forecast
          </h1>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaSearch className="mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loading && weatherData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {weatherData.location.city}, {weatherData.location.country}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 capitalize mt-2">
                  {weatherData.weather.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <FaTemperatureHigh className="text-2xl text-blue-500 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Temperature
                    </h3>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-800 dark:text-white">
                      {Math.round(weatherData.weather.temperature.current)}°C
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Feels like{" "}
                      {Math.round(weatherData.weather.temperature.feels_like)}°C
                    </p>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <p>
                        Min: {Math.round(weatherData.weather.temperature.min)}°C
                      </p>
                      <p>
                        Max: {Math.round(weatherData.weather.temperature.max)}°C
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <FaTint className="text-xl text-blue-500 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Humidity
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                      {weatherData.weather.humidity}%
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <FaWind className="text-xl text-blue-500 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Wind
                      </h3>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-800 dark:text-white">
                        {weatherData.weather.wind.speed} m/s
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Direction: {weatherData.weather.wind.direction}°
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
