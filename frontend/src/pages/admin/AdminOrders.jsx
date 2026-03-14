import {useEffect, useState} from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiChevronRight,
  FiX,
  FiRotateCw,
  FiMapPin,
  FiShoppingBag,
  FiChevronDown,
  FiImage,
  FiEye,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import {motion, AnimatePresence} from "framer-motion";
import {useTranslation} from "react-i18next";

const AdminOrders = () => {
  const {t} = useTranslation();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCustomerInfoOpen, setIsCustomerInfoOpen] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/api/orders/getAllOrders");
      setOrders(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/api/orders/updateOrderStatus/${orderId}`, {status});
      toast.success(`Order marked as ${status}`);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({...prev, status}));
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleUpdatePaymentStatus = async (
    orderId,
    paymentStatus,
    paymentMethod,
  ) => {
    try {
      const data = {};
      if (paymentStatus) data.paymentStatus = paymentStatus;
      if (paymentMethod) data.paymentMethod = paymentMethod;

      await API.put(`/api/orders/updatePaymentStatus/${orderId}`, data);
      toast.success("Payment details updated");
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          ...(paymentStatus && {paymentStatus}),
          ...(paymentMethod && {paymentMethod}),
        }));
      }
    } catch (error) {
      toast.error("Failed to update payment status");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".status-dropdown-container")) {
        setIsStatusDropdownOpen(false);
      }
      if (!e.target.closest(".payment-dropdown-container")) {
        setIsPaymentDropdownOpen(false);
      }
      if (!e.target.closest(".method-dropdown-container")) {
        setIsMethodDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const activeOrders = orders.filter(
    (o) => !(o.status === "Delivered" && o.paymentStatus === "Paid"),
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Processing":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Ready":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "Out for Delivery":
        return "bg-blue-50 text-blue-600 border-blue-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 1, transition: {staggerChildren: 0.05}},
  };

  const itemVariants = {
    hidden: {opacity: 0, y: 10},
    visible: {opacity: 1, y: 0},
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="size32 degular-semibold text-slate-800 mb-2">
              {t("Order Management")}
            </h2>
            <p className="size16 text-slate-500 font-medium">
              {t("Track and process your wholesale customer orders.")}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl size14 degular-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
            <FiRotateCw
              size={16}
              className={isRefreshing || isLoading ? "animate-spin" : ""}
            />{" "}
            {t("Refresh Orders")}
          </button>
        </header>

        {/* Mobile Orders List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 md:hidden">
          {activeOrders.map((order) => (
            <motion.div
              key={order._id}
              variants={itemVariants}
              onClick={() => setSelectedOrder(order)}
              className="premium-card p-5 cursor-pointer bg-white group hover:border-indigo-200 transition-all border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className="size12 degular-semibold text-slate-400 uppercase tracking-widest mb-1 leading-none">
                    {t("Order ID")}
                  </span>
                  <span className="size18 degular-semibold text-slate-800">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`px-3 py-1.5 rounded-full border text-[10px] degular-semibold uppercase tracking-wider ${getStatusStyle(order.status || "Processing")}`}>
                    {t(order.status || "Processing")}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-full border text-[10px] degular-semibold uppercase tracking-wider ${
                      order.paymentStatus === "Paid"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}>
                    {t("payment")} {t(order.paymentStatus || "Pending")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiUser size={14} className="text-slate-400" />
                  <span className="size15 degular-semibold text-slate-600 truncate">
                    {order.user?.shopName || order.user?.personName}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] degular-semibold uppercase tracking-tight ${
                    order.paymentMethod === "UPI"
                      ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}>
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <FiCalendar size={14} />
                  <span className="size13 degular-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="size16 degular-semibold text-indigo-600">
                    ₹{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          {!isLoading && activeOrders.length === 0 && (
            <div className="p-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <FiPackage size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="degular-semibold text-slate-400">
                {t("No orders yet")}
              </p>
            </div>
          )}
        </motion.div>

        {/* Desktop Table View */}
        <div className="hidden md:block glass-effect rounded-[32px] overflow-hidden border border-slate-200/50">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 size12 degular-semibold text-slate-400 uppercase tracking-widest">
                  {t("Order Details")}
                </th>
                <th className="px-6 py-5 size12 degular-semibold text-slate-400 uppercase tracking-widest">
                  {t("Customer")}
                </th>
                <th className="px-6 py-5 size12 degular-semibold text-slate-400 uppercase tracking-widest">
                  {t("Date")}
                </th>
                <th className="px-6 py-5 size12 degular-semibold text-slate-400 uppercase tracking-widest">
                  {t("Status")}
                </th>
                <th className="px-6 py-5 size12 degular-semibold text-slate-400 uppercase tracking-widest">
                  {t("Payment")}
                </th>
                <th className="px-6 py-5 size12 degular-semibold text-slate-400 uppercase tracking-widest text-right">
                  {t("Total")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeOrders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <FiPackage size={18} />
                      </div>
                      <span className="size15 degular-semibold text-slate-800">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="size15 degular-semibold text-slate-800 truncate max-w-[180px]">
                        {order.user?.shopName}
                      </span>
                      <span className="size12 text-slate-400 capitalize">
                        {order.user?.personName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
                      <FiCalendar size={14} />
                      <span className="size14">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1.5 rounded-full border text-[11px] degular-semibold uppercase tracking-wider whitespace-nowrap ${getStatusStyle(order.status || "Processing")}`}>
                      {t(order.status || "Processing")}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`px-3 py-1.5 rounded-full border text-[11px] degular-semibold uppercase tracking-wider whitespace-nowrap ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}>
                        {t(order.paymentStatus || "Pending")}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] w-fit degular-semibold uppercase tracking-tight ${
                          order.paymentMethod === "UPI"
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                        {order.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 group-hover:translate-x-[-4px] transition-transform">
                      <span className="size16 degular-semibold text-slate-900 font-bold">
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                      <FiChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && activeOrders.length === 0 && (
            <div className="py-24 text-center">
              <FiPackage size={56} className="mx-auto text-slate-200 mb-4" />
              <p className="size18 degular-semibold text-slate-400">
                {t("Your order queue is currently empty.")}
              </p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                onClick={() => setSelectedOrder(null)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              />

              <motion.div
                initial={{opacity: 0, scale: 0.95, y: 20}}
                animate={{opacity: 1, scale: 1, y: 0}}
                exit={{opacity: 0, scale: 0.95, y: 20}}
                className="bg-white rounded-[32px] overflow-hidden w-full max-w-2xl relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 sm:p-8  border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="size24 degular-semibold text-slate-800">
                        {t("Order ID")} #
                        {selectedOrder._id.slice(-6).toUpperCase()}
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-full border text-[10px] degular-semibold uppercase tracking-wider ${getStatusStyle(selectedOrder.status || "Processing")}`}>
                        {t(selectedOrder.status || "Processing")}
                      </span>
                    </div>
                    <p className="size14 text-slate-500 font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100 shadow-sm cursor-pointer">
                    <FiX size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
                  {/* Customer & Payment Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
                      <div
                        className="flex items-center justify-between text-indigo-600 cursor-pointer select-none"
                        onClick={() =>
                          setIsCustomerInfoOpen(!isCustomerInfoOpen)
                        }>
                        <div className="flex items-center gap-2">
                          <FiUser size={18} />
                          <h4 className="size14 degular-semibold uppercase tracking-widest">
                            {t("Customer Info")}
                          </h4>
                        </div>
                        <button className="p-1 rounded-full hover:bg-slate-200/50 transition-colors text-slate-400 hover:text-indigo-600">
                          {isCustomerInfoOpen ? (
                            <FiMinus size={16} />
                          ) : (
                            <FiPlus size={16} />
                          )}
                        </button>
                      </div>
                      <AnimatePresence>
                        {isCustomerInfoOpen && (
                          <motion.div
                            initial={{height: 0, opacity: 0, marginTop: 0}}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              marginTop: 16,
                            }}
                            exit={{height: 0, opacity: 0, marginTop: 0}}
                            className="space-y-3 overflow-hidden">
                            <div>
                              <p className="size12 text-slate-400 uppercase tracking-tighter mb-0.5 font-bold">
                                {t("Shop Name")}
                              </p>
                              <p className="size15 degular-semibold text-slate-800">
                                {selectedOrder.user?.shopName}
                              </p>
                            </div>
                            <div>
                              <p className="size12 text-slate-400 uppercase tracking-tighter mb-0.5 font-bold">
                                {t("Contact Person")}
                              </p>
                              <p className="size14 degular-semibold text-slate-600">
                                {selectedOrder.user?.personName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiMapPin className="text-slate-400" size={14} />
                              <p className="size13 text-slate-500 leading-relaxed font-medium">
                                {selectedOrder.user?.location}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-4 text-emerald-600">
                        <FiCheckCircle size={18} />
                        <h4 className="size14 degular-semibold uppercase tracking-widest">
                          {t("Payment Status")}
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="relative payment-dropdown-container w-full">
                          {selectedOrder.paymentStatus === "Paid" ? (
                            <div className="flex items-center justify-between w-full border rounded-xl px-4 py-2.5 size14 degular-semibold outline-none shadow-sm bg-emerald-50 text-emerald-700 border-emerald-100">
                              <span>{t("Payment: Completed")}</span>
                              <FiCheckCircle
                                size={16}
                                className="text-emerald-500"
                              />
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPaymentDropdownOpen(
                                    !isPaymentDropdownOpen,
                                  );
                                }}
                                className="flex items-center justify-between w-full border rounded-xl px-4 py-2.5 size14 degular-semibold outline-none transition-all shadow-sm cursor-pointer bg-red-50 text-red-600 border-red-200">
                                <span>{t("Payment: Pending")}</span>
                                <FiChevronDown
                                  size={16}
                                  className={`transition-transform duration-200 ${isPaymentDropdownOpen ? "rotate-180" : ""}`}
                                />
                              </button>
                              <AnimatePresence>
                                {isPaymentDropdownOpen && (
                                  <motion.div
                                    initial={{opacity: 0, y: 10, scale: 0.95}}
                                    animate={{opacity: 1, y: 0, scale: 1}}
                                    exit={{opacity: 0, y: 10, scale: 0.95}}
                                    transition={{duration: 0.15}}
                                    className="absolute top-full left-0 right-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-70 overflow-hidden">
                                    {[
                                      {
                                        value: "Pending",
                                        label: t("Payment: Pending"),
                                      },
                                      {
                                        value: "Paid",
                                        label: t("Payment: Completed"),
                                      },
                                    ].map((statusOption) => (
                                      <button
                                        key={statusOption.value}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdatePaymentStatus(
                                            selectedOrder._id,
                                            statusOption.value,
                                          );
                                          setIsPaymentDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-5 py-2.5 size14 degular-semibold transition-colors ${
                                          selectedOrder.paymentStatus ===
                                          statusOption.value
                                            ? "bg-slate-50 text-indigo-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                        }`}>
                                        {statusOption.label}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <p className="size12 text-slate-400 uppercase tracking-tighter mb-1 font-bold">
                              {t("Total Amount Due")}
                            </p>
                            <p className="size24 degular-semibold text-indigo-600">
                              ₹{selectedOrder.totalAmount?.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="size12 text-slate-400 uppercase tracking-tighter mb-1 font-bold">
                              {t("Method")}
                            </p>
                            <div className="relative method-dropdown-container flex flex-col items-end gap-2 text-left">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsMethodDropdownOpen(
                                    !isMethodDropdownOpen,
                                  );
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg size11 degular-semibold uppercase tracking-tight bg-slate-50 border border-slate-200 text-slate-700 outline-none cursor-pointer hover:border-indigo-300 transition-colors">
                                {selectedOrder.paymentMethod}
                                <FiChevronDown
                                  size={14}
                                  className={`transition-transform duration-200 ${isMethodDropdownOpen ? "rotate-180" : ""}`}
                                />
                              </button>
                              <AnimatePresence>
                                {isMethodDropdownOpen && (
                                  <motion.div
                                    initial={{opacity: 0, y: 10, scale: 0.95}}
                                    animate={{opacity: 1, y: 0, scale: 1}}
                                    exit={{opacity: 0, y: 10, scale: 0.95}}
                                    transition={{duration: 0.15}}
                                    className="absolute top-full right-0 mt-2 w-28 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-70 overflow-hidden text-left">
                                    {["Cash", "UPI"].map((methodOption) => (
                                      <button
                                        key={methodOption}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdatePaymentStatus(
                                            selectedOrder._id,
                                            selectedOrder.paymentStatus,
                                            methodOption,
                                          );
                                          setIsMethodDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 size12 degular-semibold uppercase tracking-tight transition-colors ${
                                          selectedOrder.paymentMethod ===
                                          methodOption
                                            ? "bg-slate-50 text-indigo-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                        }`}>
                                        {methodOption}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        {/* Admin Payment Proof View */}
                        {selectedOrder.paymentMethod === "UPI" && (
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="size12 text-slate-400 uppercase tracking-tighter mb-2 font-bold">
                              {t("Payment Proof (UPI)")}
                            </p>
                            {selectedOrder.paymentScreenshot ? (
                              <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-white">
                                <img
                                  src={`${import.meta.env.VITE_BASE_URL}${selectedOrder.paymentScreenshot}`}
                                  alt="Payment Proof"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <a
                                    href={`${import.meta.env.VITE_BASE_URL}${selectedOrder.paymentScreenshot}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-xl hover:scale-110 transition-transform">
                                    <FiEye size={20} />
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-red-50/50 border border-dashed border-red-200 rounded-xl p-4 flex items-center justify-center gap-2">
                                <FiImage className="text-red-400" size={18} />
                                <span className="size13 degular-semibold text-red-600">
                                  {t("No proof uploaded yet")}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <FiShoppingBag size={18} className="text-slate-400" />
                      <h4 className="size15 degular-semibold uppercase tracking-widest text-slate-800">
                        {t("Order Items")}
                      </h4>
                      <span className="ml-auto size12 degular-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {selectedOrder.items?.length} {t("items")}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                          {/* <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                            {item.product?.image ? (
                              <img
                                src={`${import.meta.env.VITE_BASE_URL}${item.product.image}`}
                                className="w-full h-full object-cover rounded-xl"
                                alt={item.product?.name}
                              />
                            ) : (
                              <FiPackage size={24} />
                            )}
                          </div> */}
                          <div className="flex-1 min-w-0">
                            <p className="size15 degular-semibold text-slate-800 truncate">
                              {item.product?.name}
                            </p>
                            <p className="size16 text-slate-400 font-medium">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                          <p className="size20 degular-semibold text-slate-800">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6">
                  <div className="w-full sm:w-1/2">
                    <label className="block size12 degular-semibold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      {t("Current Progress")}
                    </label>
                    <div className="relative status-dropdown-container w-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsStatusDropdownOpen(!isStatusDropdownOpen);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl size15 degular-semibold transition-all border outline-none shadow-sm cursor-pointer ${
                          selectedOrder.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : selectedOrder.status === "Out for Delivery"
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : selectedOrder.status === "Ready"
                                ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                                : !selectedOrder.status ||
                                    selectedOrder.status === "Processing"
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}>
                        <span className="flex items-center gap-2 ">
                          {(!selectedOrder.status ||
                            selectedOrder.status === "Processing") &&
                            `📦 ${t("Processing")}`}
                          {selectedOrder.status === "Ready" &&
                            `⚡ ${t("Ready")}`}
                          {selectedOrder.status === "Out for Delivery" &&
                            `🚚 ${t("Out for Delivery")}`}
                          {selectedOrder.status === "Delivered" &&
                            `✔️ ${t("Delivered")}`}
                          {/* Fallback just in case */}
                          {selectedOrder.status &&
                            ![
                              "Processing",
                              "Ready",
                              "Out for Delivery",
                              "Delivered",
                            ].includes(selectedOrder.status) &&
                            selectedOrder.status}
                        </span>
                        <FiChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isStatusDropdownOpen && (
                          <motion.div
                            initial={{opacity: 0, y: -10, scale: 0.95}}
                            animate={{opacity: 1, y: 0, scale: 1}}
                            exit={{opacity: 0, y: -10, scale: 0.95}}
                            transition={{duration: 0.15}}
                            className="absolute bottom-full left-0 right-0 mb-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-70 overflow-hidden">
                            {[
                              {
                                value: "Processing",
                                label: `📦 ${t("Processing")}`,
                              },
                              {
                                value: "Ready",
                                label: `⚡ ${t("Mark as Ready")}`,
                              },
                              {
                                value: "Out for Delivery",
                                label: `🚚 ${t("Out for Delivery")}`,
                              },
                              {
                                value: "Delivered",
                                label: `✔️ ${t("Delivered")}`,
                              },
                            ].map((statusOption) => (
                              <button
                                key={statusOption.value}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateOrderStatus(
                                    selectedOrder._id,
                                    statusOption.value,
                                  );
                                  setIsStatusDropdownOpen(false);
                                }}
                                className={`w-full text-left px-5 py-3 size14 degular-semibold transition-colors cursor-pointer ${
                                  selectedOrder.status === statusOption.value
                                    ? "bg-slate-50 text-indigo-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                }`}>
                                {statusOption.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-full sm:w-auto px-6 sm:px-8 bg-slate-900 text-white rounded-xl size16 py-3.5 degular-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 cursor-pointer border border-slate-900">
                    {t("Close Details")}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminOrders;
