import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import Signup from "./components/Signup";
import WeatherPage from "./pages/WeatherPage";
import WeatherHistory from "./components/WeatherHistory";
import ProtectedRoute from "./components/ProtectedRoute";

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className={darkMode ? "dark" : ""}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/weather"
              element={
                user && (
                  <WeatherPage
                    user={user}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    onLogout={handleLogout}
                  />
                )
              }
            />
            <Route
              path="/history"
              element={
                user && (
                  <WeatherHistory
                    user={user}
                    darkMode={darkMode}
                    onBack={() => window.history.back()}
                  />
                )
              }
            />
          </Route>

          {/* Redirect root to weather page if authenticated, otherwise to login */}
          <Route
            path="/"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/weather" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
