import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectDB';
import EventTicket from '@/models/EventTicket';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const reqBody = await request.json();
    const { eventId, userId, ticketType, noOfTickets, price } = reqBody;

    const ticketInDb = await EventTicket.findOne({
      user: userId,
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
      user: userId,
      noOfTickets,
      ticketType,
      price,
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
