import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RxHamburgerMenu } from 'react-icons/rx'
const AdminNavbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };
    return (
        <div>
            <div className="border-b flex justify-between items-center border-black p-5 shadow-lg bg-white">

                <h1 className="size70 rova-regular uppercase">Admin Dashboard</h1>

                {/* Burger */}
                <button
                    className="md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <RxHamburgerMenu size={24} />
                </button>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-4">
                    <button onClick={() => navigate("/admin/orders")}>Orders</button>
                    <button onClick={() => navigate("/admin/users")}>Users</button>
                    <button onClick={() => navigate("/admin/products")}>Products</button>
                    <button onClick={handleLogout}>Logout</button>
                </nav>

            </div>
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                        animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
                        exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden flex justify-between items-center py-2 px-5 shadow glass-effect"
                    >
                        <button onClick={() => { navigate("/admin/orders"); setMenuOpen(false) }}>Orders</button>
                        <button onClick={() => { navigate("/admin/users"); setMenuOpen(false) }}>Users</button>
                        <button onClick={() => { navigate("/admin/products"); setMenuOpen(false) }}>Products</button>
                        <button onClick={handleLogout}>Logout</button>
                    </motion.nav >
                )
                }
            </AnimatePresence ></div>
    )
}

export default AdminNavbar