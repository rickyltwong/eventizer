import connectDB from '@/config/connectDB';
import Event from '@/models/Event';
import { NextRequest, NextResponse } from 'next/server';


let r=connectDB();
console.log('db connected! '+JSON.stringify(r));


export async function GET(req: NextRequest, res: NextResponse) {
    const events = await Event.find({});
     console.log(events);
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
}

export async function POST(request: NextRequest) {
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
    });
    return NextResponse.json({
      message: 'Event created successful',
      success: true,
      event: newEvent
    });

  } catch (error: any) {
    console.error(error.message)
    return NextResponse.json({ error: error.message}, {status: 500});
  }
}

