import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
function Home() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await API.get("/products");
        setProducts(res.data);
    };

    const updateQuantity = (productId, change) => {
        setCart((prev) => {
            const newQty = (prev[productId] || 0) + change;
            if (newQty <= 0) {
                const copy = { ...prev };
                delete copy[productId];
                return copy;
            }
            return { ...prev, [productId]: newQty };
        });
    };

    const calculateTotal = () => {
        return products.reduce((total, product) => {
            const qty = cart[product._id] || 0;
            return total + qty * product.price;
        }, 0);
    };

    const placeOrder = async () => {
        const items = Object.keys(cart).map((id) => ({
            product: id,
            quantity: cart[id],
        }));

        try {
            await API.post("/orders", { items });
            alert("Order placed successfully");
            setCart({});
        } catch (error) {
            alert(error.response?.data?.message || "Order failed");
        }
    };

    return (


        <div className="min-h-[100dvh] bg-gray-100 p-4">
            <Navbar />
            <h2 className="text-xl font-bold my-4">Products</h2>

            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    quantity={cart[product._id] || 0}
                    onIncrease={() => updateQuantity(product._id, 1)}
                    onDecrease={() => updateQuantity(product._id, -1)}
                />
            ))}

            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4">
                <h3 className="font-bold">Total: ₹{calculateTotal()}</h3>
                <button
                    onClick={placeOrder}
                    className="bg-blue-600 text-white w-full py-2 rounded-md mt-2"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}

export default Home;