'use client'
import React, { useEffect, useState } from 'react'
import UserCard from '../conponents/UserCard'
import axios from 'axios'

const Users = () => {
    const [users, setUsers] = useState(null)

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/users');
            console.log(res);
            setUsers(res.data);
        } catch (error) {
            console.log("Failed to fetch users", error);
        }
    };

    useEffect(() => {

        fetchUsers();
    }, []);

    return (

        <div className='max-w-96 mx-auto mt-5'>
            {
             users && users.length > 0 ?  users?.map((item,id)=>{
                return <div key={id}>
                    <UserCard users={item} refreshFollower ={fetchUsers} />
                    <hr className='my-5' />
                </div>
                }) : <p className='flex justify-center items-center w-full h-screen text-3xl'>There is no User!!</p>
            }
            
        </div>

    )
}

export default Users