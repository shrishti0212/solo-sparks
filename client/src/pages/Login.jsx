import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux"
import { setUser } from "../utils/userSlice";


const Login = () =>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name:"",
    email:"",
    password:""

  })

  const [error, setError ] = useState("");

  const toggleForm = () => setIsRegister(!isRegister);

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.name]: e.target.value })
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setError("");

    try{
      const url = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { name: formData.name, email:formData.email , password : formData.password} : { email: formData.email, password :formData.password};

      const res= await axios.post(url, payload);

      dispatch(setUser(res.data.user)); 
      localStorage.setItem("token",res.data.token); 

      console.log(res.data);
      alert(`${isRegister ? "Registered": "Logged in"} successfully`);
      navigate("/")

    }catch(err){
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#A18AFF]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isRegister? "Register" : "Login"}
        </h2>

        {isRegister && (
          <input 
            type="text" 
            name="name" 
            placeholder="Name" 
            onChange={handleChange} 
            value={formData.name} 
            className="w-full p-2 mb-4 border rounded" 
            required
          />
        )}

         <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        {error && <p className=" text-red-600">{error}</p>}
          
        <button 
            type="submit" 
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition">
            {isRegister? "SignUp":"Login"}
        </button> 

          <p className="mt-4 text-sm text-center">
            {isRegister ? "Already have an account?":"Don't have an account"}
            {" "}
            <span className="text-[#A18AFF] cursor-pointer" onClick={toggleForm}>
              {isRegister?"Login":"Register"}
            </span>
          </p>
      </form>
    </div>
  )
}

export default Login;