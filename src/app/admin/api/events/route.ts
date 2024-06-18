import { connectDB } from '@/config/connectDB';
import MyEvent from '@/models/MyEvent';
import { NextRequest, NextResponse } from 'next/server';


let r=connectDB();
console.log('db connected! '+JSON.stringify(r));


export async function GET(req: NextRequest, res: NextResponse) {
    const events = await MyEvent.find({});
     console.log(events);
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
