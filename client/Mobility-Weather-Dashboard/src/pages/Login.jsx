import axios from 'axios'
import {useNavigate, Link} from 'react-router-dom'
import { useState } from 'react'
import "../styles/Login.css";

function Login(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    async function handleLogin(){
        try{
            const res = await axios.post('http://localhost:5000/api/login',{
                email: email,
                password: password
            })
            if(res.data.success){
                localStorage.setItem("isLoggedIn","true")
                localStorage.setItem("userId",res.data.user._id)
                setTimeout(() => {
                    navigate("/dashboard");
                }, 30); 
            }   
            else{
                navigate("/login")
            }
        }
        catch(e){
            console.log(e)
            alert("Server Error")
        }
    }
    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <input className="login-input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email' />
                <input className="login-input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' />
                <button className="login-button" onClick={handleLogin}>Submit</button>
                <p className="signup-text">Don't have an account?{" "}
                    <Link to="/signup" className="signup-link">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login