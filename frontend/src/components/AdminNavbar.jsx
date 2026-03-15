import React, {useState, useEffect} from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {motion, AnimatePresence} from "framer-motion";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiLayout,
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";
import API from "../api/axios";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const {t, i18n} = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "kn" : "en";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const res = await API.get("/api/auth/userDetails");
        setAdminUser(res.data);
      } catch (error) {
        console.error("Failed to fetch admin details", error);
      }
    };
    fetchAdminDetails();

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navItems = [
    {name: t("Dashboard"), path: "/admin", icon: FiLayout},
    {name: t("Orders"), path: "/admin/orders", icon: FiPackage},
    {name: t("Shops"), path: "/admin/users", icon: FiUsers},
    {name: t("Inventory"), path: "/admin/products", icon: FiShoppingBag},
    {name: t("Sales"), path: "/admin/sales", icon: FiTrendingUp},
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 xl:px-8 py-4 ${
          scrolled ? "mt-0" : "mt-2"
        }`}>
        <div
          className={`max-w-7xl mx-auto h-16 sm:h-20 glass-effect rounded-[24px] sm:rounded-[32px] flex items-center justify-between px-6 sm:px-10 transition-all duration-500 border border-white/40 shadow-xl ${
            scrolled ? "shadow-slate-200/50" : "shadow-transparent"
          }`}>
          {/* Admin Branding */}
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 transition-transform group-hover:scale-110">
              <span className="text-white degular-semibold size20 sm:size24">
                {adminUser?.personName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col gap-1 items-start">
              <span className="degular-semibold size16 sm:size18 text-slate-800 leading-none">
                {adminUser ? adminUser.shopName : t("Console")}
              </span>
              <span className="degular-semibold size12 sm:size14 text-indigo-600 leading-none font-medium">
                {adminUser ? adminUser.personName : t("Merchant Admin")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-50/50 p-1 rounded-2xl border border-slate-100/50 backdrop-blur-sm">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === "/admin" && location.pathname === "/admin/");
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-5 py-2.5 rounded-xl size14 degular-semibold transition-all ${
                      isActive
                        ? "text-slate-900"
                        : "text-slate-500 hover:text-slate-800"
                    }`}>
                    <span className="relative z-10 flex items-center gap-2">
                      <item.icon
                        className={`size16 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                      />
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="adminNavTab"
                        className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-100"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="h-8 w-px bg-slate-200 mx-4" />

            {/* Language Toggle */}
            <motion.button
              whileTap={{scale: 0.95}}
              onClick={toggleLanguage}
              className="px-4 py-2.5 bg-slate-50 text-slate-700 rounded-xl size14 degular-semibold hover:bg-slate-100 transition-colors shadow-sm border border-slate-200 mr-2">
              {i18n.language === "en" ? "ಕನ್ನಡ" : "English"}
            </motion.button>

            <motion.button
              whileTap={{scale: 0.95}}
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl size14 degular-semibold hover:bg-red-100 transition-colors shadow-sm cursor-pointer">
              <FiLogOut className="size16" /> {t("Log out")}
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="xl:hidden w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-all border border-slate-200">
            <FiMenu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-60 overflow-hidden">
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            <motion.div
              initial={{x: "100%", opacity: 0.5}}
              animate={{x: 0, opacity: 1}}
              exit={{x: "100%", opacity: 0.5}}
              transition={{type: "spring", damping: 25, stiffness: 200}}
              className="absolute top-4 right-4 bottom-4 w-[calc(100%-32px)] sm:w-96 bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden">
              {/* Mobile Menu Header */}
              <div className="p-8 pb-10 flex justify-between items-center border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-600 rounded-[20px] flex items-center justify-center">
                    <span className="text-white degular-semibold size20 sm:size24">
                      {adminUser?.personName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="degular-semibold size18 text-slate-800 leading-none">
                      {adminUser ? adminUser.shopName : t("Admin Menu")}
                    </span>
                    <span className="degular-semibold size14 text-indigo-600 uppercase tracking-widest mt-1">
                      {adminUser ? adminUser.personName : t("Console")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all border border-slate-100 shadow-sm">
                  <FiX size={24} />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className="px-4 py-0 sm:px-6 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {navItems.map((item, idx) => {
                    const isActive =
                      location.pathname === item.path ||
                      (item.path === "/admin" &&
                        location.pathname === "/admin/");
                    return (
                      <motion.div
                        key={item.path}
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.1 + idx * 0.05}}>
                        <Link
                          to={item.path}
                          onClick={() => setMenuOpen(false)}
                          className={`w-full flex items-center justify-between xl:p-5 p-3 rounded-[24px] transition-all ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                              : "bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                          }`}>
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-white/20" : "bg-white border border-slate-200 shadow-sm text-slate-400"}`}>
                              <item.icon size={20} />
                            </div>
                            <span className="size18 degular-semibold">
                              {item.name}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-6 sm:p-8 bg-slate-50/30 border-t border-slate-50 space-y-3">
                <motion.button
                  whileTap={{scale: 0.98}}
                  onClick={toggleLanguage}
                  className="w-full py-3 bg-white text-slate-700 rounded-[24px] degular-semibold size18 flex items-center justify-center gap-3 border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
                  {i18n.language === "en"
                    ? "ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"
                    : "Switch to English"}
                </motion.button>

                <motion.button
                  whileTap={{scale: 0.98}}
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full py-3 bg-white text-red-600 rounded-[24px] degular-semibold size18 flex items-center justify-center gap-3 border border-red-100 shadow-sm hover:bg-red-50 transition-colors">
                  <FiLogOut size={22} /> {t("Log out")}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminNavbar;
