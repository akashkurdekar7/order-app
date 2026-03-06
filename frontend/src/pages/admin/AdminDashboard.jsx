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
    const [search, setSearch] = useState("");

    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});
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
            toast.error(error.response?.data?.message || "Error fetching products");
        }
    };

    const fetchDashboard = async () => {
        try {
            const res = await API.get("/api/orders/getDashboardStats");
            setStats(res.data);
        } catch (error) {
            toast.error("Failed loading stats");
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await API.get("/api/orders/getAllOrders");
            setOrders(res.data);
        } catch (error) {
            toast.error("Failed loading orders");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/ api / orders / updateOrderStatus / ${id} `, { status });
            fetchOrders();
        } catch (error) {
            toast.error("Failed updating order");
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await API.delete(`/ api / products / deleteProduct / ${id} `);
            fetchProducts();
            toast.success("Product deleted");
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const editProduct = (product) => {
        setOpenModal(true);
        setEditingId(product._id);

        setNewProduct({
            ...product,
            image: null,
            preview: product.image
                ? `${import.meta.env.VITE_BASE_URL}${product.image} `
                : "",
        });
    };

    const addProduct = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!newProduct.name.trim()) {
            newErrors.name = "Product name is required";
        }

        if (!newProduct.price) {
            newErrors.price = "Price is required";
        }

        if (!newProduct.stock) {
            newErrors.stock = "Stock is required";
        }

        if (!editingId && !newProduct.image) {
            newErrors.image = "Product image is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        try {
            const formData = new FormData();
            formData.append("name", newProduct.name);
            formData.append("price", newProduct.price);
            formData.append("stock", newProduct.stock);

            if (newProduct.image) {
                formData.append("image", newProduct.image);
            }

            if (editingId) {
                await API.put(`/ api / products / updateProduct / ${editingId} `, formData);
                toast.success("Product updated");
            } else {
                await API.post("/api/products/addProduct", formData);
                toast.success("Product added");
            }

            setEditingId(null);
            setNewProduct({ name: "", price: "", stock: "", image: null, preview: "" });
            setOpenModal(false);

            if (fileInputRef.current) fileInputRef.current.value = "";

            fetchProducts();

        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="min-h-screen bg-gray-100 p-6">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-8">
                <h1 className="size26 degular-semibold">Dashboard</h1>

                <button
                    onClick={() => {
                        setEditingId(null);
                        setNewProduct({ name: "", price: "", stock: "", image: null, preview: "" });
                        setOpenModal(true);
                    }}
                    className="bg-indigo-600 size14 degular-semibold text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                    <span className="size20">+</span>Add Product
                </button>
            </div>

            {/* STATS */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

                <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                        <p className="size16 degular-regular text-gray-500">Orders</p>
                        <h3 className="size26 degular-semibold">{stats.totalOrders}</h3>
                    </div>
                    <span className="size40">📦</span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                        <p className="size16 degular-regular text-gray-500">Users</p>
                        <h3 className="size26 degular-semibold">{stats.totalUsers}</h3>
                    </div>
                    <span className="size40">👤</span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                        <p className="size16 degular-regular text-gray-500">Products</p>
                        <h3 className="size26 degular-semibold">{stats.totalProducts}</h3>
                    </div>
                    <span className="size40">🛒</span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                        <p className="size16 degular-regular text-gray-500">Sales</p>
                        <h3 className="size26 degular-semibold">₹{stats.totalSales}</h3>
                    </div>
                    <span className="size40">💰</span>
                </div>

            </div>

            {/* PRODUCTS */}

            <div className="bg-white rounded-xl shadow-sm p-6 mb-10">

                <div className="flex justify-between mb-4 items-center">

                    <h2 className="size26 degular-semibold">Products</h2>

                    <input
                        placeholder="Search product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm"
                    />

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">

                            <tr>

                                <th className="p-3 size16 degular-semibold">Image</th>
                                <th className="p-3 size16 degular-semibold">Name</th>
                                <th className="p-3 size16 degular-semibold">Price</th>
                                <th className="p-3 size16 degular-semibold">Stock</th>
                                <th className="p-3 size16 degular-semibold">Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredProducts.map((product) => (

                                <tr key={product._id} className="odd:bg-white even:bg-gray-50 border-b">

                                    <td className="p-3">

                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}${product.image} `}
                                            className="h-12 w-12 object-cover rounded-lg"
                                        />

                                    </td>

                                    <td className="p-3 size16 degular-regular">{product.name}</td>

                                    <td className="p-3 size16 degular-regular">₹{product.price}</td>

                                    <td className="p-3 size16 degular-regular  flex items-center justify-center gap-2 flex-col">

                                        <span className="size16 degular-regular">{product.stock}</span>
                                        <span
                                            className={`size10 degular-regular w-max ${product.stock === 0 ? "bg-red-100 text-red-600" :
                                                product.stock <= 10 ? "bg-orange-100 text-orange-600" :
                                                    "bg-green-100 text-green-600"
                                                } `}
                                        >

                                            {product.stock === 0
                                                ? "Out of Stock"
                                                : product.stock <= 10
                                                    ? "Low Stock"
                                                    : "In Stock"}

                                        </span>

                                    </td>

                                    <td className="p-3">

                                        <div className="flex justify-center gap-3">

                                            <button onClick={() => editProduct(product)}>
                                                <CiEdit size={22} />
                                            </button>

                                            <button onClick={() => deleteProduct(product._id)}>
                                                <MdDeleteOutline size={22} className="text-red-500" />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* ORDERS */}

            <div className="bg-white rounded-xl shadow-sm p-6">

                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

                <div className="space-y-3">

                    {orders.map((order) => (

                        <div
                            key={order._id}
                            className="border rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4"
                        >

                            <div>

                                <p className="text-sm text-gray-500">Shop</p>

                                <p className="font-semibold">{order.user?.shopName}</p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">Items</p>

                                <p>{order.items?.length}</p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">Amount</p>

                                <p className="font-bold text-indigo-600">₹{order.totalAmount}</p>

                            </div>

                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm"
                            >

                                <option>Processing</option>
                                <option>Ready</option>
                                <option>Out for Delivery</option>
                                <option>Delivered</option>

                            </select>

                        </div>

                    ))}

                </div>

            </div>

            {/* MODAL */}

            {openModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-full max-w-md">

                        <h2 className="size26 degular-semibold mb-4">

                            {editingId ? "Edit Product" : "Add Product"}

                        </h2>

                        <form onSubmit={addProduct} className="space-y-3">

                            <div className="mb-2">
                                <input
                                    placeholder="Product Name"
                                    value={newProduct.name}
                                    onChange={(e) => {
                                        setNewProduct({ ...newProduct, name: e.target.value });
                                        setErrors({ ...errors, name: "" });
                                    }}
                                    className="w-full border rounded-lg p-2"
                                />
                                {errors.name && <p className="text-red-500 size14 degular-regular mt-2">{errors.name}</p>}
                            </div>
                            <div className="mb-2">
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={newProduct.price}
                                    onChange={(e) => {
                                        setNewProduct({ ...newProduct, price: e.target.value });
                                        setErrors({ ...errors, price: "" });
                                    }}
                                    className="w-full border rounded-lg p-2"
                                />
                                {errors.price && <p className="text-red-500 size14 degular-regular mt-2">{errors.price}</p>}
                            </div>
                            <div className="mb-2">
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={newProduct.stock}
                                    onChange={(e) => {
                                        setNewProduct({ ...newProduct, stock: e.target.value });
                                        setErrors({ ...errors, stock: "" });
                                    }}
                                    className="w-full border rounded-lg p-2"
                                />
                                {errors.stock && <p className="text-red-500 size14 degular-regular mt-2">{errors.stock}</p>}
                            </div>
                            <div className="mb-2">
                                <label className="size16 degular-semibold my-2">
                                    Product Image
                                </label>

                                <label
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition"
                                >

                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">

                                        <p className="text-gray6600 size14 degular-regular">
                                            Click to upload image
                                        </p>

                                        <p className="text-gray-400 size12 degular-regular">
                                            PNG, JPG, WEBP, JPEG
                                        </p>

                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept=".jpg,.jpeg,.png,.webp"
                                        className="hidden"
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
                                            setErrors({ ...errors, image: "" });
                                        }}
                                    />

                                </label>
                                {errors.image && <p className="text-red-500 size14 degular-regular mt-2">{errors.image}</p>}
                            </div>
                            {newProduct.preview && (
                                <img
                                    src={newProduct.preview}
                                    alt="preview"
                                    className="w-28 h-28 object-cover rounded-lg border mt-2"
                                />
                            )}
                            {/* <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setNewProduct({
                                            ...newProduct,
                                            image: file,
                                            preview: URL.createObjectURL(file)
                                        });
                                    }
                                }}
                            />

                            {newProduct.preview && (

                                <img
                                    src={newProduct.preview}
                                    className="w-24 h-24 object-cover rounded"
                                />

                            )} */}

                            <div className="flex gap-3 pt-4">

                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className="flex-1 border py-2 rounded-lg"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>
    );
}

export default AdminDashboard;
