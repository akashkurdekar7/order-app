import {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useTranslation} from "react-i18next";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiUpload,
  FiImage,
  FiCamera,
  FiEye,
} from "react-icons/fi";

function MyOrders() {
  const {t} = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/orders/getMyOrders");
      setOrders(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || t("Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadScreenshot = async (orderId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("screenshot", file);

    try {
      toast.loading(t("Uploading proof..."), {id: "uploading"});
      await API.put(`/api/orders/uploadScreenshot/${orderId}`, formData, {
        headers: {"Content-Type": "multipart/form-data"},
      });
      toast.success(t("Payment proof uploaded!"), {id: "uploading"});
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || t("Upload failed"), {
        id: "uploading",
      });
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Processing":
        return "bg-amber-50 text-amber-600 border-amber-100 animate-pulse";
      case "Shipped":
        return "bg-blue-50 text-blue-600 border-blue-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen pb-32 md:pt-6 pt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8">
        <header className="mb-8 sm:mb-12 text-center sm:text-left">
          <motion.h2
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            className="size28 sm:size32 degular-semibold text-slate-900 mb-2">
            {t("Order History")}
          </motion.h2>
          <motion.p
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1}}
            className="size14 sm:size16 text-slate-500">
            {t("Track and manage your wholesale supplies.")}
          </motion.p>
        </header>

        {orders.length === 0 && !loading ? (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <FiPackage className="text-slate-300 size32" />
            </div>
            <h3 className="size20 degular-semibold text-slate-800 mb-1">
              {t("No orders yet")}
            </h3>
            <p className="size14 text-slate-500">
              {t("When you place an order, it will appear here.")}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  layout
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: index * 0.05}}
                  className="premium-card bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all border border-slate-100">
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 border-b border-slate-50 bg-slate-50/10">
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="size10 sm:size12 text-slate-400 uppercase tracking-widest font-bold mb-1">
                          {t("Order ID")}
                        </span>
                        <span className="size14 sm:size16 degular-semibold text-slate-800 truncate">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div
                        className={`px-3 sm:px-4 py-1.5 rounded-full border size10 sm:size12 degular-semibold uppercase tracking-wider shrink-0 ${getStatusStyles(order.status)}`}>
                        {t(order.status)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="size12 sm:size14" />
                        <span className="size11 sm:size12 font-medium">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {day: "2-digit", month: "short"},
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiClock className="size12 sm:size14" />
                        <span className="size11 sm:size12 font-medium">
                          {new Date(order.createdAt).toLocaleTimeString(
                            "en-US",
                            {hour: "2-digit", minute: "2-digit", hour12: true},
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span
                          className={`px-2 py-0.5 rounded-md size10 degular-semibold uppercase tracking-tight ${
                            order.paymentMethod === "UPI"
                              ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex flex-col grow">
                    <p className="size11 sm:size12 text-slate-400 uppercase tracking-widest font-bold mb-4">
                      {t("Items Summary")}
                    </p>
                    <div className="space-y-3 sm:space-y-4 md:mb-6">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="size13 sm:size14 degular-semibold text-slate-800 line-clamp-1">
                              {item.product?.name || t("Deleted Product")}
                            </span>
                            <span className="size11 sm:size12 text-slate-500">
                              {t("Qty: ")}
                              {item.quantity} x {item.product?.price}
                            </span>
                          </div>
                          <span className="size18 sm:size14 degular-semibold text-indigo-600 shrink-0">
                            ₹
                            {(item.product?.price || item.price) *
                              item.quantity || 0}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Payment Proof Logic */}
                    {order.paymentMethod === "UPI" && (
                      <div className="mt-auto pt-4 border-t border-slate-50">
                        {order.paymentScreenshot ? (
                          <div className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-50 flex items-center justify-center">
                            <img
                              src={`${import.meta.env.VITE_BASE_URL}${order.paymentScreenshot}`}
                              alt="Payment Proof"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <a
                                href={`${import.meta.env.VITE_BASE_URL}${order.paymentScreenshot}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-lg hover:scale-110 transition-transform">
                                <FiEye size={20} />
                              </a>
                            </div>
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                              <FiImage className="text-indigo-600 size14" />
                              <span className="size11 degular-semibold text-slate-700">
                                {t("Proof Uploaded")}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-indigo-50/50 border border-dashed border-indigo-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-50">
                              <FiCamera size={24} />
                            </div>
                            <div className="text-center">
                              <p className="size14 degular-semibold text-indigo-900 leading-none">
                                {t("Upload UPI Proof")}
                              </p>
                              <p className="size12 text-indigo-600/70 mt-1 font-medium italic">
                                {" "}
                                {t("Screenshot of your payment")}
                              </p>
                            </div>
                            <label className="w-full">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleUploadScreenshot(
                                    order._id,
                                    e.target.files[0],
                                  )
                                }
                              />
                              <div className="w-full py-2.5 bg-indigo-600 text-white rounded-xl size13 degular-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer">
                                <FiUpload size={16} /> {t("Choose File")}
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 sm:p-5 pt-0 mt-auto">
                    <div className="pt-4 sm:pt-5 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="size12 text-slate-500 degular-regular whitespace-nowrap">
                          {t("Total Amount")}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md size10 degular-semibold uppercase tracking-tight w-fit mt-1 ${
                            order.paymentStatus === "Paid"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}>
                          {t(order.paymentStatus)}
                        </span>
                      </div>
                      <span
                        className={`size24 sm:size24 degular-semibold ${
                          order.paymentStatus === "Paid"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}>
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
