import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Weather from "./pages/WeatherPage";
import UserHistory from "./components/UserHistory";
// import Profile from "./components/Profile";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminRoute from "./components/Auth/AdminRoute";
import { User } from "./types";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          // First try to use stored user data
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Then verify with the server
          const response = await axios.get<User>(
            "http://localhost:5000/api/users/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Update user data if needed
          if (response.data) {
            const updatedUser = {
              ...response.data,
              isAdmin: Boolean(response.data.isAdmin),
            };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className={darkMode ? "dark" : ""}>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <Navbar
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              user={user}
              setUser={setUser}
            />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home darkMode={darkMode} />} />
                <Route
                  path="/login"
                  element={<Login setUser={setUser} darkMode={darkMode} />}
                />
                <Route
                  path="/register"
                  element={<Signup setUser={setUser} darkMode={darkMode} />}
                />
                <Route
                  path="/weather"
                  element={
                    <ProtectedRoute user={user}>
                      {user && (
                        <Weather
                          user={user}
                          darkMode={darkMode}
                          toggleDarkMode={toggleDarkMode}
                        />
                      )}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute user={user}>
                      <UserHistory darkMode={darkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <Routes>
                        <Route
                          index
                          element={<AdminDashboard darkMode={darkMode} />}
                        />
                        <Route
                          path="statistics"
                          element={<AdminDashboard darkMode={darkMode} />}
                        />
                        <Route
                          path="history"
                          element={<AdminDashboard darkMode={darkMode} />}
                        />
                        <Route
                          path="users"
                          element={<AdminDashboard darkMode={darkMode} />}
                        />
                      </Routes>
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                className: darkMode ? "dark" : "",
                style: {
                  background: darkMode ? "#1F2937" : "#fff",
                  color: darkMode ? "#fff" : "#000",
                },
              }}
            />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
