import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectDB';
import Events from '@/models/Event';

export const revalidate = 0;

type Params = {
  eventid: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  await dbConnect();

  const { eventid } = context.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(eventid)) {
      return NextResponse.json(
        { message: 'Invalid event ID' },
        { status: 400 },
      );
    }

    const eventData = await Events.findById(eventid);

    if (!eventData) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(eventData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}
