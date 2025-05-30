import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  user: any;
  children: React.ReactNode;
}

const PublicRoute = ({ user, children }: PublicRouteProps) => {
  if (user) {
    return <Navigate to="/weather" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
