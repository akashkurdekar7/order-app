import { useState, useEffect } from "react";
import API from "../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token) {
            if (role === "admin") navigate("/admin");
            else navigate("/home");
        }
    }, []);

    const handleLogin = async () => {
        try {
            const res = await API.post("/api/auth/login", {
                phone,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);

            if (res.data.user.role === "admin") {
                navigate("/admin");
                toast.success("Welcome admin");
            } else {
                navigate("/home");
                toast.success("Login successful");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm">

                <h2 className="text-2xl font-semibold text-gray-800 text-center">
                    Login
                </h2>

                <p className="text-sm text-gray-500 text-center mt-1 mb-6">
                    Access your account
                </p>

                <div className="mb-4">
                    <label className="text-sm text-gray-600">Phone</label>
                    <input
                        type="text"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-5 relative">
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3  text-gray-500"
                    >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                    Login
                </button>

                <p className="text-sm text-center text-gray-500 mt-5">
                    New here?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-600 hover:underline"
                    >
                        Create account
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;