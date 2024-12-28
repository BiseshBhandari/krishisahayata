import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import RegisterPage from './Components/Register/RegisterPage';
import LoginPage from './Components/Login/LoginPage';
import Dashboard from './Components/UserSide/Dashboard/Dashboard';
import ForgotPass from './Components/Forgot-pass/ForgotPass';
import ResetPass from './Components/Reset-Pass/ResetPass';
import './App.css';


function App() {

  const location = useLocation();

  const hideNavbarPaths = ["/login", "/register", "/forgot-pass", "reset-pass"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-pass" element={<ForgotPass />} />
        <Route path="/reset-pass" element={<ResetPass />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </>
  )
}

export default App
