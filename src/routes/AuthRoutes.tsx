import { Route } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";


const AuthRoutes = () => {
  return (
    <>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  );
};

export default AuthRoutes;