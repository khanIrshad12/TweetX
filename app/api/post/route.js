import connectToDatabase from '@/service/db';
import Post from '@/models/post';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '@/models/user';
import { Follow } from '@/models/follow';

export const POST = async (req, res) => {
  await connectToDatabase();

  try {
    const tokenEntry = cookies().get('tweetxToken');
    if (!tokenEntry) {
      return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 });
    }

    const token = tokenEntry.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { content } = await req.json();

    const userId = decoded.userId;

    const newPost = new Post({
      userId,
      content,
    });

    await newPost.save();

    return NextResponse.json({ message: 'Post created successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
};


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

        const follows = await Follow.find({ followerId: loggedInUserId });
        const followingIds = follows.map(follow => follow.followingId);

        // Fetch posts of the users the logged-in user is following
        const posts = await Post.find({ userId: { $in: followingIds } }).sort({ createdAt: -1 }).populate('userId', 'username');;

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
        return NextResponse.json({ error: "failed to get the user details" }, { status: 404 })
    }
}