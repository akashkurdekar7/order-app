import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import registerImg from "../assets/register.jpg";

const Login = () => {
  const [form, setForm] = useState({ phone: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      toast.success("Login Successful");

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 relative"
      style={{ backgroundImage: `url(${registerImg})` }}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect w-full max-w-md rounded-3xl p-8 sm:p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 mx-auto mb-6">
            <span className="text-white degular-semibold size32 mt-1">W</span>
          </div>
          <h2 className="size32 degular-semibold text-slate-900 mb-2">
            Welcome Back
          </h2>
          <p className="size16 text-slate-600 degular-regular">
            Secure sign in to your account
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block size14 degular-semibold text-slate-700 mb-2 ml-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              className="w-full px-5 py-4 bg-white/50 border border-white/20 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all degular-regular text-slate-900"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block size14 degular-semibold text-slate-700 mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-white/50 border border-white/20 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all degular-regular text-slate-900"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl size18 degular-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all mt-4">
            Sign In
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="size14 text-slate-600 degular-regular">
            Interested in joining?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors underline">
              Register Here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
