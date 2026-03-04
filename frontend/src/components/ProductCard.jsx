function ProductRow({ product, quantity, onIncrease, onDecrease }) {
    return (
        <tr className="border-b hover:bg-gray-50">

            <td className="p-3 border border-gray-300">
                {product.image && (
                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-12 w-12 object-cover rounded"
                    />
                )}
            </td>

            <td className="p-3 font-medium text-gray-800 border border-gray-300">
                {product.title}
            </td>

            <td className="p-3 text-indigo-600 font-semibold border border-gray-300">
                ₹{product.price}
            </td>

            <td className="p-3 text-gray-500 border border-gray-300">
                {product.stock}
            </td>

            <td className="p-3 border border-gray-300">

                <div className="flex items-center border rounded-md w-fit">

                    <button
                        onClick={onDecrease}
                        className="px-3 py-1 hover:bg-gray-100"
                    >
                        -
                    </button>

                    <span className="px-3">
                        {quantity}
                    </span>

                    <button
                        onClick={onIncrease}
                        className="px-3 py-1 hover:bg-gray-100 text-indigo-600"
                    >
                        +
                    </button>

                </div>

            </td>

            <td className="p-3 font-semibold border border-gray-300">
                ₹{quantity * product.price}
            </td>

        </tr>
    );
}

export default ProductRow;