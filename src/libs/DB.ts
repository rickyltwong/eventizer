import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.log(
    'MONGODB_URL is not defined in environment variables, exiting...'
  );
  process.exit(1);
}

async function dbConnect() {
  if (mongoose.connections[0].readyState) {
    console.log('Mongo DBAlready connected. Reusing connection...');
    return;
  }

  try {
    console.log('Connecting to MongoDB ...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('Something went wrong upon MongoDB connection!');
    console.log(error);
  }
}

export default dbConnect;

// Ref: https://github.com/devat-youtuber/nextjs_connect_mongodb/blob/main/config/database.js

// Old Ref: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.ts
// not working in nextjs 14
