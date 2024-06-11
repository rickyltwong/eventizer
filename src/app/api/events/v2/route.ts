import { connectDB } from '@/config/connectDB2';
import MyEvent from '@/models/MyEvent';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';

let r = connectDB();
console.log('db connected! ' + JSON.stringify(r));

export async function GET(request: NextRequest) {
  try {
    console.log('start fetch');
    const events = await MyEvent.find({});
    console.log(events);
    return NextResponse.json({
      message: 'fetch events successful',
      success: true,
      data: events,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
