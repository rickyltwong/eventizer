import { NextResponse } from 'next/server';

import connectDB from '@/lib/connectDB';
import Ticket from '@/models/Ticket';

export async function GET() {
  await connectDB();

  try {
    const now = new Date();
    const tickets = await Ticket.find({
      discount: { $gt: 0 },
      discountExpiry: { $lt: now },
    });

    for (const ticket of tickets) {
      ticket.discount = 0;
      ticket.discountExpiry = null;
      await ticket.save();
    }

    console.log('Expired discounts have been reset.');

    return NextResponse.json({ message: 'Expired discounts have been reset.' });
  } catch (error) {
    console.error('Error resetting expired discounts:', error);
    return NextResponse.json(
      { error: 'Error resetting expired discounts.' },
      { status: 500 },
    );
  }
}
