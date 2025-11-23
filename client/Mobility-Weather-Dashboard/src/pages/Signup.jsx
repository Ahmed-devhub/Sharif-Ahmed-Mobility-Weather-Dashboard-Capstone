import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignup() {
    try {
      const res = await axios.post("http://localhost:5000/api/signup", {
        name: name,
        email: email,
        password: password
      });

      if (res.data.message === "Signup Successful") {
        alert("Account created!");
        navigate("/login");
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      alert("Server error");
    }
  }

  return (
    <>
      <h2>Signup</h2>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Create Account</button>
    </>
  );
}

export default Signup;
