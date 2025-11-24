import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from './components/Navbar.jsx'
import Dashboard from "./pages/Dashboard.jsx";
import Explore from "./pages/Explore.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

function App(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
        setLoading(false);
    }, []);

    function ProtectedRoute({ children }) {
        return isLoggedIn ? (
            <>
                <Navbar />
                {children} 
            </>
        ): (
            <Navigate to="/login" />
        )
    }

    if (loading) {
        return <p>Loading...</p>;
    }


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