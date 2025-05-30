export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface SearchHistory {
  id: string;
  user: {
    username: string;
    email: string;
  };
  city: string;
  country: string;
  searchDate: string;
}

export interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalSearches: number;
}
