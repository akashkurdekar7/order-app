import {useState} from "react";
import API from "../api/axios";
import {useNavigate, Link} from "react-router-dom";
import toast from "react-hot-toast";
import {motion} from "framer-motion";
import registerImg from "../assets/register.jpg";
import {FiEye, FiEyeOff} from "react-icons/fi";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    shopName: "",
    personName: "",
    phone: "",
    aadhaar: "",
    location: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleRegister = async () => {
    if (!form.shopName.trim()) {
      toast.error("Shop name is required");
      return;
    }

    if (!form.personName.trim()) {
      toast.error("Owner name is required");
      return;
    }

    if (!form.phone) {
      toast.error("Phone number is required");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error("Enter a valid 10 digit phone number");
      return;
    }

    if (!form.aadhaar) {
      toast.error("Aadhaar number is required");
      return;
    }

    if (!/^\d{12}$/.test(form.aadhaar)) {
      toast.error("Aadhaar must be exactly 12 digits");
      return;
    }

    if (!form.location.trim()) {
      toast.error("Location is required");
      return;
    }

    if (!form.password) {
      toast.error("Password is required");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await API.post("/api/auth/register", form);
      toast.success("Registered successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div
      className="md:min-h-screen min-h-auto flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 py-5 relative"
      style={{backgroundImage: `url(${registerImg})`}}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[3px]"></div>

      <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        className="glass-effect w-full max-w-2xl rounded-3xl p-8 sm:p-12 relative z-10 shadow-2xl">
        <div className="text-center mb-3">
          {/* <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/30 mx-auto mb-6">
            <span className="text-white degular-semibold size24 mt-1">W</span>
          </div> */}
          <h2 className="size32 degular-semibold text-slate-900 md:mb-2 mb-0">
            Create Account
          </h2>
          <p className="size16 text-slate-600 degular-regular tracking-wide">
            Join our premium wholesale network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-y-6 gap-y-3 mb-8 md:mb-10">
          <div className="space-y-2 md:space-y-4">
            <div>
              <label className="block size12 degular-semibold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Shop Name
              </label>
              <input
                type="text"
                placeholder="Business name"
                autoComplete="on"
                className="w-full px-5 py-3.5 bg-white/50 border border-white/20 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all degular-regular text-slate-900"
                onChange={(e) => setForm({...form, shopName: e.target.value})}
              />
            </div>
            <div>
              <label className="block size12 degular-semibold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Owner Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-5 py-3.5 bg-white/50 border border-white/20 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all degular-regular text-slate-900"
                onChange={(e) => setForm({...form, personName: e.target.value})}
              />
            </div>
            <div>
              <label className="block size12 degular-semibold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Phone Number
              </label>

              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 degular-semibold">
                  +91
                </span>

                <input
                  type="tel"
                  placeholder="10 digit number"
                  maxLength={10}
                  className="w-full pl-14 pr-5 py-3.5 bg-white/50 border border-white/20 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all degular-regular text-slate-900"
                  onChange={(e) =>
                    setForm({...form, phone: e.target.value.replace(/\D/g, "")})
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 md:space-y-4">
            <div>
              <label className="block size12 degular-semibold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Aadhaar Number
              </label>
              <input
                type="tel"
                placeholder="12 digit number"
                maxLength={12}
                pattern="\d{12}"
                className="w-full px-5 py-3.5 bg-white/50 border border-white/20 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all degular-regular text-slate-900"
                onChange={(e) => setForm({...form, aadhaar: e.target.value})}
              />
            </div>
            <div>
              <label className="block size12 degular-semibold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Location / Shop Address
              </label>
              <input
                type="text"
                placeholder="City, Area"
                className="w-full px-5 py-3.5 bg-white/50 border border-white/20 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all degular-regular text-slate-900"
                onChange={(e) => setForm({...form, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block size12 degular-semibold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-white/50 border border-white/20 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all degular-regular text-slate-900"
                  onChange={(e) => setForm({...form, password: e.target.value})}
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
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="w-full py-4.5 cursor-pointer bg-indigo-600 text-white rounded-2xl size18 degular-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all">
          Create Wholesale Account
        </button>

        <div className="mt-8 text-center">
          <p className="size14 text-slate-600 degular-regular">
            Already registered?{" "}
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors cursor-pointer">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
