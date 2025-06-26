// client/pages/AuthForm.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { setUser } from "../utils/userSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const AuthForm = () => {
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

      const res = await axios.post(url, payload);

      dispatch(setUser({ ...res.data.user, token: res.data.token }));
      localStorage.setItem("token", res.data.token);

      toast.success(`${isRegister ? "Registered" : "Logged in"} successfully`);
      navigate("/");
    } catch (err) {
    const errorMsg = err.response?.data?.message || "Something went wrong";
    toast.error(errorMsg);
    setError(errorMsg);    }
  };

  const handleToggle = () => {
    navigate(isRegister ? "/login" : "/register");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#8576FF] to-[#B8B5FF] px-6">
      <motion.h2
        className="text-6xl font-bold mb-16 text-center text-[#8474ff]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isRegister ? "Register" : "Login"}
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-xl space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white bg-opacity-20 px-5 py-4 rounded-lg font-semibold text-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-white bg-opacity-20 px-5 py-4 rounded-lg font-semibold text-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full bg-white bg-opacity-20 px-5 py-4 rounded-lg font-semibold text-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        />

        {error && <p className="text-red-200 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-white/90 py-4 rounded-lg text-xl text-[#8474ff] font-bold hover:bg-opacity-75 transition"
        >
          {isRegister ? "Sign Up" : "Login"}
        </button>

        <p className="text-white/90 text-center text-base">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={handleToggle}
            className="text-[#fff] underline font-semibold cursor-pointer"
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default AuthForm;