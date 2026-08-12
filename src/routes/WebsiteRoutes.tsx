import { Route } from "react-router-dom";
import WebsiteLayout from "../layouts/WebsiteLayout";
import Home from "../pages/website/home/Home";
import { ProductDetail } from "../pages/website/product-detail-page/ProductDetail";
import { CartPage } from "../pages/website/CartPage";
import { CheckoutPage } from "../pages/website/CheckoutPage";
import { ProductListingPage } from "../pages/website/product-listing-page/ProductListingPage";
import Restaurants from "../pages/website/product-listing-page/Restaurants";


const WebsiteRoutes = () => {
  return (
    <>

    <Route path="/" element={<WebsiteLayout />}>
      
      <Route index element={<Home />} />
      <Route path="/product-detail-page" element={<ProductDetail />} />

      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/food-items/All" element={<ProductListingPage />} />

      <Route path="/food-items/:slug" element={<ProductListingPage />} />

      <Route path="/restaurants" element={<Restaurants />} />
    </Route>
    </>
  );
};

export default WebsiteRoutes;
