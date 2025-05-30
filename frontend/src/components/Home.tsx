import { FC } from "react";
import { Link } from "react-router-dom";
import { Cloud, Sun, Wind } from "lucide-react";

interface HomeProps {
  darkMode: boolean;
}

const Home: FC<HomeProps> = ({ darkMode }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1
          className={`text-4xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to Weather App
        </h1>
        <p
          className={`text-lg mb-8 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Get accurate weather forecasts for any location
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <Sun className="w-8 h-8 text-yellow-500 mb-2" />
            <p className={darkMode ? "text-white" : "text-gray-900"}>
              Real-time Weather
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <Cloud className="w-8 h-8 text-blue-500 mb-2" />
            <p className={darkMode ? "text-white" : "text-gray-900"}>
              Detailed Forecasts
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <Wind className="w-8 h-8 text-green-500 mb-2" />
            <p className={darkMode ? "text-white" : "text-gray-900"}>
              Wind Analysis
            </p>
          </div>
        </div>
        <Link
          to="/weather"
          className={`px-6 py-3 rounded-lg ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold transition-colors`}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
