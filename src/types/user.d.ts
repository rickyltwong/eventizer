import mongoose from 'mongoose';

export interface IUser {
  name: string;
  _id?: mongoose.Types.ObjectId;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  role: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  eventHistory?: mongoose.Types.ObjectId[];
  favourites?: mongoose.Types.ObjectId[];
  accountSource?: string;
}
