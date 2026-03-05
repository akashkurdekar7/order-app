import React from "react";

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 ">
            <div className="flex justify-cnter rounded-xl overflow-hidden ">
                <img
                    src={import.meta.env.VITE_BASE_URL + product.image}
                    alt={product.name}
                    className="object-contain"
                />
            </div>

            <div className="card-body">
                <h3 className="degular-semibold size20 mt-3">{product.name}</h3>

                <p className="text-gray-600 degular-regular size14">
                    Price: <span className="font-medium text-black">₹{product.price}</span> /pack
                </p>
            </div>
        </div>
    );
};

export default ProductCard;