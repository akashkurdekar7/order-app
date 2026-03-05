import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from 'react-hot-toast';

function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/api/orders/getMyOrders");
            setOrders(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5">

            <h1 className="degular-semibold size26 text-center mb-2">My Orders</h1>

            {orders.length === 0 && (
                <p className="text-gray-500">No orders yet</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            <div className="flex justify-between">
                                <p className="text-gray-500 mb-2 size14 degular-regular">Items</p>
                                <p className="text-gray-500 mb-2 size14 degular-regular">Quantity</p>
                            </div>

                            <div className="space-y-1">
                                {order.items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between size18 degular-semibold"
                                    >
                                        <span>
                                            {item.product?.name}
                                        </span>

                                        <span className="text-gray-500 size18 degular-semibold">
                                            x{item.quantity}
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