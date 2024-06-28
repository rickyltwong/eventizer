import dbConnect  from '@/config/connectDB';
import MyEvent from '@/models/MyEvent';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';

// let r = connectDB();
// console.log('db connected! ' + JSON.stringify(r));

export async function GET(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const events = await MyEvent.find({});
  console.log(events);
  return new Response(JSON.stringify(events), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
