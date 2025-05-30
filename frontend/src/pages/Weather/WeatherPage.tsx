import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar";
import ModernWeatherCard from "../components/ModernWeatherCard";
import LoadingSpinner from "../components/LoadingSpinner";
import RecentSearches from "../components/RecentSearches";
import { useAuth } from "../context/AuthContext";
import { useWeatherCache } from "../hooks/useWeatherCache";

interface WeatherData {
  data: {
    name: string;
    sys: {
      country: string;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
  };
}

interface TransformedWeatherData {
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
  const [weather, setWeather] = useState<TransformedWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getFromCache, saveToCache, clearCache, cachedCities } =
    useWeatherCache();

  const fetchWeather = useCallback(
    async (city: string) => {
      try {
        setLoading(true);
        setError("");
        setWeather(null);

        // Check cache first
        const cachedData = getFromCache(city);
        if (cachedData) {
          setWeather(cachedData);
          setLoading(false);
        }

        const token = localStorage.getItem("token");
        const response = await axios.get<WeatherData>(
          `http://localhost:5000/api/weather?city=${city}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Transform the data to match the expected structure
        const transformedData = {
          location: {
            city: response.data.data.name,
            country: response.data.data.sys.country,
          },
          weather: {
            condition: response.data.data.weather[0].main,
            description: response.data.data.weather[0].description,
            temperature: {
              current: response.data.data.main.temp,
              feels_like: response.data.data.main.feels_like,
              min: response.data.data.main.temp_min,
              max: response.data.data.main.temp_max,
            },
            humidity: response.data.data.main.humidity,
            wind: {
              speed: response.data.data.wind.speed,
              deg: response.data.data.wind.deg,
            },
          },
        };

        // Save to cache and update state
        saveToCache(city, transformedData);
        setWeather(transformedData);
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
    [navigate, logout, getFromCache, saveToCache]
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Weather App
          </h1>
          <div className="flex space-x-4">
            <span className="text-gray-800 dark:text-white">
              Welcome, {user.username}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/history")}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center"
            >
              <FaHistory className="mr-2" />
              History
            </motion.button>
            {user.isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/admin/history")}
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                Admin Dashboard
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleUnit}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              °{unit}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </motion.button>
          </div>
        </motion.div>

        <SearchBar onSearch={fetchWeather} />

        <RecentSearches
          searches={cachedCities}
          onSelect={fetchWeather}
          onClear={clearCache}
          darkMode={darkMode}
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-8"
            >
              <LoadingSpinner />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          ) : weather ? (
            <motion.div
              key="weather"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto mt-8"
            >
              <ModernWeatherCard
                weatherData={weather}
                unit={unit}
                convertTemp={convertTemp}
                darkMode={darkMode}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WeatherPage;
