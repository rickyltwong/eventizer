import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

import dbConnect from '@/lib/connectDB';
import EventTicket from '@/models/EventTicket';

type Params = {
  eventid: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  await dbConnect();

  const userId = request.nextUrl.searchParams.get('user');
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
    const eventTicket = await EventTicket.findOne({
      user: userId,
      event: eventid,
    });

    if (eventTicket) {
      const qrCodeImage = await QRCode.toDataURL('https://example.com', opts);
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
