import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, User, Shield } from "lucide-react";
import { User as UserType } from "../../types";
import { useAuth } from "@context/AuthContext";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

const Navbar: FC<NavbarProps> = ({
  darkMode,
  toggleDarkMode,
  user,
  setUser,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
    <nav
      className={`sticky top-0 z-50 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-md`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Weather App
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${
                darkMode
                  ? "text-yellow-400 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {user ? (
              <>
                <Link
                  to="/weather"
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Weather
                </Link>
                <Link
                  to="/history"
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  History
                </Link>
                {user.isAdmin && (
                  <button
                    onClick={handleAdminClick}
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? "text-white hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
