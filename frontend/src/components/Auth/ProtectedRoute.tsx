import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { User } from "../../types";

interface ProtectedRouteProps {
  children: ReactNode;
  user: User | null;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
