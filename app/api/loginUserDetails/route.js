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
        
        // Fetch all users and follows
        const users = await User.find();
        const follows = await Follow.find();

        // Fetch posts sorted by createdAt
        const userPosts = await Post.find({ userId: loggedInUserId }).sort({ createdAt: -1 });

        // Count of posts by the logged-in user
        const loggedInUserPostCount = userPosts.length;

        // Find the logged-in user
        const loggedInUser = await User.findById(loggedInUserId);

        if (!loggedInUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate following and followers count for each user
        const followMap = new Map();
        follows.forEach(follow => {
            if (!followMap.has(follow.followerId)) {
                followMap.set(follow.followerId, { following: new Set(), followers: new Set() });
            }
            if (!followMap.has(follow.followingId)) {
                followMap.set(follow.followingId, { following: new Set(), followers: new Set() });
            }
            followMap.get(follow.followerId).following.add(follow.followingId);
            followMap.get(follow.followingId).followers.add(follow.followerId);
        });

        // Prepare usersData array with required details
        const usersData = users.map(user => {
            const followingCount = followMap.has(user._id) ? followMap.get(user._id).following.size : 0;
            const followersCount = followMap.has(user._id) ? followMap.get(user._id).followers.size : 0;
            const isFollowing = followMap.has(loggedInUserId) ? followMap.get(loggedInUserId).following.has(user._id) : false;

            // Prepare posts data for the logged-in user
            let userPostedDetails = null;
            if (user._id.toString() === loggedInUserId.toString()) {
                userPostedDetails = userPosts.map(post => ({
                    _id: post._id,
                    userId: post.userId,
                    username: loggedInUser.username,
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

        console.log(usersData);
        return NextResponse.json(usersData, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to get the user details' }, { status: 404 });
    }
};