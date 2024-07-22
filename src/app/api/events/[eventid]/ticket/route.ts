import ip from 'ip';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

import dbConnect from '@/lib/connectDB';
import EventTicket from '@/models/EventTicket';
import User from '@/models/User';

export const revalidate = 0;

type Params = {
  eventid: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  await dbConnect();

  const userEmail = request.nextUrl.searchParams.get('user');
  const { eventid } = context.params;
  const opts: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    width: 800,
    margin: 1,
  };

  try {
    if (!mongoose.Types.ObjectId.isValid(eventid)) {
      return NextResponse.json(
        { message: 'Invalid event ID' },
        { status: 400 },
      );
    }

    if (!userEmail) {
      return NextResponse.json({ message: 'Invalid user' }, { status: 400 });
    }

    const userData = await User.findOne({
      email: userEmail,
    });

    if (!userData) {
      return NextResponse.json(
        { message: 'User Data not found in DB' },
        { status: 404 },
      );
    }

    const eventTicket = await EventTicket.findOne({
      user: userData._id,
      event: eventid,
    });

    if (eventTicket) {
      let hostUrl = process.env.AUTH_URL;

      if (!hostUrl || hostUrl.includes('localhost')) {
        hostUrl = ip.address() + ':3000';
      }

      const qrCodeImage = await QRCode.toDataURL(
        hostUrl +
          'api/events/' +
          eventid.toString() +
          '/attendance?userId=' +
          userData._id +
          '&ticketId=' +
          eventTicket._id,
        opts,
      );
      return NextResponse.json({ qr: qrCodeImage }, { status: 200 });
    }

    return NextResponse.json('Unable to find ticket', { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}
