import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import toast from 'react-hot-toast';
import { FiPackage, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';

function MyOrders() {
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
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 sm:mb-12 text-center sm:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="size28 sm:size32 degular-semibold text-slate-900 mb-2"
          >
            Order History
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="size14 sm:size16 text-slate-500"
          >
            Track and manage your wholesale supplies.
          </motion.p>
        </header>

        {orders.length === 0 && !loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <FiPackage className="text-slate-300 size32" />
            </div>
            <h3 className="size20 degular-semibold text-slate-800 mb-1">No orders yet</h3>
            <p className="size14 text-slate-500">When you place an order, it will appear here.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="premium-card bg-white overflow-hidden flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 border-b border-slate-50 bg-slate-50/30">
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="size10 sm:size12 text-slate-400 uppercase tracking-widest font-bold mb-1">Order ID</span>
                        <span className="size14 sm:size16 degular-semibold text-slate-800 truncate">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className={`px-3 sm:px-4 py-1.5 rounded-full border size10 sm:size12 degular-semibold uppercase tracking-wider shrink-0 ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="size12 sm:size14" />
                        <span className="size11 sm:size12 font-medium">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiClock className="size12 sm:size14" />
                        <span className="size11 sm:size12 font-medium">
                          {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 grow">
                    <p className="size11 sm:size12 text-slate-400 uppercase tracking-widest font-bold mb-4">Items Summary</p>
                    <div className="space-y-3 sm:space-y-4">
                      {order.items.map((item) => (
                        <div key={item._id} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="size13 sm:size14 degular-semibold text-slate-800 line-clamp-1">
                              {item.product?.name || "Deleted Product"}
                            </span>
                            <span className="size11 sm:size12 text-slate-500">Qty: {item.quantity}</span>
                          </div>
                          <span className="size13 sm:size14 degular-semibold text-indigo-600 shrink-0">
                            ₹{item.product?.price * item.quantity || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 sm:p-5 pt-0 mt-auto">
                    <div className="pt-4 sm:pt-5 border-t border-slate-100 flex justify-between items-center">
                      <span className="size12 sm:size14 text-slate-500 degular-regular">Total Amount</span>
                      <span className="size20 sm:size24 degular-semibold text-slate-900">₹{order.totalAmount}</span>
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