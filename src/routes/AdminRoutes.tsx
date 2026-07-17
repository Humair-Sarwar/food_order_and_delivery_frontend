import { Route } from "react-router-dom";



import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../layouts/AdminLayout";
import Restaurants from "../pages/admin/restaurants/Restaurants";
import Media from "../pages/admin/Media";

const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>

      <Route
        path="dashboard"
        element={<Dashboard />}
      />

      <Route
        path="restaurants"
        element={<Restaurants />}
      />

      <Route
        path="media"
        element={<Media />}
      />

    </Route>
  );
};

export default AdminRoutes;