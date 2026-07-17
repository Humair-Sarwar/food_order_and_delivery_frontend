import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../hooks/redux";

const ProtectedRoute = () => {
  const { token, role } = useAppSelector(
    (state) => state.auth
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === "user") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;