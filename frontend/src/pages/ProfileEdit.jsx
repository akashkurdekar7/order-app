import {useState, useEffect} from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import {motion} from "framer-motion";
import {
  FiCamera,
  FiUser,
  FiShoppingBag,
  FiPhone,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    shopName: "",
    personName: "",
    phone: "",
    aadhaar: "",
    location: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

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
      if (res.data.image) {
        setPreview(`${import.meta.env.VITE_BASE_URL}${res.data.image}`);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setProfile({...profile, image: file});
      setPreview(URL.createObjectURL(file));
    } else {
      setProfile({
        ...profile,
        [e.target.name]: e.target.value,
      });
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("shopName", profile.shopName);
      formData.append("personName", profile.personName);
      formData.append("phone", profile.phone);
      formData.append("location", profile.location);
      if (profile.image instanceof File) {
        formData.append("image", profile.image);
      }

      await API.put("/api/auth/updateProfile", formData, {
        headers: {"Content-Type": "multipart/form-data"},
      });

      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      className="min-h-screen pb-20 md:pt-6 pt-2 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[-5%] w-[300px] h-[300px] bg-slate-50 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <header className="md:mb-10 mb-6 text-center sm:text-left">
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1}}
            className="flex items-center justify-center sm:justify-start gap-2 text-slate-400 mb-1">
            <FiUser size={14} />
            <span className="size12 degular-semibold uppercase tracking-widest">
              Account Settings
            </span>
          </motion.div>
          <motion.h2
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
            className="size32 degular-semibold text-slate-800 mb-0">
            {profile.personName}
          </motion.h2>
          {/* <motion.p
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3}}
            className="size16 text-slate-500 degular-regular">
            Manage your wholesale shop identity and credentials.
          </motion.p> */}
        </header>

        <motion.div
          initial={{opacity: 0, scale: 0.98, y: 20}}
          animate={{opacity: 1, scale: 1, y: 0}}
          transition={{delay: 0.4}}
          className="glass-effect rounded-[40px] p-6 sm:p-10 border border-white/60 shadow-xl shadow-slate-200/50">
          <form onSubmit={updateProfile} className="space-y-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center sm:items-start mb-4">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[32px] overflow-hidden bg-white border-4 border-white shadow-2xl relative">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-200 bg-slate-50">
                      <FiUser size={64} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:bg-indigo-600 transition-all transform hover:scale-110 active:scale-95 group-hover:shadow-indigo-200">
                  <FiCamera size={22} />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 degular-semibold size12 text-slate-400 uppercase tracking-widest ml-1">
                  <FiShoppingBag size={14} className="text-indigo-500" /> Shop
                  Name
                </label>
                <input
                  name="shopName"
                  value={profile.shopName}
                  onChange={handleChange}
                  placeholder="Enter shop name"
                  className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-5 py-4 size16 degular-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 degular-semibold size12 text-slate-400 uppercase tracking-widest ml-1">
                  <FiUser size={14} className="text-indigo-500" /> Owner Name
                </label>
                <input
                  name="personName"
                  value={profile.personName}
                  onChange={handleChange}
                  placeholder="Enter owner name"
                  className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-5 py-4 size16 degular-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 degular-semibold size12 text-slate-400 uppercase tracking-widest ml-1">
                  <FiPhone size={14} className="text-indigo-500" /> Phone Number
                </label>
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Mobile number"
                  className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-5 py-4 size16 degular-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 degular-semibold size12 text-slate-400 uppercase tracking-widest ml-1">
                  <FiCreditCard size={14} className="text-indigo-500" />{" "}
                  Merchant Aadhaar Card
                </label>
                <div className="w-full bg-slate-100/50 border border-slate-100 rounded-2xl px-5 py-4 size16 degular-semibold text-slate-400 cursor-not-allowed flex items-center justify-between">
                  <span>{profile.aadhaar || "Pending"}</span>
                  <span className="size10 bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                    {profile.aadhaar ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 degular-semibold size12 text-slate-400 uppercase tracking-widest ml-1">
                <FiMapPin size={14} className="text-indigo-500" /> Merchant
                Location
              </label>
              <textarea
                name="location"
                value={profile.location}
                onChange={handleChange}
                rows="2"
                placeholder="Warehouse or shop address..."
                className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-5 py-4 size16 degular-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none resize-none"
              />
            </div>

            <div className="md:pt-6 pt-0">
              <motion.button
                whileHover={{y: -2}}
                whileTap={{scale: 0.98}}
                type="submit"
                className="w-full bg-slate-900 text-white py-5 rounded-[20px] size18 degular-semibold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">
                Secure Update
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileEdit;
