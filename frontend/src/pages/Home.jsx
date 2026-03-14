import {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useTranslation} from "react-i18next";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import {FiShoppingBag, FiArrowRight} from "react-icons/fi";

function Home() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [ordering, setOrdering] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/api/products/getProducts");
      setProducts(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || t("Something went wrong"));
    }
  };

  const updateQuantity = (productId, change) => {
    setCart((prev) => {
      const product = products.find((p) => p._id === productId);
      const newQty = (prev[productId] || 0) + change;

      if (newQty > product.stock) {
        toast.error(t("Low stock: Only ") + product.stock + t(" available"));
        return prev;
      }

      if (newQty <= 0) {
        const copy = {...prev};
        delete copy[productId];
        return copy;
      }

      return {...prev, [productId]: newQty};
    });
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const qty = cart[product._id] || 0;
      return total + qty * product.price;
    }, 0);
  };

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const placeOrder = async () => {
    if (cartItemCount === 0) {
      toast.error(t("Your cart is empty"));
      return;
    }

    const items = Object.keys(cart).map((id) => ({
      product: id,
      quantity: cart[id],
    }));

    try {
      setOrdering(true);
      await API.post("/api/orders/createOrder", {items, paymentMethod});
      setOrdering(false);
      toast.success(t("Order placed successfully"));
      setCart({});
      fetchProducts();
    } catch (error) {
      setOrdering(false);
      toast.error(error.response?.data?.message || t("Order failed"));
    }
  };

  return (
    <div className="min-h-screen pb-32 md:pt-6 pt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="md:mb-10 mb-5 text-center sm:text-left">
          <motion.h2
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            className="size32 degular-semibold text-slate-800 mb-2">
            {t("Exclusive Collection")}
          </motion.h2>
          <motion.p
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{delay: 0.1}}
            className="size16 text-slate-500 max-w-lg">
            {t("Premium wholesale selections tailored for your business needs.")}
          </motion.p>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          <AnimatePresence>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                quantity={cart[product._id] || 0}
                onIncrease={() => updateQuantity(product._id, 1)}
                onDecrease={() => updateQuantity(product._id, -1)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {products.length === 0 && !ordering && (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <FiShoppingBag className="size40 mb-4" />
            <p className="size18 degular-regular">{t("No products available yet.")}</p>
          </div>
        )}
      </div>

      {/* Floating Order Bar */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{y: 100, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            exit={{y: 100, opacity: 0}}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-40">
            <div className="glass-effect rounded-4xl p-2 sm:p-3 flex items-center justify-between gap-3 sm:gap-6 overflow-hidden">
              <div className="flex flex-col pl-3 sm:pl-4">
                <span className="size12 sm:size14 text-slate-500 font-medium whitespace-nowrap">
                  {t("Total")} ({cartItemCount})
                </span>
                <span className="size20 sm:size24 degular-semibold text-slate-900 leading-tight">
                  ₹{calculateTotal()}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50">
                {["Cash", "UPI"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`px-4 py-2 rounded-xl size13 degular-semibold transition-all ${
                      paymentMethod === method
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-100"
                        : "text-slate-500 hover:text-slate-700"
                    }`}>
                    {t(method)}
                  </button>
                ))}
              </div>

              <motion.button
                whileTap={{scale: 0.95}}
                onClick={placeOrder}
                disabled={ordering}
                className="bg-indigo-600 text-white px-5 sm:px-8 py-3 sm:py-3.5 rounded-full size14 sm:size16 degular-semibold flex items-center gap-2 sm:gap-3 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50">
                {ordering ? (
                  t("Placing...")
                ) : (
                  <>
                    {t("Checkout")} <FiArrowRight className="size18" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
