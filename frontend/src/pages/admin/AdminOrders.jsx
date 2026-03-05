import { useEffect, useState } from 'react'
import API from '../../api/axios';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([])

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
            const res = await API.put(`/api/orders/updateOrderStatus/${orderId}`, { status })
            fetchOrders()
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }
    return (
        <div>
            <h1>AdminOrders</h1>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Order Date</th>
                        <th>Order Status</th>
                        <th>Total Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.customer.name}</td>
                            <td>{order.createdAt}</td>
                            <td>{order.orderStatus}</td>
                            <td>{order.totalAmount}</td>
                            <td>
                                <button onClick={() => updateOrderStatus(order._id, 'Delivered')}>Delivered</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminOrders