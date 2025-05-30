import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, AlertCircle, User } from "lucide-react";
import axios from "axios";

interface HistoryTableProps {
  darkMode: boolean;
}

interface SearchHistory {
  _id: string;
  userId: string;
  username: string;
  city: string;
  country: string;
  searchDate: string;
}

const API_BASE_URL = "http://localhost:5000/api";

const HistoryTable: FC<HistoryTableProps> = ({ darkMode }) => {
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<SearchHistory | null>(
    null
  );

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/users/admin/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Admin History API response:", response.data);

      if (response.data.success) {
        console.log("Admin History data received:", response.data.history);
        setHistory(response.data.history || []);
      } else {
        setError(response.data.message || "Failed to fetch history");
      }
    } catch (err: any) {
      console.error("Failed to fetch admin history:", err);
      setError(err.response?.data?.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async () => {
    if (!selectedHistory) return;

    try {
      console.log(
        "Attempting to delete history entry with id:",
        selectedHistory._id
      );

      const token = localStorage.getItem("token");
      console.log("Using token:", token);
      const url = `${API_BASE_URL}/weather/history/${selectedHistory._id}`;
      console.log("DELETE request to URL:", url);

      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Delete History API response:", response.data);

      if (response.data.success) {
        console.log(
          "History entry deleted successfully with id:",
          selectedHistory._id
        );
        setHistory((prevHistory) =>
          prevHistory.filter((item) => item._id !== selectedHistory._id)
        );
        setShowDeleteModal(false);
        setSelectedHistory(null);
      } else {
        console.error("Delete failed:", response.data.message);
        setError(response.data.message || "Failed to delete history entry");
      }
    } catch (err: any) {
      console.error("Failed to delete history entry:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.response?.data?.message || "Failed to delete history entry");
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`rounded-lg shadow p-6 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Search History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">City</th>
                <th className="text-left py-3 px-4">Country</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredHistory.map((item) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`border-b ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {item.username}
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.city}</td>
                    <td className="py-3 px-4">{item.country}</td>
                    <td className="py-3 px-4">
                      {new Date(item.searchDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedHistory(item);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-lg shadow-xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="mb-6">
                Are you sure you want to delete this weather history entry? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedHistory(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteHistory}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryTable;
