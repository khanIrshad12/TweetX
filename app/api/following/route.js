import connectToDatabase from "@/service/db"
import { cookies } from "next/headers"
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";
import User from "@/models/user";
import { Follow } from "@/models/follow";
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

        // Get users that the logged-in user is following
        const followingUsers = users.filter(user =>
            follows.some(follow => follow.followerId.toString() === loggedInUserId.toString() && follow.followingId.toString() === user._id.toString())
        );

        // Prepare usersData array with required details
        const usersData = followingUsers.map(user => {
            // Count following and followers
            const followingCount = follows.filter(f => f.followerId.toString() === user._id.toString()).length;

            // Check if logged-in user is following this user
            const isFollowing = true;

            return {
                _id: user._id,
                username: user.username,
                followingCount,
                isFollowing,
            };
        });

        return NextResponse.json(usersData, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to get the user details' }, { status: 404 });
    }
};