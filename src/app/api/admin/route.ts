import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/connectDB';
import User from '@/models/User';

// src/app/api/admin/route.js
   //let r=dbConnect();
   //console.log('db connected! '+JSON.stringify(r));

   

export async function GET(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const users = await User.find({});
   console.log(users);
   return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function PUT(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const reqBody = await req.json();
  const { id, status, role } = reqBody;
  try{
    const user = await User.findByIdAndUpdate(id, { status, role }, { new: true });
    if (!user) {
      console.log('User not found');
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.log('Updated user:', user); // Log updated user
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error}), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


export async function POST(req: NextRequest, res: NextResponse) {
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

export async function DELETE(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const reqBody = await req.json();
  const { id} = reqBody;
  let r=await User.findByIdAndDelete(id);         
   console.log(r);
  return new Response(JSON.stringify(r), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
