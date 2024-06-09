
import axios from 'axios';
import React from 'react'

const UserCard = ({ users, refreshFollower }) => {
  const handleFollow = async () => {
    try {
      const res = await axios.post("api/followUser", { followingId: users._id });
      if (res.status == 200) {
        refreshFollower();
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex justify-between items-center py-4'>
      <div className='flex justify-center gap-5'>
        <div className='w-12 border rounded-full'></div>
        <div className='flex flex-col '>
          <h4 className='text-slate-300'>{users?.username}</h4>
          <p className='m-0 text-slate-200 flex items-center'>Following {users.followingCount}</p>
        </div>
      </div>
      <div>
        {users.isFollowing ? (
          <p className='text-zinc-500'>Following</p>
        ) : (
          <button onClick={handleFollow} className='text-white bg-rose-400 py-1 px-4 rounded-md'>Follow</button>
        )}
      </div>
    </div>
  )
}

export default UserCard