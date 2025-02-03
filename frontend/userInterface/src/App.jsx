import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from './Pages/LandingPage';
import RegisterPage from './Pages/Authen/RegisterPage';
import LoginPage from './Pages/Authen/LoginPage';
import ForgotPass from './Pages/Authen/ForgotPass';
import ResetPass from './Pages/Authen/ResetPass';
import Dashboard from './Pages/Farmer/Dashboard';
import AdminDash from './Pages/AdminP/AdminDash';
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
        {/* <Route path="/" element={<LandingPage hideNavbar={hideNavbar} />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-pass" element={<ForgotPass />} />
        <Route path="/reset-pass/:token" element={<ResetPass />} />

        <Route path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
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
