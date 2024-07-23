import dbConnect from '@/lib/connectDB';
import EventTicket from '@/models/EventTicket';

export const revalidate = 0;

export async function GET() {
  await dbConnect();
  const eventTickets = await EventTicket.find({});
  // console.log(eventTickets);
  return new Response(JSON.stringify(eventTickets), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
