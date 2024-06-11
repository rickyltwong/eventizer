import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/app/lib/mongodb';

const MONGODB_URI = process.env.MONGODB_URI as string;

// Ensure the environment variable is defined
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

export async function GET() {
  try {
    const client = await clientPromise;
    const database = client.db('Eventizer');
    const collection = database.collection('events');
    const allData = await collection.find({}).toArray();

    return NextResponse.json(allData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}

export async function GETEventById(id: string) {
  try {
    const client = await clientPromise;
    const database = client.db('Eventizer');
    const collection = database.collection('events');
    const eventData = await collection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json(eventData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}
