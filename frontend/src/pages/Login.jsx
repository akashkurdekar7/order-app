import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", {
                phone,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);

            if (res.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        } catch (error) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-[100dvh] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center px-4">

            <div className="backdrop-blur-md bg-white/90 w-full max-w-sm p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-[1.02]">

                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Welcome Back 👋
                </h2>

                <p className="text-center text-gray-500 text-sm mt-2 mb-6">
                    Sign in to manage your wholesale orders
                </p>

                <div className="mb-4">
                    <label className="text-sm text-gray-600">Phone Number</label>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <div className="mb-6 relative">
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-sm text-indigo-600"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Login
                </button>

                <p className="text-sm text-center mt-6 text-gray-600">
                    New here?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Create Account
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;