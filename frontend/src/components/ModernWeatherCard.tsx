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
  Compass,
} from "lucide-react";

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

interface ModernWeatherCardProps {
  weatherData: WeatherData;
  unit: "C" | "F";
  convertTemp: (temp: number) => number;
  darkMode: boolean;
}

const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes("rain")) return <CloudRain className="w-8 h-8" />;
  if (conditionLower.includes("snow")) return <CloudSnow className="w-8 h-8" />;
  if (conditionLower.includes("cloud")) return <Cloud className="w-8 h-8" />;
  return <Sun className="w-8 h-8" />;
};

const getWindDirection = (degrees: number) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

const ModernWeatherCard: React.FC<ModernWeatherCardProps> = ({
  weatherData,
  unit,
  convertTemp,
  darkMode,
}) => {
  if (!weatherData) return null;

  const { location, weather } = weatherData;
  const currentTemp = convertTemp(Math.round(weather.temperature.current));
  const feelsLike = convertTemp(Math.round(weather.temperature.feels_like));
  const minTemp = convertTemp(Math.round(weather.temperature.min));
  const maxTemp = convertTemp(Math.round(weather.temperature.max));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl overflow-hidden shadow-lg ${
        darkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 to-blue-100"
      }`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {location.city}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {location.country}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              {getWeatherIcon(weather.condition)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
              {weather.description}
            </p>
          </div>
        </div>

        {/* Temperature */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
            {currentTemp}°{unit}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Feels like {feelsLike}°{unit}
          </p>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <Thermometer className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Min/Max
              </p>
              <p className="text-gray-800 dark:text-white font-medium">
                {minTemp}°/{maxTemp}°
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Humidity
              </p>
              <p className="text-gray-800 dark:text-white font-medium">
                {weather.humidity}%
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <Wind className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Wind</p>
              <p className="text-gray-800 dark:text-white font-medium">
                {weather.wind.speed} m/s
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <Compass className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Direction
              </p>
              <p className="text-gray-800 dark:text-white font-medium">
                {getWindDirection(weather.wind.deg)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernWeatherCard;
