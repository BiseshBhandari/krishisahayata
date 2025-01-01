import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import RegisterPage from './Components/Register/RegisterPage';
import LoginPage from './Components/Login/LoginPage';
import Dashboard from './Components/UserSide/Dashboard/Dashboard';
import ForgotPass from './Components/Forgot-pass/ForgotPass';
import ResetPass from './Components/Reset-Pass/ResetPass';
import AdminDash from './Components/adminSide/AdminDash/AdminDash';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from './Unautorized';
import './App.css';


function App() {

  const location = useLocation();

  const hideNavbarPaths = ["/login", "/register", "/forgot-pass", "/reset-pass"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-pass" element={<ForgotPass />} />
        <Route path="/reset-pass/:token" element={<ResetPass />} />
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin_dash" element={<AdminDash />} /> */}
        <Route path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Dashboard />
            </ProtectedRoute>
          } />

        <Route path="/admin_dash"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDash />
            </ProtectedRoute>
          } />

        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
    </>
  )
}

export default App
