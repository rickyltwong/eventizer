import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

import { transporter } from '@/app/api/events/[eventid]/register/MailService';
import dbConnect from '@/lib/connectDB';
import Events from '@/models/Event';
import EventTicket from '@/models/EventTicket';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const reqBody = await request.json();
    const { eventId, userId, ticketType, noOfTickets, price } = reqBody;

    const userData = await User.findOne({
      email: userId,
    });

    const opts: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      width: 800,
      margin: 1,
    };

    if (!userData) {
      console.log('User data not found from DB');
      return NextResponse.json(
        { error: 'User data not found from DB' },
        { status: 400 },
      );
    }

    const ticketInDb = await EventTicket.findOne({
      user: userData._id,
      event: eventId,
    });

    const eventData = await Events.findById(eventId);

    if (!eventData) {
      console.log('Event data not found from DB');
      return NextResponse.json(
        { error: 'Event data not found from DB' },
        { status: 400 },
      );
    }

    if (ticketInDb) {
      console.log('You have already registered for the event');
      return NextResponse.json(
        { error: 'User already registered for this event' },
        { status: 400 },
      );
    }

    const ticket = new EventTicket({
      event: eventId,
      user: userData._id,
      noOfTickets,
      ticketType,
      price,
      purchaseDate: new Date(),
      participating: 'false',
      status: 'Registered',
    });

    const hostUrl = process.env.AUTH_URL;

    const ticketData = await ticket.save();

    const qrCodeImage = await QRCode.toDataURL(
      hostUrl +
        'api/events/' +
        ticketData.event +
        '/attendance?userId=' +
        ticketData.user +
        '&ticketId=' +
        ticketData._id,
      opts,
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: `${userData.email}`,
      subject: `${eventData.eventName} Ticket`,
      text: 'Thank you for registering for the event',
      html: `<p>Thank you for registering for the event. Please find your QR Code below:</p><img src='${qrCodeImage}' alt='QR Code' />`,
    });

    return NextResponse.json({
      message: 'Event registered successfully',
      status: 200,
      success: true,
      ticket,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong!' },
      { status: 500 },
    );
  }
}
