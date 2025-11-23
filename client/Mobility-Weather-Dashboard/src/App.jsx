import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.jsx'
import Dashboard from "./pages/Dashboard.jsx";
import Explore from "./pages/Explore.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";

function App(){
    function ProtectedRoute({ children }) {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        return isLoggedIn ? children : <Navigate to="/login" />;
    }
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            </Routes>
        </Router>
    )
}

export default App