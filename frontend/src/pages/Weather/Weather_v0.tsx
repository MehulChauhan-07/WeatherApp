import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaHistory, FaSignOutAlt } from "react-icons/fa";
import SearchBar from "@components/weather/SearchBar";
import WeatherCard from "@components/WeatherCard";
import LoadingSpinner from "@components/common/LoadingSpinner";
import { useAuth } from "@context/AuthContext";

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
      deg: number;
    };
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface WeatherPageProps {
  user: User;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const WeatherPage = ({ user, darkMode, toggleDarkMode }: WeatherPageProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchWeather = useCallback(
    async (city: string) => {
      try {
        setLoading(true);
        setError("");
        setWeather(null); // Clear previous weather data

        const token = localStorage.getItem("token");
        const response = await axios.get<WeatherData>(
          `http://localhost:5000/api/weather?city=${city}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Ensure we're setting the state with the new data
        setWeather(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError("Please login to check weather");
            logout();
            navigate("/login");
          } else {
            setError(
              err.response?.data?.message || "Error fetching weather data"
            );
          }
        } else {
          setError("An unexpected error occurred");
        }
        setWeather(null);
      } finally {
        setLoading(false);
      }
    },
    [navigate, logout]
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleUnit = () => {
    setUnit(unit === "C" ? "F" : "C");
  };

  const convertTemp = (temp: number): number => {
    if (unit === "F") {
      return Math.round((temp * 9) / 5 + 32);
    }
    return temp;
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Weather App
          </h1>
          <div className="flex space-x-4">
            <span className="text-gray-800 dark:text-white">
              Welcome, {user.username}
            </span>
            <button
              onClick={() => navigate("/history")}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center"
            >
              <FaHistory className="mr-2" />
              History
            </button>
            {user.isAdmin && (
              <button
                onClick={() => navigate("/admin/history")}
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                Admin Dashboard
              </button>
            )}
            <button
              onClick={toggleUnit}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              °{unit}
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        <SearchBar onSearch={fetchWeather} />
        {loading && <LoadingSpinner />}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {weather && !loading && (
          <WeatherCard
            weatherData={weather}
            unit={unit}
            convertTemp={convertTemp}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
