import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RxHamburgerMenu } from "react-icons/rx";

const AdminNavbar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    const navItems = [
        { name: "Dashboard", path: "/admin" },
        { name: "Orders", path: "/admin/orders" },
        { name: "Users", path: "/admin/users" },
        { name: "Products", path: "/admin/products" },
    ];

    const navButtonStyle = (path) =>
        `px-3 py-2 rounded-lg size16 degular-regular transition 
     ${location.pathname === path
            ? "bg-indigo-100 text-indigo-700"
            : "text-gray-700 hover:bg-gray-100"}`;

    return (
        <header className="bg-white shadow-sm border-b">

            {/* TOP BAR */}

            <div className="flex justify-between items-center px-6 py-4">

                <h1 className="size26 degular-semibold">
                    Admin Dashboard
                </h1>

                {/* Desktop Navigation */}

                <nav className="hidden md:flex items-center gap-2">

                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={navButtonStyle(item.path)}
                        >
                            {item.name}
                        </button>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="size16 degular-regular ml-3 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    >
                        Logout
                    </button>

                </nav>

                {/* Mobile Burger */}

                <button
                    className="md:hidden cursor-pointer"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <RxHamburgerMenu size={24} />
                </button>

            </div>

            {/* Mobile Menu */}

            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                        animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
                        exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden border-t bg-white flex flex-col "
                    >

                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setMenuOpen(false);
                                }}
                                className="size16 degular-regular text-left px-6 py-3 hover:bg-gray-50 cursor-pointer"
                            >
                                {item.name}
                            </button>
                        ))}

                        <button
                            onClick={() => {
                                handleLogout();
                                setMenuOpen(false);
                            }}
                            className="size16 degular-regular text-left px-6 py-3 text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                            Logout
                        </button>

                    </motion.nav>
                )}
            </AnimatePresence>

        </header>
    );
};

export default AdminNavbar;