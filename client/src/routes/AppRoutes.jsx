import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import Sell from "../pages/Sell";
import ComingSoon from "../pages/ComingSoon";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ComingSoon title="Password reset" />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/search" element={<Products />} />
        <Route path="/categories/:slug" element={<Products />} />
        <Route path="/seller/:username" element={<ComingSoon title="Seller profile" />} />

        {/* Authenticated */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/messages" element={<ComingSoon title="Messages" />} />
          <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />

          {/* Seller */}
          <Route path="/sell" element={<Sell />} />
          <Route path="/seller/dashboard" element={<ComingSoon title="Seller dashboard" />} />
          <Route path="/seller/products" element={<ComingSoon title="Your listings" />} />
          <Route path="/seller/orders" element={<ComingSoon title="Seller orders" />} />
          <Route path="/seller/offers" element={<ComingSoon title="Offers" />} />
          <Route path="/seller/analytics" element={<ComingSoon title="Seller analytics" />} />
          <Route path="/seller/verification" element={<ComingSoon title="Get verified" />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
