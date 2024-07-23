import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectDB';
import Events from '@/models/Event';
import EventTicket from '@/models/EventTicket';
import User from '@/models/User';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const ticketId = url.searchParams.get('ticketId');

    if (!userId || !ticketId) {
      const warningContent = generateHTMLContent(
        'Something went wrong. Please contact our admin.',
        true,
      );
      return new NextResponse(warningContent, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const ticketData = await EventTicket.findById(new ObjectId(ticketId));
    if (!ticketData) {
      const warningContent = generateHTMLContent(
        'Ticket not found. Please contact our admin.',
        true,
      );
      return new NextResponse(warningContent, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const eventData = await Events.findById(ticketData.event);
    if (!eventData) {
      const warningContent = generateHTMLContent(
        'Event not found. Please contact our admin.',
        true,
      );
      return new NextResponse(warningContent, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      const warningContent = generateHTMLContent(
        'User not found. Please contact our admin.',
        true,
      );
      return new NextResponse(warningContent, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (!userData.eventHistory) {
      userData.eventHistory = [];
    }
    const isAlreadyAttend = userData.eventHistory.includes(
      new ObjectId(eventData._id),
    );

    if (isAlreadyAttend) {
      const warningContent = generateHTMLContent(
        'Your ticket already expired. Please contact our admin.',
        true,
      );
      return new NextResponse(warningContent, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    userData.eventHistory.push(new ObjectId(eventData._id));

    ticketData.participating = 'true';
    ticketData.status = 'Attended';

    await userData.save();
    await ticketData.save();

    const successContent = generateHTMLContent(
      'Thank You for Attending the Event! Your attendance has been successfully marked.',
    );
    return new NextResponse(successContent, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error(error);
    const warningContent = generateHTMLContent(
      'Something went wrong. Please contact our admin.',
      true,
    );
    return new NextResponse(warningContent, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function generateHTMLContent(message: string, isWarning = false) {
  return `
    <!DOCTYPE html>
    <html lang='en'>
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <title>Notification</title>
      <link href='https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css' rel='stylesheet'>
    </head>
    <body class='bg-gray-100 text-gray-900'>
      <div class='flex items-center justify-center min-h-screen'>
        <div class='bg-white p-8 rounded shadow-md ${isWarning ? 'border border-red-500' : ''}'>
          <h1 class='text-2xl font-bold mb-4 ${isWarning ? 'text-red-500' : ''}'>${message}</h1>
          <a href='/' class='text-indigo-600 hover:underline'>Go back to homepage</a>
        </div>
      </div>
      <script src='https://cdn.jsdelivr.net/npm/@mantine/core@3.0.0/dist/mantine-core.umd.min.js'></script>
    </body>
    </html>
  `;
}
