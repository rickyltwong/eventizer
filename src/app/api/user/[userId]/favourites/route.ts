// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectDB';
// import Event from '@/models/Event';
import User from '@/models/User';
import UserFavorite from '@/models/UserFavorite';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Params = {
  userId: string;
};

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Missing email' }, { status: 400 });
  }
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userId = user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const userFavorites = await UserFavorite.findOne({ user: userId }).populate(
      'events',
    );
    if (!userFavorites) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(userFavorites.events, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error fetching user favorites!' },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { userId: string } },
) {
  await dbConnect();
  const { userId } = context.params;
  console.log('post called: ' + userId);
  try {
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    // }

    const reqBody = await req.json();
    const { eventId, email } = reqBody;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userId = user._id;

    const userFavorite = await UserFavorite.findOneAndUpdate(
      { user: userId },
      { $addToSet: { events: eventId } },
      { upsert: true, new: true },
    );

    return NextResponse.json(userFavorite, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error adding event to favorites!' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  // const { userId } = context.params;

  try {
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    // }

    // const eventId = req.nextUrl.searchParams.get('eventId');

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const email = searchParams.get('email');

    if (!eventId || !email) {
      return NextResponse.json(
        { message: 'Missing eventId or email' },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userId = user._id;

    const userFavorite = await UserFavorite.findOneAndUpdate(
      { user: userId },
      { $pull: { events: eventId } }, // $pull removes the event ID from the array
      { new: true },
    );

    if (!userFavorite) {
      return NextResponse.json(
        { message: 'User favorites not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}
