import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectDB';
import EventTicket from '@/models/EventTicket';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const reqBody = await request.json();
    const { eventId, userId, ticketType, noOfTickets, price } = reqBody;

    const userData = await User.findOne({
      email: userId,
    });

    if (!userData) {
      console.log('User data not found from DB');
      return NextResponse.json(
        { error: 'User data not found from DB' },
        { status: 400 },
      );
    }

    const ticketInDb = await EventTicket.findOne({
      user: userData._id,
      event: eventId,
    });

    if (ticketInDb) {
      console.log('You have already registered for the event');
      return NextResponse.json(
        { error: 'User already registered for this event' },
        { status: 400 },
      );
    }

    const ticket = new EventTicket({
      event: eventId,
      user: userData._id,
      noOfTickets,
      ticketType,
      price,
      purchaseDate: new Date(),
      participating: 'false',
      status: 'Registered',
    });

    await ticket.save();

    return NextResponse.json({
      message: 'Event registered successfully',
      status: 200,
      success: true,
      ticket,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong!' },
      { status: 500 },
    );
  }
}
