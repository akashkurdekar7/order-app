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
                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 ">
                        <div className="card-body">
                            <h3 className="degular-semibold size40 capitalize">{user.shopName}</h3>
                            <h3 className="degular-semibold size18 mt-3 capitalize">{user.personName}</h3>
                            <h3 className="degular-semibold size16 mt-3 ">{user.aadhaar?.match(/.{1,4}/g).join('-')}</h3>
                            <h3 className="degular-semibold size12 mt-3 capitalize">{user.location}</h3>
                            <div className="flex items-center justify-between mt-2">
                                <h3 className="degular-semibold size16">{user.phone}</h3>
                                <a href={`tel:${user.phone}`}>
                                    <PiPhoneCallFill className='size30 text-green-500 cursor-pointer' />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Users