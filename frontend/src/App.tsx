import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import WeatherPage from "./pages/WeatherPage";
import WeatherHistory from "./components/WeatherHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppContent = () => {
  const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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
            user ? (
              <Navigate to="/weather" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
