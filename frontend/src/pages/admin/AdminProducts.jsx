import { useEffect, useState, useRef } from 'react';
import API from '../../api/axios';
import { FiPackage, FiSearch, FiPlus, FiArrowLeft, FiEdit2, FiTrash2, FiCamera, FiX, FiTrendingUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const AdminProductCard = ({ product, onEdit, onDelete }) => {
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 10;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card flex flex-col h-full bg-white p-3 group relative overflow-hidden"
        >
            {/* Image Section */}
            <div className="product-img-wrapper relative mb-4 h-48 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                {product.image ? (
                    <img
                        src={`${import.meta.env.VITE_BASE_URL}${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FiPackage size={40} />
                    </div>
                )}
                
                {/* Stock & Sold Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isOutOfStock ? (
                        <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                            Sold Out
                        </div>
                    ) : isLowStock ? (
                        <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                            Low Stock: {product.stock}
                        </div>
                    ) : (
                        <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                            Stock: {product.stock}
                        </div>
                    )}
                </div>

                {/* Sold Count Badge (Top Right) */}
                <div className="absolute top-3 right-3">
                    <div className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg border border-white/10 flex items-center gap-1">
                         <FiTrendingUp size={10} className="text-emerald-400" />
                         <span>{product.soldCount || 0} Sold</span>
                    </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                        onClick={() => onEdit(product)}
                        className="w-10 h-10 rounded-full bg-white text-slate-800 hover:text-indigo-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all cursor-pointer"
                    >
                        <FiEdit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(product._id)}
                        className="w-10 h-10 rounded-full bg-white text-slate-800 hover:text-red-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all cursor-pointer"
                    >
                        <FiTrash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col grow px-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="size16 degular-bold text-slate-800 truncate">
                        {product.name}
                    </h3>
                    <span className="size16 degular-bold text-indigo-600 shrink-0">
                        ₹{product.price}
                    </span>
                </div>
                
                <p className="size13 text-slate-500 line-clamp-2 mb-4 h-9 leading-tight">
                    {product.description || "Premium wholesale selection tailored for your professional needs."}
                </p>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="size11 degular-bold text-slate-400 uppercase tracking-widest">Stock Level</span>
                    <div className="flex items-center gap-2">
                         <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                className={`h-full ${isOutOfStock ? "bg-red-500" : isLowStock ? "bg-amber-500" : "bg-emerald-500"}`}
                            />
                        </div>
                        <span className="size12 degular-bold text-slate-600">{product.stock}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        stock: "",
        image: null,
        description: "" // Added description to state
    });

    const [stats, setStats] = useState({ totalUnitsSold: 0 });

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await API.get("/api/orders/getDashboardStats");
            setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await API.get("/api/products/getProducts");
            setProducts(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("price", newProduct.price);
        formData.append("stock", newProduct.stock);
        formData.append("description", newProduct.description); // Append description
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
        } catch (error) {
            toast.error(editingId ? "Failed to update product" : "Failed to add product");
        }
    };

    const resetForm = () => {
        setNewProduct({ name: "", price: "", stock: "", image: null, description: "" });
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await API.delete(`/api/products/deleteProduct/${id}`);
            toast.success("Product deleted");
            fetchProducts();
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
            description: product.description || "",
            image: null
        });
        setImagePreview(product.image ? `${import.meta.env.VITE_BASE_URL}${product.image}` : null);
        setIsProductModalOpen(true);
    };

    const filteredProducts = products.filter(product =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalStock = products.reduce((acc, curr) => acc + (curr.stock || 0), 0);

    return (
        <section className="min-h-screen pb-20 pt-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <FiPackage size={14} />
                                <span className="size12 degular-bold uppercase tracking-widest">Inventory Control</span>
                            </div>
                            <h1 className="size32 degular-bold text-slate-800">Product Management</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setEditingId(null);
                                    resetForm();
                                    setIsProductModalOpen(true);
                                }}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl degular-bold size14 flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 cursor-pointer"
                            >
                                <FiPlus size={20} /> Add New Product
                            </motion.button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search inventory by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 size15 degular-medium outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="premium-card p-6 flex flex-col gap-1 border-emerald-100 bg-emerald-50/30"
                    >
                        <span className="size11 degular-bold text-emerald-600 uppercase tracking-widest">Total Products Sold</span>
                        <div className="flex items-baseline gap-2">
                            <h3 className="size28 degular-bold text-slate-800">{stats.totalUnitsSold || 0}</h3>
                            <span className="size14 text-slate-400 degular-medium">Units</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="premium-card p-6 flex flex-col gap-1 border-indigo-100 bg-indigo-50/30"
                    >
                        <span className="size11 degular-bold text-indigo-600 uppercase tracking-widest">Available In Stock</span>
                        <div className="flex items-baseline gap-2">
                            <h3 className="size28 degular-bold text-slate-800">{totalStock}</h3>
                            <span className="size14 text-slate-400 degular-medium">Items</span>
                        </div>
                    </motion.div>
                </div>

                {/* Grid View */}
                {isLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[3/4] rounded-[32px] bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {filteredProducts.map((product) => (
                            <AdminProductCard
                                key={product._id}
                                product={product}
                                onEdit={handleEditProduct}
                                onDelete={deleteProduct}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center glass-effect rounded-[40px] border border-dashed border-slate-200">
                        <FiPackage size={56} className="mx-auto text-slate-200 mb-4" />
                        <p className="size18 degular-semibold text-slate-400">
                            {searchTerm ? `No products found for "${searchTerm}"` : "No products found in your inventory."}
                        </p>
                    </div>
                )}

                {/* Add/Edit Product Modal */}
                <AnimatePresence>
                    {isProductModalOpen && (
                        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsProductModalOpen(false)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden relative z-70"
                            >
                                <div className="p-8 pb-4 border-b border-slate-50 flex items-center justify-between">
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
                                    <div className="space-y-5">
                                        <div className="flex justify-center">
                                            <div
                                                onClick={() => fileInputRef.current.click()}
                                                className="w-32 h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all cursor-pointer group relative overflow-hidden shadow-inner"
                                            >
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <FiCamera size={24} className="mb-2" />
                                                        <span className="size11 degular-semibold">Upload Image</span>
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

                                        <div className="grid grid-cols-1 gap-5">
                                            <div>
                                                <label className="block size12 degular-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Product Details</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newProduct.name}
                                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 size15 degular-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                                    placeholder="Product Name"
                                                />
                                            </div>

                                            <div>
                                                <textarea
                                                    rows="2"
                                                    value={newProduct.description}
                                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 size15 degular-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                                                    placeholder="Product Description"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block size12 degular-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={newProduct.price}
                                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 size15 degular-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block size12 degular-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Stock Qty</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={newProduct.stock}
                                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 size15 degular-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4 mb-2">
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className=" cursor-pointer flex-1 bg-slate-900 text-white py-4 rounded-3xl size16 degular-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                        >
                                            {editingId ? "Save Changes" : "List Product"}
                                        </motion.button>
                                        <button
                                            type="button"
                                            onClick={() => setIsProductModalOpen(false)}
                                            className=" cursor-pointer flex-1 bg-slate-100 text-slate-500 py-4 rounded-3xl size16 degular-bold hover:bg-slate-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default AdminProducts;
