'use client'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { deleteCookie, getCookie } from "cookies-next";
const Navbar = () => {
  const path = usePathname();
  const router = useRouter();
  
  const handleLogout = () => {
    const token = getCookie("tweetxToken");
    deleteCookie("tweetxToken");
    router.push("/login");
  }


  return (
    <>
      <div className='flex justify-around items-center p-4 bg-white shadow-md'>
        <div className='text-rose-400 font-semibold'>TweetX</div>
        <div className='flex justify-center gap-5'>
          <Link href="/feed" className={path == "/feed" ? "text-rose-400" : "text-slate-300"}>Feed</Link>
          <Link href="/users" className={path == "/users" ? "text-rose-400" : "text-slate-300"}>Users</Link>
          <Link href="/profile" className={path == "/profile" ? "text-rose-400" : "text-slate-300"}>Profile</Link>
          <p className='text-slate-300 cursor-pointer' onClick={handleLogout}>Logout</p>

        </div>
      </div>

    </>
  )
}

export default Navbar