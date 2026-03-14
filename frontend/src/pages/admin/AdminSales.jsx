import React, {useEffect, useState} from "react";
import API from "../../api/axios";
import {
  FiTrendingUp,
  FiSearch,
  FiCalendar,
  FiShoppingBag,
  FiArrowUpRight,
  FiFilter,
  FiDownload,
} from "react-icons/fi";
import {FaIndianRupeeSign} from "react-icons/fa6";
import {IoCloudDoneOutline} from "react-icons/io5";
import {motion, AnimatePresence} from "framer-motion";
import toast from "react-hot-toast";

const StatCard = ({title, value, subtext, icon: Icon, color, delay = 0}) => {
  const colorMap = {
    emerald: {bg: "bg-amber-100", text: "text-amber-600"},
    indigo: {bg: "bg-indigo-100", text: "text-indigo-600"},
    orange: {bg: "bg-orange-100", text: "text-orange-600"},
    pink: {bg: "bg-pink-100", text: "text-pink-600"},
    red: {bg: "bg-red-100", text: "text-red-600"},
  };
  const colors = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay}}
      className={`premium-card p-6 flex flex-col gap-4 border-slate-100 bg-white shadow-sm hover:shadow-md transition-all`}>
      <div className="flex justify-between items-start">
        <div
          className={`p-3 rounded-2xl ${colors.bg} flex items-center justify-center`}>
          <Icon size={20} className={colors.text} />
        </div>
        <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
          <FiArrowUpRight size={12} />
          <span className="size11 degular-semibold">Live</span>
        </div>
      </div>
      <div>
        <span className="size12 degular-semibold text-slate-400 uppercase tracking-widest">
          {title}
        </span>
        <h3 className="size28 degular-semibold text-slate-800 mt-1">{value}</h3>
        <p className="size13 text-slate-500 mt-1">{subtext}</p>
      </div>
    </motion.div>
  );
};

const AdminSales = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/api/orders/getSalesReports");
      setSales(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sales reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (sales.length === 0) {
      toast.error("No data to export");
      return;
    }

    setIsExporting(true);
    setTimeout(() => {
      try {
        const headers = [
          "Phone Number",
          "Shop Name",
          "Vendor Name",
          "Month",
          "Total Orders",
          "Total Sales (INR)",
          "Balance Due (INR)",
        ];
        const csvContent = [
          headers.join(","),
          ...filteredSales.map((item) =>
            [
              `"${item.phone || "N/A"}"`,
              `"${item.shopName}"`,
              `"${item.personName}"`,
              item.month,
              item.totalOrders,
              item.totalSales,
              item.totalBalance,
            ].join(","),
          ),
        ].join("\n");

        const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `sales_report_${new Date().toISOString().split("T")[0]}.csv`,
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Sales report exported!");
      } catch (err) {
        toast.error("Export failed");
      } finally {
        setIsExporting(false);
      }
    }, 800);
  };

  // Derived Statistics
  const totalRevenue = sales.reduce((acc, curr) => acc + curr.totalSales, 0);
  const totalBalanceDue = sales.reduce(
    (acc, curr) => acc + curr.totalBalance,
    0,
  );
  const totalOrdersCount = sales.reduce(
    (acc, curr) => acc + curr.totalOrders,
    0,
  );
  const avgOrderValue =
    totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : 0;

  // Find busiest month
  const monthStats = sales.reduce((acc, curr) => {
    acc[curr.month] = (acc[curr.month] || 0) + curr.totalSales;
    return acc;
  }, {});
  const busyMonth =
    Object.entries(monthStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const filteredSales = sales.filter((item) => {
    const matchesSearch =
      item.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.personName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth =
      selectedMonth === "All" || item.month === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  const uniqueMonths = ["All", ...new Set(sales.map((item) => item.month))];

  return (
    <section className="min-h-screen pb-20 md:pt-8 pt-2 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between md:gap-6 gap-3 md:mb-8 mb-5">
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <FiTrendingUp size={14} />
                <span className="size12 degular-semibold uppercase tracking-widest">
                  Revenue Intelligence
                </span>
              </div>
              <h1 className="size32 degular-semibold text-slate-800">
                Sales Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className={`bg-slate-900 text-white px-5 py-2.5 rounded-xl degular-semibold size14 flex items-center justify-center gap-2 shadow-lg shadow-slate-100 transition-all hover:bg-slate-800 cursor-pointer disabled:opacity-70 disabled:cursor-wait`}>
                {isExporting ? (
                  <>
                    <IoCloudDoneOutline size={18} /> Saving...
                  </>
                ) : (
                  <>
                    <FiDownload size={18} /> Export CSV
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              subtext="Cumulative gross sales"
              icon={FaIndianRupeeSign}
              color="emerald"
            />
            <StatCard
              title="Average Order"
              value={`₹${avgOrderValue}`}
              subtext="Revenue per transaction"
              icon={FiTrendingUp}
              color="indigo"
              delay={0.1}
            />
            <StatCard
              title="Total Volume"
              value={totalOrdersCount}
              subtext="Total orders processed"
              icon={FiShoppingBag}
              color="orange"
              delay={0.2}
            />
            <StatCard
              title="Balance Due"
              value={`₹${totalBalanceDue.toLocaleString()}`}
              subtext="Outstanding payments"
              icon={FaIndianRupeeSign}
              color="red"
              delay={0.3}
            />
          </div>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by vendor or shop name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 size15 degular-medium outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm min-w-[200px]">
            <FiFilter className="text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none outline-none size14 degular-semibold text-slate-600 w-full cursor-pointer">
              {uniqueMonths.map((m) => (
                <option key={m} value={m}>
                  {m === "All" ? "All Months" : m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sales Table */}
        <div className="glass-effect rounded-[32px] overflow-hidden border border-slate-200/50 shadow-xl bg-white/50 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 size11 degular-semibold text-slate-400 uppercase tracking-widest">
                    Shop Information
                  </th>
                  <th className="px-8 py-5 size11 degular-semibold text-slate-400 uppercase tracking-widest">
                    Reporting Period
                  </th>
                  <th className="px-8 py-5 size11 degular-semibold text-slate-400 uppercase tracking-widest text-center">
                    Orders
                  </th>
                  <th className="px-8 py-5 size11 degular-semibold text-slate-400 uppercase tracking-widest text-right">
                    Balance
                  </th>
                  <th className="px-8 py-5 size11 degular-semibold text-slate-400 uppercase tracking-widest text-right">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td
                        colSpan="4"
                        className="px-8 py-6 h-20 bg-slate-50/20"
                      />
                    </tr>
                  ))
                ) : filteredSales.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {filteredSales.map((item) => (
                      <motion.tr
                        layout
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        key={`${item.shopName}-${item.month}`}
                        className="hover:bg-indigo-50/10 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="size15 degular-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                              {item.shopName}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="size13 text-slate-500 font-medium">
                                {item.personName}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="size13 text-slate-400">
                                {item.phone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-600">
                            <FiCalendar size={14} className="text-slate-400" />
                            <span className="size14 degular-semibold">
                              {item.month}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 size13 degular-semibold">
                            {item.totalOrders}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span
                            className={`size15 degular-semibold ${item.totalBalance > 0 ? "text-red-500" : "text-emerald-500"}`}>
                            ₹{item.totalBalance.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className="size16 degular-semibold text-slate-800">
                              ₹{item.totalSales.toLocaleString()}
                            </span>
                            <span className="size11 degular-semibold text-emerald-500 uppercase tracking-tighter mt-1">
                              Settled
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan="4" className="py-24 text-center">
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <FiSearch size={32} />
                      </div>
                      <p className="size16 degular-semibold text-slate-400">
                        No sales records found for this selection.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminSales;
