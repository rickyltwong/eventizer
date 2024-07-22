import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectDB';
// import Event from '@/models/Event';
import EventTicket from '@/models/EventTicket';
import User from '@/models/User';

// type Params = {
//   userId: string;
// };

export async function GET(request: NextRequest) {
  await dbConnect();

  // const { userId } = context.params;

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    console.log(`user: ${user.email}`);

    const userId = user._id;
    // const userId = '669c27ac08ed9ab87f2080d0';
    console.log(`user: ${userId}`);

    const userTickets = await EventTicket.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'events', // the name of the event collection
          localField: 'event',
          foreignField: '_id',
          as: 'eventDetails',
        },
      },
      {
        $unwind: '$eventDetails',
      },
      {
        $project: {
          _id: 1,
          event: 1,
          user: 1,
          ticketType: 1,
          noOfTickets: 1,
          price: 1,
          purchaseDate: 1,
          participating: 1,
          status: 1,
          eventDetails: {
            _id: 1,
            eventName: 1,
            eventStartDateTime: 1,
          },
        },
      },
    ]);
    console.log(`length: ${userTickets.length}`);

    if (!userTickets.length) {
      return NextResponse.json(
        { message: 'No events registered yet' },
        { status: 404 },
      );
    }

    return NextResponse.json(userTickets, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}
