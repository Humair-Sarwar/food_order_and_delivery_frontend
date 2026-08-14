import { Route } from "react-router-dom";
import WebsiteLayout from "../layouts/WebsiteLayout";
import Home from "../pages/website/home/Home";
import { ProductDetail } from "../pages/website/product-detail-page/ProductDetail";
import { CartPage } from "../pages/website/CartPage";
import { CheckoutPage } from "../pages/website/CheckoutPage";
import { ProductListingPage } from "../pages/website/product-listing-page/ProductListingPage";
import Restaurants from "../pages/website/product-listing-page/Restaurants";
import { AboutPage } from "../pages/website/AboutPage";
import { ContactPage } from "../pages/website/ContactPage";
import OrderDetails from "../pages/customer/order-details/OrderDetails";

const WebsiteRoutes = () => {
  return (
    <>
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<Home />} />
        <Route
          path="/food-item/:category/:title/:id"
          element={<ProductDetail />}
        />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        
        <Route path="/food-items/All" element={<ProductListingPage />} />

        <Route path="/food-items/:slug" element={<ProductListingPage />} />

        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
    </>
  );
};

export default WebsiteRoutes;
