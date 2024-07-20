import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectDB';
import UserFavorite from '@/models/UserFavorite';

type Params = {
  userId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  await dbConnect();
  const { userId } = context.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const userFavorites = await UserFavorite.findOne({ user: userId }).populate(
      'events',
    );
    if (!userFavorites) {
      return NextResponse.json({ events: [] }, { status: 200 });
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

export async function POST(req: NextRequest, context: { params: Params }) {
  await dbConnect();
  const { userId } = context.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const reqBody = await req.json();
    const { eventId } = reqBody;
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

export async function DELETE(req: NextRequest, context: { params: Params }) {
  await dbConnect();
  const { userId } = context.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const eventId = req.nextUrl.searchParams.get('eventId');
    if (!eventId) {
      return NextResponse.json(
        { message: 'Event ID is required' },
        { status: 400 },
      );
    }

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
