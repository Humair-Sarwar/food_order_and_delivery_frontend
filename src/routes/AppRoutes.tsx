import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        {AdminRoutes()}

        {/* {UserRoutes()} */}

        {AuthRoutes()}

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;