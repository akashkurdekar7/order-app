import { useState, useEffect, useRef } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
    FiPackage,
    FiUsers,
    FiTruck,
    FiPlus,
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiX,
    FiChevronRight,
    FiTrendingUp,
    FiClock,
    FiShoppingBag,
    FiCamera,
    FiChevronDown
} from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -5 }}
        className="premium-card p-6 flex items-center gap-5"
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} text-white shadow-lg`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="size14 degular-semibold text-slate-400 uppercase tracking-wider">{label}</p>
            <h3 className="size24 degular-bold text-slate-800">{value}</h3>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalProducts: 0, totalUsers: 0, totalOrders: 0, totalSales: 0 });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [openStatusDropdown, setOpenStatusDropdown] = useState(null); // track which order ID dropdown is open
    const fileInputRef = useRef(null);

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        stock: "",
        image: null
    });

    useEffect(() => {
        fetchDashboardData();
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await API.get("/api/orders/getDashboardStats");
            setStats(res.data);
        } catch (error) {
            toast.error("Failed to fetch statistics");
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await API.get("/api/products/getProducts");
            setProducts(res.data);
        } catch (error) {
            toast.error("Failed to fetch products");
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await API.get("/api/orders/getAllOrders");
            setOrders(res.data);
        } catch (error) {
            toast.error("Failed to fetch orders");
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("price", newProduct.price);
        formData.append("stock", newProduct.stock);
        if (newProduct.image) {
            formData.append("image", newProduct.image);
        }

        try {
            if (editingId) {
                await API.put(`/api/products/updateProduct/${editingId}`, formData);
                toast.success("Product updated successfully");
            } else {
                await API.post("/api/products/addProduct", formData);
                toast.success("Product added successfully");
            }
            setIsProductModalOpen(false);
            setEditingId(null);
            resetForm();
            fetchProducts();
            fetchDashboardData();
        } catch (error) {
            toast.error(editingId ? "Failed to update product" : "Failed to add product");
        }
    };

    const resetForm = () => {
        setNewProduct({ name: "", price: "", stock: "", image: null });
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await API.delete(`/api/products/deleteProduct/${id}`);
            toast.success("Product deleted");
            fetchProducts();
            fetchDashboardData();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const handleEditProduct = (product) => {
        setEditingId(product._id);
        setNewProduct({
            name: product.name,
            price: product.price,
            stock: product.stock,
            image: null
        });
        setImagePreview(`${import.meta.env.VITE_BASE_URL}${product.image}`);
        setIsProductModalOpen(true);
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await API.put(`/api/orders/updateOrderStatus/${id}`, { status });
            toast.success("Order status updated");
            setOpenStatusDropdown(null);
            fetchOrders();
        } catch (error) {
            toast.error("Failed to update order status");
        }
    };

    // Close dropdown on outside click (simple implementation)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.status-dropdown-container')) {
                setOpenStatusDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const filteredProducts = products.filter(p =>
        p?.name?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
    );

    return (
        <div className="pb-20 pt-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="size32 degular-bold text-slate-800 mb-2">Admin Dashboard</h2>
                        <p className="size16 text-slate-500 font-medium">Monitor your business performance at a glance.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setEditingId(null);
                            resetForm();
                            setIsProductModalOpen(true);
                        }}
                        className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl degular-semibold size14 flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 w-full md:w-auto cursor-pointer"
                    >
                        <FiPlus size={20} /> Add New Product
                    </motion.button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={FiTruck} label="Total Orders" value={stats.totalOrders || 0} color="bg-blue-500" delay={0} />
                    <StatCard icon={FiUsers} label="Active Users" value={stats.totalUsers || 0} color="bg-indigo-500" delay={0.1} />
                    <StatCard icon={FiShoppingBag} label="Inventory" value={stats.totalProducts || 0} color="bg-orange-500" delay={0.2} />
                    <StatCard icon={FiTrendingUp} label="Total Sales" value={`₹${stats.totalSales || 0}`} color="bg-emerald-500" delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Products Management Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-effect rounded-[32px] overflow-hidden border border-slate-200/50">
                            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <FiTrendingUp size={20} />
                                    </div>
                                    <h3 className="size20 degular-semibold text-slate-800">Inventory Status</h3>
                                </div>
                                <div className="relative group w-full sm:w-auto">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 size14 degular-regular focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 size12 degular-bold text-slate-400 uppercase tracking-widest">Product</th>
                                            <th className="px-6 py-4 size12 degular-bold text-slate-400 uppercase tracking-widest">Stock Level</th>
                                            <th className="px-6 py-4 size12 degular-bold text-slate-400 uppercase tracking-widest text-right">Price</th>
                                            <th className="px-6 py-4 size12 degular-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredProducts.map((product) => (
                                            <motion.tr
                                                layout
                                                key={product._id}
                                                className="hover:bg-slate-50/50 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm">
                                                            {product.image && (
                                                                <img
                                                                    src={`${import.meta.env.VITE_BASE_URL}${product.image}`}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                                />
                                                            )}
                                                        </div>
                                                        <span className="size14 degular-semibold text-slate-800">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className={`size10 degular-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${product.stock === 0 ? "bg-red-50 text-red-600" :
                                                                product.stock <= 10 ? "bg-orange-50 text-orange-600" :
                                                                    "bg-emerald-50 text-emerald-600"
                                                                }`}>
                                                                {product.stock === 0 ? "Out of Stock" : product.stock <= 10 ? "Low Stock" : "Healthy"}
                                                            </span>
                                                            <span className="size12 degular-bold text-slate-400">{product.stock}</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                                className={`h-full ${product.stock === 0 ? "bg-red-500" :
                                                                    product.stock <= 10 ? "bg-orange-500" :
                                                                        "bg-emerald-500"
                                                                    }`}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="size14 degular-bold text-slate-800">₹{product.price}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all transform sm:translate-x-2 group-hover:translate-x-0">
                                                        <button
                                                            onClick={() => handleEditProduct(product)}
                                                            className="p-2 rounded-xl bg-white text-slate-400 hover:text-indigo-600 border border-slate-100 shadow-sm transition-all hover:border-indigo-100"
                                                        >
                                                            <FiEdit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProduct(product._id)}
                                                            className="p-2 rounded-xl bg-white text-slate-400 hover:text-red-500 border border-slate-100 shadow-sm transition-all hover:border-red-100"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredProducts.length === 0 && (
                                    <div className="py-20 text-center">
                                        <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-300">
                                            <FiSearch size={32} />
                                        </div>
                                        <p className="degular-semibold text-slate-400">{searchTerm ? `No products found for "${searchTerm}"` : "No products found"}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions Card */}
                    <div className="space-y-6">
                        <div className="glass-effect rounded-[32px] p-6 sm:p-8 h-full border border-slate-200/50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                        <FiClock size={20} />
                                    </div>
                                    <h3 className="size20 degular-semibold text-slate-800">Recent Transactions</h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {orders.slice(0, 8).map((order) => (
                                    <motion.div
                                        key={order._id}
                                        whileHover={{ x: 5 }}
                                        className="p-4 rounded-2xl bg-white/50 border border-slate-100/50 flex flex-col gap-3 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                    <FiPackage size={18} />
                                                </div>
                                                <div>
                                                    <p className="size14 degular-semibold text-slate-800 truncate max-w-[120px]">{order.user?.shopName || "Unregistered Shop"}</p>
                                                    <p className="size12 text-slate-400">#{order._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <p className="size14 degular-bold text-indigo-600">₹{order.totalAmount}</p>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 mt-2">
                                            <span className="size11 degular-semibold text-slate-400 uppercase tracking-wider">{order.items?.length} Items</span>

                                            <div className="relative status-dropdown-container">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenStatusDropdown(openStatusDropdown === order._id ? null : order._id);
                                                    }}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg size12 degular-semibold transition-all border ${order.status === "Delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                        order.status === "Out for Delivery" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            order.status === "Ready" ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                                                "bg-orange-50 text-orange-600 border-orange-100"
                                                        }`}
                                                >
                                                    {order.status || "Processing"}
                                                    <FiChevronDown size={14} className={`transition-transform duration-200 ${openStatusDropdown === order._id ? "rotate-180" : ""}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {openStatusDropdown === order._id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            transition={{ duration: 0.15 }}
                                                            className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 overflow-hidden cursor-pointer"
                                                        >
                                                            {["Processing", "Ready", "Out for Delivery", "Delivered"].map((statusOption) => (
                                                                <button
                                                                    key={statusOption}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateOrderStatus(order._id, statusOption);
                                                                    }}
                                                                    className={`cursor-pointer w-full text-left px-4 py-2 size12 degular-semibold transition-colors ${order.status === statusOption
                                                                        ? "bg-slate-50 text-indigo-600"
                                                                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                                                        }`}
                                                                >
                                                                    {statusOption}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {orders.length === 0 && (
                                    <div className="py-12 text-center text-slate-400">
                                        <p className="degular-semibold">No transactions found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            <AnimatePresence>
                {isProductModalOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsProductModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden relative z-70"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="size24 degular-bold text-slate-800">{editingId ? "Update Product" : "Add New Product"}</h3>
                                    <p className="size14 text-slate-500">Manage your wholesale inventory items.</p>
                                </div>
                                <button
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="cursor-pointer w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-center mb-6">
                                        <div
                                            onClick={() => fileInputRef.current.click()}
                                            className="w-40 h-40 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all cursor-pointer group relative overflow-hidden shadow-inner"
                                        >
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <FiCamera size={28} className="mb-2" />
                                                    <span className="size12 degular-semibold">Upload Image</span>
                                                </>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setNewProduct({ ...newProduct, image: file });
                                                        setImagePreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block size14 degular-semibold text-slate-400 mb-2 ml-1">Product Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 size16 degular-regular focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="e.g. Classic Blend Pack"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block size14 degular-semibold text-slate-400 mb-2 ml-1">Price (₹)</label>
                                            <input
                                                type="number"
                                                required
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 size16 degular-regular focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block size14 degular-semibold text-slate-400 mb-2 ml-1">Initial Stock</label>
                                            <input
                                                type="number"
                                                required
                                                value={newProduct.stock}
                                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 size16 degular-regular focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className=" cursor-pointer flex-1 bg-indigo-600 text-white py-4 rounded-2xl size16 degular-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        {editingId ? "Update Item" : "Confirm Listing"}
                                    </motion.button>
                                    <button
                                        type="button"
                                        onClick={() => setIsProductModalOpen(false)}
                                        className=" cursor-pointer flex-1 bg-slate-50 text-slate-500 py-4 rounded-2xl size16 degular-semibold hover:bg-slate-100 transition-all"
                                    >
                                        Discard
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
