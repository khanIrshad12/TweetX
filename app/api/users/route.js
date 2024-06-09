import connectToDatabase from "@/service/db"
import { cookies } from "next/headers"
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";
import User from "@/models/user";
import { Follow } from "@/models/follow";
import Post from "@/models/post";
export const GET = async (req, res) => {
    await connectToDatabase();

    try {
        const tokenEntry = cookies().get("tweetxToken");
        if (!tokenEntry) {
            return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
        }

        const token = tokenEntry.value;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const loggedInUserId = decoded.userId;
        const users = await User.find();
        const follows = await Follow.find();
        const Userposted = await Post.find().sort({ createdAt: -1 }); 
        const loggedInUserPostCount = await Post.countDocuments({ userId: loggedInUserId });
        // Get the list of users the logged-in user is following
        const usersData = users.map(user => {
            const followingCount = follows.filter(follow => follow.followerId.toString() === user._id.toString()).length;
            const followersCount = follows.filter(follow => follow.followingId.toString() === user._id.toString()).length;
            const isFollowing = follows.some(follow => follow.followerId.toString() === loggedInUserId.toString() && follow.followingId.toString() === user._id.toString());

            return {

                _id: user._id,
                loggedInUserPostCount,
                posts:Userposted.map(post=>({
                    _id:post._id,
                    userId:post.userId._id,
                    username:post.userId.username,
                    content:post.content,
                    createdAt:post.createdAt
                })),
                username: user.username,
                followingCount,
                followersCount,
                isFollowing
            };
        });
        const filteredUsersData = usersData.filter(userData => userData._id.toString() !== loggedInUserId.toString());
        console.log(filteredUsersData);
        return NextResponse.json(filteredUsersData, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "failed to get the user details" }, { status: 404 })
    }
}