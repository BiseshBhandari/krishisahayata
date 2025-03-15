import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import RegisterPage from "./Pages/Authen/RegisterPage";
import LoginPage from "./Pages/Authen/LoginPage";
import ForgotPass from "./Pages/Authen/ForgotPass";
import ResetPass from "./Pages/Authen/ResetPass";

import Dashboard from "./Pages/Farmer/Dashboard";
import PostPage from "./Pages/Farmer/PostPage";
import PostProfile_page from "./Pages/Farmer/PostProfile_page";
import VideosPage from "./Pages/Farmer/VideosPage";
import MarketPage from "./Pages/Farmer/MarketPage";
import CartPage from "./Pages/Farmer/CartPage";
import CheckoutPage from "./Pages/Farmer/CheckOutPage";
import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentFailure from "./Pages/PaymentFailure";

import AdminDash from "./Pages/AdminP/AdminDash";
import AdminVideo from "./Pages/AdminP/AdminVideo";
import AdminVerifyPost from "./Pages/AdminP/AdminVerifyPost";



import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./Unautorized";
import AdminLayout from "./Layouts/AdminLayout";
import FarmerLayout from "./Layouts/FarmerLayout";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-pass" element={<ForgotPass />} />
        <Route path="/reset-pass/:token" element={<ResetPass />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDash />
            </ProtectedRoute>}
          />

          <Route path="video" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminVideo />
            </ProtectedRoute>}
          />

          <Route path="verify-post" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminVerifyPost />
            </ProtectedRoute>
          }
          />

        </Route >

        {/* Farmer Routes */}
        < Route path="/farmer/*" element={<FarmerLayout />} >

          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <Dashboard />
            </ProtectedRoute>} />

          <Route path="post-profile" element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <PostProfile_page />
            </ProtectedRoute>} />

          <Route path="post" element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <PostPage />
            </ProtectedRoute>} />

          <Route path="videos" element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <VideosPage />
            </ProtectedRoute>} />

          <Route path="market" element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <MarketPage />
            </ProtectedRoute>
          } />

          <Route path="cart" element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <CartPage />
            </ProtectedRoute>
          } />

          <Route path="checkout" element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <CheckoutPage />
            </ProtectedRoute>
          } />

          <Route path="payment-success/:order_id" element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <PaymentSuccess />
            </ProtectedRoute>} />

          <Route path="payment-failure" element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <PaymentFailure />
            </ProtectedRoute>} />

        </Route >
      </Routes >
    </>
  );
};

export default App;
