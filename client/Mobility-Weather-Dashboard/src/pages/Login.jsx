import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'


function Login(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    function handleSubmit(){
        try{
            const res = axios.post('/auth/login',{
                email: email,
                password: password
            })
            if(res.data.success){
                localStorage.setItem("isLoggedIn","true")
                localStorage.setItem("userId",res.data.user._id)
                navigate("/dashboard")  
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
        <>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email' />
            <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' />
            <button onClick={handleSubmit}>Sumbit</button>
        </>
    )
}

export default Login