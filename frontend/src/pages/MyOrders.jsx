
import { useEffect, useState } from "react";
import API from "../api/axios";

function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/orders/my");
            setOrders(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h2>My Orders</h2>

            {orders.length === 0 && <p>No orders yet</p>}

            {orders.map((order) => (
                <div key={order._id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
                    <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                    <p><strong>Status:</strong> {order.status}</p>

                    <h4>Items:</h4>
                    {order.items.map((item) => (
                        <div key={item._id}>
                            {item.product?.title} — Qty: {item.quantity}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default MyOrders;