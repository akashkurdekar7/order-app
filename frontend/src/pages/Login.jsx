import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import registerImg from "../assets/register.jpg";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ phone: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!form.phone || !form.password) {
      toast.error(t("Phone and Password are required"));
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error(t("Enter a valid 10-digit phone number"));
      return;
    }

    if (form.password.length < 6) {
      toast.error(t("Password must be at least 6 characters"));
      return;
    }

    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      toast.success(t("Login Successful"));

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("Invalid credentials"));
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 relative gap-10"
      style={{ backgroundImage: `url(${registerImg})` }}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 flex gap-2 items-center">
        {/* to change the language */}
        <p className="text-white degular-semibold size14">
          {t("Change Language")}
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            i18n.changeLanguage(i18n.language === "en" ? "kn" : "en")
          }
          className="px-5 py-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl size14 degular-semibold hover:bg-white/20 transition-all shadow-lg cursor-pointer">
          {i18n.language === "en" ? "ಕನ್ನಡ" : "English"}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect w-max rounded-3xl p-4 relative z-10">
        <h4 className="text-slate-900 degular-semibold size16 mb-2">
          Admin details:
        </h4>
        <p className="text-slate-900 degular-regular size14">
          Phone: 9000000001
        </p>
        <p className="text-slate-900 degular-regular size14">
          Password: admin123
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect w-full max-w-md rounded-3xl p-8 sm:p-10 relative z-10">
        <div className="text-center mb-10">
          {/* <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 mx-auto mb-6">
            <span className="text-white degular-semibold size32 mt-1">W</span>
          </div> */}
          <h2 className="size32 degular-semibold text-slate-900 mb-2">
            {t("Welcome Back")}
          </h2>
          <p className="size16 text-slate-600 degular-regular">
            {t("Secure sign in to your account")}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block size14 degular-semibold text-slate-700 mb-2 ml-1">
              {t("Phone Number")}
            </label>
            <input
              type="tel"
              placeholder={t("e.g. 9876543210")}
              className="w-full px-5 py-4 bg-white/50 border border-white/20 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all degular-regular text-slate-900"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block size14 degular-semibold text-slate-700 mb-2 ml-1">
              {t("Password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-white/50 border border-white/20 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all degular-regular text-slate-900"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {showPassword ? (
                <FiEye
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FiEyeOff
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl size18 degular-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all mt-4 cursor-pointer">
            {t("Sign In")}
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="size14 text-slate-600 degular-regular">
            {t("Interested in joining? ")}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors cursor-pointer">
              {t("Register Here")}
            </Link>
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect w-max rounded-3xl p-4 relative z-10">
        <h4 className="text-slate-900 degular-semibold size16 mb-2">
          User details:
        </h4>
        <p className="text-slate-900 degular-regular size14">
          Phone: 9000000002
        </p>
        <p className="text-slate-900 degular-regular size14">
          Password: user123
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
