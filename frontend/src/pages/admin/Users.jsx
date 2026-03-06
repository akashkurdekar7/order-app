import React, { useEffect, useState } from 'react'
import API from '../../api/axios'
import { PiPhoneCallFill } from "react-icons/pi";
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getAllUsers()
    }, [])
    const getAllUsers = async () => {
        try {
            const res = await API.get("/api/auth/getUsers");
            console.log(res.data)
            setUsers(res.data.filter((user) => user.role === "user"));
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }
    return (
        <section className='p-5'>
            <h1 className='degular-semibold size40 mb-5'>Users</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.map((user) => (
                    <div key={user._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 ">
                        <div className="card-body">
                            <img src={import.meta.env.VITE_BASE_URL + user.image} alt="" className="w-auto h-auto object-cover " />
                            <h3 className="degular-semibold size24 capitalize my-2">{user.shopName}</h3>
                            <h3 className="degular-regular size18 mb-1 capitalize">{user.personName}</h3>
                            <h3 className="degular-regular size16 text-gray-500">{user.aadhaar?.match(/.{1,4}/g).join('-')}</h3>
                            <hr className='my-2' />
                            <div className="flex items-center justify-between ">
                                <div className="">
                                    <h3 className="degular-regular size16">{user.phone}</h3>
                                    <h3 className="degular-regular size12  capitalize">{user.location}</h3>
                                </div>
                                <a href={`tel:${user.phone}`}>
                                    <PiPhoneCallFill className='size30 text-green-500 cursor-pointer' />
                                </a>
                            </div>
                            <hr className='my-2' />
                            <div className="flex items-center justify-between mb-1 ">
                                <h3 className="degular-semibold size22">Balance:</h3>
                                <h3 className="degular-semibold size26">₹250</h3>
                            </div>
                            <div className="flex items-center justify-between ">
                                <h3 className="degular-semibold size22">Orders:</h3>
                                <h3 className="degular-semibold size26">20</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Users