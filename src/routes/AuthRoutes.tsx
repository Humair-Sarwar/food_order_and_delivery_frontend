import { Route } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import { PublicRoute } from "./PublicRoute";

const AuthRoutes = () => {
  return (
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
  );
};

export default AuthRoutes;