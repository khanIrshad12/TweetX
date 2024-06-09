import connectToDatabase from "@/service/db";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcrypt"
export const POST = async (req, res) => {
  try {
    await connectToDatabase();
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      console.log("not found email,username",email,username,password);
      return NextResponse.json({ error: "All fields are required" },{status:500});
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" },{status:500});
    }
    // Create a new user
    bcrypt.hash(password, 10, async function (err, hash) {
      // Store hash in your password DB.
      await User.create({
        username,
        email,
        password: hash,
      });
    });

    return NextResponse.json({ message: "User registered. successfully"}, {status: 201 });


  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "failed to post the data"},{ status: 500 });

  }

}