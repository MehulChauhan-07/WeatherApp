import { FC } from "react";
import { motion } from "framer-motion";
import { Users, Search, BarChart2 } from "lucide-react";

interface StatisticsProps {
  darkMode: boolean;
  stats: {
    totalUsers: number;
    totalSearches: number;
    averageSearchesPerUser: number;
  };
}

const Statistics: FC<StatisticsProps> = ({ darkMode, stats }) => {
  console.log("Statistics component received stats props:", stats);

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Searches",
      value: stats?.totalSearches || 0,
      icon: Search,
      color: "bg-green-500",
    },
    {
      title: "Avg. Searches/User",
      value: stats?.averageSearchesPerUser
        ? Number(stats.averageSearchesPerUser).toFixed(1)
        : "0.0",
      icon: BarChart2,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`rounded-lg shadow-lg p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {card.title}
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {card.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${card.color} text-white`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Statistics;
