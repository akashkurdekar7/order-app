import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "../components/AdminNavbar";
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
            const res = await API.get("/products/getProducts");
            setProducts(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    const deleteProduct = async (id) => {
        try {
            await API.delete(`/products/deleteProduct/${id}`);
            fetchProducts();
        } catch (error) {
            console.log(error);
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
            const res = await API.get("/orders/getDashboardStats");
            setStats(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await API.get("/orders/getAllOrders");
            setOrders(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/orders/updateOrderStatus/${id}`, { status });
            fetchOrders();
        } catch (error) {
            console.log(error);
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();

        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            toast.error("Please fill all `$");
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
                await API.put(`/products/updateProduct/${editingId}`, formData);
                toast.success("Product updated");
                setEditingId(null);
            } else {
                await API.post("/products/addProduct", formData);
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
            console.log(error);
        }
    };

    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // if you store user info
        navigate("/");
    };
    return (
        <section className="min-h-screen bg-gray-100  ">

            {/* STATS */}
            < div className="grid grid-cols-2 md:grid-cols-4 gap-4  p-5" >

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

            </div >

            {/* ADD PRODUCT */}
            < div className="p-5" >

                <h2 className="size24 degular-semibold mb-2 capitalize">Add New Product</h2>

                <form onSubmit={addProduct} className="space-y-3">

                    <input
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        className="w-full border p-2 rounded-lg size18 degular-regular"
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, price: e.target.value })
                        }
                        className="w-full border p-2 rounded-lg size18 degular-regular"
                    />

                    <input
                        type="number"
                        placeholder="Stock"
                        value={newProduct.stock}
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, stock: e.target.value })
                        }
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

                                setNewProduct({
                                    ...newProduct,
                                    image: file,
                                    preview: imageUrl,
                                });
                            }
                        }}
                        className="w-full border p-2 rounded-lg size18 degular-regular"
                    />

                    <div className="image-uploaded mt-2">
                        {newProduct.preview && (
                            <img
                                src={newProduct.preview}
                                alt="preview"
                                className="w-32 h-32 object-cover rounded"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Add Product
                    </button>

                </form>

            </div >

            {/* show products */}
            < div className=" p-5" >

                <h2 className="size24 degular-semibold mb-2 capitalize">Products</h2>

                <div className="border border-gray-300 overflow-hidden">

                    <table className="w-full border-collapse">

                        <thead className="bg-orange-200">
                            <tr>
                                <th className="border p-2 size18 degular-semibold">Image</th>
                                <th className="border p-2 size18 degular-semibold">Name</th>
                                <th className="border p-2 size18 degular-semibold">Price</th>
                                <th className="border p-2 size18 degular-semibold">Stock</th>
                                <th className="border p-2 size18 degular-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">

                                    <td className="border p-2 text-center">
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}${product.image}`}
                                            alt=""
                                            className="h-10 w-10 object-cover rounded mx-auto"
                                        />
                                    </td>

                                    <td className="border p-2 text-center size16 degular-regular capitalize">
                                        {product.name}
                                    </td>

                                    <td className="border p-2 text-center size16 degular-regular">
                                        ₹{product.price}
                                    </td>

                                    <td className="border p-2 text-center size16 degular-regular">
                                        <div>
                                            <p>{product.stock}</p>

                                            <span className={`text-xs px-2 py-1 rounded 
${product.stock === 0 ? "bg-red-100 text-red-600" :
                                                    product.stock <= 10 ? "bg-orange-100 text-orange-600" :
                                                        "bg-green-100 text-green-600"}`}>
                                                {product.stock === 0 ? "Out of Stock" :
                                                    product.stock <= 10 ? "Low Stock" :
                                                        "In Stock"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="border p-2">
                                        <div className="flex justify-center gap-3">
                                            <CiEdit
                                                size={24}
                                                className="cursor-pointer"
                                                onClick={() => editProduct(product)}
                                            />

                                            <MdDeleteOutline
                                                size={24}
                                                className="cursor-pointer text-red-500"
                                                onClick={() => deleteProduct(product._id)}
                                            />
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

            </div >

            {/* edit modal */}
            {
                openModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                        <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl">

                            <h2 className="size24 degular-semibold mb-2 capitalize">
                                Edit Product
                            </h2>

                            <form onSubmit={addProduct} className="space-y-3">

                                <input
                                    placeholder="Product Name"
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, name: e.target.value })
                                    }
                                    className="w-full border p-2 rounded-lg"
                                />

                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={newProduct.price}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, price: e.target.value })
                                    }
                                    className="w-full border p-2 rounded-lg"
                                />

                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={newProduct.stock}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, stock: e.target.value })
                                    }
                                    className="w-full border p-2 rounded-lg"
                                />

                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={(e) => {
                                        const file = e.target.files[0];

                                        if (file) {
                                            const previewUrl = URL.createObjectURL(file);

                                            setNewProduct({
                                                ...newProduct,
                                                image: file,
                                                preview: previewUrl
                                            });
                                        }
                                    }}
                                />

                                {newProduct.preview && (
                                    <img
                                        src={newProduct.preview}
                                        alt="preview"
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                )}

                                <div className="flex gap-3 mt-4">

                                    <button
                                        type="submit"
                                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
                                    >
                                        {editingId ? "Update" : "Add"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenModal(false);
                                            setEditingId(null);
                                        }}
                                        className="flex-1 border rounded-lg"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>
                    </div>
                )
            }

            {/* ORDERS */}
            <div className="p-5">

                <h2 className="size24 degular-semibold mb-2 capitalize">Orders</h2>

                <div className="space-y-4">

                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        >

                            <div>
                                <p className="text-sm text-gray-500">
                                    Shop
                                </p>
                                <p className="font-medium">
                                    {order.user?.shopName}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total
                                </p>
                                <p className="font-medium">
                                    ₹{order.totalAmount}
                                </p>
                            </div>

                            <div>
                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        updateStatus(order._id, e.target.value)
                                    }
                                    className="border rounded-lg p-2"
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Out for Delivery">
                                        Out for Delivery
                                    </option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>

                        </div>
                    ))}

                </div>
            </div>



        </section >
    );
}

export default AdminDashboard;