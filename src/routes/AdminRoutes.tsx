import { Route } from "react-router-dom";



import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../layouts/AdminLayout";

const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>

      <Route
        path="dashboard"
        element={<Dashboard />}
      />

    </Route>
  );
};

export default AdminRoutes;