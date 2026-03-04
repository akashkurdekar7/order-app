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
        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

            {orders.length === 0 && (
                <p className="text-gray-500">No orders yet</p>
            )}

            <div className="space-y-4">

                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white p-5 rounded-xl shadow-sm"
                    >

                        <div className="flex justify-between items-center mb-3">
                            <p className="font-medium">
                                Total: ₹{order.totalAmount}
                            </p>

                            <span className={`text-sm px-3 py-1 rounded-full ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                    order.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-gray-100"
                                }`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="border-t pt-3">
                            <p className="text-sm text-gray-500 mb-2">Items</p>

                            <div className="space-y-1">
                                {order.items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.product?.title}
                                        </span>

                                        <span className="text-gray-500">
                                            Qty: {item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default MyOrders;