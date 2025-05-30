import React from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  Clock,
  Trash2,
} from "lucide-react";

interface WeatherHistoryData {
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
  searchedAt: string;
  _id: string;
}

interface ModernWeatherHistoryCardProps {
  historyData: WeatherHistoryData;
  darkMode: boolean;
  onDelete?: (id: string) => void;
}

const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes("rain")) return <CloudRain className="w-6 h-6" />;
  if (conditionLower.includes("snow")) return <CloudSnow className="w-6 h-6" />;
  if (conditionLower.includes("cloud")) return <Cloud className="w-6 h-6" />;
  return <Sun className="w-6 h-6" />;
};

const ModernWeatherHistoryCard: React.FC<ModernWeatherHistoryCardProps> = ({
  historyData,
  darkMode,
  onDelete,
}) => {
  if (!historyData) return null;

  const { location, weather, searchedAt, _id } = historyData;
  const searchDate = new Date(searchedAt).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg overflow-hidden shadow-md ${
        darkMode
          ? "bg-gray-800/50 hover:bg-gray-800/70"
          : "bg-white/50 hover:bg-white/70"
      } backdrop-blur-sm transition-colors duration-200`}
    >
      <div className="p-4">
        {/* Header with Location and Time */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {location.city}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {location.country}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{searchDate}</span>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(_id)}
                className="p-1 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                title="Delete history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Weather Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weather.condition)}
            <span className="text-gray-800 dark:text-white capitalize">
              {weather.description}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {Math.round(weather.temperature.current)}°C
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Feels like {Math.round(weather.temperature.feels_like)}°C
            </p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center space-x-1">
            <Thermometer className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">
              {Math.round(weather.temperature.min)}°/
              {Math.round(weather.temperature.max)}°
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">
              {weather.humidity}%
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">
              {weather.wind.speed} m/s
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernWeatherHistoryCard;
