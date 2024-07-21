import { NextRequest } from 'next/server';

import dbConnect from '@/lib/connectDB';
import eventTicket from '@/models/EventTicket';

export async function PUT(req: NextRequest) {
  await dbConnect();
  const reqBody = await req.json();
  const { id, status, participating } = reqBody;

  try {
    const ticket = await eventTicket.findByIdAndUpdate(
      id,
      { status: status, participating: participating },
      { new: true },
    );

    console.log('Updated ticket:', ticket);

    if (!ticket) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.log('Ticket updated successfully' + ticket);
      return new Response(JSON.stringify(ticket), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating ticket:', error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  await dbConnect();
  const attendees = await eventTicket.find({}).populate('user', 'name email');
  return new Response(JSON.stringify(attendees), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const reqBody = await req.json();
  const ticket = await eventTicket.create(reqBody);
  return new Response(JSON.stringify(ticket), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const reqBody = await req.json();
  const { id } = reqBody;
  const r = await eventTicket.findByIdAndDelete(id);
  return new Response(JSON.stringify(r), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
