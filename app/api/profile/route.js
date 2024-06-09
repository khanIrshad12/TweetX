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
        const tokenEntry = cookies().get('tweetxToken');
        if (!tokenEntry) {
            return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 });
        }

        const token = tokenEntry.value;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const loggedInUserId = decoded.userId;

        // Fetch all users
        const users = await User.find();

        // Fetch follows data
        const follows = await Follow.find();

        // Fetch posts sorted by createdAt for the logged-in user
        const userPosts = await Post.find({ userId: loggedInUserId }).sort({ createdAt: -1 });

        // Count of posts by the logged-in user
        const loggedInUserPostCount = userPosts.length;

        // Prepare usersData array with required details
        const usersData = users.map(user => {
            // Count following and followers
            const followingCount = follows.filter(f => f.followerId.toString() === user._id.toString()).length;
            const followersCount = follows.filter(f => f.followingId.toString() === user._id.toString()).length;

            // Check if logged-in user is following this user
            const isFollowing = follows.some(f => f.followerId.toString() === loggedInUserId.toString() && f.followingId.toString() === user._id.toString());

            // Prepare posts data for the logged-in user
            let userPostedDetails = null;
            if (user._id.toString() === loggedInUserId.toString()) {
                userPostedDetails = userPosts.map(post => ({
                    _id: post._id,
                    userId: post.userId,
                    username: user.username,
                    content: post.content,
                    createdAt: post.createdAt
                }));
            }

            return {
                _id: user._id,
                username: user.username,
                followingCount,
                followersCount,
                isFollowing,
                loggedInUserPostCount,
                posts: userPostedDetails
            };
        });
        // Filter out the logged-in user
const loggedInUser = usersData.find(user => user._id.toString() === loggedInUserId.toString());
console.log(loggedInUser);
        return NextResponse.json(loggedInUser, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to get the user details' }, { status: 404 });
    }
};