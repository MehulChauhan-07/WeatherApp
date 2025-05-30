import { useState, useEffect } from "react";

interface CachedWeatherData {
  data: any;
  timestamp: number;
}

const CACHE_KEY = "weather_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_ITEMS = 5;

export const useWeatherCache = () => {
  const [cache, setCache] = useState<Record<string, CachedWeatherData>>({});

  useEffect(() => {
    const savedCache = localStorage.getItem(CACHE_KEY);
    if (savedCache) {
      setCache(JSON.parse(savedCache));
    }
  }, []);

  const saveToCache = (city: string, data: any) => {
    const newCache = {
      ...cache,
      [city.toLowerCase()]: {
        data,
        timestamp: Date.now(),
      },
    };

    // Keep only the most recent 5 items
    const entries = Object.entries(newCache);
    if (entries.length > MAX_CACHE_ITEMS) {
      const sortedEntries = entries.sort(
        (a, b) => b[1].timestamp - a[1].timestamp
      );
      const trimmedEntries = sortedEntries.slice(0, MAX_CACHE_ITEMS);
      const trimmedCache = Object.fromEntries(trimmedEntries);
      setCache(trimmedCache);
      localStorage.setItem(CACHE_KEY, JSON.stringify(trimmedCache));
    } else {
      setCache(newCache);
      localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
    }
  };

  const getFromCache = (city: string) => {
    const cachedData = cache[city.toLowerCase()];
    if (!cachedData) return null;

    const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
    if (isExpired) {
      const newCache = { ...cache };
      delete newCache[city.toLowerCase()];
      setCache(newCache);
      localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
      return null;
    }

    return cachedData.data;
  };

  const clearCache = () => {
    setCache({});
    localStorage.removeItem(CACHE_KEY);
  };

  return {
    getFromCache,
    saveToCache,
    clearCache,
    cachedCities: Object.keys(cache),
  };
};
