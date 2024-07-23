import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/connectDB';
import Ticket from '@/models/Ticket';

export const revalidate = 0;

export async function GET(req: NextRequest): Promise<NextResponse | undefined> {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('event');

    let tickets;
    if (eventId) {
      tickets = await Ticket.find({ event: eventId }).populate('event');
    } else {
      tickets = await Ticket.find({}).populate('event');
    }

    // console.log(tickets);
    return new NextResponse(JSON.stringify(tickets), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching tickets: ', error.message);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse | undefined> {
  await connectDB();
  try {
    const reqBody = await request.json();
    const {
      event,
      type,
      markedPrice,
      price,
      discount,
      discountExpiry,
      status,
      sold,
    } = reqBody;

    // Validate required fields
    if (!event) {
      console.error('Validation Error: Event ID is required');
      return new NextResponse(
        JSON.stringify({ error: 'Event ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const newTicket = await Ticket.create({
      event,
      type,
      markedPrice,
      price,
      discount,
      discountExpiry,
      status,
      sold,
    });

    return NextResponse.json({
      message: 'Ticket created successfully',
      success: true,
      ticket: newTicket,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating ticket: ', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function DELETE(
  req: NextRequest,
): Promise<NextResponse | undefined> {
  await connectDB();
  try {
    const reqBody = await req.json();
    const { id } = reqBody;
    const r = await Ticket.findByIdAndDelete(id);
    // console.log(r);
    return new NextResponse(JSON.stringify(r), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse | undefined> {
  await connectDB();
  try {
    const reqBody = await req.json();
    const { id, ...updateData } = reqBody;

    if (!id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Ticket ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTicket) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Ticket not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Ticket updated successfully',
        ticket: updatedTicket,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating ticket: ', error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Failed to update ticket' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
  }
}
