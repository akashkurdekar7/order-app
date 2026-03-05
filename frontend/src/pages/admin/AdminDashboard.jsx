import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";

function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const fileInputRef = useRef(null);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        stock: "",
        image: null,
        preview: "",
    });

    useEffect(() => {
        fetchDashboard();
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get("/api/products/getProducts");
            setProducts(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const deleteProduct = async (id) => {
        try {
            await API.delete(`/api/products/deleteProduct/${id}`);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const editProduct = (product) => {
        setOpenModal(true);
        setNewProduct({
            ...product,
            image: null,
            preview: product.image
                ? `${import.meta.env.VITE_BASE_URL}${product.image}`
                : ""
        });
        setEditingId(product._id);
    };

    const fetchDashboard = async () => {
        try {
            const res = await API.get("/api/orders/getDashboardStats");
            setStats(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await API.get("/api/orders/getAllOrders");
            setOrders(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/api/orders/updateOrderStatus/${id}`, { status });
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();

        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            toast.error("Please fill all fields");
            return;
        }

        if (!editingId && !newProduct.image) {
            toast.error("Please upload an image");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", newProduct.name);
            formData.append("price", newProduct.price);
            formData.append("stock", newProduct.stock);
            if (newProduct.image) {
                formData.append("image", newProduct.image);
            }
            if (editingId) {
                await API.put(`/api/products/updateProduct/${editingId}`, formData);
                toast.success("Product updated");
                setEditingId(null);
            } else {
                await API.post("/api/products/addProduct", formData);
                toast.success("Product added");
            }

            setNewProduct({ name: "", price: "", stock: "", image: null, preview: "" });
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setOpenModal(false);
            fetchProducts();

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <section className="min-h-screen bg-gray-100 p-5">
            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                    <p className="text-gray-500 size18 degular-regular">Orders</p>
                    <h3 className="font-semibold size30 rova-regular">{stats.totalOrders}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                    <p className="text-gray-500 size18 degular-regular">Users</p>
                    <h3 className="font-semibold size30 rova-regular">{stats.totalUsers}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                    <p className="text-gray-500 size18 degular-regular">Products</p>
                    <h3 className="font-semibold size30 rova-regular">{stats.totalProducts}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                    <p className="text-gray-500 size18 degular-regular">Sales</p>
                    <h3 className="font-semibold size30 rova-regular">₹{stats.totalSales}</h3>
                </div>
            </div>

            {/* ADD PRODUCT */}
            <div className="mb-8">
                <h2 className="size24 degular-semibold mb-2 capitalize">Add New Product</h2>
                <form onSubmit={addProduct} className="space-y-3 max-w-lg bg-white p-6 rounded-xl shadow-sm">
                    <input
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full border p-2 rounded-lg size18 degular-regular"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full border p-2 rounded-lg size18 degular-regular"
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full border p-2 rounded-lg size18 degular-regular"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".jpg,.jpeg,.png,.heic,.webp"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const imageUrl = URL.createObjectURL(file);
                                setNewProduct({ ...newProduct, image: file, preview: imageUrl });
                            }
                        }}
                        className="w-full border p-2 rounded-lg size18 degular-regular"
                    />
                    {newProduct.preview && (
                        <img src={newProduct.preview} alt="preview" className="w-32 h-32 object-cover rounded mt-2" />
                    )}
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                        Add Product
                    </button>
                </form>
            </div>

            {/* SHOW PRODUCTS */}
            <div className="mb-8 ">
                <h2 className="size24 degular-semibold mb-4 capitalize">Products</h2>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-left size18 degular-semibold">Image</th>
                                <th className="p-4 text-left size18 degular-semibold">Name</th>
                                <th className="p-4 text-left size18 degular-semibold">Price</th>
                                <th className="p-4 text-left size18 degular-semibold">Stock</th>
                                <th className="p-4 text-center size18 degular-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4">
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}${product.image}`}
                                            alt=""
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-4 size16 degular-regular capitalize">{product.name}</td>
                                    <td className="p-4 size16 degular-regular font-medium">₹{product.price}</td>
                                    <td className="p-4 size16 degular-regular">
                                        <div className="flex flex-col">
                                            <span>{product.stock}</span>
                                            <span className={`text-[10px] uppercase font-bold mt-1 px-2 py-0.5 rounded-full w-fit ${product.stock === 0 ? "bg-red-100 text-red-600" :
                                                product.stock <= 10 ? "bg-orange-100 text-orange-600" :
                                                    "bg-green-100 text-green-600"
                                                }`}>
                                                {product.stock === 0 ? "Out of Stock" : product.stock <= 10 ? "Low Stock" : "In Stock"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => editProduct(product)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                <CiEdit size={24} className="text-gray-600" />
                                            </button>
                                            <button onClick={() => deleteProduct(product._id)} className="p-2 hover:bg-red-50 rounded-full transition-colors">
                                                <MdDeleteOutline size={24} className="text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
                        <h2 className="size24 degular-semibold mb-6 capitalize">Edit Product</h2>
                        <form onSubmit={addProduct} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    placeholder="Product Name"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Stock</label>
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const previewUrl = URL.createObjectURL(file);
                                            setNewProduct({ ...newProduct, image: file, preview: previewUrl });
                                        }
                                    }}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                            {newProduct.preview && (
                                <img src={newProduct.preview} alt="preview" className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                            )}
                            <div className="flex gap-4 mt-8">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                    {editingId ? "Update Product" : "Add Product"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setOpenModal(false); setEditingId(null); }}
                                    className="px-6 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ORDERS SECTION */}
            <div className="mb-8">
                <h2 className="size24 degular-semibold mb-4 capitalize">Recent Orders</h2>
                <div className="space-y-3">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-4 items-center">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                    {order.user?.shopName?.[0] || "S"}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Shop Name</p>
                                    <p className="font-semibold text-gray-800">{order.user?.shopName}</p>
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Items</p>
                                    <p className="font-semibold text-gray-700">{order.items?.length} products</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Total Amount</p>
                                    <p className="font-bold text-indigo-600">₹{order.totalAmount}</p>
                                </div>
                            </div>
                            <div className="min-w-[150px]">
                                <select
                                    value={order.status}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                    className={`w-full border-0 rounded-lg p-2 text-sm font-semibold cursor-pointer outline-none ${order.status === "Delivered" ? "bg-green-50 text-green-700" :
                                        order.status === "Processing" ? "bg-yellow-50 text-yellow-700" :
                                            order.status === "Ready" ? "bg-blue-50 text-blue-700" :
                                                "bg-gray-50 text-gray-700"
                                        }`}
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AdminDashboard;