import connectToDatabase from '@/service/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { Follow } from '@/models/follow';
import User from '@/models/user';

export const POST = async (req, res) => {
    await connectToDatabase();

    try {
        const tokenEntry = cookies().get('tweetxToken');
        if (!tokenEntry) {
            return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 });
        }

        const token = tokenEntry.value;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const followerId = decoded.userId;
        const { followingId } = await req.json();
        const follows = await Follow.find();
        console.log(follows);
        // Check if the user is already following
        const existingFollow = await Follow.findOne({ followerId, followingId });
        if (existingFollow) {
            return NextResponse.json({ error: 'Already following this user' }, { status: 400 });
        }

        // Create a new follow record
        const newFollow = new Follow({ followerId, followingId });
        await newFollow.save();

        return NextResponse.json({ message: 'Successfully followed user' }, { status: 200 });
    } catch (error) {
        console.error('Failed to follow user:', error);
        return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 });
    }
};


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

        // Get the IDs of users that the logged-in user is following
        const followingIds = follows
            .filter(follow => follow.followerId.toString() === loggedInUserId.toString())
            .map(follow => follow.followingId.toString());

        // Filter users who are not followed by the logged-in user
        const notFollowingUsers = users.filter(user => !followingIds.includes(user._id.toString()) && user._id.toString() !== loggedInUserId.toString());

        // Prepare usersData array with required details
        const usersData = notFollowingUsers.map(user => {
            // Count following and followers
            const followingCount = follows.filter(f => f.followerId.toString() === user._id.toString()).length;
            const followersCount = follows.filter(f => f.followingId.toString() === user._id.toString()).length;

            return {
                _id: user._id,
                username: user.username,
                followingCount,
                followersCount,
                isFollowing: false
            };
        });

        return NextResponse.json(usersData, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to get the user details' }, { status: 404 });
    }
};