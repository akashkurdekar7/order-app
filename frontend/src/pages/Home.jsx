import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
function Home() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});

    // useEffect(() => {
    //     fetchProducts();
    // }, []);
    useEffect(() => {
        setProducts(demoProducts);
    }, []);
    // const fetchProducts = async () => {
    //     try {
    //         const res = await API.get("/products");
    //         setProducts(res.data);
    //     } catch (error) {
    //         console.log("Using demo products");
    //         setProducts(demoProducts);
    //     }
    // };
    const demoProducts = [
        {
            _id: "1",
            title: "Gold Flake Kings",
            image: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Gold_Flake_Cigarettes_Pack.jpg",
            price: 170,
            stock: 60
        },
        {
            _id: "2",
            title: "Classic Milds",
            image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Wills_Classic_Cigarettes_Pack.jpg",
            price: 330,
            stock: 40
        },
        {
            _id: "3",
            title: "Classic Connect",
            image: "https://upload.wikimedia.org/wikipedia/commons/4/45/Wills_Classic_Connect_Cigarettes.jpg",
            price: 300,
            stock: 35
        },
        {
            _id: "4",
            title: "Marlboro Red",
            image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Marlboro_Red_pack.jpg",
            price: 320,
            stock: 50
        },
        {
            _id: "5",
            title: "Dunhill Switch",
            image: "https://upload.wikimedia.org/wikipedia/commons/3/32/Dunhill_cigarettes_pack.jpg",
            price: 350,
            stock: 25
        }
    ];
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

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="w-full text-sm border border-gray-300">

                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3 border border-gray-300">Image</th>
                            <th className="p-3 border border-gray-300">Product</th>
                            <th className="p-3 border border-gray-300">Price</th>
                            <th className="p-3 border border-gray-300">Stock</th>
                            <th className="p-3 border border-gray-300">Quantity</th>
                            <th className="p-3 border border-gray-300">Total</th>
                        </tr>
                    </thead>

                    <tbody>

                        {products.map((product) => (
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