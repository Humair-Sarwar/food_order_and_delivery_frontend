import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

interface ProtectedRouteProps {
  // Optional role prop to restrict access based on user type
  allowedRole?: string;
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const location = useLocation();
  // Retrieve token and role from the Redux authentication state
  const { token, role } = useAppSelector((state) => state.auth);

  // If the user is not authenticated, redirect them to the login page
  // Store the current location to redirect back after login
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If a specific role is required and the current user's role does not match, 
  // redirect them directly to the login page regardless of who is logged in.
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Allow access to the requested route if all checks pass
  return <Outlet />;
};

export default ProtectedRoute;