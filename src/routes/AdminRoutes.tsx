import { Route } from "react-router-dom";



import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../layouts/AdminLayout";
import Restaurants from "../pages/admin/restaurants/Restaurants";
import Media from "../pages/admin/Media";
import { Categories } from "../pages/admin/categories/Categories";
import FoodItems from "../pages/admin/food-items/FoodItems";
import { FoodItemForm } from "../pages/admin/food-items/FoodItemForm";
import { Customers } from "../pages/admin/Customers";
import AdminSettings from "../pages/admin/Settings";
import Orders from "../pages/admin/orders/Orders";
import OrderDetail from "../pages/admin/orders/OrderDetail";
import Report from "../pages/admin/Report";

const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>

      <Route
        path="dashboard"
        element={<Dashboard />}
      />

      <Route
        path="orders"
        element={<Orders />}
      />
      <Route
        path="order/:id"
        element={<OrderDetail />}
      />
      <Route
        path="reports"
        element={<Report />}
      />

      <Route
        path="restaurants"
        element={<Restaurants />}
      />
      <Route
        path="categories"
        element={<Categories />}
      />

      <Route
        path="food-items"
        element={<FoodItems />}
      />
      <Route
        path="food-items/create"
        element={<FoodItemForm />}
      />
      <Route
        path="food-items/update/:id"
        element={<FoodItemForm />}
      />

      <Route
        path="customers"
        element={<Customers />}
      />

      <Route
        path="media"
        element={<Media />}
      />

      <Route
        path="settings"
        element={<AdminSettings />}
      />

    </Route>
  );
};

export default AdminRoutes;