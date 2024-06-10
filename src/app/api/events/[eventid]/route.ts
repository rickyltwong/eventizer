import {ObjectId} from "mongodb";
import clientPromise from '@/app/lib/mongodb';
import {NextApiRequest, NextApiResponse} from "next";
import {NextResponse} from "next/server";

const MONGODB_URI = process.env.MONGODB_URI as string;

// Ensure the environment variable is defined
if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const id = req.url?.slice(req.url?.lastIndexOf('/')).replace("/","")

    try {
        const client = await clientPromise;
        const database = client.db('Eventizer');
        const collection = database.collection('events');
        const eventData = await collection.findOne({_id: new ObjectId(id)})

        return NextResponse.json(eventData, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {message: 'Something went wrong!'},
            {status: 500}
        );
    }
}
