import {Link, useNavigate, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  FiLogOut,
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUser,
  FiPackage,
  FiHome,
} from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchProfile();
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get("/api/auth/userDetails");
      setProfile({
        shopName: res.data.shopName || "",
        personName: res.data.personName || "",
        phone: res.data.phone || "",
        aadhaar: res.data.aadhaar || "",
        location: res.data.location || "",
        image: res.data.image || null,
      });
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  const menuItems =
    role === "user"
      ? [
          {name: "Browse", path: "/home", icon: FiHome},
          {name: "My Orders", path: "/my-orders", icon: FiPackage},
          {name: "Profile", path: "/profile-edit", icon: FiUser},
        ]
      : [
          {name: "Dashboard", path: "/admin", icon: FiHome},
          {name: "Orders", path: "/admin/orders", icon: FiPackage},
          {name: "Products", path: "/admin/products", icon: FiShoppingBag},
        ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 py-4 ${
          scrolled ? "mt-0" : "mt-2"
        }`}>
        <div
          className={`max-w-7xl mx-auto h-16 sm:h-20 glass-effect rounded-[24px] sm:rounded-[32px] flex items-center justify-between px-6 sm:px-10 transition-all duration-500 border border-white/40 shadow-xl ${
            scrolled ? "shadow-slate-200/50" : "shadow-transparent"
          }`}>
          {/* Logo */}
          <Link
            to={role === "admin" ? "/admin" : "/home"}
            className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 transition-transform group-hover:scale-110">
              {profile?.image ? (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${profile.image}`}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-white degular-semibold size20 sm:size24">
                  W
                </span>
              )}
            </div>
            <div className="flex flex-col justify-between">
              <span className="degular-semibold size18 sm:size18 text-slate-800 leading-none">
                {profile?.shopName}
              </span>
              <span className="degular-semibold size12 sm:size14 text-indigo-600 leading-none">
                {profile?.personName}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-50/50 p-1 rounded-2xl border border-slate-100/50 backdrop-blur-sm">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-5 py-2.5 rounded-xl size14 degular-semibold transition-all ${
                      isActive
                        ? "text-slate-900"
                        : "text-slate-500 hover:text-slate-800"
                    }`}>
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-100"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="h-8 w-px bg-slate-200 mx-4" />

            <motion.button
              whileTap={{scale: 0.95}}
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl size14 degular-semibold hover:bg-red-100 transition-colors shadow-sm cursor-pointer">
              <FiLogOut className="size16" /> Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-all border border-slate-200 cursor-pointer">
            <FiMenu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-60 overflow-hidden">
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={() => setIsMenuOpen(false)}
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
                  <div className="w-12 h-12 bg-slate-900 rounded-[20px] flex items-center justify-center">
                    {profile?.image ? (
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${profile.image}`}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <span className="text-white degular-semibold size24">
                        W
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="degular-semibold size18 text-slate-800 leading-none">
                      Menu
                    </span>
                    <span className="degular-semibold size14 text-indigo-600 uppercase tracking-widest mt-1">
                      Wholesale
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all border border-slate-100 shadow-sm cursor-pointer">
                  <FiX size={24} />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                <div className="space-y-3">
                  {menuItems.map((item, idx) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.path}
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.1 + idx * 0.05}}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between p-5 rounded-[24px] transition-all ${
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
                          {/* <FiX
                            className={`rotate-45 ${isActive ? "text-white/40" : "text-slate-300"}`}
                            size={20}
                          /> */}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-6 sm:p-8 bg-slate-50/30 border-t border-slate-50">
                <motion.button
                  whileTap={{scale: 0.98}}
                  onClick={logout}
                  className="w-full py-5 bg-white text-red-600 rounded-[24px] degular-semibold size18 flex items-center justify-center gap-3 border border-red-100 shadow-sm hover:bg-red-50 transition-colors cursor-pointer">
                  <FiLogOut size={22} /> Log out
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
