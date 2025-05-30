import React from "react";
import { FaTemperatureHigh, FaWind, FaTint } from "react-icons/fa";

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

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weatherData,
}) => {
  console.log("CurrentWeatherCard received data:", weatherData);

  if (!weatherData) {
    console.error("CurrentWeatherCard: No weather data provided");
    return null;
  }

  if (!weatherData.location || !weatherData.weather) {
    console.error(
      "CurrentWeatherCard: Invalid weather data structure",
      weatherData
    );
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Invalid weather data structure
      </div>
    );
  }

  const { location, weather } = weatherData;

  // Add debug log for rendering
  console.log("CurrentWeatherCard rendering with:", { location, weather });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition-all hover:scale-105">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          {location.city}, {location.country}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 capitalize mt-2">
          {weather.description}
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
              {Math.round(weather.temperature.current)}°C
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Feels like {Math.round(weather.temperature.feels_like)}°C
            </p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <p>Min: {Math.round(weather.temperature.min)}°C</p>
              <p>Max: {Math.round(weather.temperature.max)}°C</p>
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
              {weather.humidity}%
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
                {weather.wind.speed} m/s
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Direction: {weather.wind.direction}°
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;
