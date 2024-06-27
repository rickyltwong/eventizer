import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {

  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  try {
    console.log(isConnected);
    mongoose.connect(process.env.DATABASE_CONN!);
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
      isConnected = true;
    });

    connection.on('error', (err) => {
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running. ' + err
      );
      process.exit();
    });
  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
  }
};

export default connectDB;
