import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from './components/Navbar.jsx'
import Dashboard from "./pages/Dashboard.jsx";
import Explore from "./pages/Explore.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";


function ProtectedRoute({ children }) {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    return loggedIn ? (
        <>
            <Navbar />
            {children}
        </>
    ) : (
        <Navigate to="/login" replace />
    );
}

function App(){
    
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            </Routes>
        </Router>
    )
}

export default App