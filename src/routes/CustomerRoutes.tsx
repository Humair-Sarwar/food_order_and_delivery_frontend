import { Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import FoodItemOrders from "../pages/customer/food-item-orders/FoodItemOrders";
import Wishlist from "../pages/customer/wishlist/Wishlist";
import ProfileInfo from "../pages/customer/profile-info/ProfileInfo";
import Dashboard from "../pages/customer/dashboard/Dashboard";
import Addresses from "../pages/customer/addresses/Addresses";
import OrderDetails from "../pages/customer/order-details/OrderDetails";

const CustomerRoutes = () => {
  return (
    <Route path="/user" element={<CustomerLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="orders" element={<FoodItemOrders />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="profile-info" element={<ProfileInfo />} />
      <Route path="address" element={<Addresses />} />
      <Route path="order/:id" element={<OrderDetails />} />
    </Route>
  );
};

export default CustomerRoutes;
