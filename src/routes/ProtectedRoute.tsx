import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

interface ProtectedRouteProps {
  // Optional role prop to restrict access based on user type
  allowedRole?: string;
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  // Retrieve token and role from the Redux authentication state
  const { token, role } = useAppSelector((state) => state.auth);

  // If the user is not authenticated, redirect them to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and the current user's role does not match, 
  // redirect them directly to the login page regardless of who is logged in.
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // Allow access to the requested route if all checks pass
  return <Outlet />;
};

export default ProtectedRoute;