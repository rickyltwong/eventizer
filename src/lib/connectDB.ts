import '../models/Event';
import '../models/EventTicket';
// import '../models/Ticket';
import '../models/User';
import '../models/UserFavorite';

import mongoose from 'mongoose';

const DATABASE_CONN = process.env.DATABASE_CONN!;

if (!DATABASE_CONN) {
  console.log(
    'MONGODB_URL is not defined in environment variables, exiting...',
  );
  process.exit(1);
}

const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      // console.log('Already connected to MongoDB');
      return;
    }

    await mongoose.connect(DATABASE_CONN);
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
      require('../models');
    });

    connection.on('error', (err) => {
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running. ' + err,
      );
      process.exit();
    });
  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
  }
};

export default connectDB;
