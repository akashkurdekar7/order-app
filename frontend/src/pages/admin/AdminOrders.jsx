import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

const AdminOrders = () => {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/api/orders/getAllOrders");
            setOrders(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await API.put(`/api/orders/updateOrderStatus/${orderId}`, { status });
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const getStatusStyle = (status) => {
        if (status === "Delivered") return "bg-green-100 text-green-700";
        if (status === "Processing") return "bg-yellow-100 text-yellow-700";
        if (status === "Ready") return "bg-blue-100 text-blue-700";
        if (status === "Out for Delivery") return "bg-orange-100 text-orange-700";
        return "bg-gray-100 text-gray-700";
    };

    const updatePaymentStatus = async (orderId, paymentStatus) => {
        try {

            await API.put(`/api/orders/updatePaymentStatus/${orderId}`, {
                paymentStatus
            });

            // update modal state immediately
            setSelectedOrder((prev) => ({
                ...prev,
                paymentStatus
            }));

            fetchOrders();

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">

            <h2 className="size30 degular-semibold mb-4 capitalize">
                Orders
            </h2>

            {/* MOBILE FIRST ORDER CARDS */}

            <div className="flex flex-col gap-4 md:hidden">

                {orders.map(order => (

                    <div
                        key={order._id}
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer"
                    >

                        <div className="flex justify-between items-center">

                            <span className="degular-semibold size18">
                                #{order._id.slice(-6).toUpperCase()}
                            </span>

                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(order.orderStatus)}`}>
                                {order.orderStatus}
                            </span>

                        </div>

                        <div className="mt-2 text-gray-600 degular-regular size16">
                            {order.user?.personName}
                        </div>

                        <div className="flex justify-between mt-3 text-sm text-gray-500">

                            <span>
                                {new Date(order.createdAt).toLocaleDateString("en-IN")}
                            </span>

                            <span className="degular-semibold text-indigo-600">
                                ₹{order.totalAmount?.toLocaleString()}
                            </span>

                        </div>

                    </div>

                ))}

            </div>


            {/* DESKTOP TABLE */}

            <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="p-3 text-center size18 degular-semibold">ID</th>
                            <th className="p-3 text-center size18 degular-semibold">Customer</th>
                            <th className="p-3 text-center size18 degular-semibold">Date</th>
                            <th className="p-3 text-center size18 degular-semibold">Status</th>
                            <th className="p-3 text-center size18 degular-semibold">Total</th>

                        </tr>

                    </thead>

                    <tbody>

                        {orders.map(order => (

                            <tr
                                key={order._id}
                                onClick={() => setSelectedOrder(order)}
                                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            >

                                <td className="p-3 text-center size18 degular-regular">
                                    #{order._id.slice(-6).toUpperCase()}
                                </td>

                                <td className="p-3 text-center size18 degular-regular">
                                    {order.user?.personName}
                                </td>

                                <td className="p-3 text-center size18 degular-regular">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                </td>

                                <td className="p-3 text-center">

                                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>

                                </td>

                                <td className="p-3 text-center size18 degular-semibold">
                                    ₹{order.totalAmount?.toLocaleString()}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>


            {/* ORDER DETAILS MODAL */}

            {selectedOrder && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

                    <div className="bg-white w-full max-w-lg rounded-xl p-6 max-h-[80vh] overflow-y-auto">

                        <div className="flex justify-between items-center mb-4">

                            <h3 className="size24 degular-regular ">
                                Order for
                                <span className="degular-semibold text-indigo-600 capitalize"> {selectedOrder.user?.shopName}</span>
                            </h3>

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-500 cursor-pointer"
                            >
                                <MdClose size={25} color="black" />
                            </button>

                        </div>


                        <div className="space-y-2 mb-4">

                            <div className="flex justify-between items-center">
                                <span className="degular-regular text-gray-500">Customer</span>
                                <span className="degular-semibold">{selectedOrder.user?.personName}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="degular-regular text-gray-500">Payment</span>
                                <select
                                    value={selectedOrder.paymentStatus}
                                    onChange={(e) =>
                                        updatePaymentStatus(selectedOrder._id, e.target.value)
                                    }
                                    className="border rounded-md p-1 size14 degular-regular"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                </select>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="degular-regular text-gray-500">Total</span>
                                <span className="degular-semibold text-indigo-600 ">
                                    ₹{selectedOrder.totalAmount?.toLocaleString()}
                                </span>
                            </div>

                        </div>


                        {/* ORDER ITEMS */}

                        <h4 className="degular-semibold size18 mb-3">
                            Items
                        </h4>

                        <div className="flex flex-col gap-3">

                            {selectedOrder.items?.map((item, index) => (

                                <div
                                    key={index}
                                    className="flex justify-between border rounded-lg p-3"
                                >

                                    <div>

                                        <p className="degular-semibold">
                                            {item.product?.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </p>

                                    </div>

                                    <p className="degular-semibold">
                                        ₹{item.price}
                                    </p>

                                </div>

                            ))}

                        </div>


                        {/* UPDATE STATUS */}

                        <div className="mt-6">

                            <select
                                value={selectedOrder.status}
                                onChange={(e) =>
                                    updateOrderStatus(selectedOrder._id, e.target.value)
                                }
                                className="w-full border rounded-lg p-2 degular-regular"
                            >

                                <option value="Processing">Processing</option>
                                <option value="Ready">Ready</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>

                            </select>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminOrders;