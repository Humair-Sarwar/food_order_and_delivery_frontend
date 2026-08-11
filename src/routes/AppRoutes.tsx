import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import ProtectedRoute from "./ProtectedRoute";
import WebsiteRoutes from "./WebsiteRoutes";
import { ScrollToTop } from "../components/ScrollToTop";
import { TopProgressBar } from "../components/TopProgressBar";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TopProgressBar />
      <Routes>
        <Route element={<ProtectedRoute />}>
          {AdminRoutes()}
        </Route>

        {/* {UserRoutes()} */}

        {AuthRoutes()}
        {WebsiteRoutes()}

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;