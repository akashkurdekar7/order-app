import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        shopName: "",
        personName: "",
        aadhaar: "",
        location: "",
        phone: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            const res = await API.post(
                "/auth/register",
                form
            );

            alert("Registered successfully");
            navigate("/");
        } catch (error) {
            alert(error?.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">

                <h2 className="text-2xl font-semibold text-center text-gray-800">
                    Create Account
                </h2>

                <p className="text-sm text-gray-500 text-center mt-1 mb-6">
                    Register your shop to start ordering
                </p>

                <div className="space-y-4">

                    <input
                        name="shopName"
                        placeholder="Shop Name"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <input
                        name="personName"
                        placeholder="Owner Name"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <input
                        name="aadhaar"
                        placeholder="Aadhaar Number"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <input
                        name="location"
                        placeholder="Location"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <input
                        name="phone"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                </div>

                <button
                    onClick={handleRegister}
                    className="w-full mt-6 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                    Register
                </button>

                <p className="text-sm text-center text-gray-500 mt-5">
                    Already have an account?{" "}
                    <Link
                        to="/"
                        className="text-indigo-600 hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;