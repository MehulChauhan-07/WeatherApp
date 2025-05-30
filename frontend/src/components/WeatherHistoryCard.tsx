import React from "react";

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
}

interface WeatherHistoryCardProps {
  historyData: WeatherHistoryData;
  darkMode: boolean;
}

const WeatherHistoryCard: React.FC<WeatherHistoryCardProps> = ({
  historyData,
  darkMode,
}) => {
  if (!historyData) {
    return null;
  }

  const { location, weather, searchedAt } = historyData;
  const searchDate = new Date(searchedAt).toLocaleString();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {location.city}, {location.country}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 capitalize">
            {weather.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Searched on: {searchDate}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {Math.round(weather.temperature.current)}°C
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Feels like {Math.round(weather.temperature.feels_like)}°C
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Min/Max</p>
          <p className="text-gray-800 dark:text-white">
            {Math.round(weather.temperature.min)}°/
            {Math.round(weather.temperature.max)}°
          </p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Humidity</p>
          <p className="text-gray-800 dark:text-white">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Wind</p>
          <p className="text-gray-800 dark:text-white">
            {weather.wind.speed} m/s
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherHistoryCard;
