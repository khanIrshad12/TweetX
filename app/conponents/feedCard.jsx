'use client'
import React from 'react'
import { formatDistanceToNow } from 'date-fns';

const FeedCard = ({postData}) => {
    console.log(postData);
    const timeAgo = formatDistanceToNow(new Date(postData?.createdAt), { addSuffix: true });
  
    return (
        <div className='relative bg-zinc-50 shadow-sm rounded-md my-2 overflow-hidden'>
            <div className='flex flex-col p-8'>
                <div className='flex justify-between h-12 '>
                    <div className='flex gap-5'>
                        <div className='w-12 border border-zinc-500 rounded-full'></div>
                        <h5 className='text-slate-500'>{postData?.username}</h5>
                    </div>

                    <div className='flex flex-col items-end justify-end'>
                        <p className='text-slate-300 '>{timeAgo}</p>
                    </div>
                </div>

                <div className='text-center w-full flex justify-center relative'>
                    <p className='flex text-left w-[28rem] text-zinc-400'>{postData?.content}</p>
                </div>
            </div>
            <div className='bg-rose-400 w-12 rounded-full absolute top-[50%] -right-[1rem] h-12'></div>
        </div>
    )
}

export default FeedCard