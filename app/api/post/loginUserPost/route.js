import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import Post from "@/models/post";
import connectToDatabase from "@/service/db";
import { NextResponse } from "next/server";
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

        // Fetch posts of the logged-in user
        const posts = await Post.find({ userId: loggedInUserId }).sort({ createdAt: -1 }).populate('userId', 'username');;
        const postsWithUsername = posts.map(post => ({
            _id: post._id,
            userId: post.userId._id,
            username: post.userId.username,
            content: post.content,
            createdAt: post.createdAt
        }));

        return NextResponse.json(postsWithUsername, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to get posts' }, { status: 500 });
    }
};