import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import "../styles/NavBar.css";

function Navbar(){

    const  navigate = useNavigate()
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    function handleOnClick(){
        window.localStorage.removeItem("isLoggedIn")
        navigate("/login")
    }

    return (
        <nav className="navbar">
            {isLoggedIn && (
            <>
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>{" "}
                    <Link to="/explore">Explore</Link>{" "}
                    <Link to="/about">About</Link>{" "}
                </div>
                <button onClick = {handleOnClick}>Logout</button>
            </>
            )}
            {!isLoggedIn && <Link className="login-link" to="/login">Login</Link>}
        </nav>
    )
}

export default Navbar