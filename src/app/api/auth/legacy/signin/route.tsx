import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectDB';
import User from '@/models/User';
// import { UserDocument } from '@/models/User';

// Calls the connect function to establish a connection to the database.

console.log('in Sign in here');

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;

    //check if user exists
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 400 },
      );
    }

    // check if password and user password is null
    if (!password || !user.password) {
      return NextResponse.json(
        { error: 'Please enter a password' },
        { status: 400 },
      );
    }

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    //create token data
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    // Create a token with expiration of 1 day
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d',
    });

    // Create a JSON response indicating successful login
    const response = NextResponse.json({
      message: 'Login successful',
      status: 200,
      success: true,
    });

    // Set the token as an HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
  }
}
