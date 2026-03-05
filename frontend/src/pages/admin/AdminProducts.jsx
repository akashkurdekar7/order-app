import { useEffect, useState } from 'react'
import API from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get("/api/products/getProducts");
            setProducts(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <section className="min-h-screen bg-gray-100 p-5">
            <h1 className="size26 text-center rova-regular mb-5 ">Inventory</h1>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-8 xl:gap-10">
                {products.map(prod => (
                    <ProductCard product={prod} key={prod._id} />
                ))}
            </div>
        </section>
    )
}

export default AdminProducts