'use client'
import React, { useEffect, useRef, useState } from 'react';
import { TbMessage } from "react-icons/tb";
import { BsPostcard } from "react-icons/bs";
import { MdOutlinePostAdd } from "react-icons/md";
import UserCard from '../conponents/UserCard';
import FeedCard from '../conponents/feedCard';
import axios from 'axios';

const Profile = () => {

  const [userDetails, setUserDetails] = useState({});
  const [postedDetails, setPostedDetails] = useState([])

  const [followingDetails, setFollowingDetails] = useState([]);
  const [followerDetails, setFollowerDetails] = useState([])

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  const tabsRef = useRef([]);

  const tabsData = [
    { label: "Post", icons: <TbMessage /> }, { label: "Followers", icons: <BsPostcard /> }, { label: "Following", icons: <MdOutlinePostAdd /> }
  ]

  const getProfileDetails = async () => {
    try {
      const res = await axios.get("api/profile");
      if (res.status === 200) {
        console.log(res.data);
        setUserDetails(res.data)
      } else {
        console.log("failed to get the data", res.data.error.message);
      }
    } catch (error) {
      console.log("failed to get the detaails", error);

    }
  }
  const getFollowingDetails = async () => {
    try {
      const res = await axios.get("api/following");
      if (res.status === 200) {
        setFollowingDetails(res.data);
        console.log(res.data);
      } else {
        console.log("failed to get the data", res.data.error.message);
      }
    } catch (error) {
      console.log("failed to get the detaails", error);

    }
  }
  const getFollowerDetails = async () => {
    try {
      const res = await axios.get("api/followUser");
      if (res.status === 200) {
        console.log(res.data);
        setFollowerDetails(res.data)
      } else {
        console.log("failed to get the data", res.data.error.message);
      }
    } catch (error) {
      console.log("failed to get the detaails", error);

    }
  }
const profilepostedDetails =async()=>{
  try {
    const res =await axios.get("api/post/loginUserPost");
    if(res.status == 200){
      console.log(res.data);
      setPostedDetails(res.data)
    }else{
      console.log("something went wrong",res.data);
    }
  } catch (error) {
    console.log(error);
  }
}


  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    }

    setTabPosition();
    window.addEventListener("resize", setTabPosition);

    return () => window.removeEventListener("resize", setTabPosition);
  }, [activeTabIndex]);

  useEffect(() => {

    getProfileDetails();
    getFollowingDetails();
    getFollowerDetails();
    profilepostedDetails()
  }, [])


  return (
    <div className='max-w-[450px] mx-auto mt-5'>
      <div>
        <div className='flex justify-between gap-12 mb-12'>

          <div className='w-20 h-[5rem] border rounded-full border-zinc-400 '></div>
          <div className='mt-10'>
            <h4 className='font-bold text-slate-500 text-lg mb-5'>{userDetails?.username}</h4>
            <div className='flex gap-5'>
              <p className='text-sm text-slate-300 font-medium'>Post: {userDetails?.posts?.length}</p>
              <p className='text-sm text-slate-300 font-medium'>Followers: {userDetails?.followersCount}</p>
              <p className='text-sm text-slate-300 font-medium'>Following: {userDetails?.followingCount}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="flex justify-around border-t">
            {tabsData.map((tab, idx) => {
              return (
                <button
                  key={idx}

                  ref={(el) => (tabsRef.current[idx] = el)}
                  className="pt-2 pb-3 flex items-center gap-2 text-sm text-slate-300"
                  onClick={() => {

                    setActiveTabIndex(idx)
                  }}>
                  {tab?.icons}{tab.label}
                </button>
              );
            })}
          </div>
          <span
            className="absolute top-0 block h-1 bg-zinc-800 rounded-sm transition-all duration-300"
            style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
          />
        </div>
        <div className="py-4">
          {activeTabIndex === 0 ?  postedDetails && postedDetails.length > 0 ?
            postedDetails?.map((item, id) => {
              return <div key={id}> <FeedCard postData={item} /></div>
            }) : <p className='inline-block text-center w-full font-bold'> You don't have any post</p>
           : activeTabIndex === 1 ? followerDetails.length > 0 ? followerDetails.map((item, id) => {
            return <div key={id}><UserCard users={item} /></div>
          }) : <p className='inline-block text-center w-full font-bold'> Your follower count is zero</p> : followingDetails.length > 0 ? followingDetails?.map((item, id) => {
            return <div key={id}><UserCard users={item} /></div>
          }) : <p className='inline-block text-center w-full font-bold'> Your following count is zero</p>}
        </div>

      </div>
    </div>
  )
}

export default Profile