import {useEffect, useState} from "react";
import API from "../../api/axios";
import {PiPhoneCallFill} from "react-icons/pi";
import {
  FiUsers,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import {motion} from "framer-motion";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";

const Users = () => {
  const {t} = useTranslation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/api/auth/getUsers");
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 1, transition: {staggerChildren: 0.1}},
  };

  const itemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {opacity: 1, y: 0},
  };

  return (
    <section className="min-h-screen pb-20 pt-8 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="md:mb-10 mb-4">
          <h1 className="size32 degular-semibold text-slate-800 mb-2">
            {t("User Directory")}
          </h1>
          <p className="size16 text-slate-500 degular-regular">
            {t("Manage and contact your registered wholesale partners.")}
          </p>
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {users.map((user) => (
            <motion.div
              key={user._id}
              variants={itemVariants}
              className="premium-card bg-white overflow-hidden group hover:border-indigo-200 transition-all">
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                {user.image ? (
                  <img
                    src={import.meta.env.VITE_BASE_URL + user.image}
                    alt={user.shopName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <FiUser size={48} />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <a
                    href={`tel:${user.phone}`}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-emerald-500 shadow-lg hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110">
                    <PiPhoneCallFill size={20} />
                  </a>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <h3 className="size20 degular-semibold text-slate-800 capitalize mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {user.shopName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="size14 degular-medium capitalize">
                      {user.personName}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <FiMapPin size={14} className="shrink-0" />
                    <span className="size13 degular-medium line-clamp-1">
                      {user.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <FiCreditCard size={14} className="shrink-0" />
                    <span className="size13 degular-medium tracking-wider">
                      {user.aadhaar?.match(/.{1,4}/g)?.join("-") || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-0 border-t border-slate-50">
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <FiShoppingBag size={12} />
                      <span className="size11 degular-semibold uppercase tracking-widest">
                        {t("Total Sales")}
                      </span>
                    </div>
                    <span className="size18 degular-semibold text-slate-800">
                      ₹{(user.totalSales || 0).toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl border ${!user.totalBalance ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}>
                    <div
                      className={`flex items-center gap-1.5 mb-1 ${!user.totalBalance ? "text-emerald-500" : "text-red-500"}`}>
                      <span className="size11 degular-semibold uppercase tracking-widest">
                        {t("Balance Due")}
                      </span>
                    </div>
                    <span
                      className={`size18 degular-semibold ${!user.totalBalance ? "text-emerald-600" : "text-red-600"}`}>
                      ₹{(user.totalBalance || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {!isLoading && users.length === 0 && (
          <div className="py-24 text-center glass-effect rounded-[32px] border border-dashed border-slate-200">
            <FiUsers size={56} className="mx-auto text-slate-200 mb-4" />
            <p className="size18 degular-semibold text-slate-400">
              {t("No registered users found.")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Users;
