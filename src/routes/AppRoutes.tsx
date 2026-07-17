import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route element={<ProtectedRoute />}>
          {AdminRoutes()}
        </Route>

        {/* {UserRoutes()} */}

        {AuthRoutes()}

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;