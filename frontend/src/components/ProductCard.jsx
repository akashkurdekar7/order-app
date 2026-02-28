function ProductCard({ product, quantity, onIncrease, onDecrease }) {
    return (
        <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-col gap-2">

            {product.image && (
                <img
                    src={product.image}
                    alt={product.title}
                    className="h-32 object-cover rounded-md"
                />
            )}

            <h3 className="font-semibold text-lg">{product.title}</h3>

            <p className="text-gray-600">₹{product.price}</p>

            <p className="text-sm text-gray-500">
                Stock: {product.stock}
            </p>

            <div className="flex items-center gap-3 mt-2">
                <button
                    onClick={onDecrease}
                    className="bg-gray-300 px-3 py-1 rounded-md"
                >
                    -
                </button>

                <span className="font-semibold">{quantity}</span>

                <button
                    onClick={onIncrease}
                    className="bg-green-500 text-white px-3 py-1 rounded-md"
                >
                    +
                </button>
            </div>

            {quantity > 0 && (
                <p className="text-sm font-semibold text-blue-600">
                    Total: ₹{quantity * product.price}
                </p>
            )}
        </div>
    );
}

export default ProductCard;