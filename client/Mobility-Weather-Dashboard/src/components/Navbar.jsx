import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

function Navbar(){

    const  navigate = useNavigate()

    function handleOnClick(){
        window.localStorage.removeItem("isLoggedIn")
        navigate("/login")
    }

    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/about">About</Link>
            <Link to="/login">Login</Link>
            <button onClick = {handleOnClick}>Logout</button>
        </nav>
    )
}

export default Navbar