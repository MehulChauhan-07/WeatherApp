import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  Search,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

interface StatsCardsProps {
  darkMode: boolean;
}

interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalSearches: number;
}

const API_BASE_URL = "http://localhost:5000/api";

const StatsCards: FC<StatsCardsProps> = ({ darkMode }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/users/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data.stats);
    } catch (err) {
      setError("Failed to fetch statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "blue",
    },
    {
      label: "Admins",
      value: stats?.totalAdmins || 0,
      icon: ShieldCheck,
      color: "green",
    },
    {
      label: "Total Searches",
      value: stats?.totalSearches || 0,
      icon: Search,
      color: "purple",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center"
      >
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {stat.label}
              </p>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full bg-${stat.color}-100`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
