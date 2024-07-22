import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectDB';
import Events from '@/models/Event';
import { IEvent } from '@/types';

export const revalidate = 0;

export async function GET() {
  await dbConnect();

  try {
    const events = (await Events.find({})) as IEvent[];

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const event = new Events(body);
    await event.save();

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const event = await Events.findByIdAndUpdate(body.id, body, { new: true });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const event = await Events.findByIdAndDelete(body.id);

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
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
