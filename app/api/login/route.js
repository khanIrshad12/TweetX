import connectToDatabase from "@/service/db";
import User from "@/models/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    await connectToDatabase();

    const { email, password } = await req.json();

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 500 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 500 });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        cookies().set("tweetxToken", token)

        return NextResponse.json({ message: "login successfull" }, { status: 200 })
    } catch (error) {
        console.log("failed to login", error);
        return NextResponse.json({ error: "login successfull" }, { status: 401 })
    }

}