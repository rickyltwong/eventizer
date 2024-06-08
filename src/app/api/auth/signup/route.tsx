import dbConnect from "@/app/utils/dbconfig";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

// Call the connect function to establish a connection to the database.


export async function POST(request: NextRequest) {
await dbConnect();
  try {
    const reqBody = await request.json();
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role,
    } = reqBody;
    // Parses the request body to extract username, email, and password.

     console.log("in here");

    const user = await (User.findOne({ username }) || User.findOne({ email }));
    if (user) {
        console.log("existing user");
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      role,
    });

    // Saves the new user to the database.
    const savedUser = await newUser.save();

    console.log("saved user", savedUser);

    return NextResponse.json({
      message: "User created successfully",
      status: 200,
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
