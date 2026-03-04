import { useEffect, useState } from "react";
import API from "../api/axios";

function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [newProduct, setNewProduct] = useState({
        title: "",
        price: "",
        stock: "",
        image: ""
    });

    useEffect(() => {
        fetchDashboard();
        fetchOrders();
        fetchProducts();
    }, []);
    const fetchProducts = async () => {
        const res = await API.get("/products/getProducts");
        setProducts(res.data);
    };
    const deleteProduct = async (id) => {
        await API.delete(`/products/${id}`);
        fetchProducts();
    };
    const editProduct = (product) => {
        setNewProduct(product);
        setEditingId(product._id);
    };
    const fetchDashboard = async () => {
        const res = await API.get("/orders/dashboard");
        setStats(res.data);
    };

    const fetchOrders = async () => {
        const res = await API.get("/orders");
        setOrders(res.data);
    };

    const updateStatus = async (id, status) => {
        await API.put(`/orders/${id}`, { status });
        fetchOrders();
    };

    const addProduct = async () => {

        if (editingId) {
            await API.put(`/products/${editingId}`, newProduct);
            alert("Product updated");
            setEditingId(null);
        } else {
            await API.post("/products", newProduct);
            alert("Product added");
        }

        setNewProduct({ title: "", price: "", stock: "", image: "" });

        fetchProducts();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Orders</p>
                    <h3 className="text-xl font-semibold">{stats.totalOrders}</h3>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Users</p>
                    <h3 className="text-xl font-semibold">{stats.totalUsers}</h3>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Products</p>
                    <h3 className="text-xl font-semibold">{stats.totalProducts}</h3>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Sales</p>
                    <h3 className="text-xl font-semibold">₹{stats.totalSales}</h3>
                </div>

            </div>


            {/* ADD PRODUCT */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 max-w-lg">

                <h2 className="text-lg font-semibold mb-4">Add Product</h2>

                <div className="space-y-3">

                    <input
                        placeholder="Title"
                        value={newProduct.title}
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, title: e.target.value })
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
                        placeholder="Image URL"
                        value={newProduct.image}
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, image: e.target.value })
                        }
                        className="w-full border p-2 rounded-lg"
                    />

                    <button
                        onClick={addProduct}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Add Product
                    </button>

                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">

                <h2 className="text-lg font-semibold mb-4">Products</h2>

                <table className="w-full text-sm border border-gray-300 border-collapse">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Image</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Stock</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {products.map((product) => (

                            <tr key={product._id}>

                                <td className="border p-2">
                                    <img
                                        src={product.image}
                                        alt=""
                                        className="h-10 w-10 object-cover rounded"
                                    />
                                </td>

                                <td className="border p-2">
                                    {product.title}
                                </td>

                                <td className="border p-2">
                                    ₹{product.price}
                                </td>

                                <td className="border p-2">
                                    {product.stock}
                                </td>

                                <td className="border p-2 flex gap-2">

                                    <button
                                        onClick={() => editProduct(product)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>
                </table>

            </div>

            {/* ORDERS */}
            <div className="bg-white p-6 rounded-xl shadow-sm">

                <h2 className="text-lg font-semibold mb-4">Orders</h2>

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

        </div>
    );
}

export default AdminDashboard;