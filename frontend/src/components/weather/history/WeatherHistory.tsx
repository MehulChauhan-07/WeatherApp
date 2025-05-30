import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModernWeatherHistoryCard from "../../ModernWeatherHistoryCard";

interface WeatherHistoryProps {
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
      deg: number;
    };
  };
}

interface HistoryEntry {
  _id: string;
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

interface HistoryResponse {
  history: HistoryEntry[];
  total: number;
  page: number;
  totalPages: number;
}

const WeatherHistory: React.FC<WeatherHistoryProps> = ({ darkMode }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const fetchHistory = async (pageNum: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view history");
        navigate("/login");
        return;
      }

      const response = await axios.get<HistoryResponse>(
        `http://localhost:5000/api/weather/history?page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(response.data.history);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (error) {
      console.error("History fetch error:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(
            error.response?.data?.message || "Error fetching weather history"
          );
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteHistory = async (id: string) => {
    setSelectedHistoryId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedHistoryId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to delete history");
        navigate("/login");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/weather/history/${selectedHistoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove the deleted history from the state
        setHistory((prevHistory) =>
          prevHistory.filter((entry) => entry._id !== selectedHistoryId)
        );
        setShowDeleteModal(false);
        setSelectedHistoryId(null);
      } else {
        setError(response.data.message || "Failed to delete history");
      }
    } catch (error) {
      console.error("Delete history error:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(
            error.response?.data?.message || "Error deleting weather history"
          );
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Weather History
          </h1>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {history.map((entry) => (
                  <ModernWeatherHistoryCard
                    key={entry._id}
                    historyData={entry}
                    darkMode={darkMode}
                    onDelete={handleDeleteHistory}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg shadow-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this weather history entry? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedHistoryId(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherHistory;
