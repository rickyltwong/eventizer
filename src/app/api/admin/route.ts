import { NextRequest } from 'next/server';

import dbConnect from '@/lib/connectDB';
import User from '@/models/User';

export const revalidate = 0;

export async function GET() {
  await dbConnect();
  const users = await User.find({});
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const reqBody = await req.json();
  const { id, status, role } = reqBody;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { status, role },
      { new: true },
    );
    if (!user) {
      console.log('User not found');
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.log('Updated user:', user);
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const reqBody = await req.json();
  const user = await User.create(reqBody);
  console.log(user);
  return new Response(JSON.stringify(user), {
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
  const r = await User.findByIdAndDelete(id);
  console.log(r);
  return new Response(JSON.stringify(r), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
