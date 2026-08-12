import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import ProtectedRoute from "./ProtectedRoute";
import WebsiteRoutes from "./WebsiteRoutes";
import { ScrollToTop } from "../components/ScrollToTop";
import { TopProgressBar } from "../components/TopProgressBar";
import CustomerRoutes from "./CustomerRoutes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TopProgressBar />
      <Routes>
        <Route element={<ProtectedRoute allowedRole="admin"/>}>{AdminRoutes()}</Route>

        {/* {UserRoutes()} */}

        {AuthRoutes()}
        {WebsiteRoutes()}
        <Route element={<ProtectedRoute allowedRole="user" />}>
        {CustomerRoutes()}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
