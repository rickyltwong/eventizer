import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/connectDB';
import Event from '@/models/Event';

export const revalidate = 0;

export async function GET() {
  await connectDB();
  const events = await Event.find({});
  // console.log(events);
  return new Response(JSON.stringify(events), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const reqBody = await request.json();
    const {
      eventName,
      eventDescription,
      eventAddress,
      eventStartDateTime,
      eventEndDateTime,
      instructorName,
      eventType,
      capacity,
      difficulty,
      minimumAge,
      image,
    } = reqBody;

    const newEvent = await Event.create({
      eventName,
      eventDescription,
      eventAddress: {
        venueName: eventAddress.venueName,
        addressLine1: eventAddress.addressLine1,
      },
      eventStartDateTime: new Date(eventStartDateTime),
      eventEndDateTime: new Date(eventEndDateTime),
      instructorName,
      eventType,
      capacity,
      difficulty,
      minimumAge,
      image,
    });
    return NextResponse.json({
      message: 'Event created successful',
      success: true,
      event: newEvent,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const reqBody = await req.json();
  const { id } = reqBody;
  const r = await Event.findByIdAndDelete(id);
  // console.log(r);
  return new Response(JSON.stringify(r), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const reqBody = await req.json();
  const { id, ...updateData } = reqBody;

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: 'Event ID is required' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedEvent) {
      return new Response(
        JSON.stringify({ success: false, message: 'Event not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Event updated successfully',
        event: updatedEvent,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to update event' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
