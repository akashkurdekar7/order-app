import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";

const ProductTable = ({ product, quantity, onIncrease, onDecrease }) => {
    return (
        <tr className="border-b hover:bg-gray-50">

            <td className="p-3 border border-gray-300 text-center">
                {product.image && (
                    <img
                        src={import.meta.env.VITE_BASE_URL + product.image}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                    />
                )}
            </td>

            <td className="p-3 size18 degular-regular text-gray-800 border border-gray-300 text-center">
                {product.name}
            </td>

            <td className="p-3 size18 degular-regular text-indigo-600 font-semibold border border-gray-300 text-center">
                ₹{product.price}
            </td>

            <td className="p-3 size18 degular-regular text-gray-500 border border-gray-300 text-center">
                {product.stock}
            </td>

            <td className="p-3 size18 degular-regular border border-gray-300">

                <div className="flex items-center gap-3 justify-center" >

                    <button
                        onClick={onDecrease}
                        className=" hover:bg-gray-100 cursor-pointer"
                    >
                        <CiSquareMinus size={40} />
                    </button>

                    <span className="">
                        {quantity}
                    </span>

                    <button
                        onClick={onIncrease}
                        className=" hover:bg-gray-100 text-indigo-600 cursor-pointer"
                    >
                        <CiSquarePlus size={40} />
                    </button>

                </div>

            </td>

            <td className="p-3 size18 degular-regular font-semibold border border-gray-300 text-center">
                ₹{quantity * product.price}
            </td>

        </tr>
    );
}

export default ProductTable;
