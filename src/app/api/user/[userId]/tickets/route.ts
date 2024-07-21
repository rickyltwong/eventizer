import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectDB';
// import Event from '@/models/Event';
import EventTicket from '@/models/EventTicket';

type Params = {
  userId: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  await dbConnect();

  const { userId } = context.params;

  console.log('in the api call');

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

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
