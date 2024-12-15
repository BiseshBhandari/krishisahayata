import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import RegisterPage from './components/register/RegisterPage'
import './App.css'


function App() {

  const location = useLocation();

  const hideNavbarPaths = ["/login", "/register"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  )
}

export default App
