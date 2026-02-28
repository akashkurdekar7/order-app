import { useEffect, useState } from "react";
import API from "../api/axios";

function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchDashboard();
        fetchOrders();
    }, []);

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
    const [newProduct, setNewProduct] = useState({
        title: "",
        price: "",
        stock: "",
        image: ""
    });

    const addProduct = async () => {
        await API.post("/products", newProduct);
        alert("Product added");
        setNewProduct({ title: "", price: "", stock: "", image: "" });
        fetchDashboard();
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <div className="">
                <h3>Add Product</h3>

                <input
                    placeholder="Title"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                />

                <input
                    placeholder="Price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />

                <input
                    placeholder="Stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                />

                <input
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />

                <button onClick={addProduct}>Add Product</button>
            </div>
            <h3>Total Orders: {stats.totalOrders}</h3>
            <h3>Total Users: {stats.totalUsers}</h3>
            <h3>Total Products: {stats.totalProducts}</h3>
            <h3>Total Sales: ₹{stats.totalSales}</h3>

            <hr />

            <h3>Orders</h3>

            {orders.map((order) => (
                <div key={order._id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
                    <p><strong>Shop:</strong> {order.user?.shopName}</p>
                    <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                    <p><strong>Status:</strong> {order.status}</p>

                    <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                        <option value="Processing">Processing</option>
                        <option value="Ready">Ready</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
            ))}
        </div>
    );
}

export default AdminDashboard;