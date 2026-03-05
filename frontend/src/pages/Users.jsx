import React, { useEffect, useState } from 'react'
import API from '../api/axios'
const Users = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getAllUsers()
    }, [])
    const getAllUsers = async () => {
        try {
            const res = await API.get("/auth/getUsers");
            setUsers(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <section className='p-5'>
            <h1 className='text-2xl font-bold mb-5'>Users</h1>
            <table className='w-full border-collapse border border-black'>
                <thead>
                    <tr className='border border-black'>
                        <th className='border border-black p-2'>Id</th>
                        <th className='border border-black p-2'>Name</th>
                        <th className='border border-black p-2'>Email</th>
                        <th className='border border-black p-2'>Role</th>
                        <th className='border border-black p-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td className='border border-black p-2'>{user._id}</td>
                            <td className='border border-black p-2'>{user.name}</td>
                            <td className='border border-black p-2'>{user.email}</td>
                            <td className='border border-black p-2'>{user.role}</td>
                            <td className='border border-black p-2'>
                                <button className='bg-blue-500 text-white p-2 rounded'>Update</button>
                                <button className='bg-red-500 text-white p-2 rounded'>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}

export default Users