import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
function Home() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [ordering, setOrdering] = useState(false);
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get("/products/getProducts");
            setProducts(res.data);
        } catch (error) {
            console.log("Using demo products");
            setProducts(demoProducts);
        }
    };

    const updateQuantity = (productId, change) => {
        setCart((prev) => {
            const product = products.find((p) => p._id === productId);
            const newQty = (prev[productId] || 0) + change;

            if (newQty > product.stock) {
                toast("Not enough stock available");
                return prev;
            }

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
        if (Object.keys(cart).length === 0) {
            toast("Please add items to cart");
            return;
        }

        const items = Object.keys(cart).map((id) => ({
            product: id,
            quantity: cart[id],
        }));

        try {
            setOrdering(true);
            await API.post("/orders/createOrder", { items });
            setOrdering(false);
            toast.success("Order placed successfully");

            setCart({});      // reset cart
            fetchProducts();  // refresh stock

        } catch (error) {
            toast.error(error.response?.data?.message || "Order failed");
        }
    };

    return (
        <div className="min-h-[100dvh] bg-gray-100 p-4">
            <h2 className="size30 degular-semibold my-2 capitalize">Products</h2>

            <div className="bg-white shadow overflow-x-auto">

                <table className="w-full text-sm border border-gray-300">

                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3 border border-gray-300 size18 degular-regular">Image</th>
                            <th className="p-3 border border-gray-300 size18 degular-regular">Product</th>
                            <th className="p-3 border border-gray-300 size18 degular-regular">Price</th>
                            <th className="p-3 border border-gray-300 size18 degular-regular">Stock</th>
                            <th className="p-3 border border-gray-300 size18 degular-regular">Quantity</th>
                            <th className="p-3 border border-gray-300 size18 degular-regular">Total</th>
                        </tr>
                    </thead>

                    <tbody>

                        {products
                            .filter((product) => product.stock > 0)
                            .map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    quantity={cart[product._id] || 0}
                                    onIncrease={() => updateQuantity(product._id, 1)}
                                    onDecrease={() => updateQuantity(product._id, -1)}
                                />
                            ))}

                    </tbody>
                </table>

            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4">
                <h3 className="size24 degular-semibold">
                    Total: ₹{calculateTotal()} ({Object.values(cart).reduce((a, b) => a + b, 0)} items)
                </h3>
                <button
                    onClick={placeOrder}
                    disabled={Object.keys(cart).length === 0 || ordering}
                    className={`w-full py-2 rounded-md mt-2 text-white size20 degular-semibold
        ${Object.keys(cart).length === 0 || ordering
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {ordering ? "Placing Order..." : "Place Order"}
                </button>
            </div>
        </div>
    );
}

export default Home;