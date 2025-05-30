import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import UserTable from "@components/Admin/UserTable";
import HistoryTable from "@components/Admin/HistoryTable";
import Statistics from "@components/Admin/Statistics";
import axios from "axios";

interface AdminDashboardProps {
  darkMode: boolean;
}

const API_BASE_URL = "http://localhost:5000/api";

const AdminDashboard: FC<AdminDashboardProps> = ({ darkMode }) => {
  const [activeSection, setActiveSection] = useState("statistics");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSearches: 0,
    averageSearchesPerUser: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  // Use separate loading/error states for other sections if needed
  // const [usersLoading, setUsersLoading] = useState(false);
  // const [usersError, setUsersError] = useState("");
  // etc.

  const location = useLocation();
  const navigate = useNavigate();

  console.log("AdminDashboard rendered. Current activeSection:", activeSection);
  console.log("Current location pathname:", location.pathname);

  // Effect to update active section based on URL changes
  useEffect(() => {
    const path = location.pathname.split("/").pop() || "statistics";
    console.log("useEffect [location]: Detected path from URL:", path);
    setActiveSection(path);
  }, [location]);

  // Effect to fetch stats when the statistics section is active
  useEffect(() => {
    console.log(
      "useEffect [activeSection]: activeSection is",
      activeSection,
      "- fetching stats if needed"
    );
    if (activeSection === "statistics") {
      fetchStats();
    } else {
      // Optionally clear stats data or set to default when navigating away
      setStats({ totalUsers: 0, totalSearches: 0, averageSearchesPerUser: 0 });
      setStatsError("");
      setStatsLoading(false); // Ensure loading is false when not fetching
    }
  }, [activeSection]); // Dependency array includes activeSection

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/users/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Stats API response data:", response.data);

      if (response.data.success) {
        const { totalUsers, totalSearches, averageSearchesPerUser } =
          response.data;
        setStats({
          totalUsers: totalUsers || 0,
          totalSearches: totalSearches || 0,
          averageSearchesPerUser: averageSearchesPerUser || 0,
        });
      } else {
        setStatsError(response.data.message || "Failed to fetch statistics");
      }
    } catch (err: any) {
      console.error("Failed to fetch stats:", err);
      setStatsError(
        err.response?.data?.message || "Failed to fetch statistics"
      );
    } finally {
      setStatsLoading(false);
    }
  };

  const sections = [
    { id: "statistics", label: "Statistics", path: "statistics" },
    { id: "users", label: "Users", path: "users" },
    { id: "history", label: "History", path: "history" },
  ];

  const handleSectionChange = (section: string) => {
    console.log(
      "handleSectionChange: Attempting to change section to:",
      section
    );
    // setActiveSection(section); // Rely on URL change effect
    navigate(`/admin/${section}`);
  };

  console.log(
    "Rendering section:",
    activeSection,
    "Loading:",
    statsLoading,
    "Error:",
    statsError,
    "Stats data:",
    stats
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage users, view statistics, and monitor search history
        </p>
      </motion.div>

      <div className="flex space-x-4 mb-8">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSectionChange(section.path)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeSection === section.path
                ? "bg-blue-500 text-white"
                : darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {section.label}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Conditional rendering based on activeSection state */}
        {activeSection === "statistics" && (
          <>
            {statsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : statsError ? (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                {statsError}
              </div>
            ) : (
              // Only render Statistics component if stats data is available and not loading/error
              stats && <Statistics stats={stats} darkMode={darkMode} />
            )}
          </>
        )}
        {activeSection === "users" && <UserTable darkMode={darkMode} />}
        {activeSection === "history" && <HistoryTable darkMode={darkMode} />}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
