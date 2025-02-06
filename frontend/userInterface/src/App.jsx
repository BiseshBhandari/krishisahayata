import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import RegisterPage from "./Pages/Authen/RegisterPage";
import LoginPage from "./Pages/Authen/LoginPage";
import ForgotPass from "./Pages/Authen/ForgotPass";
import ResetPass from "./Pages/Authen/ResetPass";
import Dashboard from "./Pages/Farmer/Dashboard";
import AdminDash from "./Pages/AdminP/AdminDash";
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
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDash />} />
        </Route>

        {/* Farmer Routes */}
        <Route path="/farmer/*" element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerLayout />
          </ProtectedRoute>}>

          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
