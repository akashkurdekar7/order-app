import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const [open, setOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    const MenuLinks = () => (
        <>
            {role === "user" && (
                <>
                    <Link to="/home">Products</Link>
                    <Link to="/my-orders">My Orders</Link>
                </>
            )}

            {role === "admin" && (
                <>
                    <Link to="/admin">Dashboard</Link>
                    <Link to="/admin/orders">Orders</Link>
                    <Link to="/admin/products">Products</Link>
                </>
            )}
        </>
    );

    return (
        <>
            <nav className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

                    <h1 className="text-lg font-semibold">
                        Wholesale Orders
                    </h1>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
                        <MenuLinks />

                        <button
                            onClick={logout}
                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Burger */}
                    <button
                        className="md:hidden flex flex-col gap-1"
                        onClick={() => setOpen(true)}
                    >
                        <span className="w-6 h-0.5 bg-black"></span>
                        <span className="w-6 h-0.5 bg-black"></span>
                        <span className="w-6 h-0.5 bg-black"></span>
                    </button>

                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.35 }}
                        className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-8 text-xl z-50"
                    >

                        <button
                            className="absolute top-6 right-6 text-2xl"
                            onClick={() => setOpen(false)}
                        >
                            ✕
                        </button>

                        <MenuLinks />

                        <button
                            onClick={logout}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-md"
                        >
                            Logout
                        </button>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;