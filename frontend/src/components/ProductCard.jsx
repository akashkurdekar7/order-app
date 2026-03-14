import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import {FiPlus, FiMinus} from "react-icons/fi";

const ProductCard = ({product, quantity, onIncrease, onDecrease}) => {
  const isOutOfStock = product.stock === 0;
  const imageUrl = product.image
    ? `${import.meta.env.VITE_BASE_URL}${product.image}`
    : "https://via.placeholder.com/300?text=Product";

  return (
    <motion.div
      layout
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      className="premium-card flex flex-col h-full bg-white p-2.5 sm:p-3">
      {/* Image Section */}
      <div className="product-img-wrapper relative mb-4">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {isOutOfStock ? (
          <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
            Out of Stock
          </div>
        ) : null}
      </div>

      {/* Info Section */}
      <div className="flex flex-col grow">
        <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-start mb-1 gap-1">
          <h3 className="size28 degular-semibold text-slate-800">
            {product.name}
          </h3>
          <span className="size20 degular-semibold text-primary shrink-0 text-left md:text-right">
            ₹{product.price}
          </span>
        </div>

        {/* <p className="size14 text-slate-500 line-clamp-2 mb-4 h-10 leading-snug">
          {product.description || "High-quality wholesale product for your professional needs."}
        </p> */}

        {/* Action Section */}
        <div className="mt-2">
          <AnimatePresence mode="wait">
            {quantity === 0 ? (
              <motion.button
                key="add-btn"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                onClick={onIncrease}
                disabled={product.stock === 0}
                className={`w-full py-2 rounded-xl size13 sm:size14 degular-semibold transition-colors flex items-center justify-center gap-1.5
  ${
    isOutOfStock
      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
      : "bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
  }`}>
                <FiPlus
                  className={`size14 sm:size16 ${isOutOfStock ? "hidden" : ""}`}
                />

                {/* <span className="hidden xs:inline bg">
                  {isOutOfStock ? "Out of Stock" : "Add to Order"}
                </span> */}

                <span className="xs:hidden ">
                  {isOutOfStock ? "Sold Out" : "Add"}
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="qty-controls"
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.95}}
                className="flex items-center justify-between bg-slate-100 rounded-xl p-1">
                <button
                  onClick={onDecrease}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-red-500 transition-colors">
                  <FiMinus className="size14" />
                </button>

                <span className="size16 degular-semibold text-slate-800 px-4">
                  {quantity}
                </span>

                <button
                  onClick={onIncrease}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                  <FiPlus className="size14" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
